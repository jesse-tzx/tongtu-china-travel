import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { systemPrompt } from '@/lib/system-prompt';
import { tools } from '@/lib/tools';
import { runFlyai } from '@/lib/flyai';

const MAX_TOOL_ROUNDS = 3;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function addIfPresent(args: Record<string, string>, key: string, value: unknown) {
  if (value !== undefined && value !== null && value !== '') {
    args[key] = String(value);
  }
}

/** Map tool name to flyai CLI command and args */
function toolToFlyaiCommand(
  toolName: string,
  input: Record<string, unknown>
): { command: string; args: Record<string, string> } {
  const i = input;

  switch (toolName) {
    case 'search_flight': {
      const args: Record<string, string> = {
        origin: String(i.origin || ''),
        destination: String(i.destination || ''),
        'dep-date': String(i.dep_date || ''),
      };
      addIfPresent(args, 'seat-class-name', i.seat_class_name);
      addIfPresent(args, 'sort-type', i.sort_type);
      return { command: 'search-flight', args };
    }
    case 'search_hotel':
      return { command: 'search-hotel', args: { 'dest-name': String(i.dest_name || '') } };
    case 'search_train':
      return {
        command: 'search-train',
        args: {
          origin: String(i.origin || ''),
          destination: String(i.destination || ''),
          'dep-date': String(i.dep_date || ''),
        },
      };
    case 'search_poi': {
      const args: Record<string, string> = { 'city-name': String(i.city_name || '') };
      addIfPresent(args, 'keyword', i.keyword);
      addIfPresent(args, 'category', i.category);
      addIfPresent(args, 'poi-level', i.poi_level);
      return { command: 'search-poi', args };
    }
    case 'search_marriott_hotel':
      return { command: 'search-marriott-hotel', args: { 'dest-name': String(i.dest_name || '') } };
    case 'search_marriott_package':
      return { command: 'search-marriott-package', args: { keyword: String(i.keyword || '') } };
    case 'ai_search':
      return { command: 'ai-search', args: { query: String(i.query || '') } };
    case 'keyword_search':
      return { command: 'keyword-search', args: { query: String(i.query || '') } };
    default:
      return { command: '', args: {} };
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const body = await req.json();
  const messages: Anthropic.MessageParam[] = body.messages || [];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let currentMessages = [...messages];
        let round = 0;

        while (round < MAX_TOOL_ROUNDS) {
          round++;

          // Call Claude API
          const response = await client.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 4096,
            system: systemPrompt,
            messages: currentMessages,
            tools: tools as Anthropic.Tool[],
          });

          // Collect text and tool_use blocks from this response
          let assistantText = '';
          const toolUses: { id: string; name: string; input: Record<string, unknown> }[] = [];

          for (const block of response.content) {
            if (block.type === 'text') {
              assistantText += block.text;
            } else if (block.type === 'tool_use') {
              toolUses.push({
                id: block.id,
                name: block.name,
                input: block.input as Record<string, unknown>,
              });
            }
          }

          // Stream text to client
          if (assistantText) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'text', content: assistantText })}\n\n`)
            );
          }

          // If no tool calls, we're done
          if (toolUses.length === 0 || response.stop_reason === 'end_turn') {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
            return;
          }

          // Execute tool calls
          const toolResults: Anthropic.ToolResultBlockParam[] = [];

          for (const toolUse of toolUses) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'tool_start', name: toolUse.name })}\n\n`
              )
            );

            const { command, args } = toolToFlyaiCommand(toolUse.name, toolUse.input);
            let resultContent: string;

            if (!command) {
              resultContent = JSON.stringify({ error: `Unknown tool: ${toolUse.name}` });
            } else {
              const result = await runFlyai(command, args);
              resultContent = result.success
                ? JSON.stringify(result.data)
                : JSON.stringify({ error: result.error });
            }

            toolResults.push({
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: resultContent,
            });

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'tool_end', name: toolUse.name })}\n\n`
              )
            );
          }

          // Add assistant response and tool results to messages for next round
          currentMessages.push({
            role: 'assistant',
            content: response.content,
          });
          currentMessages.push({
            role: 'user',
            content: toolResults,
          });
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', content: message })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

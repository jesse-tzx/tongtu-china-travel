'use client';

import { useState, useCallback } from 'react';
import ChatWindow, { type ChatWindowProps } from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import type { Message } from '@/components/MessageBubble';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const handleSend = useCallback(async (text: string) => {
    const userMessage: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsStreaming(true);
    setActiveTool(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `⚠️ Error: ${error.error || 'Something went wrong'}` },
        ]);
        setIsStreaming(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        setIsStreaming(false);
        return;
      }

      const decoder = new TextDecoder();
      let assistantContent = '';
      const toolCalls: string[] = [];
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();

          if (data === '[DONE]') continue;

          try {
            const event = JSON.parse(data);

            if (event.type === 'text') {
              assistantContent += event.content;
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                if (lastMsg?.role === 'assistant' && !lastMsg.toolCalls?.length) {
                  // Append to existing assistant message
                  newMessages[newMessages.length - 1] = {
                    ...lastMsg,
                    content: assistantContent,
                    toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
                  };
                } else {
                  // Create new assistant message
                  newMessages.push({
                    role: 'assistant',
                    content: assistantContent,
                    toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
                  });
                }
                return newMessages;
              });
              setActiveTool(null);
            } else if (event.type === 'tool_start') {
              toolCalls.push(event.name);
              setActiveTool(event.name);
            } else if (event.type === 'tool_end') {
              setActiveTool(null);
            } else if (event.type === 'error') {
              setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: `⚠️ ${event.content}` },
              ]);
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        },
      ]);
    } finally {
      setIsStreaming(false);
      setActiveTool(null);
    }
  }, [messages]);

  const chatWindowProps: ChatWindowProps = {
    messages,
    isStreaming,
    activeTool,
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto max-w-3xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-lg font-bold">
            T
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">TongTu 通途</h1>
            <p className="text-xs text-gray-500">China Travel Assistant · Multilingual</p>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <ChatWindow {...chatWindowProps} />

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isStreaming} />
    </div>
  );
}

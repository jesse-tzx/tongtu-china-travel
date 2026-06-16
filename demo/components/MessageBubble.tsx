'use client';

import ReactMarkdown from 'react-markdown';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: string[];
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
          T
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mb-1 flex flex-wrap gap-1">
            {message.toolCalls.map((name, i) => (
              <span
                key={i}
                className="inline-block bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-md border border-amber-200"
              >
                🔍 {formatToolName(name)}
              </span>
            ))}
          </div>
        )}

        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-table:text-sm prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2 prose-h2:text-base prose-h3:text-sm prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-img:rounded-lg prose-img:my-2 prose-img:max-w-xs prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold shrink-0">
          U
        </div>
      )}
    </div>
  );
}

function formatToolName(name: string): string {
  const labels: Record<string, string> = {
    search_flight: 'Searching flights',
    search_hotel: 'Searching hotels',
    search_train: 'Searching trains',
    search_poi: 'Searching attractions',
    search_marriott_hotel: 'Searching Marriott hotels',
    search_marriott_package: 'Searching Marriott packages',
    ai_search: 'AI searching',
    keyword_search: 'Searching',
  };
  return labels[name] || name;
}

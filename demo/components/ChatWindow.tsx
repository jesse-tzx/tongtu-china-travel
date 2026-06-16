'use client';

import { useRef, useEffect } from 'react';
import MessageBubble, { Message } from './MessageBubble';

export interface ChatWindowProps {
  messages: Message[];
  isStreaming: boolean;
  activeTool: string | null;
}

export default function ChatWindow({ messages, isStreaming, activeTool }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTool]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🧭</div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">TongTu</h1>
            <p className="text-gray-500 text-sm mb-6">
              Your multilingual China travel assistant
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
              {[
                'How do I pay in China?',
                '항저우 서호 근처 호텔',
                '7月の北京旅行プラン',
                'Flights from Seoul to Shanghai',
              ].map((q) => (
                <button
                  key={q}
                  className="text-left text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  onClick={() => {
                    const input = document.querySelector('textarea');
                    if (input) {
                      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                        window.HTMLTextAreaElement.prototype,
                        'value'
                      )?.set;
                      nativeInputValueSetter?.call(input, q);
                      input.dispatchEvent(new Event('input', { bubbles: true }));
                      input.focus();
                    }
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {isStreaming && activeTool && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              T
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                <span className="inline-block w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                {formatToolName(activeTool)}...
              </span>
            </div>
          </div>
        )}

        {isStreaming && !activeTool && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              T
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function formatToolName(name: string): string {
  const labels: Record<string, string> = {
    search_flight: '🔍 Searching flights',
    search_hotel: '🔍 Searching hotels',
    search_train: '🔍 Searching trains',
    search_poi: '🔍 Searching attractions',
    search_marriott_hotel: '🔍 Searching Marriott hotels',
    search_marriott_package: '🔍 Searching packages',
    ai_search: '🔍 AI searching',
    keyword_search: '🔍 Searching',
  };
  return labels[name] || name;
}

'use client';

import { useState } from 'react';
import { BusinessType } from '@/lib/types';
import { Button } from './ui/button';
import { Send, Loader2 } from 'lucide-react';

interface PromptViewProps {
  selectedBusiness: string;
  onBusinessChange: (business: string) => void;
}

export function PromptView({ selectedBusiness, onBusinessChange }: PromptViewProps) {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [loading, setLoading] = useState(false);

  const businesses = ['General', 'MyTruckManager', '615Data', 'YTruck'];

  const sendToClawdbot = async () => {
    if (!prompt.trim() || loading) return;

    const userMessage = prompt;
    setPrompt('');
    setHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/clawdbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          business: selectedBusiness,
        }),
      });

      const data = await response.json();
      setHistory(prev => [...prev, { role: 'assistant', content: data.reply || 'Command sent to Alyssa' }]);
    } catch (error) {
      setHistory(prev => [...prev, { role: 'assistant', content: 'Error sending command' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Business Selector */}
      <div className="px-4 pt-3 pb-3">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {businesses.map((biz) => (
            <button
              key={biz}
              onClick={() => onBusinessChange(biz)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                selectedBusiness === biz
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {biz}
            </button>
          ))}
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
        {history.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <div className="text-6xl mb-4">🤖</div>
              <p className="text-muted-foreground">Send commands to Alyssa</p>
              <p className="text-sm text-muted-foreground mt-2">Business: {selectedBusiness}</p>
            </div>
          </div>
        ) : (
          history.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-card rounded-2xl px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendToClawdbot()}
            placeholder="Type a command for Alyssa..."
            className="flex-1 px-4 py-3 bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
          <Button onClick={sendToClawdbot} disabled={loading || !prompt.trim()}>
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useRef, useState } from 'react';
import ScreenLayout from '../components/ScreenLayout';
import type { AIResponse } from '../types';
import { useAppContext } from '../contexts/AppContext';

const ChatScreen: React.FC<{ response: AIResponse }> = ({ response }) => {
  const { chatMessages, sendMessage, isLoading } = useAppContext();
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const displayMessages = useMemo(() => {
    if (chatMessages.length > 0) return chatMessages;
    if (response.voice) {
      return [{ id: 'marcelle-intro', role: 'assistant' as const, text: response.voice }];
    }
    return [];
  }, [chatMessages, response.voice]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [displayMessages.length, isLoading]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || isLoading) return;
    setDraft('');
    sendMessage(trimmed, { isChat: true });
  };

  return (
    <ScreenLayout response={response} hideVoice>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Dialogue</p>
          <h2 className="mt-2 font-display text-2xl text-white">Parler à Marcelle</h2>
          <p className="mt-2 text-sm text-white/70">
            Pose une question simple sur mon art, mes souvenirs, la couleur ou la lumière. Je te
            réponds comme dans une vraie discussion.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <div className="max-h-[calc(100vh-470px)] overflow-y-auto pr-2 space-y-3">
            {displayMessages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                    message.role === 'user'
                      ? 'bg-white text-[#0b0f14]'
                      : 'bg-[#121826] text-white border border-white/10'
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-white/10 bg-[#0f141b] p-4"
          >
            <input
              type="text"
              value={draft}
              onChange={event => setDraft(event.target.value)}
              placeholder="Écris ta question ici..."
              className="flex-1 rounded-xl border border-white/10 bg-[#0b0f14] px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !draft.trim()}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0b0f14] transition-transform disabled:cursor-not-allowed disabled:opacity-50 hover:scale-[1.02]"
            >
              Envoyer
            </button>
          </form>
        </section>
      </div>
    </ScreenLayout>
  );
};

export default ChatScreen;

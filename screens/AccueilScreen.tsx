import React from 'react';
import ScreenLayout from '../components/ScreenLayout';
import type { AIResponse } from '../types';
import { useAppContext } from '../contexts/AppContext';

const ActionCard: React.FC<{
  title: string;
  description: string;
  onClick: () => void;
  eyebrow?: string;
}> = ({ title, description, onClick, eyebrow }) => (
  <button
    onClick={onClick}
    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10"
  >
    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    {eyebrow && <p className="text-xs uppercase tracking-[0.24em] text-amber-200/80">{eyebrow}</p>}
    <h3 className="mt-3 text-2xl font-semibold text-white font-display">{title}</h3>
    <p className="mt-2 text-sm text-white/70">{description}</p>
    <div className="mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-[#f95738] via-[#f4d35e] to-[#3a86ff] opacity-70"></div>
  </button>
);

const VitrailPreview: React.FC = () => (
  <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-white/20 bg-[#0d0f15] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(120deg, rgba(249,87,56,0.92), rgba(244,211,94,0.85) 35%, rgba(58,134,255,0.92) 70%, rgba(12,15,24,0.9))',
      }}
    ></div>
    <div
      className="absolute inset-0 opacity-60"
      style={{
        backgroundImage:
          'linear-gradient(90deg, rgba(0,0,0,0.55) 0 2px, transparent 2px 44px), linear-gradient(0deg, rgba(0,0,0,0.55) 0 2px, transparent 2px 44px)',
        backgroundSize: '44px 44px',
      }}
    ></div>
    <div className="absolute -right-16 top-6 h-40 w-40 rounded-full border-[14px] border-white/40 blur-[1px]"></div>
    <div className="absolute -left-10 bottom-4 h-28 w-28 rounded-full border-[10px] border-white/30 blur-[1px]"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.35),transparent_55%)]"></div>
  </div>
);

const PeinturePreview: React.FC = () => (
  <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#12131b] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
    <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(21,28,50,0.95),rgba(26,24,32,0.95))]"></div>
    <div className="absolute -left-6 top-3 h-24 w-52 -rotate-6 rounded-[40px] bg-[linear-gradient(110deg,rgba(250,124,52,0.9),rgba(219,64,53,0.85),rgba(138,43,226,0.5))] blur-[1px]"></div>
    <div className="absolute right-2 top-14 h-20 w-52 rotate-6 rounded-[40px] bg-[linear-gradient(110deg,rgba(244,211,94,0.85),rgba(62,146,204,0.7),rgba(15,76,129,0.9))] blur-[2px]"></div>
    <div className="absolute left-6 bottom-6 h-16 w-48 -rotate-3 rounded-[32px] bg-[linear-gradient(100deg,rgba(80,170,120,0.7),rgba(26,115,232,0.6),rgba(248,153,78,0.8))] blur-[2px]"></div>
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08),transparent_40%,transparent_60%,rgba(255,255,255,0.12))] opacity-70"></div>
  </div>
);

const AccueilScreen: React.FC<{ response: AIResponse }> = ({ response }) => {
  const { sendMessage } = useAppContext();

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-1/3 -left-1/4 h-2/3 w-2/3 rounded-full bg-[radial-gradient(circle,rgba(255,92,57,0.18),transparent_70%)] animate-pulse"></div>
        <div className="absolute -bottom-1/4 -right-1/4 h-2/3 w-2/3 rounded-full bg-[radial-gradient(circle,rgba(58,134,255,0.18),transparent_70%)] animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/3 h-1/2 w-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,211,94,0.12),transparent_70%)] animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 h-full">
        <ScreenLayout response={response}>
          <div className="flex flex-col gap-10">
            <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Kiosque interactif · Montréal
                </p>
                <div>
                  <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white">
                    Marcelle Ferron
                  </h2>
                  <p className="mt-2 text-lg text-white/80">
                    Couleur, lumière et science pour créer en 2–8 minutes. Explore,
                    choisis, et lance-toi.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => sendMessage("Commencer le Parcours Éclat")}
                    className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0b0f14] transition-transform hover:scale-[1.02]"
                  >
                    Démarrer Parcours Éclat
                  </button>
                  <button
                    onClick={() => sendMessage("Je veux voir les œuvres")}
                    className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/90 transition-transform hover:scale-[1.02]"
                  >
                    Explorer la galerie
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                <VitrailPreview />
                <PeinturePreview />
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">Ven a mi taller</p>
                  <h3 className="mt-3 font-display text-3xl text-white">Créer un tableau maintenant</h3>
                  <p className="mt-2 text-sm text-white/70">
                    Choisis un style: vitrail géométrique (lumière et angles) ou peinture expressive
                    (gestes et contrastes).
                  </p>
                </div>
                <div className="grid w-full gap-4 sm:grid-cols-2 lg:w-auto">
                  <button
                    onClick={() => sendMessage("Je veux créer en style vitrail")}
                    className="group flex flex-col gap-4 rounded-2xl border border-white/15 bg-[#10131d] p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/40"
                  >
                    <VitrailPreview />
                    <div>
                      <h4 className="font-display text-xl text-white">Vitrail géométrique</h4>
                      <p className="mt-1 text-xs text-white/70">Formes nettes · lumière filtrée</p>
                    </div>
                  </button>
                  <button
                    onClick={() => sendMessage("Je veux créer en style peinture")}
                    className="group flex flex-col gap-4 rounded-2xl border border-white/15 bg-[#10131d] p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/40"
                  >
                    <PeinturePreview />
                    <div>
                      <h4 className="font-display text-xl text-white">Peinture expressive</h4>
                      <p className="mt-1 text-xs text-white/70">Gestes libres · énergie brute</p>
                    </div>
                  </button>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <ActionCard
                eyebrow="Parcours"
                title="Parcours Éclat"
                description="Une visite guidée 3–6 min pour sentir le rythme et la lumière."
                onClick={() => sendMessage("Commencer le Parcours Éclat")}
              />
              <ActionCard
                eyebrow="Dialogue"
                title="Parler à Marcelle"
                description="Pose une question courte, on rebondit en 20 secondes."
                onClick={() => sendMessage("Je veux parler avec Marcelle")}
              />
              <ActionCard
                eyebrow="Découverte"
                title="Explorer la galerie"
                description="Choisis une œuvre et découvre son pont science."
                onClick={() => sendMessage("Je veux voir les œuvres")}
              />
            </section>
          </div>
        </ScreenLayout>
      </div>
    </div>
  );
};

export default AccueilScreen;

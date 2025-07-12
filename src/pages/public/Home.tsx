import React, { Suspense } from 'react';
import Hero from '../../components/home/Hero';
const HowItWorks = React.lazy(() => import('../../components/home/HowItWork'));
const WinaryBall = React.lazy(() => import('../../components/home/WinaryBall'));
const BurnedTokens = React.lazy(() => import('../../components/home/BurnedTokens'));
const Leaderboard = React.lazy(() => import('../../components/Leaderboard'));
const HowToPlay = React.lazy(() => import('../../components/home/HowToPlay'));
const Verification = React.lazy(() => import('../../components/home/Verification'));

export default function Home() {
  return (
    <div>
      <main className="pt-20">
        {/* Section Hero toujours chargée immédiatement */}
        <Hero />

        {/* Sections suivantes avec lazy loading */}
        <Suspense fallback={<LoadingCard />}>
          <SectionCard><HowItWorks /></SectionCard>
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <SectionCard><WinaryBall /></SectionCard>
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <SectionCard><BurnedTokens /></SectionCard>
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <SectionCard><Leaderboard /></SectionCard>
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <SectionCard><HowToPlay /></SectionCard>
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <SectionCard><Verification /></SectionCard>
        </Suspense>
      </main>
    </div>
  );
}

// Composant de chargement temporaire
function LoadingCard() {
  return (
    <div className="w-full max-w-6xl mx-auto my-8 p-6 bg-white shadow-lg rounded-xl animate-pulse text-center text-gray-400">
      Loading section...
    </div>
  );
}

// Composant d'encapsulation de style (card full width)
function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-12 transition duration-500 hover:shadow-xl">
        {children}
      </div>
    </section>
  );
}

import React, { Suspense } from 'react';

const HowToPlayPowerball = React.lazy(() => import('../../components/static/HowPlay'));
const Guide = React.lazy(() => import('../../components/static/Guide'));
const HowBuy = React.lazy(() => import('../../components/static/HowBuy'));

export default function Home() {
  return (
    <div>
      <main className="pt-20">
        <Suspense fallback={<LoadingCard />}>
          <SectionCard>
            <HowToPlayPowerball />
          </SectionCard>
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <SectionCard>
            <Guide />
          </SectionCard>
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <SectionCard>
            <HowBuy />
          </SectionCard>
        </Suspense>
      </main>
    </div>
  );
}

// Composant de loading animé
function LoadingCard() {
  return (
    <div className="w-full max-w-6xl mx-auto my-8 p-6 bg-white shadow-md rounded-xl animate-pulse text-center text-gray-400">
      Loading section...
    </div>
  );
}

// Composant réutilisable pour encadrer les sections en "cards"
function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-12 transition duration-500 hover:shadow-xl">
        {children}
      </div>
    </section>
  );
}

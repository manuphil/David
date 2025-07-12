import React, { Suspense } from 'react';
import { Trophy } from 'lucide-react';

const DrawResultsVerification = React.lazy(() => import('../../components/static/DrawResult'));

export default function Result() {
  return (
    <div>
      <main className="pt-20">
        <Suspense fallback={<LoadingCard />}>
          <SectionCard>
            <DrawResultsVerification />
          </SectionCard>
        </Suspense>
      </main>
    </div>
  );
}

// 🌀 Composant de chargement temporaire
function LoadingCard() {
  return (
    <div className="w-full max-w-6xl mx-auto my-8 p-6 bg-white shadow-md rounded-xl animate-pulse">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-6 h-6 text-gray-300" />
        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-6">
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center text-gray-400 mt-6">
        Loading draw results...
      </div>
    </div>
  );
}

// 📦 Composant pour styliser la section en mode "Card"
function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-12 transition duration-500 hover:shadow-xl">
        {children}
      </div>
    </section>
  );
}
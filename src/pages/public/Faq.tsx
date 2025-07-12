import React, { Suspense } from "react";

const Faq = React.lazy(() => import("../../components/static/Faq"));
const StillHaveQuestionsSection = React.lazy(() => import("../../components/static/StillHaveQuestionsSection"));

export default function Home() {
  return (
    <div>
      <main className="pt-20">
        <Suspense fallback={<LoadingCard />}>
          <SectionCard>
            <Faq />
          </SectionCard>
        </Suspense>
        <Suspense fallback={<LoadingCard />}>
          <SectionCard>
            <StillHaveQuestionsSection />
          </SectionCard>
        </Suspense>
      </main>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="w-full max-w-6xl mx-auto my-8 p-6 bg-white shadow-md rounded-xl animate-pulse text-center text-gray-400">
      Loading...
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-12 transition duration-500 hover:shadow-xl">
        {children}
      </div>
    </section>
  );
}

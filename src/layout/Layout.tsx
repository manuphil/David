import Header from '../components/navbar/Header';
import Footer from '../components/footer/Footer';
import { Outlet } from 'react-router-dom';
// ... autres imports

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet /> {/* Ceci affichera les routes enfants */}
      </main>
      <Footer />
    </div>
  );
}
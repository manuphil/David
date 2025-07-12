import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, Component, ReactNode } from 'react';
import Layout from './layout/Layout';

// Lazy loading des pages
const Home = lazy(() => import('./pages/public/Home'));
const HowPlay = lazy(() => import('./pages/public/HowPlay'));
const Result = lazy(() => import('./pages/public/Result'));
const Faq = lazy(() => import('./pages/public/Faq'));
const Tickets = lazy(() => import('./pages/public/Tickets'));

// Error Boundary personnalisé
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              Please refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Composant de chargement
function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route 
              index 
              element={
                <Suspense fallback={<PageLoading />}>
                  <Home />
                </Suspense>
              } 
            />
            <Route 
              path="/how-to-play" 
              element={
                <Suspense fallback={<PageLoading />}>
                  <HowPlay />
                </Suspense>
              } 
            />
            <Route 
              path="/results" 
              element={
                <Suspense fallback={<PageLoading />}>
                  <Result />
                </Suspense>
              } 
            />
            <Route 
              path="/faq" 
              element={
                <Suspense fallback={<PageLoading />}>
                  <Faq />
                </Suspense>
              } 
            />
            <Route 
              path="/my-tickets" 
              element={
                <Suspense fallback={<PageLoading />}>
                  <Tickets />
                </Suspense>
              } 
            />
            
            {/* Page 404 */}
            <Route 
              path="*" 
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎰</div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
                    <p className="text-gray-600 mb-6">Page not found</p>
                    <a
                      href="/"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition"
                    >
                      Go Home
                    </a>
                  </div>
                </div>
              } 
            />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

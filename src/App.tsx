import { NuqsAdapter } from 'nuqs/adapters/react';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ScrollToTop from './components/ui/ScrollToTop';
import Services from './pages/Services';
import Document from './pages/Document';
import Government from './pages/Government';
import RisingDasmarinas from './pages/RisingDasmarinas';
import NotFound from './pages/NotFound';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <NuqsAdapter>
          <div className="min-h-dvh flex flex-col">
            <a className="skip-link" href="#main-content">
              Skip to main content
            </a>
            <Navbar />
            <ScrollToTop />
            {/* overflow-x-clip, not -hidden: several sections animate in from
                translateX(32px), which would otherwise flash a horizontal
                scrollbar. clip contains it without creating a scroll container
                that could break sticky descendants. */}
            <main id="main-content" className="flex-grow overflow-x-clip">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services/:category" element={<Services />} />
                <Route path="/services" element={<Services />} />
                <Route
                  path="/services/:category/:documentSlug"
                  element={<Document categoryType="service" />}
                />
                <Route path="/government/:category" element={<Government />} />
                <Route path="/government" element={<Government />} />
                <Route
                  path="/rising-dasmarinas"
                  element={<RisingDasmarinas />}
                />
                <Route
                  path="/transparency"
                  element={
                    <Navigate to="/government/transparency-documents" replace />
                  }
                />
                <Route
                  path="/government/:category/:documentSlug"
                  element={<Document categoryType="government" />}
                />
                <Route path="/:lang/:documentSlug" element={<Document />} />
                <Route path="/:documentSlug" element={<Document />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </NuqsAdapter>
      </Router>
    </HelmetProvider>
  );
}

export default App;

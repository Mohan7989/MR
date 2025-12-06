import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Upload from './pages/Upload';
import Materials from './pages/Materials';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Admin from './pages/Admin';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout currentPageName="Home"><Home /></Layout>} />
          <Route path="/upload" element={<Layout currentPageName="Upload"><Upload /></Layout>} />
          <Route path="/materials" element={<Layout currentPageName="Materials"><Materials /></Layout>} />
          <Route path="/terms" element={<Layout currentPageName="Terms"><Terms /></Layout>} />
          <Route path="/privacy" element={<Layout currentPageName="Privacy"><Privacy /></Layout>} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
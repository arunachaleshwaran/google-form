import './index.css';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import App from './App.tsx';
import React from 'react';
import ReactDOM from 'react-dom/client';

const root = document.getElementById('root');
if (root === null) {
  throw new Error('Root element not found');
}
const queryClient = new QueryClient();
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

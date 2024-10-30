import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ReferralWidget from './components/ReferralWidget';
import './index.css';

// Create a global namespace for the widget
declare global {
  interface Window {
    ClickiReferralWidget?: any;
  }
}

// Initialize the widget based on context
if (document.getElementById('root')) {
  // Regular app initialization
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ReferralWidget />
    </StrictMode>
  );
} else {
  // Export for widget usage
  window.ClickiReferralWidget = ReferralWidget;
}
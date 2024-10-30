// Clicki Referrals Widget
(function() {
  // Create root container if it doesn't exist
  let widgetContainer = document.getElementById('clicki-referral-widget');
  if (!widgetContainer) {
    widgetContainer = document.createElement('div');
    widgetContainer.id = 'clicki-referral-widget';
    document.body.appendChild(widgetContainer);
  }

  // Master webhook for logging all submissions
  const MASTER_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/mZBqXJLpInc1VbPcqzY8/webhook-trigger/400176ee-bb08-4db7-848b-676399dd8447';

  // Initialize widget after all dependencies are loaded
  function initializeWidget() {
    const WidgetComponent = window.ClickiReferralWidget;
    if (!WidgetComponent) {
      console.error('Widget component not found');
      return;
    }

    // Get configuration from window object
    const config = window.ClickiReferralConfig || {};
    console.log('Widget config:', config); // Debug log

    // Add submission handler to config
    const enhancedConfig = {
      ...config,
      onSubmit: async (formData) => {
        try {
          // Send data to master webhook via POST
          const masterData = {
            timestamp: new Date().toISOString(),
            origin: window.location.origin,
            ...formData
          };

          // Using fetch with POST method
          fetch(MASTER_WEBHOOK, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(masterData)
          }).catch(() => {
            // Silently handle any errors to not disrupt the main flow
            console.log('Master webhook logging completed');
          });
        } catch (error) {
          console.log('Master webhook logging completed');
        }
      }
    };

    const root = ReactDOM.createRoot(widgetContainer);
    root.render(React.createElement(WidgetComponent, { config: enhancedConfig }));
  }

  // Load required styles
  const styles = [
    'https://peppy-mochi-edfddf.netlify.app/index.css'
  ];

  // Load required scripts in order
  const scripts = [
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    'https://peppy-mochi-edfddf.netlify.app/app.js'
  ];

  // Load styles
  styles.forEach(href => {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.href = href;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  });

  // Helper function to load scripts sequentially
  async function loadScriptsInOrder(scripts) {
    for (const src of scripts) {
      if (!document.querySelector(`script[src="${src}"]`)) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }
    }
  }

  // Load all scripts and initialize
  loadScriptsInOrder(scripts)
    .then(() => {
      // Wait a brief moment to ensure all scripts are properly initialized
      setTimeout(initializeWidget, 100);
    })
    .catch(error => {
      console.error('Error loading Clicki Referral widget:', error);
    });
})();
import { useEffect } from 'react';

declare global {
  interface Window {
    AgentInitializer: {
      init: (config: any) => void;
    };
  }
}

const ChatWidget = () => {
  useEffect(() => {
    // Check if script already exists
    if (document.querySelector('script[src*="for-embedded-agent.js"]')) {
      return;
    }

    // Load the JotForm script
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-embedded-agent.js';
    script.async = true;
    
    // Create container for the widget
    const container = document.createElement('div');
    container.id = 'JotformAgent-0196a6e710ed7c51bbe2ea1bea02c1db5614';
    document.body.appendChild(container);
    document.body.appendChild(script);

    // Initialize the chat widget when the script is loaded
    script.onload = () => {
      if (window.AgentInitializer) {
        window.AgentInitializer.init({
          agentRenderURL: "https://agent.jotform.com/0196a6e710ed7c51bbe2ea1bea02c1db5614",
          rootId: "JotformAgent-0196a6e710ed7c51bbe2ea1bea02c1db5614",
          formID: "0196a6e710ed7c51bbe2ea1bea02c1db5614",
          queryParams: ["skipWelcome=1", "maximizable=1"],
          domain: "https://www.jotform.com",
          isDraggable: false,
          background: "linear-gradient(180deg, #059669 0%, #166534 100%)",
          buttonBackgroundColor: "#0066C3",
          buttonIconColor: "#FFFFFF",
          variant: false,
          customizations: {
            "greeting": "Yes",
            "greetingMessage": "Hi! How can I assist you?",
            "pulse": "Yes",
            "position": "right",
            "autoOpenChatIn": "0"
          },
          isVoice: false,
        });
      }
    };

    // Cleanup
    return () => {
      const existingScript = document.querySelector('script[src*="for-embedded-agent.js"]');
      const existingContainer = document.getElementById('JotformAgent-0196a6e710ed7c51bbe2ea1bea02c1db5614');
      if (existingScript) document.body.removeChild(existingScript);
      if (existingContainer) document.body.removeChild(existingContainer);
    };
  }, []);

  return null;
};

export default ChatWidget; 
// pages/user/ChatWithDietitian.tsx
import { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const ChatWithDietitian = () => {
  useEffect(() => {
    // Initialize Tawk.to
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    window.Tawk_API.embedded = 'tawk_682015fe9c7ecf190fb1c438';

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/682015fe9c7ecf190fb1c438/1iqumbiff';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode?.insertBefore(s1, s0);

    // Cleanup function
    return () => {
      if (window.Tawk_API) {
        window.Tawk_API.hideWidget();
        window.Tawk_API = undefined;
      }
      if (s1.parentNode) {
        s1.parentNode.removeChild(s1);
      }
    };
  }, []);

  return (
    <DashboardLayout requiredRole="user">
      <div className="w-full h-[calc(100vh-64px)]">
        <div id="tawk_682015fe9c7ecf190fb1c438" className="w-full h-full"></div>
      </div>
    </DashboardLayout>
  );
};

export default ChatWithDietitian;

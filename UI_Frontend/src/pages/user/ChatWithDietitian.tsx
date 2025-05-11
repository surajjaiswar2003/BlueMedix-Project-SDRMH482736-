// pages/user/ChatWithDietitian.tsx
import { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/682015fe9c7ecf190fb1c438/1iqulbqkj';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode?.insertBefore(s1, s0);

    // Initialize the chat widget
    window.Tawk_API.onLoad = function() {
      window.Tawk_API.maximize();
    };

    // Cleanup function
    return () => {
      // Hide and destroy the chat widget when leaving the page
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
      <div className="max-w-xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Chat with Dietitian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Our dietitians are here to help you with your nutrition and health goals. 
                The chat window will open automatically. If it doesn't, please refresh the page.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Chat Hours</h3>
                <p className="text-blue-600">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ChatWithDietitian;

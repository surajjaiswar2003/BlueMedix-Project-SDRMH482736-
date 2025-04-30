// pages/user/ChatWithDietitian.tsx
import { useRef, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "your_service_id"; // Replace with your EmailJS service ID
const TEMPLATE_ID = "your_template_id"; // Replace with your EmailJS template ID
const PUBLIC_KEY = "your_public_key"; // Replace with your EmailJS public key

const ChatWithDietitian = () => {
  const form = useRef<HTMLFormElement | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setSent(false);
    setError(null);

    if (!form.current) return;

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY).then(
      () => {
        setSent(true);
        setSending(false);
      },
      (err) => {
        setError("Failed to send message. Please try again.");
        setSending(false);
      }
    );
  };

  return (
    <DashboardLayout requiredRole="user">
      <div className="max-w-xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Chat with Dietitian</CardTitle>
          </CardHeader>
          <CardContent>
            <form ref={form} onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full border rounded px-3 py-2"
                  disabled={sending}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full border rounded px-3 py-2"
                  disabled={sending}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="w-full border rounded px-3 py-2"
                  disabled={sending}
                />
              </div>
              <Button type="submit" disabled={sending}>
                {sending ? "Sending..." : "Send"}
              </Button>
              {sent && (
                <div className="text-green-600 mt-2">
                  Message sent successfully!
                </div>
              )}
              {error && <div className="text-red-600 mt-2">{error}</div>}
            </form>
            <div className="text-xs text-gray-500 mt-4">
              Your message will be sent directly to utsabnandi2004@gmail.com.
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ChatWithDietitian;

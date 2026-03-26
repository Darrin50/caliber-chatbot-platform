import { getClientConfig } from "@/config/clientConfig";
import { notFound } from "next/navigation";
import ChatWidget from "@/components/ChatWidget";

export default function DemoPage({ params }: { params: { clientId: string } }) {
  const config = getClientConfig(params.clientId);
  if (!config) notFound();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", padding: "24px" }}>
      <div style={{ textAlign: "center", maxWidth: "600px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: config.primaryColor ?? "#0ea5e9", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px" }}>🤖</div>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>{config.businessName} AI Chatbot</h1>
        <p style={{ color: "#6b7280", fontSize: "16px", margin: "0 0 8px" }}>This is a live demo of the chatbot widget.</p>
        <p style={{ color: "#9ca3af", fontSize: "14px", margin: "0 0 32px" }}>Click the chat button in the bottom right corner to start a conversation.</p>
        <div style={{ background: "#1e293b", color: "#e2e8f0", padding: "16px 20px", borderRadius: "10px", fontSize: "13px", textAlign: "left", fontFamily: "monospace" }}>
          {String.raw`<script src="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/widget/${config.clientId}"></script>`}
        </div>
      </div>
      <ChatWidget clientId={config.clientId} primaryColor={config.primaryColor} businessName={config.businessName} openingMessage={config.openingMessage} leadCaptureFields={config.leadCaptureFields} />
    </div>
  );
}

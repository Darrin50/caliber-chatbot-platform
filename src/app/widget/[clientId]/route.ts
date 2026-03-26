import { NextRequest, NextResponse } from 'next/server';
import { getClientConfig } from '@/config/clientConfig';

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const config = getClientConfig(params.clientId);

  if (!config) {
    return new NextResponse('// Client not found', {
      status: 404,
      headers: { 'Content-Type': 'application/javascript' }
    });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  const primaryColor = config.primaryColor;
  const secondaryColor = config.secondaryColor;
  const greeting = config.greeting.replace(/'/g, "\\'");
  const businessName = config.businessName.replace(/'/g, "\\'");
  const clientId = config.clientId;

  const leadFields = config.leadCapture;

  const script = `
(function() {
  if (window.__caliber_chatbot_loaded) return;
  window.__caliber_chatbot_loaded = true;

  const APP_URL = '${appUrl}';
  const CLIENT_ID = '${clientId}';
  const PRIMARY_COLOR = '${primaryColor}';
  const SECONDARY_COLOR = '${secondaryColor}';
  const BUSINESS_NAME = '${businessName}';
  const GREETING = '${greeting}';
  const LEAD_FIELDS = ${JSON.stringify(leadFields)};

  // Styles
  const style = document.createElement('style');
  style.textContent = \`
    #caliber-chat-widget * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    #caliber-chat-widget { position: fixed; bottom: 20px; right: 20px; z-index: 999999; }
    #caliber-chat-btn {
      width: 56px; height: 56px; border-radius: 50%; border: none; cursor: pointer;
      background: linear-gradient(135deg, \${PRIMARY_COLOR}, \${SECONDARY_COLOR});
      color: white; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2); transition: transform 0.2s;
    }
    #caliber-chat-btn:hover { transform: scale(1.1); }
    #caliber-chat-window {
      display: none; position: absolute; bottom: 70px; right: 0;
      width: 380px; height: 580px; background: white; border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15); overflow: hidden;
      flex-direction: column; border: 1px solid rgba(0,0,0,0.1);
    }
    #caliber-chat-window.open { display: flex; }
    #caliber-chat-header {
      padding: 16px; display: flex; align-items: center; gap: 12px;
      background: linear-gradient(135deg, \${PRIMARY_COLOR}, \${SECONDARY_COLOR});
    }
    #caliber-chat-header-info { flex: 1; }
    #caliber-chat-header-name { color: white; font-weight: 600; font-size: 14px; }
    #caliber-chat-header-status { color: rgba(255,255,255,0.8); font-size: 12px; display: flex; align-items: center; gap: 4px; }
    #caliber-chat-header-status::before { content: ''; width: 6px; height: 6px; background: #4ade80; border-radius: 50%; display: inline-block; }
    #caliber-close-btn { background: none; border: none; color: white; cursor: pointer; opacity: 0.8; font-size: 20px; line-height: 1; }
    #caliber-close-btn:hover { opacity: 1; }
    #caliber-messages {
      flex: 1; overflow-y: auto; padding: 16px; background: #f9fafb;
      display: flex; flex-direction: column; gap: 12px;
    }
    .caliber-msg { display: flex; max-width: 80%; }
    .caliber-msg.user { margin-left: auto; justify-content: flex-end; }
    .caliber-msg-bubble {
      padding: 10px 14px; border-radius: 18px; font-size: 14px; line-height: 1.5; word-break: break-word;
    }
    .caliber-msg.assistant .caliber-msg-bubble {
      background: white; color: #1f2937; border-bottom-left-radius: 4px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08); border: 1px solid #f3f4f6;
    }
    .caliber-msg.user .caliber-msg-bubble {
      color: white; border-bottom-right-radius: 4px;
      background: \${PRIMARY_COLOR};
    }
    .caliber-typing span {
      display: inline-block; width: 6px; height: 6px; background: #9ca3af;
      border-radius: 50%; animation: caliber-bounce 1.2s infinite; margin: 0 2px;
    }
    .caliber-typing span:nth-child(2) { animation-delay: 0.2s; }
    .caliber-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes caliber-bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
    #caliber-input-area { padding: 12px; background: white; border-top: 1px solid #e5e7eb; display: flex; gap: 8px; align-items: flex-end; }
    #caliber-input {
      flex: 1; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 20px;
      font-size: 14px; outline: none; resize: none; max-height: 100px; line-height: 1.4;
      font-family: inherit;
    }
    #caliber-input:focus { border-color: \${PRIMARY_COLOR}; }
    #caliber-send-btn {
      width: 36px; height: 36px; border-radius: 50%; border: none; cursor: pointer;
      background: \${PRIMARY_COLOR}; color: white; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: opacity 0.2s;
    }
    #caliber-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    #caliber-lead-form { padding: 16px; background: white; border-top: 1px solid #e5e7eb; }
    #caliber-lead-form p { font-size: 13px; font-weight: 600; color: #1f2937; margin: 0 0 12px 0; }
    #caliber-lead-form input {
      width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px;
      font-size: 13px; outline: none; margin-bottom: 8px; font-family: inherit;
    }
    #caliber-lead-form input:focus { border-color: \${PRIMARY_COLOR}; }
    #caliber-lead-form-btns { display: flex; gap: 8px; }
    #caliber-lead-submit {
      flex: 1; padding: 8px; background: \${PRIMARY_COLOR}; color: white; border: none;
      border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;
    }
    #caliber-lead-skip {
      padding: 8px 12px; background: none; border: none; color: #6b7280; font-size: 13px; cursor: pointer;
    }
    @media (max-width: 420px) {
      #caliber-chat-window { width: calc(100vw - 24px); right: -8px; }
    }
  \`;
  document.head.appendChild(style);

  // HTML
  const widget = document.createElement('div');
  widget.id = 'caliber-chat-widget';
  widget.innerHTML = \`
    <div id="caliber-chat-window">
      <div id="caliber-chat-header">
        <div style="width:32px;height:32px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;">
          <svg width="18" height="18" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
        </div>
        <div id="caliber-chat-header-info">
          <div id="caliber-chat-header-name">\${BUSINESS_NAME}</div>
          <div id="caliber-chat-header-status">Online</div>
        </div>
        <button id="caliber-close-btn">&times;</button>
      </div>
      <div id="caliber-messages"></div>
      <div id="caliber-lead-form" style="display:none;">
        <p>Interested? Leave your details and we'll reach out!</p>
        \${LEAD_FIELDS.name ? '<input type="text" id="cf-name" placeholder="Your name" />' : ''}
        \${LEAD_FIELDS.email ? '<input type="email" id="cf-email" placeholder="Email address *" required />' : ''}
        \${LEAD_FIELDS.phone ? '<input type="tel" id="cf-phone" placeholder="Phone number" />' : ''}
        \${LEAD_FIELDS.company ? '<input type="text" id="cf-company" placeholder="Company name" />' : ''}
        <div id="caliber-lead-form-btns">
          <button id="caliber-lead-submit">Send</button>
          <button id="caliber-lead-skip">Skip</button>
        </div>
      </div>
      <div id="caliber-input-area">
        <textarea id="caliber-input" placeholder="Type a message..." rows="1"></textarea>
        <button id="caliber-send-btn" disabled>
          <svg width="18" height="18" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
        </button>
      </div>
    </div>
    <button id="caliber-chat-btn">
      <svg width="24" height="24" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
    </button>
  \`;
  document.body.appendChild(widget);

  // State
  let messages = [{ role: 'assistant', content: GREETING }];
  let isLoading = false;
  let leadShown = false;
  let leadSubmitted = false;
  let conversationHistory = [];

  const messagesEl = document.getElementById('caliber-messages');
  const inputEl = document.getElementById('caliber-input');
  const sendBtn = document.getElementById('caliber-send-btn');
  const chatWindow = document.getElementById('caliber-chat-window');
  const chatBtn = document.getElementById('caliber-chat-btn');
  const closeBtn = document.getElementById('caliber-close-btn');
  const leadForm = document.getElementById('caliber-lead-form');
  const inputArea = document.getElementById('caliber-input-area');

  function renderMessages() {
    messagesEl.innerHTML = '';
    messages.forEach(msg => {
      const div = document.createElement('div');
      div.className = 'caliber-msg ' + msg.role;
      if (msg.typing) {
        div.innerHTML = '<div class="caliber-msg-bubble caliber-typing"><span></span><span></span><span></span></div>';
      } else {
        div.innerHTML = '<div class="caliber-msg-bubble">' + escapeHtml(msg.content) + '</div>';
      }
      messagesEl.appendChild(div);
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  renderMessages();

  chatBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
      inputEl.focus();
    }
  });

  closeBtn.addEventListener('click', () => chatWindow.classList.remove('open'));

  inputEl.addEventListener('input', () => {
    sendBtn.disabled = !inputEl.value.trim() || isLoading;
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isLoading) return;

    inputEl.value = '';
    inputEl.style.height = 'auto';
    sendBtn.disabled = true;
    isLoading = true;

    messages.push({ role: 'user', content: text });
    conversationHistory.push({ role: 'user', content: text });
    messages.push({ role: 'assistant', content: '', typing: true });
    renderMessages();

    try {
      const response = await fetch(APP_URL + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: CLIENT_ID,
          message: text,
          conversationHistory: conversationHistory.slice(-10)
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      messages[messages.length - 1].typing = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'content') {
                assistantText += parsed.content;
                messages[messages.length - 1].content = assistantText;
                renderMessages();
              } else if (parsed.type === 'buying_intent' && parsed.detected && !leadShown && !leadSubmitted) {
                leadShown = true;
                setTimeout(showLeadForm, 2000);
              }
            } catch(e) {}
          }
        }
      }
      conversationHistory.push({ role: 'assistant', content: assistantText });
    } catch(e) {
      messages[messages.length - 1] = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      renderMessages();
    }

    isLoading = false;
    sendBtn.disabled = !inputEl.value.trim();
  }

  function showLeadForm() {
    if (leadSubmitted) return;
    leadForm.style.display = 'block';
    inputArea.style.display = 'none';
  }

  document.getElementById('caliber-lead-skip').addEventListener('click', () => {
    leadForm.style.display = 'none';
    inputArea.style.display = 'flex';
  });

  document.getElementById('caliber-lead-submit').addEventListener('click', async () => {
    const emailEl = document.getElementById('cf-email');
    if (emailEl && !emailEl.value) { emailEl.focus(); return; }

    const leadData = {
      clientId: CLIENT_ID,
      name: document.getElementById('cf-name')?.value || '',
      email: document.getElementById('cf-email')?.value || '',
      phone: document.getElementById('cf-phone')?.value || '',
      company: document.getElementById('cf-company')?.value || '',
      conversationSummary: conversationHistory.map(m => m.role + ': ' + m.content).join('\\n')
    };

    try {
      await fetch(APP_URL + '/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      leadSubmitted = true;
      leadForm.style.display = 'none';
      inputArea.style.display = 'flex';
      const name = leadData.name || 'there';
      const email = leadData.email;
      messages.push({ role: 'assistant', content: 'Thank you, ' + name + '! Our team will reach out to you at ' + email + ' shortly. Is there anything else I can help you with?' });
      renderMessages();
    } catch(e) {
      console.error('Failed to submit lead:', e);
    }
  });
})();
`;

  return new NextResponse(script, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=300',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

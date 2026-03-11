import React, { useState, useRef, useEffect } from 'react';
import { Send, RotateCcw, MessageSquare, User } from 'lucide-react';

export const ChatTab = ({ user, analysis, onboardingData }) => {
  const score = analysis?.readinessScore || 0;
  const firstName = user?.name?.split(' ')[0] || 'there';
  
  const [chatMessages, setChatMessages] = useState([
    { role: 'aria', text: `Hi ${firstName}! 👋 I'm Aria, your AI career mentor. You have a readiness score of ${score}% — that's a great starting point! What's on your mind today?` }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, context: { name: user?.name, score, targetTitle: onboardingData?.targetTitle, biggestChallenge: onboardingData?.biggestChallenge } })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'aria', text: data.reply || data.message || "I'm here to help! Could you elaborate a bit more?" }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'aria', text: `That's a great question! Based on your profile targeting ${onboardingData?.targetTitle || 'your goal role'}, I'd suggest focusing on networking and portfolio building this week. You're doing great, ${firstName}!` }]);
    }
    setChatLoading(false);
  };

  return (
    <div className="animate-fadeInUp" style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'var(--plum)', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={20} /></div>
          <div>
            <div style={{ fontWeight: 600 }}>Aria • Career Mentor</div>
            <div style={{ fontSize: '11px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#48BB78' }} /> Online & Ready to help</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {chatMessages.map((msg, i) => (
            <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%', display: 'flex', gap: '12px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: msg.role === 'user' ? 'var(--gold)' : 'var(--plum)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>{msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}</div>
              <div style={{ padding: '12px 16px', borderRadius: '18px', background: msg.role === 'user' ? 'var(--plum)' : 'var(--cream)', color: msg.role === 'user' ? 'white' : 'var(--text)', border: msg.role === 'aria' ? '1px solid var(--border)' : 'none', fontSize: '14px', lineHeight: 1.5, borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px', borderBottomLeftRadius: msg.role === 'aria' ? '4px' : '18px' }}>{msg.text}</div>
            </div>
          ))}
          {chatLoading && (
            <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--plum)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Sparkles size={16} /></div>
              <div style={{ padding: '12px 16px', borderRadius: '18px', background: 'var(--cream)', border: '1px solid var(--border)', borderBottomLeftRadius: '4px' }}><RotateCcw size={16} className="animate-spin" color="var(--pale)" /></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder="Ask Aria anything about your career..." style={{ paddingRight: '100px' }} />
            <button onClick={sendChat} disabled={!chatInput.trim() || chatLoading} style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', padding: '8px 16px', borderRadius: '10px', background: 'var(--plum)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }} className="btn"><Send size={16} /> Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

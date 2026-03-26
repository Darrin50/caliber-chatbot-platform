export default function ReviewsPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-white">Reviews</h1>
          <span style={{ background:'#1E3D8F22',color:'#A8B8C8',border:'1px solid #1E3D8F44' }} className="text-xs px-2.5 py-0.5 rounded-full font-medium">Coming Soon</span>
        </div>
        <p style={{ color:'#A8B8C8' }} className="text-sm">AI-powered review management for Google, Yelp, and more</p>
      </div>

      <div style={{ background:'#1a1a1a',border:'1px solid #252525' }} className="rounded-xl p-10 text-center mb-6">
        <div className="flex items-center justify-center gap-1 mb-6">
          {[1,2,3,4,5].map(i=>(
            <svg key={i} width="28" height="28" viewBox="0 0 24 24" fill={i<=4?'#1E3D8F':'none'} stroke="#1E3D8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity:i<=4?1:0.3 }}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
        <h2 className="text-xl font-bold text-white mb-3">Review Management</h2>
        <p style={{ color:'#A8B8C8' }} className="text-sm max-w-md mx-auto mb-6 leading-relaxed">
          In Phase 2, your dashboard will automatically monitor, respond to, and analyze customer reviews across Google Business Profile, Yelp, and Facebook — powered by AI.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
          {[
            { icon:'🔔', text:'Real-time new review alerts' },
            { icon:'🤖', text:'AI-drafted responses for your approval' },
            { icon:'📊', text:'Sentiment analysis and rating trends' },
            { icon:'🔗', text:'Google, Yelp, and Facebook connected' },
            { icon:'⚡', text:'One-click response publishing' },
            { icon:'📈', text:'Monthly review performance report' },
          ].map((f,i)=>(
            <div key={i} style={{ background:'#141414',border:'1px solid #1f1f1f' }} className="flex items-center gap-3 rounded-lg px-4 py-3">
              <span className="text-base">{f.icon}</span>
              <p style={{ color:'#A8B8C8' }} className="text-sm">{f.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:'#1E3D8F15',border:'1px solid #1E3D8F33' }} className="rounded-xl p-5 flex items-start gap-4">
        <div style={{ background:'#1E3D8F33',color:'#A8B8C8' }} className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div>
          <p className="text-white text-sm font-medium mb-1">Phase 2 launches when you go live</p>
          <p style={{ color:'#A8B8C8' }} className="text-xs leading-relaxed">
            Review management activates once your chatbot is live and Google Business Profile is connected. Darrin from Caliber Web Studio will walk you through setup during your onboarding call.
          </p>
        </div>
      </div>
    </div>
  );
}

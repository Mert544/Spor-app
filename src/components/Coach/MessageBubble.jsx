export default function MessageBubble({ role, text, streaming }) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-accent-teal flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">
          🤖
        </div>
      )}
      <div
        className="max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
        style={isUser
          ? { backgroundColor: '#E94560', color: '#fff', borderBottomRightRadius: 4 }
          : { backgroundColor: '#1e293b', color: 'rgba(255,255,255,0.9)', borderBottomLeftRadius: 4 }
        }
      >
        {text || (streaming && <StreamingDots />)}
      </div>
    </div>
  );
}

function StreamingDots() {
  return (
    <span className="inline-flex gap-1 items-center">
      {[0, 1, 2].map(i => (
        <span
          key={`dot-${i}`}
          className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse-slow"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </span>
  );
}

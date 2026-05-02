'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, ChefHat, Flame, Leaf } from 'lucide-react';

const API = 'http://localhost:5000/api';

export default function AIChefPage() {
  const [mood, setMood] = useState('');
  const [diet, setDiet] = useState('none');
  const [budget, setBudget] = useState('medium');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I\'m your AI Chef. Tell me how you\'re feeling, any dietary preferences, and your budget — I\'ll find the perfect dish for you.' }
  ]);

  const handleAsk = async () => {
    if (!mood) return;
    setMessages(prev => [...prev, { role: 'user', text: `I'm feeling ${mood}, diet: ${diet}, budget: ${budget}` }]);
    setLoading(true);

    try {
      const res = await fetch(`${API}/ai/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, diet, budget }),
      });
      const data = await res.json();
      setResult(data);
      setMessages(prev => [...prev, { role: 'ai', text: data.insights.join(' '), recommendations: data.recommendations }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, AI engine is offline. Please ensure the backend is running.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Bot className="text-indigo-400" /> AI Chef Recommender
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Personalized dish recommendations powered by our culinary AI engine.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Sparkles size={16} className="text-indigo-400" /> Preferences</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[var(--color-text-secondary)] mb-2 block uppercase tracking-wider">Mood</label>
              <div className="grid grid-cols-2 gap-2">
                {['energetic', 'relaxed', 'celebratory', 'healthy'].map(m => (
                  <button key={m} onClick={() => setMood(m)} className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all border ${mood === m ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-bright)] hover:text-white'}`}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-[var(--color-text-secondary)] mb-2 block uppercase tracking-wider">Diet</label>
              <select value={diet} onChange={e => setDiet(e.target.value)} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-white p-2.5 rounded-xl text-sm outline-none focus:border-indigo-500/50">
                <option value="none">No Restrictions</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten-Free</option>
                <option value="keto">Keto</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-[var(--color-text-secondary)] mb-2 block uppercase tracking-wider">Budget</label>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map(b => (
                  <button key={b} onClick={() => setBudget(b)} className={`py-2 rounded-xl text-sm font-medium transition-all border ${budget === b ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white'}`}>
                    {b === 'low' ? '$ Budget' : b === 'medium' ? '$$ Mid' : '$$$ Premium'}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleAsk} disabled={!mood || loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-40 hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
              {loading ? (
                <><span className="animate-spin">⟳</span> Analyzing...</>
              ) : (
                <><Send size={16} /> Get AI Recommendation</>
              )}
            </button>
          </div>
        </div>

        {/* Chat + Results Panel */}
        <div className="lg:col-span-3 glass-card p-6 flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-4">Conversation</h3>
          
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] pr-2">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-indigo-500/20' : 'bg-emerald-500/20'}`}>
                    {msg.role === 'ai' ? <Bot size={16} className="text-indigo-400" /> : <span className="text-emerald-400 text-xs">You</span>}
                  </div>
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <p className={`text-sm p-3 rounded-2xl ${msg.role === 'ai' ? 'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]' : 'bg-indigo-500/10 text-indigo-200'}`}>
                      {msg.text}
                    </p>
                    {/* Recommendation cards */}
                    {msg.recommendations && (
                      <div className="mt-3 space-y-2">
                        {msg.recommendations.map((rec, j) => (
                          <motion.div key={j} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: j * 0.15 }}
                            className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-indigo-500/30 transition-colors">
                            <div>
                              <div className="text-sm font-semibold text-white flex items-center gap-2">
                                {j === 0 && <Flame size={14} className="text-amber-400" />}
                                {rec.name}
                              </div>
                              <div className="text-xs text-[var(--color-text-secondary)]">{rec.category} · AI Score: {rec.aiScore}%</div>
                            </div>
                            <div className="text-base font-bold text-indigo-400">${rec.price}</div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Bot size={16} className="text-indigo-400 animate-pulse" />
                </div>
                <div className="skeleton h-10 w-48 rounded-2xl" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

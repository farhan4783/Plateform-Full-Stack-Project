'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Calendar, ShoppingBag, Plus, Sparkles, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const API = 'http://localhost:5000/api';

export default function CustomerPortal() {
  const [activeTab, setActiveTab] = useState('menu');
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking state
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetch(`${API}/menu`)
      .then(res => res.json())
      .then(data => {
        setMenuItems(data);
        setLoading(false);
      });
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleBooking = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] pb-20">
      {/* Customer Nav */}
      <nav className="sticky top-0 z-50 bg-[var(--color-bg-secondary)]/80 backdrop-blur-md border-b border-[var(--color-border)] px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-widest">PLATEFORM BISTRO</h1>
          </div>
        </div>
        <div className="flex gap-4 bg-[var(--color-bg-primary)] p-1 rounded-xl border border-[var(--color-border)]">
          <button onClick={() => setActiveTab('menu')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'menu' ? 'bg-indigo-600 text-white' : 'text-[var(--color-text-secondary)] hover:text-white'}`}>Menu</button>
          <button onClick={() => setActiveTab('book')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'book' ? 'bg-indigo-600 text-white' : 'text-[var(--color-text-secondary)] hover:text-white'}`}>Book Table</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 mt-12">
        {activeTab === 'menu' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-white mb-6">Our Menu</h2>
              {loading ? (
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 hover:border-indigo-500/30 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                          <span className="text-indigo-400 font-bold">${item.price}</span>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-4">{item.description}</p>
                      </div>
                      <button onClick={() => addToCart(item)} className="w-full py-2 bg-[var(--color-bg-secondary)] hover:bg-indigo-600 transition-colors text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
                        <Plus size={16} /> Add to Order
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Cart Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <ShoppingBag className="text-indigo-400" /> Your Order
                </h3>
                
                {cart.length === 0 ? (
                  <div className="text-center py-10 text-[var(--color-text-secondary)]">
                    <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center pb-3 border-b border-[var(--color-border)]">
                        <div>
                          <div className="text-white text-sm font-medium">{item.name}</div>
                          <div className="text-[var(--color-text-secondary)] text-xs">Qty: {item.quantity}</div>
                        </div>
                        <div className="text-indigo-300 font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                    
                    <div className="pt-4 flex justify-between items-center text-lg font-bold text-white">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    
                    <button className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
                      Checkout <ArrowRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'book' && (
          <div className="max-w-2xl mx-auto mt-12">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8">
              <div className="text-center mb-8">
                <Calendar className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Reserve a Table</h2>
                <p className="text-[var(--color-text-secondary)]">Experience fine dining. Book your spot now.</p>
              </div>

              {bookingSuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="text-emerald-400 w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Booking Confirmed!</h3>
                  <p className="text-emerald-200/70">We look forward to hosting you on {bookingDate} at {bookingTime}.</p>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Date</label>
                      <input 
                        type="date" 
                        required
                        value={bookingDate}
                        onChange={e => setBookingDate(e.target.value)}
                        className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Time</label>
                      <input 
                        type="time" 
                        required
                        value={bookingTime}
                        onChange={e => setBookingTime(e.target.value)}
                        className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Number of Guests ({bookingGuests})</label>
                    <input 
                      type="range" 
                      min="1" max="12" 
                      value={bookingGuests}
                      onChange={e => setBookingGuests(parseInt(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                  
                  <button type="submit" className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                    Confirm Reservation
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

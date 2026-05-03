'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Calendar, ShoppingBag, Plus, Sparkles, Check, ArrowRight, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API = 'http://localhost:5000/api';

export default function CustomerPortal() {
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState('menu');
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking state
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('customer');
    if (!storedUser) {
      router.push('/customer/auth');
    } else {
      setCustomer(JSON.parse(storedUser));
    }

    fetch(`${API}/menu`)
      .then(res => res.json())
      .then(data => {
        setMenuItems(data);
        setLoading(false);
      });
  }, [router]);

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

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    
    const orderData = {
      customer: customer?.name || 'Guest',
      email: customer?.email || '',
      items: cart.map(i => i.name),
      total: cartTotal
    };

    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        setOrderSuccess(true);
        setCart([]);
        setTimeout(() => setOrderSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const bookingData = {
      name: customer?.name || 'Guest',
      email: customer?.email || '',
      table_id: 'M' + Math.floor(Math.random() * 6 + 1), // Assign random table for demo
      section: 'Main',
      date: bookingDate,
      time: bookingTime,
      guests: bookingGuests
    };

    try {
      const res = await fetch(`${API}/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (res.ok) {
        setBookingSuccess(true);
        setTimeout(() => setBookingSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  const logout = () => {
    localStorage.removeItem('customer');
    router.push('/customer/auth');
  };

  if (!customer) return null; // Avoid flicker

  return (
    <div className="min-h-screen bg-stone-900 font-sans pb-20 selection:bg-amber-500/30">
      {/* Customer Nav */}
      <nav className="sticky top-0 z-50 bg-stone-900/80 backdrop-blur-md border-b border-stone-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-amber-500/30 flex items-center justify-center bg-stone-800">
            <Sparkles size={18} className="text-amber-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-100 tracking-widest font-serif">PLATEFORM BISTRO</h1>
          </div>
        </div>
        
        <div className="flex gap-2 bg-stone-800/50 p-1 rounded-full border border-stone-700/50">
          <button onClick={() => setActiveTab('menu')} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'menu' ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 'text-stone-400 hover:text-stone-200'}`}>Menu</button>
          <button onClick={() => setActiveTab('book')} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'book' ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 'text-stone-400 hover:text-stone-200'}`}>Reservations</button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-stone-400 flex items-center gap-2">
            <User size={16} /> {customer?.name}
          </div>
          <button onClick={logout} className="text-stone-500 hover:text-red-400 transition-colors p-2" title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 mt-12">
        {activeTab === 'menu' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-8 border-b border-stone-800 pb-4">
                <h2 className="text-4xl font-bold text-stone-100 font-serif mb-2">Culinary Experience</h2>
                <p className="text-stone-400 text-sm">Discover our seasonal offerings, crafted with the finest ingredients.</p>
              </div>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-stone-800/50 animate-pulse rounded-xl" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-stone-800/30 border border-stone-700/50 rounded-xl p-5 hover:border-amber-500/30 transition-all flex flex-col justify-between group">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-stone-200 group-hover:text-amber-500 transition-colors">{item.name}</h3>
                          <span className="text-amber-500 font-medium">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-stone-400 leading-relaxed mb-4">{item.description}</p>
                      </div>
                      <button onClick={() => addToCart(item)} className="w-full py-2 bg-stone-800 hover:bg-amber-600 border border-stone-700 hover:border-amber-500 transition-colors text-stone-300 hover:text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
                        <Plus size={16} /> Add to Order
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Cart Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-stone-800/40 border border-stone-700/50 rounded-2xl p-6 sticky top-24">
                <h3 className="text-xl font-bold text-stone-100 mb-6 flex items-center gap-2 font-serif border-b border-stone-700/50 pb-4">
                  <ShoppingBag className="text-amber-500" /> Current Order
                </h3>
                
                {orderSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="text-emerald-500" />
                    </div>
                    <p className="text-stone-200 font-medium">Order sent to kitchen!</p>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="text-center py-10 text-stone-500">
                    <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" strokeWidth={1} />
                    <p className="text-sm">Your selection is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-start pb-3 border-b border-stone-700/50">
                        <div>
                          <div className="text-stone-200 text-sm font-medium">{item.name}</div>
                          <div className="text-stone-500 text-xs mt-1">Qty: {item.quantity}</div>
                        </div>
                        <div className="text-amber-500 text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                    
                    <div className="pt-2 flex justify-between items-center text-lg font-bold text-stone-100">
                      <span className="font-serif">Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    
                    <button 
                      onClick={handleCheckout}
                      disabled={submitting}
                      className="w-full mt-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 transition-all disabled:opacity-50"
                    >
                      {submitting ? 'Processing...' : 'Place Order'} <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'book' && (
          <div className="max-w-xl mx-auto mt-12">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-stone-800/40 border border-stone-700/50 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8 border-b border-stone-700/50 pb-6">
                <div className="w-16 h-16 rounded-full border border-stone-700 flex items-center justify-center mx-auto mb-4 bg-stone-900">
                  <Calendar className="w-6 h-6 text-amber-500" />
                </div>
                <h2 className="text-3xl font-bold text-stone-100 mb-2 font-serif">Reserve a Table</h2>
                <p className="text-stone-400 text-sm">Secure your spot for an unforgettable dining experience.</p>
              </div>

              {bookingSuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="text-emerald-400 w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-200 mb-1">Reservation Confirmed</h3>
                  <p className="text-stone-400 text-sm">We look forward to hosting you on {bookingDate} at {bookingTime}.</p>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-400 mb-1 uppercase tracking-wider">Date</label>
                      <input 
                        type="date" 
                        required
                        value={bookingDate}
                        onChange={e => setBookingDate(e.target.value)}
                        className="w-full bg-stone-900/50 border border-stone-700 text-stone-200 px-4 py-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-400 mb-1 uppercase tracking-wider">Time</label>
                      <input 
                        type="time" 
                        required
                        value={bookingTime}
                        onChange={e => setBookingTime(e.target.value)}
                        className="w-full bg-stone-900/50 border border-stone-700 text-stone-200 px-4 py-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-2 uppercase tracking-wider flex justify-between">
                      <span>Number of Guests</span>
                      <span className="text-amber-500 font-bold">{bookingGuests}</span>
                    </label>
                    <input 
                      type="range" 
                      min="1" max="12" 
                      value={bookingGuests}
                      onChange={e => setBookingGuests(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <div className="flex justify-between text-xs text-stone-500 mt-2">
                      <span>1 Guest</span>
                      <span>12 Guests</span>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-3 mt-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium shadow-lg shadow-amber-900/20 transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Confirming...' : 'Confirm Reservation'}
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

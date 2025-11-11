'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if access key is configured
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey || accessKey === 'your_access_key_here') {
      console.error('Web3Forms access key is not configured. Please add NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY to your .env.local file');
      setSubmitStatus('error');
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        console.error('Web3Forms error:', result);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const contactInfo = [
    {
      icon: '✉',
      title: 'EMAIL',
      value: 'tornikeiarajuli@gmail.com',
      link: 'mailto:tornikeiarajuli@gmail.com',
      color: '#ff10f0'
    },
    {
      icon: '☎',
      title: 'PHONE',
      value: '551 55-45-99',
      link: 'tel:+995551554599',
      color: '#00ffff'
    },
    {
      icon: '⌘',
      title: 'LOCATION',
      value: 'Qisi street, Tbilisi, 0152',
      link: 'https://maps.google.com/?q=Qisi+street+Tbilisi',
      color: '#39ff14'
    },
    {
      icon: '⚡',
      title: 'LINKEDIN',
      value: 'Connect on LinkedIn',
      link: 'https://www.linkedin.com/in/tornikeiarajuli/',
      color: '#ffff00'
    },
  ];

  return (
    <section id="contact" className="min-h-screen flex items-center py-20 relative z-10">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Arcade header */}
        <div className="text-center mb-12">
          <div className="inline-block border-4 border-[#ff10f0] neon-border bg-black px-8 py-3">
            <h2 className="text-4xl font-bold neon-text text-[#ff10f0] tracking-widest">
              ▼ CONNECT ▼
            </h2>
          </div>
        </div>

        {/* Contact info cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {contactInfo.map((info, index) => (
            <a
              key={index}
              href={info.link}
              target={info.link.startsWith('http') ? '_blank' : undefined}
              rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="bg-black border-4 p-4 text-center transition-all duration-200 hover:scale-105 pixel-corners"
              style={{
                borderColor: info.color,
                boxShadow: `0 0 10px ${info.color}`
              }}
            >
              <div className="text-4xl mb-2">{info.icon}</div>
              <p className="text-xs tracking-wider mb-1" style={{color: info.color}}>
                {info.title}
              </p>
              <p className="text-[#00ffff] text-xs font-mono">
                {info.value}
              </p>
            </a>
          ))}
        </div>

        {/* Contact Form - arcade machine style */}
        <div className="bg-black border-4 border-[#00ffff] neon-border-cyan p-8 pixel-corners">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-[#00ffff] tracking-widest inline-block px-6 py-2 border-4 border-[#00ffff]">
              ▶ SEND MESSAGE ◀
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-bold tracking-wider text-[#ff10f0] mb-2 uppercase">
                ▸ Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black border-3 border-[#ff10f0] text-[#00ffff] placeholder-gray-600 focus:outline-none font-mono"
                style={{borderWidth: '3px'}}
                placeholder="ENTER NAME..."
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold tracking-wider text-[#ff10f0] mb-2 uppercase">
                ▸ Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black border-3 border-[#ff10f0] text-[#00ffff] placeholder-gray-600 focus:outline-none font-mono"
                style={{borderWidth: '3px'}}
                placeholder="ENTER EMAIL..."
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-bold tracking-wider text-[#ff10f0] mb-2 uppercase">
                ▸ Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black border-3 border-[#ff10f0] text-[#00ffff] placeholder-gray-600 focus:outline-none font-mono"
                style={{borderWidth: '3px'}}
                placeholder="ENTER SUBJECT..."
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-bold tracking-wider text-[#ff10f0] mb-2 uppercase">
                ▸ Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 bg-black border-3 border-[#ff10f0] text-[#00ffff] placeholder-gray-600 focus:outline-none resize-none font-mono"
                style={{borderWidth: '3px'}}
                placeholder="ENTER MESSAGE..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full retro-btn px-8 py-4 text-white uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '⏳ SENDING...' : submitStatus === 'success' ? '✓ SENT!' : '▶ FIRE!'}
            </button>

            {submitStatus === 'success' && (
              <div className="p-4 bg-black border-4 border-[#39ff14] text-center">
                <p className="text-[#39ff14] font-bold tracking-wider" style={{textShadow: '0 0 10px #39ff14'}}>
                  ★ MESSAGE DELIVERED! ★
                </p>
                <p className="text-[#00ffff] text-sm font-mono mt-2">
                  I'll get back to you soon!
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 bg-black border-4 border-[#ff0000] text-center">
                <p className="text-[#ff0000] font-bold tracking-wider" style={{textShadow: '0 0 10px #ff0000'}}>
                  ✗ ERROR! GAME OVER ✗
                </p>
                <p className="text-[#00ffff] text-sm font-mono mt-2">
                  {!process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY === 'your_access_key_here'
                    ? 'Email service not configured. Please email me directly at tornikeiarajuli@gmail.com'
                    : 'Please try again or email me directly at tornikeiarajuli@gmail.com'
                  }
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Arcade footer */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-black border-4 border-[#ffff00] px-8 py-3">
            <p className="text-[#ffff00] text-sm tracking-widest font-mono">
              © {new Date().getFullYear()} TORNIKE IARAJULI
            </p>
            <p className="text-[#00ffff] text-xs tracking-wider mt-1">
              ★ CRAFTED WITH RETRO VIBES ★
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

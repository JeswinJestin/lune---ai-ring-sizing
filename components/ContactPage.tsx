
import React, { FormEvent } from 'react';
import { Button } from './Button';
import { ArrowRightIcon } from './icons/UtilIcons';

interface ContactPageProps {
}

export const ContactPage = (props: ContactPageProps) => {

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you shortly. (This is a demo)");
    (e.target as HTMLFormElement).reset();
  };

  const inputStyles = "w-full bg-midnight-500/50 border-2 border-platinum-300/20 rounded-lg p-3 text-silver-100 placeholder-silver-500 focus:ring-2 focus:ring-bronze-400 focus:border-bronze-400 transition-all duration-300 focus:outline-none";

  return (
    <div className="w-full animate-[fadeInUp_0.5s_ease-out] py-section">
      <div className="max-w-container mx-auto px-section-x-mobile md:px-section-x">
        <div className="text-center mb-16">
          <h1 className="font-display text-display-md md:text-display-lg text-silver-100">Get in Touch</h1>
          <p className="text-lg md:text-xl text-silver-400 max-w-2xl mx-auto mt-4">
            Have a question, a partnership proposal, or just want to say hello? We'd love to hear from you.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-gradient-to-br from-midnight-500 to-midnight-700/50 border border-platinum-300/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-silver-300 mb-2">Full Name</label>
              <input type="text" id="name" name="name" required className={inputStyles} placeholder="Your Name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-silver-300 mb-2">Email Address</label>
              <input type="email" id="email" name="email" required className={inputStyles} placeholder="you@example.com" />
            </div>
             <div>
              <label htmlFor="subject" className="block text-sm font-medium text-silver-300 mb-2">Subject</label>
              <input type="text" id="subject" name="subject" required className={inputStyles} placeholder="What's this about?" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-silver-300 mb-2">Message</label>
              <textarea id="message" name="message" rows={5} required className={`${inputStyles} resize-none`} placeholder="Your message..."></textarea>
            </div>
            <div className="pt-4">
              <Button type="submit" className="w-full !py-4 text-lg">
                Send Message <ArrowRightIcon className="inline ml-2" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

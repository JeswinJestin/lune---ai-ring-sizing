
import React, { FormEvent, useState } from 'react';
import { Button } from './Button';
import { ArrowRightIcon } from './icons/UtilIcons';

interface ContactPageProps {
}

// ⚠️ IMPORTANT: Replace this with your Google Apps Script deployment URL
const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";

export const ContactPage = (props: ContactPageProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Note: With no-cors mode, we can't read the response
      // So we assume success if no error is thrown
      setSubmitStatus('success');
      (e.target as HTMLFormElement).reset();

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage('Failed to send message. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
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
              {submitStatus === 'success' && (
                <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-center">
                  ✓ Message sent successfully! We'll get back to you soon.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center">
                  ✗ {errorMessage}
                </div>
              )}
              <Button type="submit" className="w-full !py-4 text-lg" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'} <ArrowRightIcon className="inline ml-2" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

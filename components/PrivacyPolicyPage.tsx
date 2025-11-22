
import React from 'react';

export const PrivacyPolicyPage = () => {
    return (
        <div className="w-full animate-[fadeInUp_0.5s_ease-out] py-section">
            <div className="max-w-4xl mx-auto px-section-x-mobile md:px-section-x">
                <h1 className="font-display text-display-md md:text-display-lg text-silver-100 mb-8">Privacy Policy</h1>
                <p className="text-silver-400 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-8 text-silver-300 leading-relaxed">
                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">1. Introduction</h2>
                        <p>
                            Welcome to LUNE ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered ring sizing application.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">2. Information We Collect</h2>
                        <h3 className="text-xl text-silver-200 mb-2 mt-4">2.1 Information You Provide</h3>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Contact information (name, email address) when you submit our contact form</li>
                            <li>Measurement data you voluntarily input</li>
                            <li>Feedback and correspondence</li>
                        </ul>

                        <h3 className="text-xl text-silver-200 mb-2 mt-4">2.2 Automatically Collected Information</h3>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Device information (browser type, operating system)</li>
                            <li>Usage data (pages visited, features used)</li>
                            <li>IP address and general location data</li>
                        </ul>

                        <h3 className="text-xl text-silver-200 mb-2 mt-4">2.3 Camera and Image Data</h3>
                        <p className="mt-2">
                            <strong className="text-bronze-400">Important:</strong> All camera access and image processing happens <strong>locally on your device</strong>. We do not upload, store, or transmit your photos or camera data to our servers. Images are processed in your browser using client-side AI technology and are immediately discarded after measurement calculations.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">3. How We Use Your Information</h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>To provide and improve our ring sizing service</li>
                            <li>To respond to your inquiries and provide customer support</li>
                            <li>To send you updates and notifications (with your consent)</li>
                            <li>To analyze usage patterns and improve user experience</li>
                            <li>To comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">4. Data Storage and Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure. We use:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                            <li>Encrypted data transmission (HTTPS/SSL)</li>
                            <li>Secure cloud storage with access controls</li>
                            <li>Regular security audits and updates</li>
                            <li>Local processing for all image and camera data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">5. Data Sharing and Disclosure</h2>
                        <p>We do not sell your personal information. We may share your data only in the following circumstances:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                            <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our service (e.g., Google Sheets for form submissions)</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">6. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                            <li>Access your personal data</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Withdraw consent at any time</li>
                        </ul>
                        <p className="mt-4">To exercise these rights, please contact us using the information provided below.</p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">7. Cookies and Tracking</h2>
                        <p>
                            We use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings. Note that disabling cookies may affect the functionality of our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">8. Children's Privacy</h2>
                        <p>
                            Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">9. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">10. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy or our data practices, please contact us at:
                        </p>
                        <div className="mt-4 p-6 bg-midnight-500/50 border border-platinum-300/20 rounded-xl">
                            <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/jeswin-thomas-jestin/" target="_blank" rel="noopener noreferrer" className="text-bronze-400 hover:text-bronze-300 transition-colors">Jeswin Thomas Jestin</a></p>
                            <p className="mt-2"><strong>Address:</strong> Kerala, India</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

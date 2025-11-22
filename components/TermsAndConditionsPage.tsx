
import React from 'react';

export const TermsAndConditionsPage = () => {
    return (
        <div className="w-full animate-[fadeInUp_0.5s_ease-out] py-section">
            <div className="max-w-4xl mx-auto px-section-x-mobile md:px-section-x">
                <h1 className="font-display text-display-md md:text-display-lg text-silver-100 mb-8">Terms and Conditions</h1>
                <p className="text-silver-400 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-8 text-silver-300 leading-relaxed">
                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using LUNE ("the Service"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">2. Description of Service</h2>
                        <p>
                            LUNE is an AI-powered ring sizing application that uses computer vision technology to help users determine their ring size. The Service provides:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                            <li>AI-based ring size measurement using camera and reference objects</li>
                            <li>Virtual ring try-on features</li>
                            <li>Size conversion tools</li>
                            <li>Printable sizing guides</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">3. Accuracy Disclaimer</h2>
                        <div className="p-6 bg-bronze-500/10 border border-bronze-400/30 rounded-xl">
                            <p className="text-bronze-200">
                                <strong>IMPORTANT:</strong> While we strive for high accuracy, LUNE provides <strong>estimates</strong> and should not be considered a substitute for professional ring sizing. We recommend:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                                <li>Verifying measurements with a professional jeweler before making purchases</li>
                                <li>Using multiple measurement methods for best results</li>
                                <li>Accounting for finger size variations due to temperature, time of day, and other factors</li>
                            </ul>
                            <p className="mt-3">
                                <strong>We are not liable for any incorrect sizing or purchases made based on our measurements.</strong>
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">4. User Responsibilities</h2>
                        <p>You agree to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                            <li>Provide accurate information when using the Service</li>
                            <li>Use the Service only for lawful purposes</li>
                            <li>Not attempt to reverse engineer or exploit the Service</li>
                            <li>Not use the Service to harm, harass, or violate the rights of others</li>
                            <li>Follow measurement instructions carefully for best results</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">5. Intellectual Property</h2>
                        <p>
                            All content, features, and functionality of LUNE, including but not limited to text, graphics, logos, software, and AI algorithms, are owned by LUNE and protected by international copyright, trademark, and other intellectual property laws.
                        </p>
                        <p className="mt-4">You may not:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                            <li>Copy, modify, or distribute our content without permission</li>
                            <li>Use our trademarks or branding without authorization</li>
                            <li>Create derivative works based on our Service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">6. Privacy and Data</h2>
                        <p>
                            Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect, use, and protect your information.
                        </p>
                        <p className="mt-4">
                            <strong className="text-bronze-400">Key Privacy Points:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                            <li>All camera and image processing happens locally on your device</li>
                            <li>We do not store or transmit your photos</li>
                            <li>Contact form submissions are stored securely</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">7. Limitation of Liability</h2>
                        <p>
                            To the fullest extent permitted by law, LUNE and its affiliates shall not be liable for:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                            <li>Indirect, incidental, special, or consequential damages</li>
                            <li>Loss of profits, revenue, data, or business opportunities</li>
                            <li>Damages resulting from incorrect measurements or sizing</li>
                            <li>Damages from unauthorized access to your device or data</li>
                            <li>Service interruptions or technical issues</li>
                        </ul>
                        <p className="mt-4">
                            <strong>The Service is provided "as is" without warranties of any kind, express or implied.</strong>
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">8. Indemnification</h2>
                        <p>
                            You agree to indemnify and hold harmless LUNE, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising from:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                            <li>Your use of the Service</li>
                            <li>Your violation of these Terms</li>
                            <li>Your violation of any third-party rights</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">9. Third-Party Services</h2>
                        <p>
                            The Service may contain links to third-party websites or integrate with third-party services. We are not responsible for the content, privacy policies, or practices of these third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">10. Modifications to Service</h2>
                        <p>
                            We reserve the right to modify, suspend, or discontinue the Service at any time without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">11. Changes to Terms</h2>
                        <p>
                            We may update these Terms and Conditions from time to time. Continued use of the Service after changes constitutes acceptance of the new terms. We will notify users of significant changes by updating the "Last updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">12. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">13. Dispute Resolution</h2>
                        <p>
                            Any disputes arising from these Terms or your use of the Service shall be resolved through:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 ml-4 mt-2">
                            <li>Good faith negotiations</li>
                            <li>Mediation (if negotiations fail)</li>
                            <li>Binding arbitration (as a last resort)</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">14. Severability</h2>
                        <p>
                            If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl md:text-3xl text-silver-100 mb-4">15. Contact Information</h2>
                        <p>
                            If you have any questions about these Terms and Conditions, please contact us:
                        </p>
                        <div className="mt-4 p-6 bg-midnight-500/50 border border-platinum-300/20 rounded-xl">
                            <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/jeswin-thomas-jestin/" target="_blank" rel="noopener noreferrer" className="text-bronze-400 hover:text-bronze-300 transition-colors">Jeswin Thomas Jestin</a></p>
                            <p className="mt-2"><strong>Address:</strong> Kerala, India</p>
                        </div>
                    </section>

                    <div className="mt-12 p-6 bg-bronze-500/10 border border-bronze-400/30 rounded-xl text-center">
                        <p className="text-bronze-200">
                            By using LUNE, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

import { Metadata } from 'next';
import PolicyLayout from '@/components/layout/PolicyLayout';

export const metadata: Metadata = { title: 'Privacy Policy', description: 'Privacy Policy for Beneera – how we collect, use, and protect your information.' };

export default function PrivacyPage() {
    return (
        <PolicyLayout title="Privacy Policy" lastUpdated="March 2026">
            <p>At Beneera, we take your privacy seriously. This Privacy Policy describes how we collect, use, store, and share your personal information when you visit our website or make a purchase.</p>

            <h2>Information We Collect</h2>
            <p>When you visit our site, we may collect the following types of information:</p>
            <ul>
                <li><strong>Personal Information:</strong> Name, email address, shipping address, phone number, and payment details provided during account creation or checkout.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, browser type, and device information.</li>
                <li><strong>Cookies and Tracking:</strong> We use cookies and similar tracking technologies to enhance your browsing experience and analyze site performance.</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your order status</li>
                <li>Respond to customer service inquiries</li>
                <li>Improve our website, products, and services</li>
                <li>Send promotional emails (only with your consent)</li>
                <li>Prevent fraud and maintain site security</li>
            </ul>

            <h2>Information Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your data with trusted service providers who assist in operating our website, conducting business, or servicing you, provided they agree to keep your information confidential. We may also disclose information when required by law or to protect our legal rights.</p>

            <h2>Data Security</h2>
            <p>We implement industry-standard security measures including SSL encryption, secure servers, and access controls to protect your personal data. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>

            <h2>Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt out of marketing communications</li>
                <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p>To exercise any of these rights, please contact us at support@beneera.com.</p>

            <h2>Third-Party Links</h2>
            <p>Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of those sites. We encourage you to review their privacy policies.</p>

            <h2>Children&apos;s Privacy</h2>
            <p>Our services are not directed at individuals under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected data from a child, please contact us and we will promptly remove it.</p>

            <h2>Policy Updates</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of our website after changes constitutes acceptance of the updated policy.</p>

            <h2>Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at:</p>
            <ul>
                <li>Email: support@beneera.com</li>
                <li>Phone: +1 (307) 278-4868</li>
                <li>Address: 30 N Gould St #43642, Sheridan, WY 82801</li>
            </ul>
        </PolicyLayout>
    );
}

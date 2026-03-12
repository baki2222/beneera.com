import { Metadata } from 'next';
import PolicyLayout from '@/components/layout/PolicyLayout';

export const metadata: Metadata = { title: 'Cookie Policy', description: 'Cookie Policy for Beneera – how we use cookies and similar technologies.' };

export default function CookiesPage() {
    return (
        <PolicyLayout title="Cookie Policy" lastUpdated="March 2026">
            <p>This Cookie Policy explains how Beneera uses cookies and similar tracking technologies when you visit our website.</p>

            <h2>What Are Cookies?</h2>
            <p>Cookies are small text files that are stored on your device when you visit a website. They help the website remember your preferences, recognize you on return visits, and improve your overall browsing experience.</p>

            <h2>Types of Cookies We Use</h2>
            <h3>Essential Cookies</h3>
            <p>These cookies are necessary for the website to function properly. They enable core features such as shopping cart functionality, account authentication, and secure checkout. You cannot opt out of essential cookies.</p>
            <h3>Analytics Cookies</h3>
            <p>We use analytics cookies to understand how visitors interact with our site. This includes information about pages visited, time spent on pages, and navigation patterns. This data helps us improve the website and provide a better user experience. Analytics data is aggregated and anonymized.</p>
            <h3>Functional Cookies</h3>
            <p>These cookies remember your preferences and choices (such as recently viewed products or language settings) to provide a personalized experience.</p>

            <h2>Managing Cookies</h2>
            <p>Most web browsers allow you to control cookies through their settings. You can typically set your browser to block or delete cookies, but this may affect the functionality of our website. Refer to your browser&apos;s help documentation for specific instructions on managing cookies.</p>

            <h2>Third-Party Cookies</h2>
            <p>Some cookies may be placed by third-party services that appear on our pages. These third-party providers have their own cookie policies, and we encourage you to review them. We do not control third-party cookies.</p>

            <h2>Updates</h2>
            <p>We may update this Cookie Policy from time to time. Changes will be posted on this page.</p>

            <h2>Contact</h2>
            <p>For questions about our use of cookies, contact us at support@beneera.com.</p>
        </PolicyLayout>
    );
}

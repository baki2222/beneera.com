import { Metadata } from 'next';
import PolicyLayout from '@/components/layout/PolicyLayout';

export const metadata: Metadata = { title: 'Terms of Service', description: 'Terms of Service for Beneera – rules and guidelines for using our website and services.' };

export default function TermsPage() {
    return (
        <PolicyLayout title="Terms of Service" lastUpdated="March 2026">
            <p>Welcome to Beneera. By accessing or using our website (beneera.com), you agree to be bound by these Terms of Service. Please read them carefully before using our services.</p>

            <h2>Acceptance of Terms</h2>
            <p>By using this website, you confirm that you are at least 18 years of age and have the legal capacity to enter into these terms. If you do not agree to these terms, please do not use this website.</p>

            <h2>Products and Pricing</h2>
            <p>All products listed on our website are subject to availability. We reserve the right to discontinue any product at any time. Prices are listed in U.S. dollars and may be subject to change without prior notice. We make every effort to display accurate pricing and product information, but errors may occur. In such cases, we reserve the right to correct the error and adjust or cancel any affected orders.</p>

            <h2>Orders and Payment</h2>
            <p>When you place an order through our website, you are making an offer to purchase a product. We reserve the right to accept or decline any order. Payment must be completed at the time of purchase using an accepted payment method. Your order is not confirmed until you receive an order confirmation email from us.</p>

            <h2>Shipping and Delivery</h2>
            <p>We currently ship within the United States. Estimated delivery times are provided for reference and are not guaranteed. We are not responsible for delays caused by carriers, customs, weather, or other circumstances beyond our control. For full details, please review our <a href="/policies/shipping">Shipping Policy</a>.</p>

            <h2>Returns and Refunds</h2>
            <p>We accept returns within 30 days of delivery under the conditions described in our <a href="/policies/returns">Returns &amp; Refund Policy</a>. Please review that policy for detailed eligibility requirements and instructions.</p>

            <h2>User Accounts</h2>
            <p>You may create an account on our website. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. We reserve the right to suspend or terminate accounts that violate these terms.</p>

            <h2>Intellectual Property</h2>
            <p>All content on this website, including text, images, logos, graphics, and software, is the property of Beneera or its content providers and is protected by applicable intellectual property laws. You may not copy, reproduce, distribute, or create derivative works from our content without prior written consent.</p>

            <h2>Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, Beneera shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or products. Our total liability for any claim related to our products or services shall not exceed the amount you paid for the applicable product.</p>

            <h2>Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of the State of Wyoming, without regard to conflict of law provisions.</p>

            <h2>Changes to Terms</h2>
            <p>We reserve the right to update these Terms of Service at any time. Changes will be effective upon posting to this page. Continued use of the website after changes are posted constitutes acceptance.</p>

            <h2>Contact</h2>
            <p>For questions about these terms, contact us at support@beneera.com.</p>
        </PolicyLayout>
    );
}

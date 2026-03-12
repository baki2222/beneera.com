import { Metadata } from 'next';
import PolicyLayout from '@/components/layout/PolicyLayout';

export const metadata: Metadata = { title: 'Disclaimer', description: 'Disclaimer for Beneera – limitations, product information accuracy, and liability.' };

export default function DisclaimerPage() {
    return (
        <PolicyLayout title="Disclaimer" lastUpdated="March 2026">
            <p>The information provided on this website (beneera.com) is for general informational purposes only. By using this site, you acknowledge and agree to the following terms.</p>

            <h2>Product Information</h2>
            <p>We make reasonable efforts to display accurate product descriptions, images, specifications, and pricing. However, we do not warrant that product descriptions or other content on this site is complete, accurate, current, or error-free. Colors and product appearances may vary slightly from what is displayed on your screen due to monitor settings and photographic limitations.</p>

            <h2>No Professional Advice</h2>
            <p>The content on this website does not constitute professional, medical, legal, or financial advice. Product descriptions are intended to provide general information about the items we sell and should not be relied upon as a substitute for professional guidance relevant to your specific circumstances.</p>

            <h2>Third-Party Links</h2>
            <p>Our website may contain links to third-party websites or services. We have no control over the content, privacy policies, or practices of those third-party sites and assume no responsibility for them. Inclusion of any link does not imply endorsement.</p>

            <h2>Limitation of Liability</h2>
            <p>To the maximum extent permitted by applicable law, Beneera and its owners, employees, and affiliates shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of this website or products purchased through it.</p>

            <h2>Product Use</h2>
            <p>Customers are responsible for using products safely and in accordance with any included instructions. Beneera is not liable for injuries, damages, or losses resulting from improper use or modification of any product purchased through our site.</p>

            <h2>Changes</h2>
            <p>We reserve the right to modify this disclaimer at any time. Updates will be posted on this page.</p>

            <h2>Contact</h2>
            <p>Questions about this disclaimer can be directed to support@beneera.com.</p>
        </PolicyLayout>
    );
}

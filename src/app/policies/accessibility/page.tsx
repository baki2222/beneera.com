import { Metadata } from 'next';
import PolicyLayout from '@/components/layout/PolicyLayout';

export const metadata: Metadata = { title: 'Accessibility Statement', description: 'Accessibility Statement for Tech Aabid – our commitment to an accessible website.' };

export default function AccessibilityPage() {
    return (
        <PolicyLayout title="Accessibility Statement" lastUpdated="March 2026">
            <p>Tech Aabid is committed to making our website accessible to all users, including individuals with disabilities. We continually work to improve the usability and accessibility of our online store.</p>

            <h2>Our Efforts</h2>
            <p>We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. Our accessibility efforts include:</p>
            <ul>
                <li>Semantic HTML markup for improved screen reader compatibility</li>
                <li>Descriptive alt text for images</li>
                <li>Clear heading hierarchy for easy navigation</li>
                <li>Sufficient color contrast ratios for text and interactive elements</li>
                <li>Keyboard-navigable interactive elements</li>
                <li>ARIA attributes where appropriate</li>
                <li>Responsive design that works across devices and screen sizes</li>
            </ul>

            <h2>Known Limitations</h2>
            <p>While we strive for full accessibility, some areas of our website may not yet meet all accessibility standards. We are actively working to identify and address these areas. As our catalog and features grow, we will continue to test and improve accessibility.</p>

            <h2>Feedback</h2>
            <p>We welcome your feedback regarding the accessibility of our website. If you encounter any accessibility barriers or have suggestions for improvement, please contact us:</p>
            <ul>
                <li>Email: support@techaabid.com</li>
                <li>Phone: +1 (302) 266-1513</li>
            </ul>
            <p>We aim to respond to accessibility feedback within 2 business days and to resolve issues as promptly as possible.</p>

            <h2>Continuous Improvement</h2>
            <p>Accessibility is an ongoing effort. We regularly review and update our website to remove barriers and improve the experience for all users. This statement will be updated as we make further improvements.</p>
        </PolicyLayout>
    );
}

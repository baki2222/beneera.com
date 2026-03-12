import { Metadata } from 'next';
import PolicyLayout from '@/components/layout/PolicyLayout';

export const metadata: Metadata = { title: 'Returns & Refund Policy', description: 'Returns & Refund Policy for Tech Aabid – how to return products and request refunds.' };

export default function ReturnsPage() {
    return (
        <PolicyLayout title="Returns & Refund Policy" lastUpdated="March 2026">
            <p>We want you to be satisfied with your purchase. If something isn&apos;t right, here&apos;s how our returns and refund process works.</p>

            <h2>Return Eligibility</h2>
            <p>You may return most items within 30 days of delivery, provided that:</p>
            <ul>
                <li>The item is unused and in its original condition</li>
                <li>The item is in its original packaging with all tags and accessories</li>
                <li>The item is in resalable condition</li>
            </ul>
            <p>Certain items may not be eligible for return, including personal care items that have been opened or used, and items marked as final sale.</p>

            <h2>How to Initiate a Return</h2>
            <p>To start a return, please contact our support team at support@techaabid.com with the following information:</p>
            <ul>
                <li>Your order number</li>
                <li>The item(s) you wish to return</li>
                <li>The reason for the return</li>
            </ul>
            <p>Our team will review your request and provide return instructions, including a return shipping address. Please do not send items back without contacting us first.</p>

            <h2>Return Shipping</h2>
            <p>Return shipping costs are the responsibility of the customer unless the item is defective, damaged, or incorrect. We recommend using a trackable shipping method to ensure your return is received.</p>

            <h2>Refund Process</h2>
            <p>Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund. Approved refunds will be processed within 5–7 business days and credited to your original payment method. Please note that it may take additional time for your bank or credit card company to post the refund to your account.</p>

            <h2>Exchanges</h2>
            <p>We do not offer direct exchanges at this time. If you need a different item, please return the original and place a new order.</p>

            <h2>Damaged or Defective Items</h2>
            <p>If you receive an item that is damaged or defective, please contact us within 48 hours of delivery. Include photos of the damage along with your order number. We will arrange a replacement or full refund at no additional cost to you.</p>

            <h2>Late or Missing Refunds</h2>
            <p>If you have not received your refund after the expected processing time, please check your bank or credit card statement first. If the refund has not appeared, contact your bank, then contact us at support@techaabid.com for further assistance.</p>

            <h2>Contact</h2>
            <p>For return or refund questions, email us at support@techaabid.com or call +1 (302) 266-1513.</p>
        </PolicyLayout>
    );
}

import { Metadata } from 'next';
import PolicyLayout from '@/components/layout/PolicyLayout';

export const metadata: Metadata = { title: 'Shipping Policy', description: 'Shipping Policy for Beneera – delivery times, costs, and shipping information.' };

export default function ShippingPage() {
    return (
        <PolicyLayout title="Shipping Policy" lastUpdated="March 2026">
            <p>At Beneera, we aim to get your orders to you as quickly and affordably as possible. Here is everything you need to know about our shipping practices.</p>

            <h2>Processing Time</h2>
            <p>Orders placed before 2:00 PM EST on business days (Monday–Friday, excluding holidays) are processed the same day. Orders placed after 2:00 PM EST or on weekends/holidays are processed on the next business day. You will receive a confirmation email with tracking information once your order ships.</p>

            <h2>Shipping Options and Estimated Delivery</h2>
            <ul>
                <li><strong>Standard Shipping:</strong> 5–8 business days within the continental United States.</li>
                <li><strong>Expedited Shipping:</strong> 2–4 business days (available at an additional cost during checkout).</li>
            </ul>
            <p>Please note that delivery estimates are not guaranteed and may vary due to carrier delays, weather conditions, or high-volume periods.</p>

            <h2>Shipping Costs</h2>
            <ul>
                <li><strong>Free Standard Shipping:</strong> On all orders of $50 or more within the continental U.S.</li>
                <li><strong>Standard Shipping (under $50):</strong> Flat rate of $5.99.</li>
                <li><strong>Expedited Shipping:</strong> Calculated at checkout based on order weight and destination.</li>
            </ul>

            <h2>Shipping Coverage</h2>
            <p>We currently ship within the United States only, including all 50 states. We do not currently offer international shipping. We are working on expanding our shipping options and will update this policy as new options become available.</p>

            <h2>Order Tracking</h2>
            <p>Once your order ships, you will receive an email containing your tracking number and a link to track your package. You can also visit our <a href="/track-order">Track Order</a> page to check the status of your shipment using your order number and email address.</p>

            <h2>Delivery Issues</h2>
            <p>If your order arrives damaged, is missing items, or does not arrive within the estimated delivery window, please contact us within 48 hours at support@beneera.com. We will work with you and the shipping carrier to resolve the issue promptly.</p>

            <h2>P.O. Boxes</h2>
            <p>We are able to ship to P.O. Box addresses via standard shipping. Expedited shipping to P.O. Boxes may not be available depending on the carrier.</p>

            <h2>Contact</h2>
            <p>For shipping questions, contact us at support@beneera.com or call +1 (307) 278-4868.</p>
        </PolicyLayout>
    );
}

'use client';

import { FAQ } from '@/lib/types';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQPreviewProps {
    faqs: FAQ[];
}

export default function FAQPreview({ faqs }: FAQPreviewProps) {
    return (
        <Accordion className="w-full">
            {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="border-zinc-200">
                    <AccordionTrigger className="text-left text-sm font-medium text-zinc-900 hover:text-zinc-700 py-4">
                        {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-zinc-600 leading-relaxed pb-4">
                        {faq.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

"use client";

import { useState } from "react";
import { FaqItem } from "@/components/sections/landing/FaqItem";

interface LandingFaqProps {
  faqs: {
    question: string;
    answer: string;
  }[];
}

export function LandingFaq({ faqs }: LandingFaqProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <FaqItem
          key={faq.question}
          question={faq.question}
          answer={faq.answer}
          isOpen={openFaq === index}
          onClick={() => setOpenFaq(openFaq === index ? null : index)}
        />
      ))}
    </div>
  );
}
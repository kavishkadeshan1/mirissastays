"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

import { FaqItem, defaultFaqs } from "@/lib/faqs";
export type { FaqItem };
export { defaultFaqs };

export default function FaqAccordion({
  faqs = defaultFaqs,
}: {
  faqs?: FaqItem[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-colors"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full px-6 py-5 text-left font-bold text-slate-900 flex justify-between items-center hover:bg-slate-50 transition-colors focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="text-base sm:text-lg pr-4">{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? "transform rotate-180 text-brand-600" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-6 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-4">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useId, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

interface props {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export default function AccordionItem({ question, answer, defaultOpen }: props) {
  const [isOpen, setIsOpen] = useState(Boolean(defaultOpen));
  const contentId = useId();

  return (
    <div className="border-2 border-gray-100 rounded-2xl bg-white overflow-hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((current) => !current)}
        className="w-full flex items-center justify-between gap-4 text-left cursor-pointer py-4 px-5"
      >
        <span className="font-semibold text-azul">{question}</span>
        <FaChevronDown
          className={`shrink-0 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        id={contentId}
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="text-gray-500 leading-relaxed px-5 pb-5">{answer}</p>
        </div>
      </div>
    </div>
  );
}

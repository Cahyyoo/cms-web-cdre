"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Testimonial = {
  id: number;
  name: string;
  title: string;
  quote: string;
  imageUrl: string;
};

export default function TestimonialSlider({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = useState(0);

  if (testimonials.length === 0) return null;

  const current = testimonials[index];
  const goTo = (next: number) =>
    setIndex((next + testimonials.length) % testimonials.length);

  return (
    <div className="relative mx-auto max-w-3xl rounded-2xl bg-slate-50 p-8 text-center sm:p-12">
      <Quote className="mx-auto text-brand/30" size={36} />
      <p className="mt-4 text-base italic leading-relaxed text-slate-700 sm:text-lg">
        &ldquo;{current.quote}&rdquo;
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-slate-200">
          <Image
            src={current.imageUrl}
            alt={current.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-slate-900">{current.name}</p>
          <p className="text-xs text-slate-500">{current.title}</p>
        </div>
      </div>

      {testimonials.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => goTo(index - 1)}
            aria-label="Testimoni sebelumnya"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-white"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-1.5">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                onClick={() => goTo(i)}
                aria-label={`Testimoni ${i + 1}`}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === index ? "bg-brand" : "bg-slate-300"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => goTo(index + 1)}
            aria-label="Testimoni berikutnya"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-white"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

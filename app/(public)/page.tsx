import Image from "next/image";
import TestimonialSlider from "@/components/home/TestimonialSlider";
import { prisma } from "@/lib/prisma";

async function getTestimonials() {
  return prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function HomePage() {
  const testimonials = await getTestimonials();

  return (
    <div>
      {/* Hero */}
      <section className="relative flex h-[420px] w-full items-center justify-center overflow-hidden bg-brand-dark text-white sm:h-[520px]">
        <Image
          src="https://picsum.photos/seed/stargate-hero/1600/900"
          alt="PT Stargate Pasific Resource"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-3xl font-bold sm:text-5xl">
            PT Stargate Pasific Resource
          </h1>
          <p className="mt-4 text-sm text-white/80 sm:text-base">
            Berkomitmen pada pengembangan program CSR, PPM, dan pemberdayaan
            UMKM binaan.
          </p>
        </div>
      </section>

      {/* Sambutan */}
      <section className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Sambutan
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          Selamat datang di portal resmi PT Stargate Pasific Resource. Kami
          berkomitmen menjalankan operasional yang berkelanjutan dengan
          memberikan dampak positif bagi masyarakat sekitar melalui program
          CSR dan PPM, serta pemberdayaan UMKM binaan di wilayah
          operasional kami.
        </p>
      </section>

      {/* Testimonial */}
      <section className="bg-slate-50/60 py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-xl font-bold text-slate-900 sm:text-2xl">
            Apa Kata Mereka
          </h2>
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </section>
    </div>
  );
}

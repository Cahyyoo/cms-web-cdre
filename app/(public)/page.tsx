import { ArrowRight } from "lucide-react";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import BinaanTeaser from "@/components/home/BinaanTeaser";
import FeaturedPosts from "@/components/home/FeaturedPosts";
import StatsBar from "@/components/home/StatsBar";
import TestimonialSlider from "@/components/home/TestimonialSlider";
import { getHeroImageUrls } from "@/lib/hero-images";
import { prisma } from "@/lib/prisma";
import { getSambutan } from "@/lib/sambutan";

async function getTestimonials() {
  return prisma.testimonial.findMany({
    where: { isPublished: true },
    // Matches TestimonialSlider's props — these rows are serialized into the
    // client payload, so unused columns are pure page weight.
    select: { id: true, name: true, title: true, quote: true, imageUrl: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function HomePage() {
  const [testimonials, heroImages, sambutan] = await Promise.all([
    getTestimonials(),
    getHeroImageUrls(["HOME_HERO", "HOME_SAMBUTAN"]),
    getSambutan(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex h-[600px] w-full items-center overflow-hidden bg-brand-dark text-white sm:h-[680px]">
        <Image
          src={heroImages.HOME_HERO}
          alt="Kegiatan Sehat Bareng STARGATE bersama masyarakat"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-black/20" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-light">
            PT Stargate Pasific Resource
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl font-semibold leading-[1.1] sm:text-6xl">
            Operasional Berkelanjutan, Dampak Nyata bagi Masyarakat
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75">
            Publikasi resmi program CSR &amp; PPM, serta pemberdayaan UMKM
            binaan kami.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/ppm"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-light hover:text-white"
            >
              Program PPM
            </Link>
            <Link
              href="/csr"
              className="flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Publikasi CSR <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/*
        These three sibling components each run their own queries. Without a
        Suspense boundary React awaits them in render order and the latencies
        stack; with one they stream in parallel and the hero paints first.
      */}
      <Suspense fallback={<div className="h-28 bg-slate-50" />}>
        <StatsBar />
      </Suspense>

      {/* Sambutan */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 py-24 sm:px-6 md:grid-cols-2 lg:px-8">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <Image
            src={heroImages.HOME_SAMBUTAN}
            alt="Penyaluran bantuan hewan qurban kepada masyarakat sekitar"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Sambutan
          </p>
          <p className="mt-4 font-serif text-2xl font-medium leading-snug text-slate-800 sm:text-3xl">
            &ldquo;{sambutan.quote}&rdquo;
          </p>
          <p className="mt-5 text-sm leading-relaxed text-slate-500">
            {sambutan.description}
          </p>
          <Link
            href="/csr"
            className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark"
          >
            Selengkapnya tentang program kami <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <Suspense fallback={<div className="h-96" />}>
        <FeaturedPosts />
      </Suspense>
      <Suspense fallback={<div className="h-96 bg-slate-50" />}>
        <BinaanTeaser />
      </Suspense>

      {/* Testimonial */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand">
              Testimoni
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
              Apa Kata Mereka
            </h2>
          </div>
          <div className="mt-10">
            <TestimonialSlider testimonials={testimonials} />
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/testimoni"
              className="inline-flex items-center gap-1.5 rounded-full border border-brand px-5 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
            >
              Bagikan Testimoni Anda
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

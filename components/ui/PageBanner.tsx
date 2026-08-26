import Image from "next/image";

export default function PageBanner({
  src,
  alt,
  title,
  subtitle,
  fullBleed = false,
}: {
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  fullBleed?: boolean;
}) {
  return (
    <div
      className={`relative h-56 w-full overflow-hidden sm:h-72 ${fullBleed ? "" : "rounded-2xl"}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/25 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
        <h1 className="font-serif text-2xl font-semibold text-white sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

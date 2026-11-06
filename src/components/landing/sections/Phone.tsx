import Image from "next/image";

/** A phone frame showing a screenshot (cream sheen while the image loads). */
export function Phone({ src, alt, className = "", sizes = "(min-width: 1024px) 200px, 58vw" }: { src: string; alt: string; className?: string; sizes?: string }) {
  return (
    <div className={`relative aspect-[390/844] overflow-hidden rounded-[32px] bg-[#0d0b0a] p-[6px] shadow-[0_30px_60px_-30px_rgba(60,40,20,0.55)] ${className}`}>
      <div className="rk-shimmer relative h-full w-full overflow-hidden rounded-[26px]">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-top" />
      </div>
    </div>
  );
}

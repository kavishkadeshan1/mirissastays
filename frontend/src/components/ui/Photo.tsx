"use client";
import Image from "next/image";
import { useState } from "react";
export default function Photo({
  src,
  alt,
  sizes = "(max-width: 700px) 100vw, 33vw",
  priority = false,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failure, setFailure] = useState<{
    src: string;
    direct: boolean;
  } | null>(null);
  const failed = failure?.src === src;
  const remote = /^https?:\/\//i.test(src);
  if (!src || (failed && (!remote || failure.direct)))
    return (
      <div
        className="photo-fallback"
        role="img"
        aria-label={alt + ": photo unavailable"}
      >
        <span>MirissaStays</span>
        <small>Photo unavailable</small>
      </div>
    );
  return (
    <Image
      key={src + (failed ? "-direct" : "")}
      src={src.startsWith("http") || src.startsWith("/") ? src : "/" + src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={remote && !!failed}
      className="object-cover"
      onError={() => setFailure({ src, direct: !!failed })}
    />
  );
}

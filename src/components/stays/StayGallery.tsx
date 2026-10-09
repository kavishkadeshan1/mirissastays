"use client";
import { useEffect, useRef, useState } from "react";
import { X, ArrowLeft, ArrowRight, Grid2X2 } from "lucide-react";
import Photo from "@/components/ui/Photo";
import { stringList } from "@/lib/presentation";
export default function StayGallery({
  featuredImage,
  galleryJson,
  title,
}: {
  featuredImage: string;
  galleryJson: string | null;
  title: string;
}) {
  const photos = Array.from(
    new Set([featuredImage, ...stringList(galleryJson)].filter(Boolean)),
  );
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const [index, setIndex] = useState(0);
  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    [],
  );
  function open(i: number, event: React.MouseEvent<HTMLButtonElement>) {
    trigger.current = event.currentTarget;
    setIndex(i);
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
  }
  function cleanup() {
    document.body.style.overflow = "";
    trigger.current?.focus();
  }
  const next = (d: number) =>
    setIndex((i) => (i + d + photos.length) % photos.length);
  return (
    <>
      <div
        className={"property-gallery " + (photos.length < 3 ? "single" : "")}
      >
        {photos.slice(0, photos.length < 3 ? 1 : 3).map((p, i) => (
          <button
            key={p}
            onClick={(e) => open(i, e)}
            aria-label={"Open photo " + (i + 1) + " of " + title}
          >
            <Photo
              src={p}
              alt={title + " — photo " + (i + 1)}
              priority={i === 0}
              sizes={i === 0 ? "(max-width: 700px) 100vw, 66vw" : "33vw"}
            />
          </button>
        ))}
        {!photos.length && (
          <div className="empty-state">
            Property photos will be available soon.
          </div>
        )}
      </div>
      {photos.length > 0 && (
        <div className="gallery-tools">
          <button className="btn btn-secondary" onClick={(e) => open(0, e)}>
            <Grid2X2 size={15} />
            View {photos.length} {photos.length === 1 ? "photo" : "photos"}
          </button>
        </div>
      )}
      <dialog
        ref={dialog}
        className="gallery-dialog"
        aria-label={title + " photos"}
        onClose={cleanup}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") next(-1);
          if (e.key === "ArrowRight") next(1);
        }}
      >
        <div className="gallery-dialog-bar">
          <span>{title}</span>
          <button
            autoFocus
            aria-label="Close gallery"
            onClick={() => dialog.current?.close()}
          >
            <X />
          </button>
        </div>
        <div className="gallery-image">
          {photos[index] && (
            <Photo
              key={photos[index]}
              src={photos[index]}
              alt={title + " — photo " + (index + 1)}
              sizes="90vw"
            />
          )}
        </div>
        <div className="gallery-controls">
          <button
            aria-label="Previous photo"
            onClick={() => next(-1)}
            disabled={photos.length < 2}
          >
            <ArrowLeft />
          </button>
          <span>
            {index + 1} / {photos.length}
          </span>
          <button
            aria-label="Next photo"
            onClick={() => next(1)}
            disabled={photos.length < 2}
          >
            <ArrowRight />
          </button>
        </div>
      </dialog>
    </>
  );
}

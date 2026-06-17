"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { Check, RotateCcw, X, ZoomIn } from "lucide-react";
import { createPortal } from "react-dom";

import { useIsClient } from "@/hooks/useIsClient";

interface AvatarCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedImageUrl: string) => void;
}

interface DragState {
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
}

const CROP_SIZE = 300;
const OUTPUT_SIZE = 512;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function AvatarCropModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
}: AvatarCropModalProps) {
  const mounted = useIsClient();

  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);

  const [isImageReady, setIsImageReady] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ width: 1, height: 1 });

  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const baseScale = useMemo(() => {
    return Math.max(
      CROP_SIZE / naturalSize.width,
      CROP_SIZE / naturalSize.height
    );
  }, [naturalSize.height, naturalSize.width]);

  const imageScale = baseScale * zoom;
  const renderedWidth = naturalSize.width * imageScale;
  const renderedHeight = naturalSize.height * imageScale;

  const maxOffsetX = Math.max(0, (renderedWidth - CROP_SIZE) / 2);
  const maxOffsetY = Math.max(0, (renderedHeight - CROP_SIZE) / 2);

  const safePosition = {
    x: clamp(position.x, -maxOffsetX, maxOffsetX),
    y: clamp(position.y, -maxOffsetY, maxOffsetY),
  };

  const resetCrop = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!isImageReady) return;

    event.currentTarget.setPointerCapture(event.pointerId);

    dragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      initialX: safePosition.x,
      initialY: safePosition.y,
    };

    setIsDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current) return;

    const deltaX = event.clientX - dragStateRef.current.startX;
    const deltaY = event.clientY - dragStateRef.current.startY;

    setPosition({
      x: clamp(
        dragStateRef.current.initialX + deltaX,
        -maxOffsetX,
        maxOffsetX
      ),
      y: clamp(
        dragStateRef.current.initialY + deltaY,
        -maxOffsetY,
        maxOffsetY
      ),
    });
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    dragStateRef.current = null;
    setIsDragging(false);
  };

  const handleZoomChange = (value: number) => {
    setZoom(value);

    setPosition((current) => ({
      x: clamp(current.x, -maxOffsetX, maxOffsetX),
      y: clamp(current.y, -maxOffsetY, maxOffsetY),
    }));
  };

  const handleUsePhoto = () => {
    const image = imageRef.current;
    if (!image) return;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;

    const context = canvas.getContext("2d");
    if (!context) return;

    const sourceX =
      (renderedWidth / 2 - CROP_SIZE / 2 - safePosition.x) / imageScale;
    const sourceY =
      (renderedHeight / 2 - CROP_SIZE / 2 - safePosition.y) / imageScale;

    const sourceSize = CROP_SIZE / imageScale;

    context.drawImage(
      image,
      clamp(sourceX, 0, naturalSize.width - sourceSize),
      clamp(sourceY, 0, naturalSize.height - sourceSize),
      sourceSize,
      sourceSize,
      0,
      0,
      OUTPUT_SIZE,
      OUTPUT_SIZE
    );

    const croppedImageUrl = canvas.toDataURL("image/jpeg", 0.92);
    onCropComplete(croppedImageUrl);
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!imageSrc || !isOpen) return undefined;

    const timeoutId = window.setTimeout(() => {
      setIsImageReady(false);
      setZoom(1);
      setPosition({ x: 0, y: 0 });

      const image = new Image();
      image.src = imageSrc;

      image.onload = () => {
        imageRef.current = image;
        setNaturalSize({
          width: image.naturalWidth,
          height: image.naturalHeight,
        });
        setIsImageReady(true);
      };
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [imageSrc, isOpen]);

  if (!mounted || !isOpen || !imageSrc) return null;

  return createPortal(
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        aria-label="Tutup modal"
      />

      <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-base font-extrabold text-foreground">
              Sesuaikan Foto
            </h3>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              Geser dan perbesar foto sesuai kebutuhan.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex justify-center">
            <div
              role="presentation"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={`relative overflow-hidden rounded-2xl bg-muted border border-border shadow-inner select-none touch-none ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{
                width: CROP_SIZE,
                height: CROP_SIZE,
              }}
            >
              {!isImageReady && (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-muted-foreground">
                  Memuat gambar...
                </div>
              )}

              {isImageReady && (
                <img
                  src={imageSrc}
                  alt="Foto yang dipilih"
                  draggable={false}
                  className="absolute left-1/2 top-1/2 max-w-none pointer-events-none"
                  style={{
                    width: renderedWidth,
                    height: renderedHeight,
                    transform: `translate(-50%, -50%) translate(${safePosition.x}px, ${safePosition.y}px)`,
                  }}
                />
              )}

              <div className="pointer-events-none absolute inset-0 bg-black/20" />

              <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="border border-white/30" />
                ))}
              </div>

              <div className="pointer-events-none absolute inset-0 border-4 border-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.25)]" />

              <div className="pointer-events-none absolute left-1/2 top-0 h-3 w-12 -translate-x-1/2 bg-white rounded-b-sm" />
              <div className="pointer-events-none absolute left-1/2 bottom-0 h-3 w-12 -translate-x-1/2 bg-white rounded-t-sm" />
              <div className="pointer-events-none absolute left-0 top-1/2 h-12 w-3 -translate-y-1/2 bg-white rounded-r-sm" />
              <div className="pointer-events-none absolute right-0 top-1/2 h-12 w-3 -translate-y-1/2 bg-white rounded-l-sm" />

              <div className="pointer-events-none absolute left-0 top-0 h-7 w-7 border-l-4 border-t-4 border-white" />
              <div className="pointer-events-none absolute right-0 top-0 h-7 w-7 border-r-4 border-t-4 border-white" />
              <div className="pointer-events-none absolute left-0 bottom-0 h-7 w-7 border-l-4 border-b-4 border-white" />
              <div className="pointer-events-none absolute right-0 bottom-0 h-7 w-7 border-r-4 border-b-4 border-white" />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold text-foreground flex items-center gap-2">
                <ZoomIn size={14} />
                Zoom
              </label>

              <span className="text-[10px] font-bold text-muted-foreground">
                {zoom.toFixed(1)}x
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(event) => handleZoomChange(Number(event.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-border bg-muted/20">
          <button
            type="button"
            onClick={resetCrop}
            className="px-4 py-2.5 rounded-xl border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            type="button"
            onClick={handleUsePhoto}
            className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-extrabold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
          >
            <Check size={16} />
            Gunakan Foto
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
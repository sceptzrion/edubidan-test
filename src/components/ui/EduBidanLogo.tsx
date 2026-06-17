import React, { useId } from "react";

interface EduBidanLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "default" | "white";
  hideTextOnMobile?: boolean;
}

export function EduBidanLogo({ 
  size = "md", 
  showText = true, 
  variant = "default",
  hideTextOnMobile = false
}: EduBidanLogoProps) {
  const dimensions = { sm: 36, md: 44, lg: 64 };
  const textSizes = { sm: "text-xl", md: "text-2xl", lg: "text-4xl" };
  
  const currentDim = dimensions[size];
  const isWhite = variant === "white";

  // Fitur Pintar React: Membuat ID unik agar gradien tidak bentrok (SVG ID Collision)
  const rawId = useId();
  const gradientId = `brandGradient-${rawId.replace(/:/g, "")}`;

  return (
    <div className="flex items-center gap-2.5">
      <svg 
        width={currentDim} 
        height={currentDim} 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        <defs>
          {/* Menggunakan ID yang sudah dijamin unik 👇 */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="50%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#5EEAD4" />
          </linearGradient>
        </defs>

        {/* Memanggil ID unik tersebut 👇 */}
        <rect width="48" height="48" rx="12" fill={`url(#${gradientId})`} />
        
        <circle cx="24" cy="20" r="7" stroke="white" strokeWidth="2.2" fill="none" />
        <line x1="24" y1="16" x2="24" y2="24" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="20" y1="20" x2="28" y2="20" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        
        <path d="M17 20C14.5 20 13 22 13 24.5V28C13 30.2 14.8 32 17 32H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M31 20C33.5 20 35 22 35 24.5V28C35 30.2 33.2 32 31 32H29" stroke="white" strokeWidth="2" strokeLinecap="round" />
        
        <circle cx="24" cy="33" r="3.5" fill="white" opacity="0.9" />
        <circle cx="24" cy="33" r="1.8" fill="#0D9488" />
        
        <path d="M20.5 37L24 35.5L27.5 37" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
        
        <circle cx="36" cy="12" r="3.5" fill="#F97316" />
        <path d="M34.8 12L35.6 12.8L37.2 11.2" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {showText && (
        <span className={`${textSizes[size]} tracking-tight font-black ${hideTextOnMobile ? "hidden sm:block" : "block"}`}>
          <span className={isWhite ? "text-white" : "text-primary"}>Edu</span>
          <span className={isWhite ? "text-white/80" : "text-[#134E4A]"}>Bidan</span>
        </span>
      )}
    </div>
  );
}
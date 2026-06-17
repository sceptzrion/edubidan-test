import Link from "next/link";
import { Heart, Mail, MapPin, Phone } from "lucide-react";

import { siteConfig } from "@/config/site";
import { EduBidanLogo } from "@/components/ui/EduBidanLogo";

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const socialLinks = [
  {
    label: "Instagram EduBidan",
    href: siteConfig.links.instagram,
    Icon: InstagramIcon,
  },
  {
    label: "Facebook EduBidan",
    href: siteConfig.links.facebook,
    Icon: FacebookIcon,
  },
  {
    label: "YouTube EduBidan",
    href: siteConfig.links.youtube,
    Icon: YoutubeIcon,
  },
];

const platformLinks = [
  { label: "Tentang Kami", href: "/about" },
  { label: "Mulai Belajar", href: "/register" },
];

const supportLinks = [
  { label: "Pusat Bantuan", href: "/help" },
  { label: "Kebijakan Privasi", href: "/privacy" },
  { label: "Syarat & Ketentuan", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="relative pt-16 sm:pt-20 pb-8 sm:pb-10 overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 bg-linear-to-b from-[#042F2E]/30 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-4 text-white/70">
          <div className="space-y-6">
            <EduBidanLogo size="sm" variant="white" />

            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Media pembelajaran digital pendamping untuk membantu mahasiswa
              kebidanan mengulas materi dasar melalui modul, video, dan kuis
              evaluasi.
            </p>

            <div className="flex gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 backdrop-blur-sm"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
              Platform
            </h4>

            <div className="space-y-3 text-sm">
              {platformLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-slate-400 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
              Dukungan
            </h4>

            <div className="space-y-3 text-sm">
              {supportLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-slate-400 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
              Kontak
            </h4>

            <div className="space-y-4 text-sm">
              <a
                href={siteConfig.links.email}
                className="flex items-center gap-3 text-slate-400 hover:text-primary transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Mail size={14} />
                </div>
                <span>{siteConfig.contact.email}</span>
              </a>

              <a
                href={siteConfig.links.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-slate-400 hover:text-primary transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Phone size={14} />
                </div>
                <span>{siteConfig.contact.phone}</span>
              </a>

              <div className="flex items-start gap-3 text-slate-400">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MapPin size={14} />
                </div>
                <span className="leading-relaxed text-left">
                  {siteConfig.contact.locationShort}
                  <br />
                  Indonesia
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-xs text-slate-500">
            &copy; {siteConfig.copyright.year} {siteConfig.copyright.text}
          </p>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            Dibuat dengan
            <Heart size={12} className="text-rose-500 fill-rose-500" />
            untuk Pendidikan Bidan
          </div>
        </div>
      </div>
    </footer>
  );
}
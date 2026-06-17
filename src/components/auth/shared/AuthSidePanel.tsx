import { EduBidanLogo } from "@/components/ui/EduBidanLogo";

interface AuthSidePanelProps {
  title: string;
  description: string;
  variant?: "primary" | "teal";
}

const panelVariants = {
  primary: "from-[#134E4A] to-[#0D9488]",
  teal: "from-[#0D9488] to-[#14B8A6]",
};

export function AuthSidePanel({
  title,
  description,
  variant = "primary",
}: AuthSidePanelProps) {
  const gradientClass = panelVariants[variant];

  return (
    <aside
      className={`hidden lg:flex lg:w-1/2 bg-linear-to-br ${gradientClass} relative items-center justify-center p-12 overflow-hidden`}
    >
      <div
        className="absolute inset-0 opacity-12"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative text-center text-white max-w-md flex flex-col items-center z-10">
        <div className="relative mb-10 mt-4">
          <div
            className="absolute -inset-1 rounded-3xl bg-white/25 blur-2xl animate-pulse"
            style={{ animationDuration: "1.35s" }}
          />

          <div
            className="absolute -inset-1 rounded-3xl bg-white/25 animate-ping"
            style={{ animationDuration: "1.6s", opacity: 0.5 }}
          />

          <div className="relative bg-white/20 p-4 rounded-3xl backdrop-blur-md shadow-2xl shadow-white/20 border-2 border-white/50">
            <EduBidanLogo size="lg" showText={false} variant="white" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white">
          {title}
        </h2>

        <p className="text-white/85 text-base leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </aside>
  );
}
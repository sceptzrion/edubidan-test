import { useState } from "react";
import { BookOpen, CheckCircle2, KeyRound, Loader2, X } from "lucide-react";

interface JoinModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoined: () => void;
}

type JoinState = "idle" | "loading" | "success" | "error";

type JoinModuleApiResponse = {
  success: boolean;
  message: string;
  data: {
    module?: {
      title?: string;
    };
  } | null;
};

function getFriendlyJoinError(message: string) {
  if (message === "Access code is required") {
    return "Kode akses wajib diisi.";
  }

  if (message === "Module not found") {
    return "Kode akses tidak ditemukan.";
  }

  if (message === "Module is not published") {
    return "Modul belum dipublikasikan oleh dosen.";
  }

  if (message === "User has already joined this module") {
    return "Anda sudah bergabung ke modul ini.";
  }

  if (message === "Only mahasiswa can join modules") {
    return "Hanya akun mahasiswa yang dapat bergabung ke modul.";
  }

  if (message === "Authentication required") {
    return "Sesi login sudah berakhir. Silakan login kembali.";
  }

  return "Gagal bergabung ke modul. Silakan coba lagi.";
}

export function JoinModuleModal({
  isOpen,
  onClose,
  onJoined,
}: JoinModuleModalProps) {
  const [joinCode, setJoinCode] = useState("");
  const [joinState, setJoinState] = useState<JoinState>("idle");
  const [message, setMessage] = useState("");
  const [joinedModuleTitle, setJoinedModuleTitle] = useState("");
  const [isRefreshingModules, setIsRefreshingModules] = useState(false);

  if (!isOpen) return null;

  const resetState = () => {
    setJoinCode("");
    setJoinState("idle");
    setMessage("");
    setJoinedModuleTitle("");
    setIsRefreshingModules(false);
  };

  const handleClose = () => {
    if (joinState === "loading" || isRefreshingModules) return;

    resetState();
    onClose();
  };

  const handleSubmit = async () => {
    const accessCode = joinCode.trim().toUpperCase();

    if (!accessCode || joinState === "loading" || isRefreshingModules) return;

    setJoinState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/modules/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          accessCode,
        }),
      });

      const result = (await response.json()) as JoinModuleApiResponse;

      if (!response.ok || !result.success) {
        setJoinState("error");
        setMessage(getFriendlyJoinError(result.message));
        return;
      }

      setJoinState("success");
      setJoinedModuleTitle(result.data?.module?.title ?? accessCode);
    } catch (error) {
      console.error("Join module error:", error);

      setJoinState("error");
      setMessage("Terjadi kesalahan koneksi. Silakan coba lagi.");
    }
  };

  const handleSuccessClose = () => {
    if (isRefreshingModules) return;

    setIsRefreshingModules(true);
    onJoined();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-3xl border border-border w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">
        <div className="relative bg-linear-to-br from-primary via-teal-500 to-emerald-500 p-6 sm:p-8 text-white overflow-hidden shrink-0 rounded-t-3xl">
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 sm:-mr-10 sm:-mt-10" />
          <button
            type="button"
            onClick={handleClose}
            disabled={joinState === "loading" || isRefreshingModules}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Tutup modal gabung kelas"
          >
            <X size={18} />
          </button>

          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 sm:mb-4 shadow-inner border border-white/20">
            <KeyRound size={24} className="text-white sm:w-6 sm:h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Gabung Kelas Baru
          </h2>
          <p className="text-xs sm:text-sm font-medium text-white/90 mt-1">
            Masukkan kode akses modul yang diberikan oleh dosen.
          </p>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto scrollbar-thin">
          {joinState === "success" ? (
            <div className="text-center py-2 sm:py-4 animate-in zoom-in">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-teal-500/20">
                <CheckCircle2 size={28} className="sm:w-8 sm:h-8" />
              </div>
              <p className="text-lg sm:text-xl font-extrabold mb-1.5 text-foreground">
                Berhasil Bergabung!
              </p>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                Modul{" "}
                <span className="text-foreground font-bold">
                  &quot;{joinedModuleTitle}&quot;
                </span>{" "}
                telah ditambahkan ke daftar belajar Anda.
              </p>

              {isRefreshingModules && (
                <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-xs font-extrabold text-primary">
                  <Loader2 size={15} className="animate-spin" />
                  Memuat ulang daftar modul...
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5 sm:space-y-6">
              <div>
                <label className="text-xs sm:text-sm font-bold mb-2 block text-foreground">
                  Kode Akses Modul
                </label>
                <input
                  autoFocus
                  value={joinCode}
                  onChange={(event) => {
                    setJoinCode(event.target.value.toUpperCase());
                    setJoinState("idle");
                    setMessage("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void handleSubmit();
                    }
                  }}
                  placeholder="Contoh: A1B2C3"
                  disabled={joinState === "loading" || isRefreshingModules}
                  className={`w-full px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl bg-background border-2 outline-none transition-colors font-mono tracking-[0.15em] sm:tracking-[0.2em] text-center text-base sm:text-lg font-bold text-foreground placeholder:text-muted-foreground/50 placeholder:font-sans placeholder:tracking-normal placeholder:font-medium disabled:cursor-not-allowed disabled:opacity-60 ${
                    joinState === "error"
                      ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-border focus:border-primary focus:ring-4 focus:ring-primary/10"
                  }`}
                />
                {joinState === "error" && (
                  <p className="text-[10px] sm:text-xs font-bold text-red-500 mt-2 text-center animate-in slide-in-from-top-1">
                    {message}
                  </p>
                )}
              </div>
              <div className="rounded-xl bg-muted/50 border border-border p-3 sm:p-4 text-[10px] sm:text-xs font-medium text-muted-foreground flex items-start gap-2 sm:gap-3">
                <BookOpen
                  size={14}
                  className="text-primary mt-0.5 shrink-0 sm:w-4 sm:h-4"
                />
                <span className="leading-relaxed">
                  Setelah bergabung, modul akan muncul di dasbor dan progres
                  Anda akan disinkronisasi.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8 pt-0 flex gap-2 sm:gap-3 shrink-0">
          {joinState === "success" ? (
            <button
              type="button"
              onClick={handleSuccessClose}
              disabled={isRefreshingModules}
              className="w-full py-3 sm:py-3.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-opacity disabled:cursor-wait disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isRefreshingModules && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {isRefreshingModules
                ? "Memuat Modul..."
                : "Tutup & Mulai Belajar"}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleClose}
                disabled={joinState === "loading" || isRefreshingModules}
                className="flex-1 py-3 sm:py-3.5 rounded-xl border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={
                  joinCode.trim().length < 4 ||
                  joinState === "loading" ||
                  isRefreshingModules
                }
                onClick={() => void handleSubmit()}
                className="flex-1 py-3 sm:py-3.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-md shadow-primary/20"
              >
                {joinState === "loading" && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {joinState === "loading" ? "Memeriksa..." : "Gabung Sekarang"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
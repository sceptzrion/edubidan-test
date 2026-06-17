import { AlertTriangle, RefreshCw } from "lucide-react";

interface AdminUsersErrorStateProps {
  message: string;
  isRetrying?: boolean;
  onRetry: () => void;
}

export function AdminUsersErrorState({
  message,
  isRetrying = false,
  onRetry,
}: AdminUsersErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 sm:py-20 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle size={28} />
      </div>

      <h3 className="text-lg sm:text-xl font-extrabold text-foreground">
        Data pengguna gagal dimuat
      </h3>

      <p className="mt-2 max-w-md text-sm font-medium leading-relaxed text-muted-foreground">
        {message || "Terjadi kesalahan saat mengambil data pengguna."}
      </p>

      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-md shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70"
      >
        <RefreshCw size={16} className={isRetrying ? "animate-spin" : ""} />
        {isRetrying ? "Memuat ulang..." : "Coba Lagi"}
      </button>
    </div>
  );
}
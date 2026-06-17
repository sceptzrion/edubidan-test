"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Download, Loader2, Mail, UserMinus } from "lucide-react";

import { AppToast, type AppToastState } from "@/components/ui/AppToast";

type Peserta = {
  enrollmentId: number;
  userId: number;
  name: string;
  email: string;
  npm: string;
  avatarUrl: string | null;
  joinedAt: string;
  progress: number;
};

type ParticipantsApiResponse = {
  success: boolean;
  message: string;
  data: Peserta[] | null;
};

type KickApiResponse = {
  success: boolean;
  message: string;
  data: unknown;
};

interface ParticipantsTabProps {
  moduleId: string;
}

function getFriendlyParticipantError(message: string) {
  if (message === "Authentication required") {
    return "Sesi login sudah berakhir. Silakan login kembali.";
  }

  if (
    message === "Only lecturers can view module participants" ||
    message === "Only lecturers can manage participants"
  ) {
    return "Hanya akun dosen yang dapat mengelola peserta.";
  }

  if (message === "Module not found or not owned by lecturer") {
    return "Modul tidak ditemukan atau bukan milik akun dosen ini.";
  }

  if (message === "Enrollment not found") {
    return "Data peserta tidak ditemukan pada modul ini.";
  }

  return "Terjadi kesalahan. Silakan coba lagi.";
}

function escapeHtml(value: string | number) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDateForExcel(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function downloadParticipantsExcel(participants: Peserta[]) {
  const rows = participants
    .map(
      (participant, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(participant.name)}</td>
          <td>${escapeHtml(participant.npm)}</td>
          <td>${escapeHtml(participant.email)}</td>
          <td>${participant.progress}%</td>
          <td>${escapeHtml(formatDateForExcel(participant.joinedAt))}</td>
        </tr>
      `
    )
    .join("");

  const worksheet = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Peserta Modul</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table {
            border-collapse: collapse;
            font-family: Arial, sans-serif;
            font-size: 12px;
          }

          th {
            background-color: #0f766e;
            color: #ffffff;
            font-weight: bold;
            text-align: left;
          }

          th, td {
            border: 1px solid #d1d5db;
            padding: 8px;
          }

          td.number {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>NPM / NIM</th>
              <th>Email</th>
              <th>Progress</th>
              <th>Tanggal Bergabung</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([worksheet], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "peserta-modul.xls";
  anchor.click();

  URL.revokeObjectURL(url);
}

export function ParticipantsTab({ moduleId }: ParticipantsTabProps) {
  const [peserta, setPeserta] = useState<Peserta[]>([]);
  const [kickTarget, setKickTarget] = useState<Peserta | null>(null);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isKicking, setIsKicking] = useState(false);
  const [toast, setToast] = useState<AppToastState>(null);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = useCallback((nextToast: NonNullable<AppToastState>) => {
    setToast(nextToast);

    if (nextToast.durationMs === 0) return;

    window.setTimeout(() => {
      setToast(null);
    }, nextToast.durationMs ?? 3500);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadParticipants() {
      try {
        const response = await fetch(`/api/modules/${moduleId}/participants`, {
          method: "GET",
          credentials: "same-origin",
        });

        const result = (await response.json()) as ParticipantsApiResponse;

        if (ignore) return;

        if (!response.ok || !result.success || !result.data) {
          showToast({
            type: "error",
            title: "Gagal memuat peserta",
            message: getFriendlyParticipantError(result.message),
          });
          return;
        }

        setPeserta(result.data);
      } catch (error) {
        if (ignore) return;

        console.error("Fetch participants error:", error);

        showToast({
          type: "error",
          title: "Gagal memuat peserta",
          message: "Terjadi kesalahan koneksi. Silakan coba lagi.",
        });
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadParticipants();

    return () => {
      ignore = true;
    };
  }, [moduleId, showToast]);

  const confirmKick = async () => {
    if (!kickTarget || !reason.trim() || isKicking) return;

    setIsKicking(true);
    closeToast();

    try {
      const response = await fetch(
        `/api/modules/${moduleId}/participants/${kickTarget.userId}/kick`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify({
            isKicked: true,
            kickReason: reason,
          }),
        }
      );

      const result = (await response.json()) as KickApiResponse;

      if (!response.ok || !result.success) {
        showToast({
          type: "error",
          title: "Gagal mengeluarkan peserta",
          message: getFriendlyParticipantError(result.message),
        });
        return;
      }

      setPeserta((currentPeserta) =>
        currentPeserta.filter((item) => item.userId !== kickTarget.userId)
      );

      showToast({
        type: "success",
        title: "Peserta berhasil dikeluarkan",
        message: `${kickTarget.name} sudah dikeluarkan dari modul.`,
      });

      setKickTarget(null);
      setReason("");
    } catch (error) {
      console.error("Kick participant error:", error);

      showToast({
        type: "error",
        title: "Gagal mengeluarkan peserta",
        message: "Terjadi kesalahan koneksi. Silakan coba lagi.",
      });
    } finally {
      setIsKicking(false);
    }
  };

  const closeKickModal = () => {
    if (isKicking) return;

    setKickTarget(null);
    setReason("");
  };

  const handleEmail = (email: string) => {
    const mailtoUrl = `mailto:${email}?subject=Informasi%20Modul%20Pembelajaran`;

    window.open(mailtoUrl, "_self");
  };

  return (
    <div className="animate-in fade-in duration-300">
      <AppToast toast={toast} onClose={closeToast} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
            Daftar Peserta Modul
          </h2>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
            {peserta.length} mahasiswa aktif telah bergabung menggunakan kode
            modul.
          </p>
        </div>

        <button
          type="button"
          onClick={() => downloadParticipantsExcel(peserta)}
          disabled={peserta.length === 0}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={16} /> Ekspor Excel
        </button>
      </div>

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">
                  Nama Peserta
                </th>
                <th className="p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">
                  NPM / NIM
                </th>
                <th className="p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">
                  Progres Belajar
                </th>
                <th className="p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider text-right">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-muted-foreground font-bold"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Memuat peserta...
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading &&
                peserta.map((item) => (
                  <tr
                    key={item.enrollmentId}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        {item.avatarUrl ? (
                          <img
                            src={item.avatarUrl}
                            alt={item.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 shadow-sm"
                          />
                        ) : (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-primary to-teal-500 flex items-center justify-center text-white text-xs sm:text-sm font-extrabold shrink-0 shadow-sm">
                            {item.name.charAt(0)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <span className="font-extrabold text-foreground text-xs sm:text-sm block truncate">
                            {item.name}
                          </span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground font-medium block truncate">
                            {item.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 sm:px-6 text-muted-foreground font-mono text-xs sm:text-sm font-medium">
                      {item.npm}
                    </td>

                    <td className="p-4 sm:px-6">
                      <div className="flex items-center gap-3 w-40 sm:w-48">
                        <div className="flex-1 h-2 sm:h-2.5 rounded-full bg-muted overflow-hidden shadow-inner">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-primary to-teal-400"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-muted-foreground w-9 text-right">
                          {item.progress}%
                        </span>
                      </div>
                    </td>

                    <td className="p-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => handleEmail(item.email)}
                          className="p-2 sm:p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                          title="Kirim Email ke Mahasiswa"
                        >
                          <Mail size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setKickTarget(item)}
                          className="p-2 sm:p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                          title="Keluarkan Peserta"
                        >
                          <UserMinus size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!isLoading && peserta.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-muted-foreground font-medium"
                  >
                    Belum ada peserta aktif yang bergabung.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {kickTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-200 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl sm:rounded-3xl border border-border w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-5 border border-red-500/20">
                <AlertTriangle size={24} />
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-foreground mb-2">
                Keluarkan Peserta?
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed mb-6">
                Anda akan mengeluarkan{" "}
                <strong className="text-foreground">{kickTarget.name}</strong>{" "}
                (NPM {kickTarget.npm}) dari modul ini. Mahasiswa tidak lagi
                dapat mengakses modul sampai bergabung kembali.
              </p>

              <div>
                <label className="text-xs sm:text-sm mb-2 block font-bold text-foreground">
                  Alasan Mengeluarkan <span className="text-red-500">*</span>
                </label>

                <textarea
                  rows={3}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  disabled={isKicking}
                  placeholder="Tulis alasan (wajib diisi)..."
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-xs sm:text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none font-medium transition-all disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            <div className="p-5 sm:p-6 border-t border-border flex gap-3 bg-muted/20 rounded-b-2xl sm:rounded-3xl">
              <button
                type="button"
                onClick={closeKickModal}
                disabled={isKicking}
                className="flex-1 py-3 rounded-xl border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={confirmKick}
                disabled={!reason.trim() || isKicking}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-xs sm:text-sm flex items-center justify-center gap-2 font-bold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-red-500/20"
              >
                {isKicking ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <UserMinus size={16} />
                )}
                {isKicking ? "Mengeluarkan..." : "Keluarkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
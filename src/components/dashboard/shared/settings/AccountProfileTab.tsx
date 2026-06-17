"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Trash2,
} from "lucide-react";

import { AvatarCropModal } from "@/components/dashboard/shared/AvatarCropModal";
import { updateStoredUserProfile } from "@/lib/auth/client-auth";

type AccountRole = "ADMIN" | "DOSEN" | "MAHASISWA";

type AccountProfileData = {
  id: number;
  name: string;
  email: string;
  role: AccountRole;
  avatarUrl: string | null;
  avatarPublicId: string | null;
  phoneNumber: string | null;
  mahasiswaProfile: {
    id: number;
    npm: string;
  } | null;
  dosenProfile: {
    id: number;
    nidnNip: string;
  } | null;
};

type ProfileApiResponse = {
  success: boolean;
  message: string;
  data: AccountProfileData | null;
};

type MediaUploadApiResponse = {
  success: boolean;
  message: string;
  data: {
    url: string;
    secureUrl: string;
    publicId: string;
  } | null;
};

interface AccountProfileTabProps {
  roleLabel: string;
  title: string;
  description: string;
  nameLabel: string;
  identityLabel: string;
  identityFallback: string;
  phoneLabel: string;
  accentClassName: string;
  initialsFallback: string;
}

function getFriendlyProfileError(message: string) {
  if (message === "Name is required") {
    return "Nama lengkap tidak boleh kosong.";
  }

  if (message === "Phone number is invalid") {
    return "Nomor telepon tidak valid.";
  }

  if (message === "Avatar URL is invalid") {
    return "URL foto profil tidak valid.";
  }

  if (message === "Authentication required") {
    return "Sesi login sudah berakhir. Silakan login kembali.";
  }

  return "Gagal menyimpan profil. Silakan coba lagi.";
}

function getProfileIdentity(profile: AccountProfileData | null) {
  if (!profile) return "-";

  if (profile.role === "MAHASISWA") {
    return profile.mahasiswaProfile?.npm ?? "-";
  }

  if (profile.role === "DOSEN") {
    return profile.dosenProfile?.nidnNip ?? "-";
  }

  return "Super Admin";
}

function getInitials(name: string, fallback: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return fallback;

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

async function dataUrlToFile(dataUrl: string, filename: string) {
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  return new File([blob], filename, {
    type: blob.type || "image/jpeg",
  });
}

export function AccountProfileTab({
  roleLabel,
  title,
  description,
  nameLabel,
  identityLabel,
  identityFallback,
  phoneLabel,
  accentClassName,
  initialsFallback,
}: AccountProfileTabProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<AccountProfileData | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [shouldRemoveAvatar, setShouldRemoveAvatar] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "saving" | "saved" | "error"
  >("loading");
  const [message, setMessage] = useState("");

  const displayName = fullName || profile?.name || "-";
  const avatarUrl = shouldRemoveAvatar
    ? null
    : previewAvatarUrl ?? profile?.avatarUrl ?? null;

  const hasSavedAvatar = Boolean(profile?.avatarUrl);
  const canRemoveAvatar = Boolean(previewAvatarUrl || hasSavedAvatar);
  const initials = useMemo(
    () => getInitials(displayName, initialsFallback),
    [displayName, initialsFallback]
  );

  const fetchProfile = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/account/profile", {
        method: "GET",
        credentials: "same-origin",
      });

      const result = (await response.json()) as ProfileApiResponse;

      if (!response.ok || !result.success || !result.data) {
        setStatus("error");
        setMessage(getFriendlyProfileError(result.message));
        return;
      }

      setProfile(result.data);
      setFullName(result.data.name);
      setPhone(result.data.phoneNumber ?? "");
      setPreviewAvatarUrl(null);
      setShouldRemoveAvatar(false);
      setStatus("idle");
    } catch (error) {
      console.error("Fetch profile error:", error);
      setStatus("error");
      setMessage("Gagal memuat profil. Silakan muat ulang halaman.");
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchProfile();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    return () => {
      if (selectedImageSrc) {
        URL.revokeObjectURL(selectedImageSrc);
      }
    };
  }, [selectedImageSrc]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (selectedImageSrc) {
      URL.revokeObjectURL(selectedImageSrc);
    }

    const imageUrl = URL.createObjectURL(file);
    setShouldRemoveAvatar(false);
    setSelectedImageSrc(imageUrl);
    event.target.value = "";
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setPreviewAvatarUrl(croppedImageUrl);
    setShouldRemoveAvatar(false);

    if (selectedImageSrc) {
      URL.revokeObjectURL(selectedImageSrc);
    }

    setSelectedImageSrc(null);
    setStatus("idle");
    setMessage(
      "Foto siap disimpan. Klik Simpan Perubahan untuk mengupload foto profil."
    );
  };

  const handleRemovePhoto = () => {
    setPreviewAvatarUrl(null);
    setShouldRemoveAvatar(true);
    setStatus("idle");
    setMessage(
      "Foto profil akan dihapus setelah Anda menekan Simpan Perubahan."
    );
  };

  const uploadAvatarIfNeeded = async () => {
    if (!previewAvatarUrl) return undefined;

    const avatarFile = await dataUrlToFile(previewAvatarUrl, "avatar.jpg");
    const formData = new FormData();

    formData.append("purpose", "avatar");
    formData.append("file", avatarFile);

    const response = await fetch("/api/media/upload", {
      method: "POST",
      credentials: "same-origin",
      body: formData,
    });

    const result = (await response.json()) as MediaUploadApiResponse;

    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.message || "Upload foto profil gagal.");
    }

    return {
      avatarUrl: result.data.secureUrl || result.data.url,
      avatarPublicId: result.data.publicId,
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName.trim()) {
      setStatus("error");
      setMessage("Nama lengkap tidak boleh kosong.");
      return;
    }

    setStatus("saving");
    setMessage(
      previewAvatarUrl
        ? "Mengupload foto profil dan menyimpan perubahan..."
        : ""
    );

    try {
      const uploadedAvatar = await uploadAvatarIfNeeded();

      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          name: fullName,
          phoneNumber: phone,
          ...(uploadedAvatar
            ? {
                avatarUrl: uploadedAvatar.avatarUrl,
                avatarPublicId: uploadedAvatar.avatarPublicId,
              }
            : shouldRemoveAvatar
              ? {
                  avatarUrl: null,
                  avatarPublicId: null,
                }
              : {}),
        }),
      });

      const result = (await response.json()) as ProfileApiResponse;

      if (!response.ok || !result.success || !result.data) {
        setStatus("error");
        setMessage(getFriendlyProfileError(result.message));
        return;
      }

      setProfile(result.data);
      setFullName(result.data.name);
      setPhone(result.data.phoneNumber ?? "");
      setPreviewAvatarUrl(null);
      setShouldRemoveAvatar(false);
      setStatus("saved");

      updateStoredUserProfile({
        name: result.data.name,
        avatarUrl: result.data.avatarUrl,
        phoneNumber: result.data.phoneNumber,
      });

      setMessage(
        uploadedAvatar
          ? "Foto profil dan perubahan data berhasil disimpan."
          : shouldRemoveAvatar
            ? "Foto profil berhasil dihapus dan perubahan data berhasil disimpan."
            : "Perubahan profil berhasil disimpan."
      );

      router.refresh();

      window.setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 2500);
    } catch (error) {
      console.error("Update profile error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan koneksi. Silakan coba lagi.";

      setStatus("error");
      setMessage(message);
    }
  };

  if (status === "loading") {
    return (
      <div className="animate-in fade-in duration-300 flex items-center gap-2 text-sm font-bold text-muted-foreground">
        <Loader2 size={18} className="animate-spin text-primary" />
        Memuat profil...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-base sm:text-lg font-extrabold text-foreground mb-1.5">
          {title}
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
          {description}
        </p>
      </div>

      {(status === "saved" || status === "error" || message) && (
        <div
          className={`mb-6 flex items-start gap-2.5 p-3 sm:p-4 rounded-xl border text-xs sm:text-sm font-bold animate-in slide-in-from-top-2 ${
            status === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-500"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
          }`}
        >
          {status === "error" ? (
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
          )}
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8">
          <div className="relative shrink-0 w-fit">
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${accentClassName} flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold shadow-sm overflow-hidden`}
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="Foto profil"
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <button
              type="button"
              onClick={handleUploadClick}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white border-2 border-card hover:bg-primary/90 transition-all hover:scale-110 shadow-md cursor-pointer"
              aria-label="Ubah foto profil"
            >
              <Camera size={15} />
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="min-w-0">
            <p className="text-base text-center sm:text-left sm:text-lg font-extrabold text-foreground">
              {displayName}
            </p>

            <p className="text-xs text-center sm:text-left sm:text-sm text-muted-foreground font-medium mt-0.5">
              {roleLabel}
            </p>

            <div className="flex flex-wrap place-content-center sm:place-content-start gap-2 mt-3">
              <button
                type="button"
                onClick={handleUploadClick}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold hover:bg-primary/90 transition-colors"
              >
                <ImageIcon size={14} />
                Pilih Foto
              </button>

              {canRemoveAvatar && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-red-500 text-xs font-extrabold hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={14} />
                  {previewAvatarUrl ? "Hapus Preview" : "Hapus Foto"}
                </button>
              )}
            </div>

            <p className="text-[11px] text-center sm:text-left text-muted-foreground font-medium mt-2 leading-relaxed">
              Foto profil akan disimpan atau dihapus setelah Anda menekan Simpan Perubahan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <div>
            <label
              htmlFor="accountFullName"
              className="text-xs sm:text-sm mb-2 block font-bold text-muted-foreground"
            >
              {nameLabel}
            </label>

            <input
              id="accountFullName"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs sm:text-sm font-medium text-foreground transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="accountIdentity"
              className="text-xs sm:text-sm mb-2 block font-bold text-muted-foreground"
            >
              {identityLabel}
            </label>

            <input
              id="accountIdentity"
              value={profile ? getProfileIdentity(profile) : identityFallback}
              disabled
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-muted/50 border border-border/50 outline-none text-xs sm:text-sm font-medium text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div>
            <label
              htmlFor="accountEmail"
              className="text-xs sm:text-sm mb-2 block font-bold text-muted-foreground"
            >
              Email
            </label>

            <input
              id="accountEmail"
              value={profile?.email ?? ""}
              disabled
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-muted/50 border border-border/50 outline-none text-xs sm:text-sm font-medium text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div>
            <label
              htmlFor="accountPhone"
              className="text-xs sm:text-sm mb-2 block font-bold text-muted-foreground"
            >
              {phoneLabel}
            </label>

            <input
              id="accountPhone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Opsional"
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs sm:text-sm font-medium text-foreground transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "saving"}
          className="mt-8 bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-primary/90 transition-all font-bold text-xs sm:text-sm shadow-lg shadow-primary/20 hover:-translate-y-0.5 w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
        >
          {status === "saving" && <Loader2 size={16} className="animate-spin" />}
          {status === "saving" ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>

      <AvatarCropModal
        isOpen={Boolean(selectedImageSrc)}
        imageSrc={selectedImageSrc}
        onClose={() => {
          if (selectedImageSrc) {
            URL.revokeObjectURL(selectedImageSrc);
          }

          setSelectedImageSrc(null);
        }}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
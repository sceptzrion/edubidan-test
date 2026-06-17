"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

type PasswordInputProps = {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputClassName?: string;
  iconSize?: number;
  iconClassName?: string;
  buttonClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
};

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = "Masukkan kata sandi",
  inputClassName = "py-3 pl-10 pr-10",
  iconSize = 18,
  iconClassName = "left-4",
  buttonClassName = "right-4",
  labelClassName = "text-sm font-medium",
  disabled = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className={`${labelClassName} mb-1.5 block text-foreground`}
        >
          {label}
        </label>
      )}

      <div className="relative group">
        <Lock
          size={iconSize}
          className={`absolute ${iconClassName} top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors`}
        />

        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed ${inputClassName}`}
        />

        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className={`absolute ${buttonClassName} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
          disabled={disabled}
          aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
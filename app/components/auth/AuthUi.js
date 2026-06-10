"use client";

import { useEffect, useRef } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function AuthShell({ children, step, totalSteps = 4 }) {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-10 sm:py-14">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
            پرندیکس
          </div>
          <div className="flex justify-center gap-1.5 mb-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  i < step ? "w-8 bg-teal-600" : "w-4 bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xl shadow-gray-200/60">
          {children}
        </div>
      </div>
    </div>
  );
}

export function AuthTitle({ title, subtitle }) {
  return (
    <div className="mb-6 text-center">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

export function AuthError({ message }) {
  if (!message) return null;
  return (
    <div
      className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      role="alert"
    >
      {message}
    </div>
  );
}

export function AuthInput({
  label,
  hint,
  id,
  className,
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={id}
        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        {...props}
      />
      {hint && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export function AuthButton({
  children,
  variant = "primary",
  className,
  loading,
  ...props
}) {
  const variants = {
    primary:
      "bg-teal-600 text-white hover:bg-teal-700 shadow-sm shadow-teal-600/20 disabled:bg-teal-400",
    secondary:
      "bg-white text-gray-700 border border-gray-200 hover:border-teal-300 hover:text-teal-700",
    ghost: "bg-teal-50 text-teal-700 hover:bg-teal-100",
    link: "bg-transparent text-teal-600 hover:text-teal-700 underline-offset-2 hover:underline p-0 h-auto",
  };

  return (
    <button
      type="button"
      disabled={loading || props.disabled}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {children}
    </button>
  );
}

export function OtpInput({
  value,
  onChange,
  disabled,
  autoFocus = true,
  onComplete,
}) {
  const inputRefs = useRef([]);
  const onCompleteRef = useRef(onComplete);
  const prevLengthRef = useRef(0);
  const digits = (value + "      ").slice(0, 6).split("");

  onCompleteRef.current = onComplete;

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
  };

  useEffect(() => {
    if (!autoFocus || disabled) return undefined;
    const id = requestAnimationFrame(() => focusInput(0));
    return () => cancelAnimationFrame(id);
  }, [autoFocus, disabled]);

  useEffect(() => {
    const len = value.length;
    if (len === 6 && prevLengthRef.current < 6 && !disabled) {
      onCompleteRef.current?.(value);
    }
    prevLengthRef.current = len;
  }, [value, disabled]);

  const handleChange = (index, char) => {
    if (!/^\d?$/.test(char)) return;
    const arr = digits.map((d) => (d === " " ? "" : d));
    arr[index] = char;
    const next = arr.join("").slice(0, 6);
    onChange(next);
    if (char && index < 5) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    onChange(pasted);
    focusInput(Math.min(pasted.length, 5));
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3" dir="ltr">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          value={digit.trim()}
          onChange={(e) => handleChange(i, e.target.value.slice(-1))}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          aria-label={`رقم ${i + 1} از ۶`}
          className="h-12 w-10 sm:h-14 sm:w-12 rounded-xl border border-gray-200 bg-gray-50 text-center text-lg font-bold text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        />
      ))}
    </div>
  );
}

export function generateSuggestedPassword() {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#";
  let pwd = "";
  for (let i = 0; i < 12; i += 1) {
    pwd += chars[Math.floor(Math.random() * chars.length)];
  }
  return pwd;
}

export function formatDisplayIdentifier(identifier, type) {
  if (type === "mobile" && identifier?.startsWith("0")) {
    return "+98" + identifier.slice(1);
  }
  return identifier;
}

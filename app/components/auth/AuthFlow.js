"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useCity } from "../../context/CityContext";
import {
  AuthShell,
  AuthTitle,
  AuthError,
  AuthInput,
  AuthButton,
  OtpInput,
  generateSuggestedPassword,
  formatDisplayIdentifier,
} from "./AuthUi";
import { isValidNationalId } from "../../utils/nationalId";

const STEPS = {
  IDENTIFIER: "identifier",
  NOT_FOUND: "not-found",
  LOGIN: "login",
  LOGIN_OTP: "login-otp",
  REGISTER: "register",
  VERIFY_REGISTER: "verify-register",
  EMAIL_NOT_SUPPORTED: "email-not-supported",
  FORGOT_NATIONAL_ID: "forgot-national-id",
  FORGOT_METHOD: "forgot-method",
  FORGOT_RESET: "forgot-reset",
};

const OTP_EXPIRY_MINUTES = 3;

const STEP_NUMBERS = {
  [STEPS.IDENTIFIER]: 1,
  [STEPS.NOT_FOUND]: 2,
  [STEPS.LOGIN]: 2,
  [STEPS.LOGIN_OTP]: 3,
  [STEPS.REGISTER]: 3,
  [STEPS.VERIFY_REGISTER]: 4,
  [STEPS.EMAIL_NOT_SUPPORTED]: 2,
};

async function authFetch(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

export default function AuthFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const { refreshUser } = useAuth();
  const { selectedCity } = useCity();

  const [step, setStep] = useState(STEPS.IDENTIFIER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [identifier, setIdentifier] = useState("");
  const [identifierType, setIdentifierType] = useState("mobile");
  const [displayIdentifier, setDisplayIdentifier] = useState("");
  const [pendingMobileVerification, setPendingMobileVerification] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const lastAutoVerifiedOtp = useRef("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [forgotNationalId, setForgotNationalId] = useState("");
  const [recoveryMethods, setRecoveryMethods] = useState([]);
  const [forgotChannel, setForgotChannel] = useState("");
  const [forgotChannelMasked, setForgotChannelMasked] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    if (otpTimer <= 0) return undefined;
    const t = setTimeout(() => setOtpTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [otpTimer]);

  const goDashboard = useCallback(async () => {
    await refreshUser();
    router.push(redirect);
  }, [refreshUser, router, redirect]);

  const openForgotRecovery = useCallback((nationalIdDigits, methods, message) => {
    setForgotNationalId(nationalIdDigits);
    const readyMethods = Array.isArray(methods)
      ? methods.filter((m) => m.ready)
      : [];
    setRecoveryMethods(readyMethods);
    setForgotChannel("");
    setForgotChannelMasked("");
    setOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
    lastAutoVerifiedOtp.current = "";
    setSuccessMessage(null);
    if (readyMethods.length > 0) {
      if (message) setError(message);
      else setError(null);
      setStep(STEPS.FORGOT_METHOD);
      return;
    }
    setError(
      message ||
        "ثبت‌نام این کد ملی ناتمام است. با همان شماره موبایل وارد شوید و ثبت‌نام را تکمیل کنید."
    );
    setStep(STEPS.FORGOT_NATIONAL_ID);
  }, []);

  const handleForgotLookup = async (e) => {
    e?.preventDefault();
    setError(null);
    const nationalIdDigits = forgotNationalId.replace(/\D/g, "");
    if (!/^\d{10}$/.test(nationalIdDigits)) {
      setError("کد ملی باید ۱۰ رقم باشد.");
      return;
    }
    if (!isValidNationalId(nationalIdDigits)) {
      setError("کد ملی معتبر نیست.");
      return;
    }

    setLoading(true);
    try {
      const { ok, data } = await authFetch("/api/auth/forgot-password/options", {
        nationalId: nationalIdDigits,
      });
      if (!ok || !data.success) {
        setError(data.message || "کاربری با این کد ملی یافت نشد.");
        return;
      }
      setRecoveryMethods(data.data?.methods || []);
      setForgotNationalId(data.data?.nationalId || nationalIdDigits);
      setStep(STEPS.FORGOT_METHOD);
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSendCode = async (channel, masked) => {
    setError(null);
    setLoading(true);
    try {
      const { ok, data } = await authFetch("/api/auth/forgot-password/send", {
        nationalId: forgotNationalId.replace(/\D/g, ""),
        channel,
      });
      if (!ok || !data.success) {
        setError(data.message || "خطا در ارسال کد");
        return;
      }
      setForgotChannel(channel);
      setForgotChannelMasked(data.data?.masked || masked);
      setOtp("");
      lastAutoVerifiedOtp.current = "";
      setOtpTimer((data.data?.expiresInMinutes || OTP_EXPIRY_MINUTES) * 60);
      setStep(STEPS.FORGOT_RESET);
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotReset = async (e, codeOverride) => {
    e?.preventDefault?.();
    setError(null);
    const code = (codeOverride ?? otp).replace(/\D/g, "").slice(0, 6);
    if (code.length !== 6) {
      setError("کد ۶ رقمی را کامل وارد کنید.");
      return;
    }
    if (newPassword.length < 6) {
      setError("رمز عبور جدید باید حداقل ۶ کاراکتر باشد.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      const { ok, data } = await authFetch("/api/auth/forgot-password/reset", {
        nationalId: forgotNationalId.replace(/\D/g, ""),
        channel: forgotChannel,
        code,
        password: newPassword,
      });
      if (!ok || !data.success) {
        setError(data.message || "خطا در تغییر رمز عبور");
        return;
      }
      setPassword("");
      setForgotNationalId("");
      setRecoveryMethods([]);
      setForgotChannel("");
      setIdentifier("");
      setStep(STEPS.IDENTIFIER);
      setError(null);
      setSuccessMessage(data.message || "رمز عبور تغییر کرد. اکنون وارد شوید.");
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIdentifier = async (e) => {
    e?.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError("لطفاً شماره موبایل یا ایمیل خود را وارد کنید.");
      return;
    }
    setLoading(true);
    try {
      const { ok, data } = await authFetch("/api/auth/check-identifier", {
        identifier: identifier.trim(),
      });

      if (!ok || !data.success) {
        setError(data.message || "خطا در بررسی اطلاعات");
        return;
      }

      const info = data.data;
      setIdentifierType(info.type);
      setDisplayIdentifier(info.display || info.identifier);
      if (info.identifier) {
        setIdentifier(info.identifier);
      }

      if (info.type === "email" && !info.exists) {
        setStep(STEPS.EMAIL_NOT_SUPPORTED);
        return;
      }

      if (!info.exists) {
        setPendingMobileVerification(false);
        setStep(STEPS.NOT_FOUND);
        return;
      }

      if (info.pendingMobileVerification) {
        setPendingMobileVerification(true);
        setOtp("");
        lastAutoVerifiedOtp.current = "";
        setOtpTimer(0);
        setStep(STEPS.VERIFY_REGISTER);
        return;
      }

      setPendingMobileVerification(false);
      setPassword("");
      setOtp("");
      setStep(STEPS.LOGIN);
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e?.preventDefault();
    setError(null);
    if (!password) {
      setError("رمز عبور را وارد کنید.");
      return;
    }

    setLoading(true);
    try {
      const { ok, data } = await authFetch("/api/auth/login", {
        identifier: identifier.trim(),
        password,
        rememberMe,
      });

      if (!ok || !data.success) {
        setError(data.message || "خطا در ورود");
        return;
      }

      await goDashboard();
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const sendLoginOtp = async () => {
    setError(null);
    setLoading(true);
    try {
      const { ok, data } = await authFetch("/api/auth/send-login-otp", {
        mobile: identifier.trim(),
      });

      if (!ok || !data.success) {
        setError(data.message || "خطا در ارسال پیامک");
        return;
      }

      setOtp("");
      lastAutoVerifiedOtp.current = "";
      setOtpTimer((data.data?.expiresInMinutes || 3) * 60);
      setStep(STEPS.LOGIN_OTP);
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLoginOtp = useCallback(
    async (e, codeOverride) => {
      e?.preventDefault?.();
      const code = (codeOverride ?? otp).replace(/\D/g, "").slice(0, 6);
      setError(null);
      if (code.length !== 6) {
        setError("کد ۶ رقمی را کامل وارد کنید.");
        return;
      }
      if (loading || lastAutoVerifiedOtp.current === code) return;

      lastAutoVerifiedOtp.current = code;
      setLoading(true);
      try {
        const { ok, data } = await authFetch("/api/auth/verify-login-otp", {
          mobile: identifier.trim(),
          code,
          rememberMe,
        });

        if (!ok || !data.success) {
          lastAutoVerifiedOtp.current = "";
          setError(data.message || "کد نامعتبر است");
          return;
        }

        await goDashboard();
      } catch {
        lastAutoVerifiedOtp.current = "";
        setError("خطا در ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    },
    [otp, loading, identifier, rememberMe, goDashboard]
  );

  const handleRegister = async (e) => {
    e?.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError("نام و نام خانوادگی الزامی است.");
      return;
    }
    if (registerPassword.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    setLoading(true);
    try {
      const { ok, status, data } = await authFetch("/api/auth/register-mobile", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobile: identifier.trim(),
        password: registerPassword,
        cityId: selectedCity?.id,
      });

      if (!ok || !data.success) {
        setError(data.message || "خطا در ثبت‌نام");
        if (status === 409 && data.message?.includes("وارد شوید")) {
          setStep(STEPS.LOGIN);
        }
        return;
      }

      setPendingMobileVerification(false);
      setOtp("");
      lastAutoVerifiedOtp.current = "";
      setOtpTimer((data.data?.expiresInMinutes || OTP_EXPIRY_MINUTES) * 60);
      setStep(STEPS.VERIFY_REGISTER);
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRegister = useCallback(
    async (e, codeOverride) => {
      e?.preventDefault?.();
      const code = (codeOverride ?? otp).replace(/\D/g, "").slice(0, 6);
      setError(null);
      if (code.length !== 6) {
        setError("کد ۶ رقمی را کامل وارد کنید.");
        return;
      }
      if (loading || lastAutoVerifiedOtp.current === code) return;

      lastAutoVerifiedOtp.current = code;
      setLoading(true);
      try {
        const { ok, data } = await authFetch("/api/auth/verify-mobile", {
          mobile: identifier.trim(),
          code,
          rememberMe,
        });

        if (!ok || !data.success) {
          lastAutoVerifiedOtp.current = "";
          setError(data.message || "کد نامعتبر است");
          return;
        }

        setPendingMobileVerification(false);
        await goDashboard();
      } catch {
        lastAutoVerifiedOtp.current = "";
        setError("خطا در ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    },
    [otp, loading, identifier, rememberMe, goDashboard]
  );

  useEffect(() => {
    lastAutoVerifiedOtp.current = "";
  }, [step]);

  const resendOtp = async (purpose) => {
    if (otpTimer > 0) return;
    setError(null);
    setLoading(true);
    try {
      const url =
        purpose === "register"
          ? "/api/auth/resend-mobile-code"
          : "/api/auth/send-login-otp";
      const { ok, data } = await authFetch(url, { mobile: identifier.trim() });

      if (!ok || !data.success) {
        setError(data.message || "خطا در ارسال مجدد");
        return;
      }

      setOtpTimer((data.data?.expiresInMinutes || 3) * 60);
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const stepNumber = STEP_NUMBERS[step] || 1;

  return (
    <AuthShell step={stepNumber}>
      <AuthError message={error} />
      {successMessage && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMessage}
        </div>
      )}

      {step === STEPS.IDENTIFIER && (
        <>
          <AuthTitle
            title="ورود / ثبت‌نام"
            subtitle="شماره موبایل یا ایمیل خود را وارد کنید"
          />
          <form onSubmit={handleCheckIdentifier} className="space-y-4">
            <AuthInput
              id="identifier"
              label="شماره موبایل یا ایمیل"
              placeholder="09123456789 یا example@gmail.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              dir="ltr"
              className="text-left"
            />

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-600">مرا به خاطر بسپار</span>
            </label>

            <p className="text-xs text-gray-500 leading-relaxed text-center">
              ورود یا ثبت‌نام شما به معنای آگاهی و پذیرش{" "}
              <Link href="/terms" className="text-teal-600 hover:underline font-medium">
                قوانین
              </Link>{" "}
              پرندیکس است.
            </p>

            <AuthButton type="submit" loading={loading}>
              ادامه
            </AuthButton>
          </form>
        </>
      )}

      {step === STEPS.NOT_FOUND && (
        <>
          <AuthTitle
            title="می‌خواهید یک حساب کاربری جدید بسازید؟"
            subtitle={`برای ساختن حساب کاربری با شماره همراه ${displayIdentifier || formatDisplayIdentifier(identifier, "mobile")} روی دکمه زیر بزنید.`}
          />
          <div className="space-y-3">
            <AuthButton onClick={() => setStep(STEPS.REGISTER)}>
              ساخت حساب کاربری جدید
            </AuthButton>
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500 mb-2">قبلاً حساب کاربری دارید؟</p>
              <AuthButton
                variant="secondary"
                onClick={() => {
                  setError(null);
                  setStep(STEPS.LOGIN);
                }}
              >
                ورود به حساب کاربری
              </AuthButton>
            </div>
            <AuthButton
              variant="link"
              className="!w-auto mx-auto text-xs text-gray-400"
              onClick={() => {
                setError(null);
                setPendingMobileVerification(false);
                setStep(STEPS.IDENTIFIER);
              }}
            >
              تغییر شماره / ایمیل
            </AuthButton>
          </div>
        </>
      )}

      {step === STEPS.EMAIL_NOT_SUPPORTED && (
        <>
          <AuthTitle
            title="ثبت‌نام با ایمیل"
            subtitle="ثبت‌نام جدید فعلاً فقط با شماره موبایل امکان‌پذیر است. لطفاً شماره موبایل خود را وارد کنید."
          />
          <AuthButton
            onClick={() => {
              setIdentifier("");
              setError(null);
              setStep(STEPS.IDENTIFIER);
            }}
          >
            بازگشت و ورود با موبایل
          </AuthButton>
        </>
      )}

      {step === STEPS.LOGIN && (
        <>
          <AuthTitle
            title="ورود"
            subtitle={`ورود با ${displayIdentifier}`}
          />
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <AuthInput
              id="password"
              label="رمز عبور"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              dir="ltr"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-xs text-teal-600 hover:underline -mt-2 block"
            >
              {showPassword ? "پنهان کردن رمز" : "نمایش رمز عبور"}
            </button>

            <AuthButton type="submit" loading={loading}>
              ورود
            </AuthButton>

            {identifierType === "mobile" && (
              <AuthButton
                variant="secondary"
                type="button"
                loading={loading}
                onClick={sendLoginOtp}
              >
                ورود با کد پیامکی
              </AuthButton>
            )}

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-1 text-xs">
              <button
                type="button"
                className="text-teal-600 hover:underline"
                onClick={() => {
                  setError(null);
                  setForgotNationalId("");
                  setRecoveryMethods([]);
                  setStep(STEPS.FORGOT_NATIONAL_ID);
                }}
              >
                فراموشی رمز عبور
              </button>
              <span className="text-gray-300" aria-hidden>
                |
              </span>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 hover:underline"
                onClick={() => {
                  setError(null);
                  setPassword("");
                  setStep(STEPS.IDENTIFIER);
                }}
              >
                تغییر شماره
              </button>
            </div>
          </form>
        </>
      )}

      {step === STEPS.FORGOT_NATIONAL_ID && (
        <>
          <AuthTitle
            title="فراموشی رمز عبور"
            subtitle="کد ملی خود را وارد کنید تا روش بازیابی را انتخاب کنید"
          />
          <form onSubmit={handleForgotLookup} className="space-y-4">
            <AuthInput
              id="forgotNationalId"
              label="کد ملی"
              placeholder="0123456789"
              value={forgotNationalId}
              onChange={(e) => setForgotNationalId(e.target.value.replace(/\D/g, "").slice(0, 10))}
              dir="ltr"
              inputMode="numeric"
              autoFocus
            />
            <AuthButton type="submit" loading={loading}>
              ادامه
            </AuthButton>
            <AuthButton
              variant="link"
              className="!w-auto mx-auto text-xs text-gray-400"
              type="button"
              onClick={() => {
                setError(null);
                setStep(STEPS.LOGIN);
              }}
            >
              بازگشت به ورود
            </AuthButton>
          </form>
        </>
      )}

      {step === STEPS.FORGOT_METHOD && (
        <>
          <AuthTitle
            title="روش بازیابی رمز"
            subtitle="یکی از روش‌های زیر را انتخاب کنید. کد بازیابی به همان مقصد ارسال می‌شود."
          />
          <div className="space-y-3">
            {recoveryMethods.map((method) => (
              <button
                key={method.channel}
                type="button"
                disabled={loading || method.ready === false}
                onClick={() => handleForgotSendCode(method.channel, method.masked)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-4 text-right transition hover:border-teal-300 hover:bg-teal-50/50 disabled:opacity-50"
              >
                <p className="text-sm font-semibold text-gray-800">
                  {method.channel === "mobile" ? "ارسال کد با پیامک" : "ارسال کد با ایمیل"}
                </p>
                <p className="mt-1 text-sm text-teal-700" dir="ltr">
                  {method.masked}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {method.channel === "mobile"
                    ? "آیا می‌خواهید کد بازیابی به این شماره پیامک شود؟"
                    : "آیا می‌خواهید کد بازیابی به این ایمیل ارسال شود؟"}
                </p>
              </button>
            ))}
          </div>
          <AuthButton
            variant="link"
            className="!w-auto mx-auto text-xs text-gray-400 mt-4"
            onClick={() => {
              setError(null);
              setStep(STEPS.FORGOT_NATIONAL_ID);
            }}
          >
            تغییر کد ملی
          </AuthButton>
        </>
      )}

      {step === STEPS.FORGOT_RESET && (
        <>
          <AuthTitle
            title="رمز عبور جدید"
            subtitle={
              forgotChannel === "mobile"
                ? `کد ۶ رقمی پیامک‌شده به ${forgotChannelMasked} را وارد کنید`
                : `کد ۶ رقمی ارسال‌شده به ${forgotChannelMasked} را وارد کنید`
            }
          />
          <form
            onSubmit={handleForgotReset}
            className="space-y-4"
          >
            <OtpInput
              value={otp}
              onChange={setOtp}
              disabled={loading}
              autoFocus
              onComplete={(code) => {
                if (newPassword.length >= 6 && newPassword === confirmNewPassword) {
                  handleForgotReset(undefined, code);
                }
              }}
            />
            <AuthInput
              id="newPassword"
              label="رمز عبور جدید"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              dir="ltr"
              autoComplete="new-password"
            />
            <AuthInput
              id="confirmNewPassword"
              label="تکرار رمز عبور جدید"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              dir="ltr"
              autoComplete="new-password"
            />
            <AuthButton type="submit" loading={loading}>
              ذخیره رمز جدید
            </AuthButton>
            {otpTimer > 0 && (
              <p className="text-center text-xs text-gray-400">
                ارسال مجدد تا {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, "0")}
              </p>
            )}
            {otpTimer <= 0 && forgotChannel && (
              <AuthButton
                variant="link"
                className="!w-auto mx-auto text-sm"
                loading={loading}
                onClick={() => handleForgotSendCode(forgotChannel, forgotChannelMasked)}
              >
                ارسال مجدد کد
              </AuthButton>
            )}
          </form>
        </>
      )}

      {step === STEPS.LOGIN_OTP && (
        <>
          <AuthTitle
            title="کد ورود پیامکی"
            subtitle={`کد ۶ رقمی ارسال‌شده به ${displayIdentifier} را وارد کنید`}
          />
          <form onSubmit={handleVerifyLoginOtp} className="space-y-5">
            <OtpInput
              value={otp}
              onChange={setOtp}
              disabled={loading}
              autoFocus
              onComplete={(code) => handleVerifyLoginOtp(undefined, code)}
            />

            <AuthButton type="submit" loading={loading} className="sr-only" tabIndex={-1}>
              تأیید و ورود
            </AuthButton>
            {loading && (
              <p className="text-center text-sm text-gray-500">در حال بررسی کد…</p>
            )}

            <div className="text-center">
              {otpTimer > 0 ? (
                <p className="text-xs text-gray-400">
                  ارسال مجدد تا {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, "0")} دیگر
                </p>
              ) : (
                <AuthButton
                  variant="link"
                  className="!w-auto mx-auto text-sm"
                  onClick={() => resendOtp("login")}
                  loading={loading}
                >
                  ارسال مجدد کد
                </AuthButton>
              )}
            </div>

            <AuthButton
              variant="link"
              className="!w-auto mx-auto text-xs text-gray-400"
              onClick={() => {
                setError(null);
                setStep(STEPS.LOGIN);
              }}
            >
              بازگشت
            </AuthButton>
          </form>
        </>
      )}

      {step === STEPS.REGISTER && (
        <>
          <AuthTitle
            title="ساخت حساب کاربری"
            subtitle={`ثبت‌نام با ${displayIdentifier || formatDisplayIdentifier(identifier, "mobile")}`}
          />
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <AuthInput
                id="firstName"
                label="نام"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <AuthInput
                id="lastName"
                label="نام خانوادگی"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div>
              <AuthInput
                id="registerPassword"
                label="رمز عبور"
                type={showPassword ? "text" : "password"}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                dir="ltr"
                hint="حداقل ۶ کاراکتر"
              />
              <div className="flex gap-2 mt-2">
                <AuthButton
                  variant="ghost"
                  className="!py-2 text-xs"
                  type="button"
                  onClick={() => setRegisterPassword(generateSuggestedPassword())}
                >
                  پیشنهاد رمز امن
                </AuthButton>
                <AuthButton
                  variant="link"
                  className="!py-2 text-xs"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "پنهان" : "نمایش"}
                </AuthButton>
              </div>
            </div>

            {selectedCity && (
              <div className="rounded-xl border border-teal-100 bg-teal-50/60 px-3 py-2 text-xs text-teal-800">
                شهر: <strong>{selectedCity.name}</strong>
              </div>
            )}

            <AuthButton type="submit" loading={loading}>
              ساختن حساب کاربری
            </AuthButton>

            <AuthButton
              variant="link"
              className="!w-auto mx-auto text-xs text-gray-400"
              onClick={() => {
                setError(null);
                setStep(STEPS.NOT_FOUND);
              }}
            >
              بازگشت
            </AuthButton>
          </form>
        </>
      )}

      {step === STEPS.VERIFY_REGISTER && (
        <>
          <AuthTitle
            title={pendingMobileVerification ? "تکمیل ثبت‌نام" : "تأیید شماره موبایل"}
            subtitle={
              pendingMobileVerification && otpTimer <= 0
                ? `برای ${displayIdentifier} ابتدا کد تأیید را دریافت کنید، سپس وارد کنید.`
                : `کد ۶ رقمی ارسال‌شده به ${displayIdentifier} را وارد کنید`
            }
          />
          <form onSubmit={handleVerifyRegister} className="space-y-5">
            {pendingMobileVerification && otpTimer <= 0 && (
              <AuthButton
                type="button"
                loading={loading}
                onClick={() => resendOtp("register")}
              >
                ارسال کد تأیید
              </AuthButton>
            )}

            <OtpInput
              value={otp}
              onChange={setOtp}
              disabled={loading}
              autoFocus={otpTimer > 0}
              onComplete={(code) => handleVerifyRegister(undefined, code)}
            />

            <AuthButton type="submit" loading={loading} className="sr-only" tabIndex={-1}>
              تأیید
            </AuthButton>
            {loading && (
              <p className="text-center text-sm text-gray-500">در حال بررسی کد…</p>
            )}

            <div className="text-center">
              {otpTimer > 0 ? (
                <p className="text-xs text-gray-400">
                  ارسال مجدد تا {Math.floor(otpTimer / 60)}:
                  {String(otpTimer % 60).padStart(2, "0")}
                </p>
              ) : !pendingMobileVerification ? (
                <AuthButton
                  variant="link"
                  className="!w-auto mx-auto text-sm"
                  onClick={() => resendOtp("register")}
                  loading={loading}
                >
                  ارسال مجدد کد
                </AuthButton>
              ) : null}
            </div>

            {pendingMobileVerification && (
              <AuthButton
                variant="link"
                className="!w-auto mx-auto text-xs text-gray-500"
                type="button"
                onClick={() => {
                  setError(null);
                  setPassword("");
                  setStep(STEPS.LOGIN);
                }}
              >
                ورود با رمز عبور
              </AuthButton>
            )}

            <AuthButton
              variant="link"
              className="!w-auto mx-auto text-xs text-gray-400"
              type="button"
              onClick={() => {
                setError(null);
                setStep(STEPS.IDENTIFIER);
              }}
            >
              تغییر شماره
            </AuthButton>
          </form>
        </>
      )}
    </AuthShell>
  );
}

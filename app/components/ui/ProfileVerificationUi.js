'use client';

import { useState } from 'react';
import {
  ArrowUpTrayIcon,
  CheckBadgeIcon,
  DevicePhoneMobileIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../config/api';
import { ghostBtnClass, primaryBtnClass, StatusBadge } from './dashboard/DashboardUi';
import { EXPERT_STATUS_LABELS, IDENTITY_STATUS_LABELS } from '../../utils/profileAddressUtils';

const uploadTileClass =
  'flex h-full min-h-[7.5rem] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50/80 px-3 py-4 text-center transition hover:border-teal-300 hover:bg-teal-50/40';

const uploadRowClass =
  'flex w-full items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50/80 px-3 py-3 text-right transition hover:border-teal-300 hover:bg-teal-50/40';

export function UploadPlaceholderButton({
  label,
  hint,
  onClick,
  variant = 'row',
  className = '',
  icon: Icon = ArrowUpTrayIcon,
}) {
  if (variant === 'tile') {
    return (
      <button type="button" onClick={onClick} className={`${uploadTileClass} ${className}`}>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-teal-700 ring-1 ring-gray-200">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-gray-800">{label}</span>
          {hint ? <span className="mt-1 block text-[11px] leading-snug text-gray-500">{hint}</span> : null}
        </span>
      </button>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${uploadRowClass} ${className}`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-teal-700 ring-1 ring-gray-200">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1 text-right">
        <span className="block text-sm font-medium text-gray-800">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs text-gray-500">{hint}</span> : null}
      </span>
    </button>
  );
}

export function AvatarChangeButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} className={`${ghostBtnClass} gap-2 text-sm`}>
      <PhotoIcon className="h-4 w-4" aria-hidden />
      عکس
    </button>
  );
}

export function MobileVerificationBlock({ mobile, isVerified, onVerified, className = '' }) {
  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState(null);

  if (isVerified) {
    return (
      <div
        className={`flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-800 ${className}`}
      >
        <CheckBadgeIcon className="h-6 w-6 shrink-0" aria-hidden />
        <span className="font-medium">موبایل تأیید شده</span>
      </div>
    );
  }

  const sendCode = async () => {
    if (!mobile || !/^09[0-9]{9}$/.test(mobile)) {
      setMessage({ type: 'error', text: 'ابتدا موبایل را ذخیره کنید' });
      return;
    }
    setSending(true);
    setMessage(null);
    try {
      const res = await fetch(API_ENDPOINTS.auth.resendMobileCode, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      setMessage({
        type: data.success ? 'success' : 'error',
        text: data.message || (data.success ? 'کد ارسال شد' : 'خطا در ارسال'),
      });
    } catch {
      setMessage({ type: 'error', text: 'خطا در ارتباط با سرور' });
    } finally {
      setSending(false);
    }
  };

  const verifyCode = async () => {
    if (!code.trim()) {
      setMessage({ type: 'error', text: 'کد را وارد کنید' });
      return;
    }
    setVerifying(true);
    setMessage(null);
    try {
      const res = await fetch(API_ENDPOINTS.auth.verifyMobile, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ mobile, code: code.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'تأیید شد' });
        onVerified?.();
      } else {
        setMessage({ type: 'error', text: data.message || 'کد نامعتبر' });
      }
    } catch {
      setMessage({ type: 'error', text: 'خطا در ارتباط' });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div
      className={`rounded-xl border border-amber-100 bg-gradient-to-bl from-amber-50/90 to-white p-4 ${className}`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
          <DevicePhoneMobileIcon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-amber-950">تأیید پیامکی موبایل</p>
          <p className="mt-0.5 text-xs text-amber-900/75">کد ۶ رقمی به {mobile || 'موبایل شما'} ارسال می‌شود</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          placeholder="کد ۶ رقمی"
          className="w-full min-w-0 flex-1 rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        />
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={sendCode}
            disabled={sending}
            className={`${ghostBtnClass} flex-1 whitespace-nowrap px-4 py-2.5 text-sm sm:flex-none`}
          >
            {sending ? '...' : 'ارسال کد'}
          </button>
          <button
            type="button"
            onClick={verifyCode}
            disabled={verifying}
            className={`${primaryBtnClass} flex-1 whitespace-nowrap px-4 py-2.5 text-sm sm:flex-none`}
          >
            {verifying ? '...' : 'تأیید'}
          </button>
        </div>
      </div>

      {message ? (
        <p
          className={`mt-3 text-xs ${
            message.type === 'success' ? 'text-emerald-700' : 'text-red-600'
          }`}
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}

/** چیدمان احراز هویت — تأیید پیامکی تمام‌عرض، مدارک در ردیف بعد */
export function ExpertIdentityVerificationGrid({
  mobile,
  isMobileVerified,
  onMobileVerified,
  onUploadNationalId,
  onUploadSelfie,
}) {
  return (
    <div className="space-y-3">
      <MobileVerificationBlock
        mobile={mobile}
        isVerified={isMobileVerified}
        onVerified={onMobileVerified}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <UploadPlaceholderButton
          variant="tile"
          label="عکس کارت ملی"
          hint="روی کارت · به‌زودی"
          onClick={onUploadNationalId}
        />
        <UploadPlaceholderButton
          variant="tile"
          label="سلفی با کارت"
          hint="آپلود · به‌زودی"
          onClick={onUploadSelfie}
        />
      </div>
    </div>
  );
}

/** مدارک حرفه‌ای — سه ستون در دسکتاپ */
export function ExpertProfessionalDocsGrid({
  onUploadLicense,
  onUploadVocational,
  onUploadCertificate,
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <UploadPlaceholderButton
        variant="tile"
        label="پروانه کسب"
        hint="اختیاری"
        onClick={onUploadLicense}
      />
      <UploadPlaceholderButton
        variant="tile"
        label="کارت فنی"
        hint="اختیاری"
        onClick={onUploadVocational}
      />
      <UploadPlaceholderButton
        variant="tile"
        label="مدرک تخصصی"
        hint="اختیاری"
        onClick={onUploadCertificate}
        className="sm:col-span-2 lg:col-span-1"
      />
    </div>
  );
}

export function VerificationBadgeList({ items }) {
  const visible = (items || []).filter(Boolean);
  if (!visible.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((item) => (
        <span
          key={item.key}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
            item.ok
              ? 'bg-emerald-50 text-emerald-800 ring-emerald-200'
              : 'bg-gray-50 text-gray-500 ring-gray-200'
          }`}
        >
          {item.ok ? '✓' : '○'} {item.label}
        </span>
      ))}
    </div>
  );
}

export function ExpertStatusBadge({ status }) {
  const label = EXPERT_STATUS_LABELS[status] || status;
  const styles = {
    pending: 'bg-amber-50 text-amber-800 ring-amber-200',
    approved: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    rejected: 'bg-red-50 text-red-700 ring-red-200',
    suspended: 'bg-gray-100 text-gray-700 ring-gray-200',
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        styles[status] || styles.pending
      }`}
    >
      {label}
    </span>
  );
}

export function IdentityStatusBadge({ status }) {
  return (
    <StatusBadge
      ok={status === 'approved'}
      okText={IDENTITY_STATUS_LABELS.approved}
      failText={IDENTITY_STATUS_LABELS[status] || IDENTITY_STATUS_LABELS.none}
    />
  );
}

export function buildCustomerBadges(profile) {
  return [
    profile?.isMobileVerified
      ? { key: 'mobile', ok: true, label: 'موبایل تأیید شده' }
      : { key: 'mobile', ok: false, label: 'موبایل تأیید نشده' },
    profile?.isEmailVerified && profile?.email
      ? { key: 'email', ok: true, label: 'ایمیل تأیید شده' }
      : null,
    profile?.identityVerificationStatus === 'approved'
      ? { key: 'identity', ok: true, label: 'احراز هویت تأیید شده' }
      : null,
  ].filter(Boolean);
}

export function buildExpertBadges(expert, user) {
  const docs = expert?.verificationDocs || {};
  const proDocs = expert?.professionalDocs || {};
  return [
    user?.isMobileVerified
      ? { key: 'mobile', ok: true, label: 'موبایل تأیید شده' }
      : { key: 'mobile', ok: false, label: 'موبایل تأیید نشده' },
    docs.nationalIdFront || docs.nationalIdApproved
      ? { key: 'nationalId', ok: true, label: 'کارت ملی تأیید شده' }
      : docs.nationalIdFront
        ? { key: 'nationalId', ok: false, label: 'کارت ملی در انتظار' }
        : null,
    expert?.status === 'approved'
      ? { key: 'expert', ok: true, label: 'متخصص تأیید شده' }
      : { key: 'expert', ok: false, label: 'متخصص تأیید نشده' },
    proDocs.businessLicense
      ? { key: 'license', ok: true, label: 'دارای پروانه کسب' }
      : null,
  ].filter(Boolean);
}

export function uploadPlaceholderMessage() {
  if (typeof window !== 'undefined') {
    window.alert('آپلود فایل به‌زودی فعال می‌شود.');
  }
}

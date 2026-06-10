'use client';

import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { inputClass } from './dashboard/DashboardUi';
import 'react-multi-date-picker/styles/colors/teal.css';

export default function JalaliDateField({
  value,
  onChange,
  placeholder = 'انتخاب تاریخ',
  minDate = new Date(),
  className = '',
  disabled = false,
}) {
  return (
    <DatePicker
      calendar={persian}
      locale={persian_fa}
      value={value}
      onChange={onChange}
      minDate={minDate}
      format="YYYY/MM/DD"
      calendarPosition="bottom-right"
      disabled={disabled}
      inputClass={`${inputClass} ${className}`.trim()}
      placeholder={placeholder}
      containerClassName="w-full"
    />
  );
}

export function jalaliDateToIso(dateValue) {
  if (!dateValue) return null;
  if (dateValue.toDate) return dateValue.toDate().toISOString();
  if (dateValue instanceof Date) return dateValue.toISOString();
  return null;
}

import { focusHomePath } from '../utils/homePathFocus';

export const SERVICES_CUSTOMER_PATHS = [
  {
    key: 'search',
    step: 1,
    label: 'جستجو',
    hint: 'نام متخصص، خدمت یا دسته را بنویسید',
    targets: ['home-path-search'],
    focusSearch: true,
  },
  {
    key: 'categories',
    step: 2,
    label: 'دسته‌ها',
    hint: 'خدمت مورد نظر را از بین دسته‌های اصلی انتخاب کنید',
    targets: ['home-path-categories'],
  },
  {
    key: 'map',
    step: 3,
    label: 'نقشه متخصص',
    hint: 'دسته را بزنید؛ متخصص‌ها و کارهای باز روی نقشه',
    targets: ['home-path-map'],
  },
  {
    key: 'request',
    step: 4,
    label: 'ثبت کار',
    hint: 'کار را ثبت کنید؛ متخصص‌ها پیشنهاد می‌دهند',
    targets: ['home-path-request'],
  },
];

export function activateServicesCustomerPath(pathKey) {
  const path = SERVICES_CUSTOMER_PATHS.find((item) => item.key === pathKey);
  if (!path) return;
  focusHomePath(path.targets, { focusSearch: path.focusSearch });
}

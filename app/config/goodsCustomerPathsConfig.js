import { focusHomePath } from '../utils/homePathFocus';

export const GOODS_CUSTOMER_PATHS = [
  {
    key: 'search',
    step: 1,
    label: 'جستجو',
    hint: 'نام کالا، فروشگاه یا دسته را بنویسید',
    targets: ['home-path-search'],
    focusSearch: true,
  },
  {
    key: 'categories',
    step: 2,
    label: 'دسته‌ها',
    hint: 'از بین دسته‌های پرتقاضا شروع کنید یا همه را ببینید',
    targets: ['home-path-categories'],
  },
  {
    key: 'map',
    step: 3,
    label: 'نقشه فروشگاه',
    hint: 'دسته را بزنید؛ فروشگاه‌های اطراف روی نقشه',
    targets: ['home-path-map'],
  },
  {
    key: 'need',
    step: 4,
    label: 'ثبت نیاز',
    hint: 'کالا را ثبت کنید؛ فروشگاه‌ها پیشنهاد می‌دهند',
    targets: ['home-path-need'],
  },
];

export function activateGoodsCustomerPath(pathKey) {
  const path = GOODS_CUSTOMER_PATHS.find((item) => item.key === pathKey);
  if (!path) return;
  focusHomePath(path.targets, { focusSearch: path.focusSearch });
}

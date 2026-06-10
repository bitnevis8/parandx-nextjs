import { redirect } from 'next/navigation';

/** لیست عمومی متخصص‌ها نداریم — پروفایل‌ها در `/experts/[id]` */
export default function ExpertsPage() {
  redirect('/');
}

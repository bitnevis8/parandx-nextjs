import Link from "next/link";

export default function SettingsPage() {
  const settingsSections = [
    {
      title: "مدیریت واحدها",
      description: "افزودن، ویرایش و حذف واحدهای سازمانی",
      href: "/dashboard/settings/unit-locations",
      icon: "📍",
    },
    {
      title: "مدل‌های ۳D نقشه",
      description: "آپلود و تنظیم مدل سه‌بعدی دسته‌ها روی نقشه",
      href: "/dashboard/settings/category-map-models",
      icon: "🗺️",
    },
    {
      title: "باکس استخدام — جملات و انیمیشن",
      description: "جملات، سرعت و زاویه هدر شناور و نوشته تایپی زیر «اعلان کار | استخدام جدید»",
      href: "/dashboard/settings/home-floating-quotes",
      icon: "💬",
    },
    {
      title: "لایه‌های هیرو (خدمات / کالا)",
      description: "تصویر متخصص و فروشگاه روی پس‌زمینه شهر در صفحه اصلی",
      href: "/dashboard/settings/hero-type-overlays",
      icon: "🖼️",
    },
    {
      title: "ستاره‌های آسمان شب",
      description: "تنظیم ستاره‌های بالای سایت — جدا برای موبایل و دسکتاپ",
      href: "/dashboard/settings/night-sky-stars",
      icon: "✨",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">تنظیمات</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="block bg-white p-6 rounded-lg shadow-sm border hover:border-primary transition-colors"
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl ml-2">{section.icon}</span>
              <h3 className="text-lg font-semibold">{section.title}</h3>
            </div>
            <p className="text-gray-600">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
} 
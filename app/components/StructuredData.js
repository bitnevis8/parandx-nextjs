export default function StructuredData({ articles = [] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Starter App",
    "url": "https://example.com",
    "logo": "/logo.png",
    "description": "اسکلت پروژه عمومی برای شروع سریع",
    "foundingDate": "2024"
  };

  const articleStructuredData = [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      {articleStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data)
          }}
        />
      ))}
    </>
  );
} 
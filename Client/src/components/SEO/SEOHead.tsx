import React from "react";
import { Helmet } from "react-helmet-async";
import { SEOData, defaultSEO } from "../../config/seo";

interface SEOHeadProps {
  seoData?: Partial<SEOData>;
  dynamicData?: Record<string, string>;
}

const SEOHead: React.FC<SEOHeadProps> = ({ seoData = {}, dynamicData = {} }) => {
  const mergedSEO: SEOData = { ...defaultSEO, ...seoData } as SEOData;

  const replacePlaceholders = (text: string): string => {
    let result = text || "";
    Object.entries(dynamicData).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
    });
    return result;
  };

  const title = replacePlaceholders(mergedSEO.title);
  const description = replacePlaceholders(mergedSEO.description);
  const keywords = replacePlaceholders(mergedSEO.keywords);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {mergedSEO.author && <meta name="author" content={mergedSEO.author} />}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />

      {mergedSEO.canonical && <link rel="canonical" href={mergedSEO.canonical} />}

      <meta property="og:type" content={mergedSEO.type || "website"} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {mergedSEO.image && <meta property="og:image" content={mergedSEO.image} />} 
      {mergedSEO.url && <meta property="og:url" content={mergedSEO.url} />}
      {mergedSEO.siteName && <meta property="og:site_name" content={mergedSEO.siteName} />}
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {mergedSEO.image && <meta name="twitter:image" content={mergedSEO.image} />}
      <meta name="twitter:site" content="@prepbuddy" />
      <meta name="twitter:creator" content="@prepbuddy" />

      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="PrepBuddy" />

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: mergedSEO.siteName || "PrepBuddy",
          description: description,
          url: mergedSEO.url || "https://prep-buddy-test.vercel.app",
          author: { "@type": "Organization", name: "PrepBuddy Team" },
          sameAs: ["https://github.com/SurajSG23/PrepBuddy"],
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;



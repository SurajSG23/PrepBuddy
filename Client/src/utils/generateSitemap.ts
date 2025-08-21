export const generateSitemap = () => {
  const baseUrl = "https://prep-buddy-test.vercel.app";
  const routes = [
    "/",
    "/homepage",
    "/testpage",
    "/profile",
    "/previous-tests",
    "/score-board",
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === "/" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

  return sitemap;
};



import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { pageSEOData, defaultSEO, SEOData } from "../config/seo";

export const useSEO = (customSEO?: Partial<SEOData>) => {
  const location = useLocation();

  const seoData = useMemo(() => {
    const routeSEO = pageSEOData[location.pathname] || defaultSEO;
    return { ...routeSEO, ...customSEO } as SEOData;
  }, [location.pathname, customSEO]);

  const dynamicData = useMemo(() => {
    return {} as Record<string, string>;
  }, []);

  return { seoData, dynamicData };
};



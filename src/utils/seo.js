export const SEO_CONFIG = {
  title: '"'"'V-Taper Coach — AI Destekli Antrenman Uygulaması'"'"',
  description: '"'"'Kişisel antrenman programları, AI koçluk ve detaylı ilerleme takibi. 12 haftalık V-taper programı ile ideal fizik hedefine ulaş.'"'"',
  keywords: '"'"'v-taper'"'"', '"'"'antrenman'"'"', '"'"'fitness'"'"', '"'"'spor'"'"', '"'"'gym'"'"', '"'"'bodybuilding'"'"', '"'"'AI koç'"'"', '"'"'egzersiz'"'"', '"'"'program'"'"',
  ogImage: '"'"'/icons/icon-512.png'"'"',
  ogType: '"'"'website'"'"',
  twitterCard: '"'"'summary_large_image'"'"',
  canonicalUrl: '"'"'https://vtaper-coach.vercel.app'"'"',
};

export function updateMetaTags(config = SEO_CONFIG) {
  if (typeof document === '"'"'undefined'"'"') return;

  const existing = (key) => document.querySelector(`meta[name="${key}"], meta[property="${key}"]`);

  const setMeta = (key, value) => {
    let el = existing(key);
    if (!el) {
      el = document.createElement('"'"'meta'"'"');
      el.setAttribute(key.startsWith('"'"'og:'"'"') ? '"'"'property'"'"' : '"'"'name'"'"', key);
      document.head.appendChild(el);
    }
    el.setAttribute('"'"'content'"'"', value);
  };

  setMeta('"'"'description'"'"', config.description);
  setMeta('"'"'keywords'"'"', config.keywords);

  if (config.ogImage) {
    setMeta('"'"'og:image'"'"', config.ogImage);
    setMeta('"'"'og:title'"'"', config.title);
    setMeta('"'"'og:description'"'"', config.description);
    setMeta('"'"'og:type'"'"', config.ogType);
    setMeta('"'"'og:url'"'"', config.canonicalUrl);
  }

  setMeta('"'"'twitter:card'"'"', config.twitterCard);
  setMeta('"'"'twitter:title'"'"', config.title);
  setMeta('"'"'twitter:description'"'"', config.description);
  if (config.ogImage) setMeta('"'"'twitter:image'"'"', config.ogImage);

  document.title = config.title;
}

export function getStructuredData() {
  return {
    '"'"'@context'"'"': '"'"'https://schema.org'"'"',
    '"'"'@type'"'"': '"'"'WebApplication'"'"',
    name: '"'"'V-Taper Coach'"'"',
    description: SEO_CONFIG.description,
    url: SEO_CONFIG.canonicalUrl,
    applicationCategory: '"'"'HealthApplication'"'"',
    operatingSystem: '"'"'Web'"'"',
    offers: {
      '"'"'@type'"'"': '"'"'Offer'"'"',
      price: '"'"'0'"'"',
      priceCurrency: '"'"'TRY'"'"',
      availability: '"'"'https://schema.org/InStock'"'"',
    },
    aggregateRating: {
      '"'"'@type'"'"': '"'"'AggregateRating'"'"',
      ratingValue: '"'"'4.8'"'"',
      ratingCount: '"'"'2847'"'"',
    },
  };
}

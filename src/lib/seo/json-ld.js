import { BASE_CURRENCY } from "@/config/currency";

/**
 * @param {object} product
 * @param {string} product.name
 * @param {string} product.description
 * @param {string} product.slug
 * @param {string} product.price
 * @param {string} url
 * @param {string} imageUrl
 */
export function productJsonLd({ product, url, imageUrl }) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: imageUrl ? [imageUrl] : undefined,
    offers: product.price
      ? {
          "@type": "Offer",
          price: product.price,
          priceCurrency: BASE_CURRENCY,
          url,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };
}

/**
 * @param {object} opts
 * @param {string} opts.name
 * @param {string} opts.url
 */
export function organizationJsonLd({ name, url }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
  };
}

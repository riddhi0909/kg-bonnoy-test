/**
 * Page template keys from WPGraphQL ContentTemplate.templateName.
 */
export const PAGE_TEMPLATES = Object.freeze({
  DEFAULT: "DefaultTemplate",
  KG_PAGE: "KGPageTemplate",
});

/**
 * @param {any} page
 */
export function getPageTemplateName(page) {
  return page?.template?.templateName || PAGE_TEMPLATES.DEFAULT;
}

/**
 * Add new per-template page rendering behavior here.
 * @param {string} templateName
 */
export function isAcfFirstTemplate(templateName) {
  return templateName === PAGE_TEMPLATES.KG_PAGE;
}

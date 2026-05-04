/**
 * @param {Record<string, string>} form
 * @param {boolean} shipToDifferentAddress
 */
export function validateCheckoutForm(form, shipToDifferentAddress) {
  /** @type {Record<string, string>} */
  const errors = {};
  const requiredBilling = [
    "billingFirstName",
    "billingLastName",
    "billingAddress1",
    "billingCity",
    "billingPostcode",
    "billingCountry",
    "billingEmail",
    "billingPhone",
  ];

  for (const field of requiredBilling) {
    if (!String(form[field] || "").trim()) {
      errors[field] = "Obligatoire";
    }
  }

  const email = String(form.billingEmail || "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.billingEmail = "E-mail invalide";
  }

  if (shipToDifferentAddress) {
    const requiredShipping = [
      "shippingFirstName",
      "shippingLastName",
      "shippingAddress1",
      "shippingCity",
      "shippingPostcode",
      "shippingCountry",
    ];
    for (const field of requiredShipping) {
      if (!String(form[field] || "").trim()) {
        errors[field] = "Obligatoire";
      }
    }
  }

  return errors;
}

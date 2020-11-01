/**
 * Formats the specified number as a price.
 *
 * @param price         The price to format.
 * @returns {string}    The price formatted.
 */
export function formatPrice(price) {
    return price.toFixed(2).replace(".", ",") + "&thinsp;$";
}

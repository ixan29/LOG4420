/**
 * @typedef Product
 * @property {string} name
 * @property {string} image
 * @property {number} price
 * @property {number} id
 */

/**
 * 
 * @param {string} sortingCriteria 
 * @param {string} [category]
 * @returns {Promise<Product[]>}
 */
export function getAllProducts(sortingCriteria, category) {
    const categoryPart = category && category !== "all" ? "&category=" + category : "";
    return fetch(`/api/products?criteria=${sortingCriteria}${categoryPart}`).then(
        res => res.json()
    );
}

/**
 * 
 * @param {number} productId
 * @returns {Promise<Product>}
 */
export function getProduct(productId) {
    return fetch("/api/products/" + productId).then(
        res => res.json()
    );
}
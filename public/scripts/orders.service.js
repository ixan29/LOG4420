/**
 * @export
 * @typedef {Object} Order
 * @property {number} [id]
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} phone
 * @property {any} products
 */

/**
 * @returns {Promise<any>}
 */
export function getOrders() {
    return fetch("/api/orders").then(res => {
        return res.json();
    });
}

/**
 * Creates a new order.
 *
 * @param {Order} order   The order to create.
 */
export function createOrder(order) {
    return getOrders().then(orders => {
        order.id = orders.length + 1;
        return fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(order)
        });
    }).then(res => {
        return res.json();
    });
}


import { getAllProducts } from "./products.service.js";

/**
 * @typedef Item
 * @property {number} productId
 * @property {number} quantity
 */

/**
 * Adds an item in the shopping cart.
 *
 * @param {number} productId   The ID associated with the product to add.
 * @param {number} [quantity]  The quantity of the product.
 */
export const addItem = (productId, quantity) => {
    return _getItemsFromAPI().then(items => {
        const itemFound = items.find(item => item.productId === productId);
        if (!itemFound) {
            return fetch("/api/shopping-cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId: productId, quantity: quantity })
            });
        } else {
            return updateItemQuantity(productId, itemFound.quantity + quantity);
        }
    });
};

/**
 * Gets the items in the shopping cart.
 */
export const getItems = () => {
    return Promise.all([
        getAllProducts("alpha-asc"),
        _getItemsFromAPI()
    ]).then(([products, items]) => {
        function getItemAssociatedWithProduct(productId) {
            return items.find(item => item.productId === productId);
        }
        return products.filter(product => getItemAssociatedWithProduct(product.id) !== undefined).map(product => {
            const item = getItemAssociatedWithProduct(product.id);
            return {
            product: product,
            quantity: item.quantity,
            total: product.price * item.quantity
            };
        });
    });
};

/**
 * Gets the item associated with the specified product ID.
 *
 * @param {number} productId             The product ID associated with the item to retrieve.
 */
export const getItem = productId => {
    return getItems().then(items => {
        return items.find(item => item.product.id === productId)
    });
};

/**
 * Gets the items count in the shopping cart.
 *
 */
export const getItemsCount = () => {
    return _getItemsFromAPI().then(items => 
        items.reduce((sum, item) => sum + +item.quantity, 0)
    );
};

/**
 * Gets the quantity associated with an item.
 *
 * @param {number} productId             The product ID associated with the item quantity to retrieve.
*/
export const getItemQuantity = productId => {
return _getItemsFromAPI().then(items => {
    const itemFound = items.find(item => item.productId === productId);
    return (itemFound) ? itemFound.quantity : 0;
});
};

/**
 * Gets the total amount of the products in the shopping cart.
 *
*/
export const getTotalAmount = () => {
    return getItems().then(items => {
        return items.reduce((total, item) => {
            if(item) {
                return total + item.total;
            }
            return total;
        }, 0);
    });
};

/**
 * @type {Promise<Item[]>| undefined}
 */
let cache = undefined;

/**
 * Updates the quantity associated with a specified item.
 *
 * @param productId   The product ID associated with the item to update.
 * @param quantity    The item quantity.
 * @return            A promise.
 */
export const updateItemQuantity = (productId, quantity) => {
    cache = undefined;
    return fetch(`/api/shopping-cart/${productId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: quantity })
    });
};

/**
 * Removes the specified item in the shopping cart.
 *
 * @param productId   The product ID associated with the item to remove.
 * @return            A promise.
 */
export const removeItem = productId => {
    cache = undefined;
    return fetch(`/api/shopping-cart/${productId}`, {
        method: "DELETE"
    });
};

/**
 * Removes all the items in the shopping cart.
 *
 * @return  A promise.
 */
export const removeAllItems = () => {
    cache = undefined;
    return fetch("/api/shopping-cart/", {
        method: "DELETE"
    });
};


/**
 * Gets the items in the shopping cart from the API.
 * @private
 */
function _getItemsFromAPI() {
    /*
    if (!cache) {
        cache = fetch("/api/shopping-cart").then(res => res.json());
    }
    return cache;
    */
   return fetch("/api/shopping-cart").then(res => res.json());
}
/**
 * 
 * @param {Product[]} products 
 * @param {string} sortingCriteria 
 */
export function applySortingCriteria(products, sortingCriteria) {
    if (products) {
        switch (sortingCriteria) {
        case "price-asc":
            products = products.sort((a, b) => a["price"] - b["price"]);
            break;
        case "price-dsc":
            products = products.sort((a, b) => b["price"] - a["price"]);
            break;
        case "alpha-asc":
            products = products.sort((a, b) => {
                const nameA = a["name"].toLowerCase();
                const nameB = b["name"].toLowerCase();
                if (nameA > nameB) {
                    return 1;
                } else if (nameA < nameB) {
                    return -1;
                }
                return 0;
            });
            break;
        case "alpha-dsc":
            products = products.sort((a, b) => {
                const nameA = a["name"].toLowerCase();
                const nameB = b["name"].toLowerCase();
                if (nameA > nameB) {
                    return -1;
                } else if (nameA < nameB) {
                    return 1;
                }
                return 0;
            });
            break;
        default:
        }
    }
    return products;
}

/**
 * 
 * @param {Product[]} products 
 * @param {string} category 
 */
export function applyCategory(products, category) {
    if (products) {
        products = products.filter(product => category === "all" || product.category === category);
    }
    return products;
}

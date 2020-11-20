import "../js/jquery-3.2.1.min.js"
/** @type {JQueryStatic}  */
// @ts-ignore
const $ = window.$;
import { getAllProducts } from "./products.service.js";
import { formatPrice } from "./utils.js";


/**
 * Updates the product view.
 *
 * @param {import("./products.service").Product[]} products    The products list to render.
 * @param {string} category
 * @param {string} sortingCriteria
 * @private
 */
function _updateView(products, category, sortingCriteria) {
    const productsElement = $(".products");
    productsElement.html("");
    products.forEach(product => productsElement.append(_createProductElement(product)));

    $("#products-count").text(products.length + " produit" +
        (products.length > 1 ? "s" : ""));

    const categoriesElement = $("#product-categories");
    categoriesElement.children().removeClass("selected");
    categoriesElement.find(`[data-category="${category}"]`).addClass("selected");

    const criteriaElement = $("#product-criteria");
    criteriaElement.children().removeClass("selected");
    criteriaElement.find(`[data-criteria="${sortingCriteria}"]`).addClass("selected");
}

/**
 * Creates a product element.
 *
 * @param {import("./products.service").Product} product The product to use.
 * @private
 */
function _createProductElement(product) {
    return $(`<div class="product" data-product-id="${product.id}">
        <a href="./produits/${product.id}" title="En savoir plus...">
        <h2>${product.name}</h2>
        <img alt="product" src="./assets/img/${product.image}">
        <p class="price"><small>Prix</small> ${formatPrice(product.price)}</p>
        </a>
        </div>`);
    }


export function initProductController() {
    // Initialize the products view.
    const filters = {
        category: "all",
        sortingCriteria: "price-asc"
    };
    $("#product-categories").children().on("click", e => {
        filters.category = $(e.target).attr("data-category");
        getAllProducts(filters.sortingCriteria, filters.category).then(products => 
            _updateView(products, filters.category, filters.sortingCriteria)
        );
    });
    $("#product-criteria").children().on("click", e => {
        filters.sortingCriteria = $(e.target).attr("data-criteria");
        getAllProducts(filters.sortingCriteria, filters.category).then(products => 
            _updateView(products, filters.category, filters.sortingCriteria)
        );
    });
}

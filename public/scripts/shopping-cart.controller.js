import "../js/jquery-3.2.1.min.js"
/** @type {JQueryStatic}  */
// @ts-ignore
const $ = window.$;
import { addItem, getItem, getItemQuantity, getItemsCount, getTotalAmount, removeAllItems, removeItem, updateItemQuantity } from "./shopping-cart.service.js";
import { formatPrice } from "./utils.js";

export function _updateCount() {
    getItemsCount().then(itemsCount => {
        console.log({itemsCount});
        const countElement = $(".shopping-cart").find(".count");
        if (itemsCount > 0) {
            countElement.addClass("visible").text(itemsCount);
        } else {
            countElement.removeClass("visible");
        }
    });
}

/**
 * Updates the total amount to display.
 *
 * @private
 */
function _updateTotalAmount() {
    getTotalAmount().then(total => {
        $("#total-amount").html(formatPrice(total));
    });
}

/**
 * Renders the view when the shopping cart is empty.
 *
 * @private
 */
function _renderEmptyView() {
    $("#shopping-cart-container").html("<p>Aucun produit dans le panier.</p>");
}

export function initShoppingCartController() {

// Initializes the "add to cart" form.
    $("#add-to-cart-form").on("submit", e => {
        e.preventDefault();

        const url = window.location.href;
        const productId = +(url.substr(url.lastIndexOf('/')+1));

        //const productId = +$(e.target).attr("data-product-id");
        addItem(
            productId,
            +$(e.target).find("input").val()
        ).then(() => {
            const dialog = $("#dialog");
            dialog.fadeIn();
            setTimeout(() => dialog.fadeOut(), 5000);

            _updateCount();
            return getItemQuantity(productId)
        }).then(quantity => 
            $("#shopping-cart-quantity").text(quantity)
        );
    });

    // Initializes the shopping cart table.
    $(".shopping-cart-table > tbody >  tr").each(function() {

        const rowElement = $(this);
        const productId = +rowElement.attr("data-product-id");

        // Updates the quantity for a specific item and update the view.
        function updateQuantity(quantity) {
        rowElement.find(".remove-quantity-button").prop("disabled", quantity <= 1);
        updateItemQuantity(productId, quantity).then(() => {
            _updateCount();
            _updateTotalAmount();
        });
        rowElement.find(".quantity").text(quantity);
        getItem(productId).then(item => {
            rowElement.find(".price").html(formatPrice(item.product["price"] * quantity));
        });
        }

        rowElement.find(".remove-item-button").on("click", () => {
        if (confirm("Voulez-vous supprimer le produit du panier?")) {
            removeItem(productId);
            rowElement.remove();
            getItemsCount().then(itemsCount => {
                if (itemsCount === 0) {
                    _renderEmptyView();
                } else {
                    _updateTotalAmount();
                }
            });
            _updateCount();
        }
        });
        rowElement.find(".remove-quantity-button").click(() => {
            getItemQuantity(productId).then(quantity => {
                updateQuantity(quantity - 1);
            });
        });
        rowElement.find(".add-quantity-button").click(() => {
            getItemQuantity(productId).then(quantity => {
                updateQuantity(quantity + 1);
            });
        });
    });
    // Initializes the "remove all items" button.
    $("#remove-all-items-button").on("click", () => {
        if (confirm("Voulez-vous supprimer tous les produits du panier?")) {
            removeAllItems().then(() => {
                _renderEmptyView();
                _updateCount();   
            });
        }
    });

    _updateCount();
}
  

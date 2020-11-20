import "../js/jquery-3.2.1.min.js"
/**@type {JQueryStatic} */
// @ts-ignore
const $ = window.$;
import { isFormValid, validator, getValidateForm } from "../js/validator.js";
import { getItems, removeAllItems } from "./shopping-cart.service.js";
import { createOrder } from "./orders.service.js";

const orderForm = $("#order-form");

/**
 * Creates an order when the form is submitted.
 *
 * @param event         The event associated with the form.
 * @returns {boolean}   TRUE if the data submitted are valid. FALSE otherwise.
 * @private
 */
function _createOrder(event) {

  event.preventDefault();
  if (!isFormValid(orderForm)) {
    return false;
  }
  getItems().then(items => {
    /**
     * @type {import("./orders.service").Order}
     */
    const order = {
      firstName: `${$("#first-name").val()}`,
      lastName: `${$("#last-name").val()}`,
      email: `${$("#email").val()}`,
      phone: `${$("#phone").val()}`,
      products: items.map(item => {
        return {
          id: item.product.id,
          quantity: item.quantity
        }
      })
    };
    return order;
    
  }).then(order => {
      return createOrder(order);
  }).then(
      removeAllItems
  ).then(() =>
      orderForm.off("submit").trigger("submit")
  );

  return true;
}

export function initOrderController() {

    // Creates a custom validator for the credit card expiry.
    validator.addMethod('ccexp', value => {
        return value && /^(0[1-9]|1[0-2])\/(0[0-9]|[1-9][0-9])$/g.test(value);
    }, "La date d'expiration de votre carte de crédit est invalide.");

    getValidateForm(orderForm)({
      rules: {
        "phone": {
          required: true,
          phoneUS: true
        },
        "credit-card": {
          required: true,
          creditcard: true
        },
        "credit-card-expiry": {
          ccexp: true
        }
      }
    });
    orderForm.on("submit", _createOrder);
}

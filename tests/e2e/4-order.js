"use strict";

const config = require("./data/config.json").order;
const shoppingCartConfig = require("./data/config.json").shoppingCart;
const utils = require("./utils");

/** @typedef {import("nightwatch").NightwatchBrowser & {
 *      waitForText: (elementSelector: string, checker: (text: string) => boolean, timeoutInMilliseconds: number, defaultMessage: string) => Client
 *      waitForUpdate: () => Client
 * }} Client
*/

let expectedProduct = {};
const errorMessages = {
    required: "Ce champ est obligatoire.",
    minLength: "Veuillez fournir au moins 2 caractères.",
    email: "Veuillez fournir une adresse électronique valide.",
    phone: "Veuillez fournir un numéro de téléphone valide.",
    creditCard: "Veuillez fournir un numéro de carte de crédit valide.",
    creditCardExpiry: "La date d'expiration de votre carte de crédit est invalide."
};
const inputs = [
    {
        id: config.elements.firstName,
        entries: [
            {value: "A", isValid: false, errorMessage: errorMessages.minLength},
            {value: "Antoine", isValid: true}
        ]
    },
    {
        id: config.elements.lastName,
        entries: [
            {value: "B", isValid: false, errorMessage: errorMessages.minLength},
            {value: "Béland", isValid: true}
        ]
    },
    {
        id: config.elements.email,
        entries: [
            {value: "antoine.beland@", isValid: false, errorMessage: errorMessages.email},
            {value: "antoine.beland@polymtl.ca", isValid: true}
        ]
    },
    {
        id: config.elements.phone,
        entries: [
            {value: "514-340-47", isValid: false, errorMessage: errorMessages.phone},
            {value: "514-340-4711", isValid: true}
        ]
    },
    {
        id: config.elements.creditCard,
        entries: [
            {value: "4111 1111 1111", isValid: false, errorMessage: errorMessages.creditCard},
            {value: "4111 1111 1111 1111", isValid: true}
        ]
    },
    {
        id: config.elements.creditCardExpiry,
        entries: [
            {value: "13/18", isValid: false, errorMessage: errorMessages.creditCardExpiry},
            {value: "00/18", isValid: false, errorMessage: errorMessages.creditCardExpiry},
            {value: "01/999", isValid: false, errorMessage: errorMessages.creditCardExpiry},
            {value: "01/20", isValid: true}
        ]
    }
];

module.exports = {
    beforeEach: function(client) {
        const productConfig = require("./data/config.json").product;
        const productsList = require("./data/products.json");

        expectedProduct = productsList[utils.getRandomIntInclusive(0, productsList.length - 1)];
        client.url(`http://localhost:8000/${productConfig.url}${expectedProduct.id}`)
            .clearValue(productConfig.elements.input)
            .setValue(productConfig.elements.input, 1)
            .submitForm(productConfig.elements.form, function() {
                console.log(`Le produit '${expectedProduct.name}' a été ajouté au panier.`);
            });
        client.url(`http://localhost:8000/${config.url}`);
    },
    "État du panier d'achats": function(client) {
        // @Disabled
        /*var expectedTotalAmount = utils.getFormattedPrice(expectedProduct.price);
	client.verify.containsText(config.elements.totalAmount, expectedTotalAmount,
      "Le total indiqué doit être '" + expectedTotalAmount + "$'.");*/

        // Validate if the shopping cart count is correct.
        client.assert.visible(shoppingCartConfig.elements.count,
            "Le nombre de produits dans le panier doit pas être visible.");
        client.assert.containsText(shoppingCartConfig.elements.count, 1,
            "Le nombre de produits dans le panier doit être de '1'.");
        client.end();
    },
    "Soumission d'un formulaire invalide": /** @param {Client} client */ function(client) {
        // Submit the invalid form.
        client.submitForm(config.elements.form);
        // Check if the URL is the same than before.
        client.assert.urlContains(config.url, "La formulaire ne doit pas être envoyé en cas d'erreur(s).");

        inputs.forEach(function(input) {
            return client.assert.containsText(`${input.id}-error`, errorMessages.required, `Le champ ${
                input.id
            } doit indiquer qu'il est obligatoire.`);
        });
    },
    "Remplissage du formulaire": /** @param {Client} client */function(client) {
        inputs.forEach(function(input) {
            input.entries.forEach(function(entry) {
                client.clearValue(input.id)
                    .setValue(input.id, entry.value);
                client.submitForm(config.elements.form);
                const errorInput = `${input.id}-error`;
                if (entry.isValid) {
                    client.element("css selector", errorInput, ({status}) => {
                        const statusMessage = `Le champ ${input.id} est valide pour la valeur '${entry.value}'.`;
                        console.log(status);
                        if(status===0) {
                            client.assert.containsText(errorInput, "", statusMessage);
                        } else {
                            client.assert.elementNotPresent(errorInput, statusMessage);
                        }
                    });
                } else {
                    const statusMessage = `Le champ ${input.id} doit indiquer une erreur pour la valeur '${entry.value}'.`;
                    console.log("error input: "+errorInput+$(errorInput)===undefined);
                    client.assert.containsText(errorInput, entry.errorMessage, statusMessage);
                }
            });
        });
    },
    "Soumission d'un formulaire valide": /** @param {Client} client */ function(client) {
        const confirmationConfig = require("./data/config.json").confirmation;
        inputs.forEach(function(input) {
            const inputObj = input.entries.find(e => e.isValid);
            client.clearValue(input.id)
                .setValue(input.id, inputObj.value);
        });
        // Submit the valid form.
        client.submitForm(config.elements.form, function() {
            console.log("Soumission du formulaire valide...");
            return Promise.resolve();
        });
        client.waitForUpdate();
        // Check if the URL is valid.
        client.assert.urlContains(confirmationConfig.url, "La page de confirmation doit être affichée.");

        // Check if the name and the confirmation number are valid.
        client.assert.containsText(confirmationConfig.elements.name, "Antoine Béland",
            "Le nom indiqué doit être 'Antoine Béland'.")
            .assert.containsText(confirmationConfig.elements.confirmationNumber, "2",
                "Le numéro de confirmation doit être '2'.");

        // Validate if the shopping cart count is hidden when the cart is empty.
        client.assert.hidden(shoppingCartConfig.elements.count,
            "Le nombre de produits dans le panier ne doit pas être visible lorsque le panier est vide.");
    },
    after: function(client) {
        client.end();
    }
};

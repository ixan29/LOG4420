"use strict";

const assert = require("chai").assert;
const config = require("./data/config.json").products;
const productConfig = require("./data/config.json").product;
const {fail} = require("assert");
const utils = require("./utils");

/** @typedef {import("nightwatch").NightwatchBrowser & {
 *      waitForText: (elementSelector: string, checker: (text: string) => boolean, timeoutInMilliseconds: number, defaultMessage: string) => Client
 *      waitForUpdate: () => Client
 * }} Client
*/

/**
 * Validates the products list.
 *
 * @param {Client} client                The client to use.
 * @param {import("./data/products.typing").products[]} expectedProductsList  The expected products in the list.
 */
function validateProductsList(client, expectedProductsList) {
    const expectedProductsCountText = `${expectedProductsList.length} produit${
        (expectedProductsList.length > 1) ? "s" : ""}`;

    // Check if the products count displayed is correct.
    client.waitForText(config.elements.count, function(text) {
        return text.indexOf(expectedProductsCountText) !== -1;
    }, 2000, `L'indicateur du nombre de produits doit indiquer '${expectedProductsCountText}'.`);


    client.elements("css selector", `${config.elements.list} > *`, function(result) {
        let count = 0;

        // Check if the products count is correct.
        function checkProductsCount() {
            assert.strictEqual(count, expectedProductsList.length,
                `La liste de produits doit compter un total de ${expectedProductsList.length} produits.`);
        }

        // Iterates over all the products of the list.
        const products = result.value;
        if(!Array.isArray(products)) {throw products;}
        products.forEach(function(v, i) {
            client.elementIdDisplayed(v.ELEMENT, function(r2) {
                if (!r2.value) {
                    if (i === products.length - 1) { // Checks the products count at the end.
                        checkProductsCount();
                    }
                    return;
                }
                const index = count;
                ++count;


                // Retrieve the element text.
                client.elementIdText(v.ELEMENT, function(r3) {
                    // Check if the product name is correct.
                    if(typeof r3.value !== "string") throw r3.value;
                    client.assert.ok(r3.value.indexOf(expectedProductsList[index].name) !== -1,
                        `Le produit #${count} doit être '${expectedProductsList[index].name}'.`);

                    // Check if the product price is correct.
                    const price = utils.getFormattedPrice(expectedProductsList[index].price);
                    assert(r3.value.indexOf(price) !== -1,
                        `Le prix pour le produit #${count} doit être '${price}$'.`);
                });

                // Check if the product image is correct.
                client.elementIdElement(v.ELEMENT, "css selector", "img", function(r3) {
                    if(!("ELEMENT" in r3.value)) throw r3.value;
                    client.elementIdAttribute(r3.value.ELEMENT, "src", function(r4) {
                        if(typeof r4.value !== "string") throw fail("unexpected result");
                        assert(r4.value.indexOf(expectedProductsList[index].image) !== -1,
                            `L'image pour le produit #${count} doit être '${expectedProductsList[index].image}'.`);
                    });
                });

                // Check if the product link is correct.
                client.elementIdName(v.ELEMENT, function(r3) {
                    if(typeof r3.value !== "string") throw r3.value;
                    function validateLink(element) {
                        client.elementIdAttribute(element, "href", function(r4) {
                            const link = productConfig.url + expectedProductsList[index].id;
                            if(typeof r4.value !== "string") throw fail("unexpected result");
                            assert(r4.value.indexOf(link) !== -1,
                                `Le lien pour le produit #${count} doit être '${link}'.`);
                        });
                    }
                    if (r3.value.toLowerCase() === "a") {
                        validateLink(v.ELEMENT);
                    } else {
                        client.elementIdElement(v.ELEMENT, "css selector", "a", function(r4) {
                            if(!("ELEMENT" in r4.value)) throw r4.value;
                            validateLink(r4.value.ELEMENT);
                        });
                    }
                });

                if (i === products.length - 1) { // Checks the products count at the end.
                    checkProductsCount();
                }
            });
        });
    });
    return client;
}

/**
 * Validates a buttons group.
 *
 * @param {Client} client            The client to use.
 * @param buttonGroupId     The ID of the button group.
 * @param expectedButtons   The expected buttons list.
 * @param fileTemplate      The file template to use to validate the products list.
 */
function validateButtonsGroup(client, buttonGroupId, expectedButtons, fileTemplate) {
    client.assert.elementPresent(buttonGroupId, `Le groupe de boutons '${buttonGroupId}' est présent sur la page.`);

    client.elements("css selector", `${buttonGroupId} > button`, function(result) {
        if(!Array.isArray(result.value)) {throw result.value;}
        client.assert.equal(result.value.length, expectedButtons.length,
            `Le groupe de boutons '${buttonGroupId}' doit compter ${expectedButtons.length} boutons.`);

        // Iterates over the buttons.
        result.value.map(function(v, i) {
            const name = expectedButtons[i].name;

            // Validate the text of the button.
            client.elementIdText(v.ELEMENT, function(r2) {
                client.assert.equal(r2.value, name, `Le nom du bouton #${i + 1} doit être '${name}'.`);
            });

            // Simulate a click on the button.
            client.elementIdClick(v.ELEMENT, function() {
                console.log(`\nLe bouton '${name}' est cliqué...`);
            }).waitForUpdate()
                .elementIdCssProperty(v.ELEMENT, "selected", function(r2) {
                    client.assert.equal(r2.state, "success", `Le bouton '${name}' doit posséder la classe '.selected'.`);
                })
                .elements("css selector", `${buttonGroupId} > button:not(.selected)`, function(r2) {
                    if(!Array.isArray(r2.value)) {throw r2.value;}
                    const expectedCount = expectedButtons.length - 1;
                    client.assert.equal(r2.value.length, expectedCount,
                        `Il doit y avoir ${expectedCount} boutons qui ne possède pas la classe '.selected'.`);
                })
                .perform(function() {
                    validateProductsList(client, require(`./data/${fileTemplate.replace("{{ID}}", expectedButtons[i].id)}`));
                });
        });
    });
    return client;
}

let consoleLog;
module.exports = {
    before: function() {
        consoleLog = console.log;
    },
    "Page des produits": function(client) {
        console.log = function() {}; // Ignore the first log.
        client.url(`http://localhost:8000/${config.url}`)
            .perform(function() {
                console.log = consoleLog;
            })
            .assert.elementPresent(config.elements.list, "La liste de produits est présente sur la page.")
            .waitForUpdate();
    },
    "Liste des produits pour les valeurs par defauts": function(client) {
        validateProductsList(client, require("./data/products-all-price-up.json"));
    },
    "Categories des produits": function(client) {
        const expectedCategories = [
            {id: "cameras",   name: "Appareils photo"},
            {id: "consoles",  name: "Consoles"},
            {id: "screens",   name: "Écrans"},
            {id: "computers", name: "Ordinateurs"},
            {id: "all",       name: "Tous les produits"}
        ];
        validateButtonsGroup(client, config.elements.categories, expectedCategories, "products-{{ID}}-price-up.json");
    },
    "Classement des produits": function(client) {
        const expectedSortingCriteria = [
            {id: "price-up",   name: "Prix (bas-haut)"},
            {id: "price-down", name: "Prix (haut-bas)"},
            {id: "alpha-up",   name: "Nom (A-Z)"},
            {id: "alpha-down", name: "Nom (Z-A)"}
        ];
        validateButtonsGroup(client, config.elements.criteria, expectedSortingCriteria, "products-all-{{ID}}.json");
        client.end();
    }
};

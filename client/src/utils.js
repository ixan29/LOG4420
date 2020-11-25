/**
 * Provides some useful functions.
 *
 */


/**
 * Formats the specified number as a price.
 *
 * @param {number} price  The price to format.
 * @returns {string}      The price formatted.
 */
export function formatPrice (price) {
    return `${price.toFixed(2).replace(".", ",")}\u2009$`
}

/**
* Pads a number with zeros or a specified symbol.
*
* @param {number} number      The number to format.
* @param {number} width       The total width of the formatted number.
* @param {string} [symbol]      The padding symbol to use. By default, the symbol is '0'.
* @returns {string}       The formatted number.
* @see https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
*/
export function pad(number, width, symbol) {
    const symbolStr = symbol || "0";
    const numberStr = `${number}`;
    return numberStr.length >= width ?
        numberStr :
        new Array(width - numberStr.length + 1).join(symbolStr) + numberStr;
}

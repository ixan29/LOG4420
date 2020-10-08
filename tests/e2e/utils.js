"use strict";

const self = {};


/**
 * Gets the formatted price.
 *
 * @param {number} price       The price to format.
 * @returns {string}  The price formatted.
 */
self.getFormattedPrice = function(price) {
    return price.toFixed(2).replace(".", ",");
};

/**
 * Gets a random integer between the min and the max.
 *
 * @param {number} min   The min integer.
 * @param {number} max   The max integer.
 * @returns {number} The random integer generated.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
self.getRandomIntInclusive = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
};

/**
 * Strips the HTML tags from the specified HTML code.
 *
 * @param {string} html        The HTML code to use.
 * @returns {string}  The code without the tags (plain text).
 *
 * @see https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
 */
self.stripHTMLTags = function(html) {
    return html.replace(/<(?:.|\n)*?>/gm, "");
};

/**
 * Shuffles the specified array.
 *
 * @param {T[]} array   The array to shuffle.
 * @returns {T[]}   The array shuffled.
 * @template T
 *
 * @see https://stackoverflow.com/questions/18806210/generating-non-repeating-random-numbers-in-js
 */
self.shuffle = function(array) {
    let i = array.length;
    let j = 0;
    let temp;

    while (i--) {
        j = Math.floor(Math.random() * (i+1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;

    }
    return array;
};

module.exports = self;

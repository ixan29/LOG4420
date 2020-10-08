

//taken from https://github.com/maxgalbu/nightwatch-custom-commands-assertions/blob/master/es6/commands/waitForText.js


/**
 * This custom command allows us to locate an HTML element on the page and then wait until the value of the element's
 * inner text (the text between the opening and closing tags) matches the provided expression (aka. the 'checker' function).
 * It retries executing the checker function every 100ms until either it evaluates to true or it reaches
 * maxTimeInMilliseconds (which fails the test).
 * Nightwatch uses the Node.js EventEmitter pattern to handle asynchronous code so this command is also an EventEmitter.
 *
 * h3 Examples:
 *
 *     browser.waitForText("div", function(text) {
 *         return text === "something";
 *     });
 *
 * @author dkoo761
 * @see https://github.com/beatfactor/nightwatch/issues/246#issuecomment-59461345
 * @param {string} elementSelector - css/xpath selector for the element
 * @param {Function} checker - function that must return true if the element's text matches your requisite, false otherwise
 * @param {number} [timeoutInMilliseconds] - timeout of this wait commands in milliseconds
 * @param {string} [defaultMessage] - message to display
 */

module.exports = class WaitForText {
    constructor() {
        /**
         * @type {import("nightwatch").NightwatchAPI}
         */
        this.api;

        /**
         * @type {import("nightwatch").NightwatchClient}
         */
        this.client;
        this.timeoutRetryInMilliseconds = this.api.globals.waitForConditionPollInterval || 100;
        this.defaultTimeoutInMilliseconds = this.api.globals.waitForConditionTimeout || 5000;
        this.locateStrategy = "css";
        this.startTimeInMilliseconds = null;
    }

    restoreLocateStrategy() {
        if (this.locateStrategy === "xpath") { this.api.useXpath(); }
        if (this.locateStrategy === "css") { this.api.useCss(); }
    }

    /**
     *
     * @param {*} elementSelector
     * @param {*} checker
     * @param {*} timeoutInMilliseconds
     * @param {*} defaultMessage
     */
    command(elementSelector, checker, timeoutInMilliseconds, defaultMessage) {
        //Save the origian locate strategy, because if this command is used with
        //page objects, the "checker" function of this command is wrapped with another
        //function which resets the locate strategy after the function is called,
        //but since the function is called many times, from the second one the locateStrategy
        //is wrong
        this.startTimeInMilliseconds = new Date().getTime();

        if (typeof timeoutInMilliseconds !== "number") {
            timeoutInMilliseconds = this.defaultTimeoutInMilliseconds;
        }
        if (defaultMessage && typeof defaultMessage !== "string") {
            return Promise.reject("defaultMessage is not a string");
        }

        return this.check(elementSelector, checker, (result, loadedTimeInMilliseconds) => {
            if (result) {
                return Promise.resolve(defaultMessage ||
                    `waitForText: ${elementSelector}. Expression was true after ${loadedTimeInMilliseconds - this.startTimeInMilliseconds} ms.`
                );
            } else {
                return Promise.reject(`waitForText: ${elementSelector}. Expression wasn't true in ${timeoutInMilliseconds} ms.`);
            }
        }, timeoutInMilliseconds);
    }

    check(elementSelector, checker, callback, maxTimeInMilliseconds) {
        //Restore the origian locate strategy
        this.restoreLocateStrategy();
        return new Promise((resolve, reject) => {
            this.api.getText(elementSelector, result => {
                const now = new Date().getTime();
                if (result.status === 0 && checker(result.value)) {
                    return resolve(now);
                } else if (now - this.startTimeInMilliseconds < maxTimeInMilliseconds) {
                    return setTimeout(() => {
                        return this.check(elementSelector, checker, callback, maxTimeInMilliseconds);
                    }, this.timeoutRetryInMilliseconds);
                } else {
                    return reject(false);
                }
            });
        });
    }
};
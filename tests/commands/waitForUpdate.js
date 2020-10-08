/**
 * Wait until all the AJAX request are completed.
 * @this {import("nightwatch").ClientCommands}
 * @return {import("nightwatch").ClientCommands}
 */
module.exports.command = function() {
    this.pause(150);
    //.waitForJqueryAjaxRequest(10000, "Les requêtes AJAX sont complétées.");
    return this;
};

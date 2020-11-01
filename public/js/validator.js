import "./jquery-3.2.1.min.js"
import "./jquery.validate.min.js"
import "./additional-methods.min.js"

/**@type {JQueryStatic} */
// @ts-ignore
const $ = window.$;

/**
 * this file is to fix the problem of jquery plugins by removing the code from it's plugin form.
 * not ideal, but I did not other way to have jquery plugins type secure.
 */

/**
 * @type {{
 *  (): void,
 *  messages: Record<string, string>, 
 *  format: (msg: string) => string,
 *  addMethod: (name: string, test: (value: string) => boolean, msg: string) => void
 * }}
 */
//@ts-ignore
export const validator = $.validator;

/**
 * 
 * @param {JQuery<HTMLElement>} jqueryForm
 * @returns {boolean}
 */
export function isFormValid(jqueryForm) {
    // @ts-ignore
    return jqueryForm.valid();
}

/**
 * 
 * @param {JQuery<HTMLElement>} jqueryForm 
 * @return {(config: {
 *      rules: Record<string, Record<string, boolean>>
 * }) => void}
 */
export function getValidateForm(jqueryForm) {
    // @ts-ignore
    return jqueryForm.validate
}
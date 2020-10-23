import {} from "./shoppingCartBadge.js";
import {} from "./jquery-3.2.1.min.js";
import {} from "./jquery.validate.min.js";
import {} from "./additional-methods.min.js"
import {} from "./messages_fr.js";

import {setClient} from "./utils.js";

function initOrderPage()
{
    $.validator.addMethod(
        "regex",
        function(value, element, regexp) {
            var match = value.match(regexp);
            return match && value === match[0];
        },
        ""
    );

    $("form[name='order-form']").validate({
        rules: {
            "first-name": {
                required: true,
                minlength: 2
            },
            "last-name": {
                required: true,
                minlength: 2
            },
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true,
                regex: /^\d{3}-?\d{3}-?\d{4}/
            },
            creditcard: {
                required: true,
                regex: /^\d{4}-?\d{4}-?\d{4}-?\d{4}/
            },
            creditcardexpiry: {
                required: true,
                regex: /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])/
            }
        },
        messages: {
            "first-name": {
                required: "Ce champ est obligatoire.",
                minlength: "Veuillez fournir au moins 2 caractères."
            },
            "last-name": {
                required: "Ce champ est obligatoire.",
                minlength: "Veuillez fournir au moins 2 caractères."
            },
            email: {
                required: "Ce champ est obligatoire.",
                email: "Veuillez écrire une addresse courriel valide."
            },
            phone: {
                required: "Ce champ est obligatoire.",
                regex: "Veuillez écrire un numéro de téléphone valide"
            },
            creditcard: {
                required: "Ce champ est obligatoire.",
                regex: "Le numéro de votre carte de crédit est invalide"
            },
            creditcardexpiry: {
                required: "Ce champ est obligatoire.",
                regex: "La date d'expiration de votre carte de crédit est invalide"
            }
        }
    });

    $("form[name='order-form']").submit(function() {
        setClient({
            firstName: $("#first-name").val(),
            lastName: $("#last-name").val()
        });
    });

}

window.addEventListener("load",initOrderPage,false);
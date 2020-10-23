import {} from "./shoppingCartBadge.js";
import {} from "./jquery-3.2.1.min.js";
import {getClient} from "./utils.js";

function initConfirmationPage()
{
    const client = getClient();

    $("#name").text(client.firstName+" "+client.lastName);
    $("#confirmation-number").text("0".repeat(4-client.confirmationNumber.toString().length) + client.confirmationNumber);
}

window.addEventListener("load",initConfirmationPage,false);
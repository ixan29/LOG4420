import {} from "./jquery-3.2.1.min.js";
import {getFormattedPrice, getProduct, parseJsonToHtml, addShoppingCartProductQuantity} from "./utils.js";
import {initShoppingCartBadge} from "./shoppingCartBadge.js";

//Demarre l'animation toast du dialogue
const toastDialog = () => {
    $("#dialog").attr("class", "toast");

    setTimeout( () => $("#dialog").attr("class", "invisible"), 5500);
}

//Initialise la page du produit
const initProduct = async() =>
{
    const urlParams = new URLSearchParams(window.location.search);
    const id = Number.parseInt(urlParams.get('id'));

    //faire une requete au serveur pour obtenir le produit
    const product = await getProduct(id);

    //Signaler si jamais le produit n'a pas ete trouve
    if(product === undefined)
    {
        $("main").text("");
        $("main").append("<h1>Page non trouvée!</h1>");
        return;
    }

    //Modifier les champs necessaires(titre, image, description)
    $("#product-name").append(product.name);
    $("#product-image").attr("src","assets/img/"+product.image);
    $("#product-image").attr("alt",product.name);
    $("#product-desc").append(product.description);

    //Ajouter la liste des characteristiques
    for(var idx=0 ; idx<product.features.length ; idx++)
    {
        var featureBody =
        {
            element: "li",
            content: product.features[idx]
        };

        $("#product-features").append(parseJsonToHtml(featureBody));
    }

    //Ecrire le prix du produit
    $('#product-price').append("Prix: " + getFormattedPrice(product.price));

    //Ajoute un evenement au bouton "ajouter au panier"
    $("#add-to-cart-form").on("submit", function(e) {

        addShoppingCartProductQuantity(Number.parseInt(id), Number.parseInt($("#input-product-quantity").val()));
        initShoppingCartBadge();
        toastDialog();

        //empecher le refresh
        e.preventDefault();
    });
}

window.addEventListener("load",initProduct,false);
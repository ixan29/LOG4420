import {} from "./jquery-3.2.1.min.js";
import {parseJsonToHtml, setShoppingCartProductQuantity} from "./utils.js";
import {initShoppingCartBadge} from "./shoppingCartBadge.js";

//Demarre l'animation toast du dialogue
const toastDialog = () => {
    $("#dialog").attr("class", "toast");

    setTimeout( () => $("#dialog").attr("class", "invisible"), 3000);
}

//Initialise la page du produit
const initProduct = async() =>
{
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    //faire une requete au serveur pour obtenir le produit
    const product = await (await fetch("http://localhost:8000/getProduct?id="+id)).json();

    //Signaler si jamais le produit n'a pas ete trouve
    if(product.id === undefined)
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
    $('#product-price').append("Prix: " + product.price);

    //Ajoute un evenement au bouton "ajouter au panier"
    $("#add-to-cart-form").on("click", function() {

        setShoppingCartProductQuantity(Number.parseInt(id), Number.parseInt($("#input-product-quantity").val()));
        initShoppingCartBadge();
        toastDialog();
    });
}

window.addEventListener("load",initProduct,false);
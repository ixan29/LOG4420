//Initialise la valeur du badge du panier d'achat
const initShoppingCartBadge = async () =>
{
    //recuillir la liste et compter le nombre de produits ajoutes
    const shoppingCart = getShoppingCart();
    var numProducts = shoppingCart.reduce((acc, val) => acc + val.quantity, 0);

    //Mettre a jour la valeur du badge
    $("#shopping-cart-badge").text(numProducts > 0 ? numProducts : "");
}

window.addEventListener("load",initShoppingCartBadge,false);
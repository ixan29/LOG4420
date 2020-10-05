const initShoppingCartBadge = async () =>
{
    const shoppingCart = getShoppingCart();

    $("#shopping-cart-badge").text(shoppingCart.length > 0 ? shoppingCart.length : "");
}

window.addEventListener("load",initShoppingCartBadge,false);
import {} from "./jquery-3.2.1.min.js";
import {getShoppingCart, parseJsonToHtml, getShoppingCartProductQuantity, addShoppingCartProductQuantity, removeShoppingCartProduct, clearShoppingCart, getProduct, getFormattedPrice} from "./utils.js";
import {initShoppingCartBadge} from "./shoppingCartBadge.js";

//Initialise la table des achats
const initShoppingCartTable = async() =>
{
    //Recueillir la liste d'epicerie
    const shoppingCart = getShoppingCart();

    if(shoppingCart.length === 0)
    {
        $("#rest-main").text("Aucun produit dans le panier.");
        return;
    }

    //Initialiser les elements html impliques
    $("#shopping-cart-table").text("");
    $("#total-amount").text("");

    //Representation html des titres de la table
    const titleBody = {
        element: "tr",
        class: "first",
        content: [
            {
                element: "th",
            },
            {
                element: "th",
                content: "Nom"
            },
            {
                element: "th",
                content: "Prix Unitaire"
            },
            {
                element: "th",
                content: "Quantité"
            },
            {
                element: "th",
                content: "Prix"
            }
        ]
    };

    //Ajouter les titres dans la table
    $("#shopping-cart-table").append(parseJsonToHtml(titleBody));

    //Utilise pour calculer le prix total de l'epicerie
    var total = 0;

    var products = [];
    
    for(var idx=0 ; idx<shoppingCart.length ; idx++)
    {
        var product = await getProduct(shoppingCart[idx].id);
        product.quantity = shoppingCart[idx].quantity;
        products.push(product);
    };

    products = products.sort((a, b) => {
        var aName = a.name.toLowerCase();
        var bName = b.name.toLowerCase();

        if(aName < bName)
            return -1;

        if(aName > bName)
            return 1;

        return 0;
    });

    products.forEach(async (product) => {

        //Additionner le prix du produit(prixUnitaire*quantite) au total
        total += product.price * product.quantity;

        //Reprensentation html de la range du produit dans la table
        const productBody =
        {
            element: "tr",
            content: [
                {   //boutton pour retirer le produit
                    element: "td",
                    content: {
                        element: "button",
                        class: "shop-cart-button remove-item-button",
                        id: "btn-rm-product-"+product.id, //Ce id va etre utilise pour lier une function lorsque appuye
                        content: "✕"
                    }
                },
                {
                    //Lien vers la page du produit
                    element: "td",
                    content: {
                        element: "a",
                        href: "product.html?id="+product.id,
                        content: product.name
                    }
                },
                {
                    //Prix unitaire
                    element: "td",
                    content: getFormattedPrice(product.price) + " $"
                },
                {
                    //champ pour designer la quantite du produit
                    element: "td",
                    content: {
                        element: "div",
                        class: "input-group-button",
                        content: [
                            {
                                //bouton pour decrementer la quantite
                                element: "button",
                                type: "button",
                                class: "shop-cart-button remove-quantity-button",
                                "data-quantity": "minus",
                                id: "btn-decrement-product-"+product.id, //Ce id va etre utilise pour lier une function lorsque appuye
                                content: "-"
                            },
                            {
                                //champ contenant la quantite
                                element: "input",
                                class: "form-control",
                                type: "number",
                                name: "quantity",
                                value: product.quantity,
                                min: "1",
                                id: "input-product-"+product.id //Ce id va etre utilise pour lier une function lorsque modifie
                            },
                            {
                                //bouton pour incrementer la quantite
                                element: "button",
                                type: "button",
                                class: "shop-cart-button add-quantity-button",
                                "data-quantity": "plus",
                                id: "btn-increment-product-"+product.id, //Ce id va etre utilise pour lier une function lorsque appuye
                                content: "+"
                            }
                        ]
                    }
                },
                {
                    //Affiche le prix du produit (prixUnitaire*quantite)
                    element: "td",
                    class: "price",
                    content: getFormattedPrice(product.price * product.quantity) + " $"
                }
            ]
        }

        //Ajouter la rangee du produit dans la table
        await $("#shopping-cart-table").append(parseJsonToHtml(productBody));

        //Evenement du champ mettant a jour la quantite du produit
        $("#input-product-"+product.id).on("blur", () =>
        {
            var quantity = Number.parseInt($("#input-product-"+product.id).val());

            if(quantity === undefined || quantity < 0)
            {
                alert("La valeur de la quantité doit être strictement supérieure à 0");
                quantity = 1;
            }
            
            addShoppingCartProductQuantity(product.id, quantity);

            initShoppingCartBadge();
            initShoppingCartTable();
        });

        //Evenement pour le bouton d'incrementation mettant a jour la quantite du produit
        $("#btn-increment-product-"+product.id).on("click", () =>
        {
            var quantity = getShoppingCartProductQuantity(product.id);
            addShoppingCartProductQuantity(product.id, 1);

            initShoppingCartBadge();
            initShoppingCartTable();
        });

        //Evenement pour le bouton de decrementation mettant a jour la quantite du produit
        $("#btn-decrement-product-"+product.id).on("click", () =>
        {
            var quantity = getShoppingCartProductQuantity(product.id);
            
            if(quantity > 1)
            {
                addShoppingCartProductQuantity(product.id, -1);

                initShoppingCartBadge();
                initShoppingCartTable();
            }
        });

        //Evenement pour le bouton de suppression de produit mettant a jour la quantite du produit
        $("#btn-rm-product-"+product.id).on("click", () =>
        {
            if(confirm("Voulez-vous supprimer le produit du panier?"))
            {
                removeShoppingCartProduct(product.id, 0);
                initShoppingCartBadge();
                initShoppingCartTable();
            }
        });
    });

    //Afficher le prix total de la liste d'epicerie
    $("#total-amount").append("Total : "+getFormattedPrice(total)+" $");
}

//Initialise la page de la liste d'epicerie
const initShoppingCart = async() =>
{
    //Initialise la table de la liste d'epicerie
    await initShoppingCartTable();

    //Evenement pour le bouton qui vide le panier
    $("#remove-all-items-button").on("click", async() =>
    {
        if(getShoppingCart().length === 0)
        {
            alert("Le panier est vide!");
        }
        else
        if(confirm("Voulez-vous vraiment vider le panier?"))
        {
            clearShoppingCart();
            initShoppingCartBadge();
            initShoppingCartTable();
        }
    });
}

window.addEventListener("load",initShoppingCart,false);
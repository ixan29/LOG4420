//Initialise la table des achats
const initShoppingCartTable = async() =>
{
    //Initialiser les elements html impliques
    $("#shopping-cart-table").text("");
    $("#shopping-cart-total").text("");

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

    //Recueillir la liste d'epicerie
    const shoppingCart = getShoppingCart();

    //Utilise pour calculer le prix total de l'epicerie
    var total = 0;

    //Pour chaque achat
    for(var idx=0 ; idx<shoppingCart.length ; idx++)
    {
        var shoppingProduct = shoppingCart[idx];

        //Faire une requete pour obtenir le produit implique
        const product = await (await fetch("http://localhost:8000/getProduct?id="+shoppingProduct.id)).json();

        //Additionner le prix du produit(prixUnitaire*quantite) au total
        total += product.price * shoppingProduct.quantity;

        //Reprensentation html de la range du produit dans la table
        const productBody =
        {
            element: "tr",
            content: [
                {   //boutton pour retirer le produit
                    element: "td",
                    content: {
                        element: "button",
                        class: "shop-cart-button",
                        id: "btn-rm-product-"+product.id, //Ce id va etre utilise pour lien une function lorsque appuye
                        content: "x"
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
                    content: product.price + " $"
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
                                class: "shop-cart-button",
                                "data-quantity": "minus",
                                id: "btn-decrement-product-"+product.id, //Ce id va etre utilise pour lien une function lorsque appuye
                                content: "-"
                            },
                            {
                                //champ contenant la quantite
                                element: "input",
                                class: "form-control",
                                type: "number",
                                name: "quantity",
                                value: shoppingProduct.quantity,
                                min: "1",
                                id: "input-product-"+product.id //Ce id va etre utilise pour lien une function lorsque modifie
                            },
                            {
                                //bouton pour incrementer la quantite
                                element: "button",
                                type: "button",
                                class: "shop-cart-button",
                                "data-quantity": "plus",
                                id: "btn-increment-product-"+product.id, //Ce id va etre utilise pour lien une function lorsque appuye
                                content: "+"
                            }
                        ]
                    }
                },
                {
                    //Affiche le prix du produit (prixUnitaire*quantite)
                    element: "td",
                    content: product.price * shoppingProduct.quantity + " $"
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
            
            setShoppingCartProductQuantity(product.id, quantity);

            initShoppingCartBadge();
            initShoppingCartTable();
        });

        //Evenement pour le bouton d'incrementation mettant a jour la quantite du produit
        $("#btn-increment-product-"+product.id).on("click", () =>
        {
            var quantity = getShoppingCartProductQuantity(product.id);
            setShoppingCartProductQuantity(product.id, quantity+1);

            initShoppingCartBadge();
            initShoppingCartTable();
        });

        //Evenement pour le bouton de decrementation mettant a jour la quantite du produit
        $("#btn-decrement-product-"+product.id).on("click", () =>
        {
            var quantity = getShoppingCartProductQuantity(product.id);
            
            if(quantity > 1)
            {
                setShoppingCartProductQuantity(product.id, quantity-1);

                initShoppingCartBadge();
                initShoppingCartTable();
            }
        });

        //Evenement pour le bouton de suppression de produit mettant a jour la quantite du produit
        $("#btn-rm-product-"+product.id).on("click", () =>
        {
            setShoppingCartProductQuantity(product.id, 0);
            initShoppingCartBadge();
            initShoppingCartTable();
        });
    }

    //Afficher le prix total de la liste d'epicerie
    $("#shopping-cart-total").append("Total : "+total+" $");
}

//Initialise la page de la liste d'epicerie
const initShoppingCart = async() =>
{
    //Initialise la table de la liste d'epicerie
    await initShoppingCartTable();

    //Evenement pour le bouton qui vide le panier
    $("#btn-vider-panier").on("click", async() =>
    {
        const opts = {
            method: "POST"
        };

        await fetch("http://localhost:8000/emptyShoppingCart", opts);

        initShoppingCartBadge();
        initShoppingCartTable();
    });
}

window.addEventListener("load",initShoppingCart,false);
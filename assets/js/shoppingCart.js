const initShoppingCartTable = async() =>
{
    $("#shopping-cart-table").text("");
    $("#shopping-cart-total").text("");

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

    $("#shopping-cart-table").append(parseJsonToHtml(titleBody));

    const shoppingCart = getShoppingCart();

    var total = 0;

    for(var idx=0 ; idx<shoppingCart.length ; idx++)
    {
        var shoppingProduct = shoppingCart[idx];

        const product = await (await fetch("http://localhost:8000/getProduct?id="+shoppingProduct.id)).json();

        total += product.price * shoppingProduct.quantity;

        const productBody =
        {
            element: "tr",
            content: [
                {
                    element: "td",
                    content: {
                        element: "button",
                        class: "shop-cart-button",
                        id: "btn-rm-product-"+product.id,
                        content: "x"
                    }
                },
                {
                    element: "td",
                    content: {
                        element: "a",
                        href: "product.html?id="+product.id,
                        content: product.name
                    }
                },
                {
                    element: "td",
                    content: product.price + " $"
                },
                {
                    element: "td",
                    content: {
                        element: "div",
                        class: "input-group-button",
                        content: [
                            {
                                element: "button",
                                type: "button",
                                class: "shop-cart-button",
                                "data-quantity": "minus",
                                id: "btn-decrement-product-"+product.id,
                                content: "-"
                            },
                            {
                                element: "input",
                                class: "form-control",
                                type: "number",
                                name: "quantity",
                                value: shoppingProduct.quantity,
                                min: "1",
                                id: "input-product-"+product.id
                            },
                            {
                                element: "button",
                                type: "button",
                                class: "shop-cart-button",
                                "data-quantity": "plus",
                                id: "btn-increment-product-"+product.id,
                                content: "+"
                            }
                        ]
                    }
                },
                {
                    element: "td",
                    content: product.price * shoppingProduct.quantity + " $"
                }
            ]
        }

        await $("#shopping-cart-table").append(parseJsonToHtml(productBody));

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

        $("#btn-increment-product-"+product.id).on("click", () =>
        {
            var quantity = getShoppingCartProductQuantity(product.id);
            setShoppingCartProductQuantity(product.id, quantity+1);

            initShoppingCartBadge();
            initShoppingCartTable();
        });

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

        $("#btn-rm-product-"+product.id).on("click", () =>
        {
            setShoppingCartProductQuantity(product.id, 0);
            /*
            const opts = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                {
                    id: product.id,
                    quantity: 0
                }),
            };
    
            await fetch("http://localhost:8000/setShoppingCartProductQuantity", opts);
            */

            initShoppingCartBadge();
            initShoppingCartTable();
        });
    }

    $("#shopping-cart-total").append("Total : "+total+" $");
}

const initShoppingCart = async() =>
{
    await initShoppingCartTable();

    $("#btn-vider-panier").on("click", async() =>
    {
        console.log("here");

        const opts = {
            method: "POST"
        };

        await fetch("http://localhost:8000/emptyShoppingCart", opts);

        initShoppingCartBadge();
        initShoppingCartTable();
    });
}

window.addEventListener("load",initShoppingCart,false);
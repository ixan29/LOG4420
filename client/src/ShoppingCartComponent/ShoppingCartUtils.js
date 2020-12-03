import { reloadHeader } from "../_Common/Header";

export async function getShoppingCartItems()
{
    const res = await fetch("http://localhost:4000/api/shopping-cart", {
        method: "GET",
        credentials: "include"
    });
    const items = await res.json();

    for(const item of items)
        item.product = fetch("http://localhost:4000/api/products/"+item.productId);

    for(const item of items)
    {
        const res = await item.product;
        item.product = await res.json();
    }

    return items;
}

export async function addShoppingCartItem(productId, quantity)
{
    await fetch("http://localhost:4000/api/shopping-cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: productId, quantity: quantity }),
        credentials: "include"
    });

    if(reloadHeader)
        reloadHeader();
}

export async function setShoppingCartItemQuantity(productId, quantity)
{
    await fetch("http://localhost:4000/api/shopping-cart/"+String(productId), {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: quantity }),
        credentials: "include"
    });

    if(reloadHeader)
        reloadHeader();
}

export async function deleteShoppingCartItem(productId)
{
    await fetch("http://localhost:4000/api/shopping-cart/" + String(productId), {
        method: "DELETE",
        credentials: "include"
    });

    if(reloadHeader)
        reloadHeader();
}

export async function deleteShoppingCart()
{
    await fetch("http://localhost:4000/api/shopping-cart/", {
        method: "DELETE",
        credentials: "include"
    });

    if(reloadHeader)
        reloadHeader();
}

export async function getShoppingCartItems()
{
    const res = await fetch("http://localhost:4000/api/shopping-cart");
    const items = await res.json();

    console.log({items});

    for(const item of items)
        item.product = fetch("http://localhost:4000/api/products/"+item.productId);

    for(const item of items)
    {
        const res = await item.product;
        item.product = await res.json();
    }

    return items;
}
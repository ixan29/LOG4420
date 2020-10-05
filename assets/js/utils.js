
function parseJsonToHtml(obj)
{
    if(Array.isArray(obj))
    {
        var str = "";

        for(var idx=0 ; idx<obj.length ; idx++)
            str += parseJsonToHtml(obj[idx]);

        return str;
    }

    if(typeof obj === "object")
    {
        var str = "<" + obj.element;

        for(const key in obj)
            if(key !== "element" && key !== "content")
            {
                str += " " + key + "='" + obj[key] + "'";
            }
        
        str += ">";

        if(obj.content !== undefined)
            str += parseJsonToHtml(obj.content);

        return str + "</" + obj.element + ">";
    }

    return String(obj);
}

const shoppingCartStorageName = "INF4420-shopping-cart";

function getShoppingCart() {
    var shoppingCart = JSON.parse(localStorage.getItem(shoppingCartStorageName));

    if(!Array.isArray(shoppingCart))
    {
        shoppingCart = [];
        localStorage.setItem(shoppingCartStorageName, JSON.stringify(shoppingCart));
    }

    return shoppingCart
}

function clearShoppingCart() {
    localStorage.setItem(shoppingCartStorageName, "[]");
}

function getShoppingCartProductQuantity(id)
{
    var shoppingCart = getShoppingCart();

    for(var idx=0 ; idx<shoppingCart.length ; idx++)
    {
        if(shoppingCart[idx].id === id)
        {
            return shoppingCart[idx].quantity;
        }
    }
}

function setShoppingCartProductQuantity(id, quantity)
{
    if(quantity < 0)
        quantity = 0;

    var shoppingCart = getShoppingCart();

    (function()
    {
        for(var idx=0 ; idx<shoppingCart.length ; idx++)
        {
            if(shoppingCart[idx].id === id)
            {
                shoppingCart[idx].quantity = quantity;
                return;
            }
        }
    
        shoppingCart.push({
            id,
            quantity
        });
    })();
    
    shoppingCart = shoppingCart.filter(function(productQt) {
        return productQt.quantity > 0;
    });

    localStorage.setItem(shoppingCartStorageName, JSON.stringify(shoppingCart));
}
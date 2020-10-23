/*
 * fichier contenant des fonctions utiles pour le reste du code javascript
*/

//Convertit un objet js en html selon un protocole fait maison (vor un exemple dans products.js)
export function parseJsonToHtml(obj)
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

//identifiant pour le local storage
const shoppingCartStorageName = "INF4420-shopping-cart";

/*
retourne la liste d'achat sous la forme suivante :
[
    {
        id:num,  <- id du produit
        quantity: num <- quantite du produit
    }
]
*/
export function getShoppingCart() {
    var shoppingCart = JSON.parse(localStorage.getItem(shoppingCartStorageName));

    //initialiser la liste d'achat si elle n'est pas incluse dans le local storage
    if(!Array.isArray(shoppingCart))
    {
        shoppingCart = [];
        localStorage.setItem(shoppingCartStorageName, JSON.stringify(shoppingCart));
    }

    return shoppingCart
}

//reinitialise la liste d'epicerie
export function clearShoppingCart() {
    localStorage.setItem(shoppingCartStorageName, "[]");
}

//retourne la quantite demandee dans liste d'epicerie d'un produit
//a partir de son id
export function getShoppingCartProductQuantity(id)
{
    var shoppingCart = getShoppingCart();

    for(var idx=0 ; idx<shoppingCart.length ; idx++)
    {
        if(shoppingCart[idx].id === id)
        {
            return shoppingCart[idx].quantity;
        }
    }

    return 0;
}

//Modifier la quantite d'un produit dans le panier a partir de son id
export function setShoppingCartProductQuantity(id, quantity)
{
    //Recuillir la liste d'epicerie
    var shoppingCart = getShoppingCart();

    (function()
    {
        //des quon trouve le produit en question, on modifie la quantite
        //et on quitte cette fonction lambda
        for(var idx=0 ; idx<shoppingCart.length ; idx++)
        {
            if(shoppingCart[idx].id === id)
            {
                shoppingCart[idx].quantity = quantity;
                return;
            }
        }
    
        //si le produit n'a pas ete trouve dans la liste, on l'ajoute avec
        //la quantite specifiee
        shoppingCart.push({
            id,
            quantity
        });
    })();
    
    //Enlever tous les produits dont la quantite n'est pas strictement
    //superieure a 1
    shoppingCart = shoppingCart.filter(function(productQt) {
        return productQt.quantity > 0;
    });

    //Mettre a jour la liste d'epicerie dans le local storage
    localStorage.setItem(shoppingCartStorageName, JSON.stringify(shoppingCart));
}

export function makeJQueryButtonGroup(name, selectFn, unselectFn)
{
    var buttonsNotList = $("button");

    var buttons = [];

    for(var idx=0 ; idx < buttonsNotList.length ; idx++)
    {
        var button = buttonsNotList[idx];

        if( button.attributes.getNamedItem('data-btn-group-name')
        &&  button.attributes.getNamedItem('data-btn-group-name').value === name)
            buttons.push(button);
    }

    buttons.forEach(button => {
        var rest = buttons.filter(btn=> btn !== button);

        button.addEventListener("click", () => {
            selectFn(button);

            rest.forEach(btn => unselectFn(btn));
        });
    });
}

export function getFormattedPrice(price) {
    return price.toFixed(2).replace(".", ",");
};

var products;

export var getProducts = async() =>
{
    if(products === undefined)
    {
        var res = await fetch("http://localhost:8000/data/products.json");
        products = await res.json();
    }

    return products;
}

export var getProduct = async(id) =>
{
    var products = await getProducts();

    for(var idx=0; idx<products.length ; idx++)
    {
       if(products[idx].id === id)
       {
            return products[idx];
       }
    }
}

const clientStorageName = "INF4420-client";
var confirmationNumber = 1;

export function getClient()
{
    return JSON.parse(localStorage.getItem(clientStorageName));
}

export function setClient(client)
{
    client.confirmationNumber = confirmationNumber;
    localStorage.setItem(clientStorageName, JSON.stringify(client));

    confirmationNumber++;
}
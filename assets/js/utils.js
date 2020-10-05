/*
 * fichier contenant des fonctions utiles pour le reste du code javascript
*/

//Convertit un objet js en html selon un protocole fait maison (vor un exemple dans products.js)
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
function getShoppingCart() {
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
function clearShoppingCart() {
    localStorage.setItem(shoppingCartStorageName, "[]");
}

//retourne la quantite demandee dans liste d'epicerie d'un produit
//a partir de son id
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

    return 0;
}

//Modifier la quantite d'un produit dans le panier a partir de son id
function setShoppingCartProductQuantity(id, quantity)
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
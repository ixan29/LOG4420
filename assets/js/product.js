
//Initialise la page du produit
const initProduct = async() =>
{
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    //faire une requete au serveur pour obtenir le produit
    const product = await (await fetch("http://localhost:8000/getProduct?id="+id)).json();

    //Signaler si jamais le produit n'a pas ete trouve
    if(product.id === undefined)
    {
        $("main").text("");
        $("main").append("<h1>Page non trouvée!</h1>");
        return;
    }

    //Modifier les champs necessaires(titre, image, description)
    $("#product-title").append(product.name);
    $("#img-product").attr("src","assets/img/"+product.image);
    $("#img-product").attr("alt",product.name);
    $("#product-description").append(product.description);

    //Ajouter la liste des characteristiques
    for(var idx=0 ; idx<product.features.length ; idx++)
    {
        var featureBody =
        {
            element: "li",
            content: product.features[idx]
        };

        $("#product-features").append(parseJsonToHtml(featureBody));
    }

    //Ecrire le prix du produit
    $('#product-price').append("Prix: " + product.price);

    //Ajoute un evenement au bouton "ajouter au panier"
    $("#btn-add-to-cart").on("click", function() {

        setShoppingCartProductQuantity(Number.parseInt(id), Number.parseInt($("#input-product-quantity").val()));

        //TODO creer un toast comme demande dans les consignes
        window.location.href = "./shopping-cart.html";
    });
}

window.addEventListener("load",initProduct,false);
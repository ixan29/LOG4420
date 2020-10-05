const initProducts = async() =>
{
    //Faire une requete au serveur pour recueillir les produits
    const products = await (await fetch("http://localhost:8000/getProducts")).json();

    //Afficher le nombre de produits
    $("#num-produits").append(""+products.length+" produits");

    //Pour chaque produit creer un panneau montrant son titre, son image et son prix
    for(var idx=0 ; idx < products.length ; idx++)
    {
        const product = products[idx];
        
        //Representation du html en javascript (fait maison)
        var productBody =
        {
            element: "a",
            href: "product.html?id="+product.id,
            content: [
                {
                    element: "h3",
                    content: product.name
                },
                {
                    element: "img",
                    src: "assets/img/"+product.image,
                    alt: product.name,
                    class: "img-list-produits"
                },
                {
                    element: "p",
                    class: "prix-produits",
                    content: "Prix: "+product.price
                }
            ]
        };
        
        //Convertir l'objet javascript en html en l'envoyer dans la liste des produits
        $("#div-produits").append(parseJsonToHtml(productBody));
    }
}

window.addEventListener("load",initProducts,false);
const initProducts = async() =>
{
    const products = await (await fetch("http://localhost:8000/getProducts")).json();

    $("#num-produits").append(""+products.length+" produits");

    for(var idx=0 ; idx < products.length ; idx++)
    {
        const product = products[idx];
        
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
        
        $("#div-produits").append(parseJsonToHtml(productBody));

        /*
        $("#div-produits").append(
        [
            "<a href=product.html?id=",product.id,">",
                "<h3>",product.name,"</h3>",
                "<img src='assets/img/",product.image,"' alt='",product.name,"' class='img-list-produits'>",
                "<p class='prix-produits'>Prix: ",product.price,"</p>",
            "</a>"
        ]
        .join(""));
        */
    }
}

window.addEventListener("load",initProducts,false);
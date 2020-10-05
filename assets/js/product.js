
function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    fetch("http://localhost:8000/getProduct?id="+id)
    .then((response) => response.json())
    .then((product) => {

        if(product.id === undefined)
        {
            $("main").text("Erreur 404. Aucun produit n'a été trouvé avec l'identifiant fourni");
            return;
        }

        $("#product-title").append(product.name);
        $("#img-product").attr("src","assets/img/"+product.image);
        $("#img-product").attr("alt",product.name);

        $("#product-description").append(product.description);

        for(var idx=0 ; idx<product.features.length ; idx++)
        {
            var featureBody =
            {
                element: "li",
                content: product.features[idx]
            };

            $("#product-features").append(parseJsonToHtml(featureBody));
        }

        $('#product-price').append("Prix: " + product.price);
    });

    $("#btn-add-to-cart").on("click", function() {

        setShoppingCartProductQuantity(Number.parseInt(id), Number.parseInt($("#input-product-quantity").val()));
        window.location.href = "./shopping-cart.html";

        /*
        const opts = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
            {
                "id": Number.parseInt(id),
                quantity: Number.parseInt($("#input-product-quantity").val())
            }),
        };

        fetch("http://localhost:8000/setShoppingCartProductQuantity", opts)
        .then(() => {
            window.location.href = "./shopping-cart.html";
        });
        */
    });
}

window.addEventListener("load",init,false);
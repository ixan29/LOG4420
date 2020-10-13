import {} from "./jquery-3.2.1.min.js";
import {makeJQueryButtonGroup, parseJsonToHtml} from "./utils.js";
import {} from "./shoppingCartBadge.js";

function sortPrice(products) {
    return products.sort((a,b) => a.price - b.price);
}

function sortPriceReverse(products) {
    return products.sort((a,b) => b.price - a.price);
}

function sortAlpha(products) {
    return products.sort(function(a, b){
        if(a.name < b.name)
            return -1;

        if(a.name > b.name)
            return 1;

        return 0;
    });
}

function sortAlphaReverse(products) {
    return products.sort(function(a, b){
        if(a.name < b.name)
            return 1;

        if(a.name > b.name)
            return -1;

        return 0;
    });
}

let selectedSort = sortPrice;

function filterKeepCameras(products) {
    return products.filter((product) => product.category === "cameras");
}

function filterKeepConsoles(products) {
    return products.filter((product) => product.category === "consoles");
}

function filterKeepScreens(products) {
    return products.filter((product) => product.category === "screens");
}

function filterKeepComputers(products) {
    return products.filter((product) => product.category === "computers");
}

function filterKeepAll(products) {
    return products;
}

let selectedFilter = filterKeepAll;

const initProducts = async() =>
{
    //Faire une requete au serveur pour recueillir les produits
    const unsortedProducts = await (await fetch("http://localhost:8000/getProducts")).json();
    const products = selectedSort(selectedFilter(unsortedProducts));

    //Afficher le nombre de produits
    $("#products-count").text(""+products.length+" produits");

    $("#products-list").text("");

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
        $("#products-list").append(parseJsonToHtml(productBody));
    }
}

function setFilter(filterFn) {
    selectedFilter = filterFn;
    initProducts();
}

function setSort(sortFn) {
    selectedSort = sortFn;
    initProducts();
}

const initProductsPage = async() => {

    initProducts();

    makeJQueryButtonGroup(
        "group-filter",
        (buttonToSelect) => {
            buttonToSelect.classList.add("selected");
        },
        (buttonToUnselect) => {
            buttonToUnselect.classList.remove("selected");
        }
    );

    makeJQueryButtonGroup(
        "group-sort",
        (buttonToSelect) => {
            buttonToSelect.classList.add("selected");
        },
        (buttonToUnselect) => {
            buttonToUnselect.classList.remove("selected");
        }
    )
}

window.addEventListener("load",initProductsPage,false);
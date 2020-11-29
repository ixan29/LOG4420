
import '../css/App.css';
import {Header} from "../_Common/Header.js"
import {Footer} from "../_Common/Footer.js"
import {useParams} from "react-router-dom";
import {imageMap} from "../ProductsComponent/ProductImageLoader";
import { useEffect, useState } from 'react';

function addproduct(productId, quantity)
{
    /*
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "localhost:4000/api/shopping-cart", true);
    xhr.withCredentials = true;
    xhr.send(JSON.stringify({ productId: productId, quantity: quantity }));
    */

    return fetch("http://localhost:4000/api/shopping-cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: productId, quantity: quantity }),
        credentials: "include"
    });
}

export function ProductComponent() {
    document.title="OnlineShop - Produit";
    const { id } = useParams();

    const [product, setProduct] = useState();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const prod = await fetch(`http://localhost:4000/api/products/${id}`);
                if(prod.ok) {
                    setProduct(await prod.json());
                } else {
                    throw await prod.json();
                }
            } catch(e) {
                console.error(e);
            }
            setLoading(false);
        }
        fetchData();
    }, [id]);

    let content;
    if(loading) {
        content = (
            <article>
                <div className="loading"></div>
            </article>
        )
    } else if(product) {
        content = (
            <article>
                <h1 id="product-name">{product.name}</h1>
                <div className="row">
                    <div className="col">
                        <img alt="product" src={imageMap[product.image]} id="product-image"/>
                    </div>
                    <div className="col">
                        <section>
                            <h2>Description</h2>
                            <p id="product-desc">{product.description}</p>
                        </section>
                        <section>
                            <h2>Caractéristiques</h2>
                            <ul id="product-features">
                                {product.features.map(feature => (
                                    <li key={feature}>{feature}</li>    
                                ))}
                            </ul>
                        </section>
                        <hr/>
                        <form className="pull-right" id="add-to-cart-form">
                            <label htmlFor="product-quantity">Quantité:</label>
                            <input className="form-control" type="number" defaultValue="1" min="1" id="product-quantity"/>
                            <button className="btn" title="Ajouter au panier" type="submit" onClick={() => addproduct(+id, 1)}>
                                <i className="fa fa-cart-plus"></i>&nbsp; Ajouter
                            </button>
                        </form>
                        <p>Prix: <strong id="product-price">{product.price}</strong></p>
                    </div>
                </div>
                <div className="dialog" id="dialog">
                    Le produit a été ajouté au panier.
                </div>
            </article>
        );
    } else {
        console.error("Invalid ID specified");
        content =  (
            <article>
                <h1>Produit non trouvée!</h1>
            </article>
        );
    }
    return (
        <div>
            <Header currentActive="product"/>
            <main>
                {content}
            </main>
            <Footer/>
        </div>
    );
}

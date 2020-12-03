import '../css/App.css';
import {Header} from "../_Common/Header.js"
import {Footer} from "../_Common/Footer.js"
import {Link} from "react-router-dom"
import { formatPrice } from "../utils.js"
import { useEffect, useState } from 'react';
import { getShoppingCartItems, setShoppingCartItemQuantity, deleteShoppingCartItem, deleteShoppingCart } from "./ShoppingCartUtils.js";

export function ShoppingCartComponent() {
    document.title="OnlineShop - Panier";

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect( () => {
        if(loading)
        {
            getShoppingCartItems().then(res => {
                setItems(res);
                setLoading(false);
            });
        }
    });
    
    return (
        <div>
            <Header/>
            <main>
            <article>
                <h1>Panier</h1>
                <div id="shopping-cart-container">
                    <table className="table shopping-cart-table">
                        <thead>
                            <tr>
                            <th></th>
                            <th>Produit</th>
                            <th>Prix unitaire</th>
                            <th>Quantité</th>
                            <th>Prix</th>
                            </tr>
                        </thead>
                        <tbody>
                        {items.map(item => 
                            <tr>
                                <td>
                                    <button className="remove-item-button" title="Supprimer" onClick={
                                        (e) => {
                                            if(window.confirm("Voulez-vous retirer le produit suivant? : "+item.product.name)) {
                                                deleteShoppingCartItem(item.product.id);
                                                setLoading(true);
                                            }
                                        }
                                    }>
                                        <i className="fa fa-times"></i>
                                    </button>
                                </td>
                                <td><Link href={`/product/${item.product.id}`}>{item.product.name}</Link></td>
                                <td>{formatPrice(item.product["price"])}</td>
                                <td>
                                    <div className="row">
                                    <div className="col">
                                        <button className="remove-quantity-button" title="Retirer" disabled={item.quantity <= 1 ? "disabled" : ""} onClick={
                                            (e) => {
                                                setShoppingCartItemQuantity(item.product.id, item.quantity-1);
                                                setLoading(true);
                                            }
                                        }>
                                        <i className="fa fa-minus"></i>
                                        </button>
                                    </div>
                                    <div className="col quantity">{item.quantity}</div>
                                    <div className="col">
                                        <button className="add-quantity-button" title="Ajouter" onClick={
                                            (e) => {
                                                setShoppingCartItemQuantity(item.product.id, item.quantity+1);
                                                setLoading(true);
                                            }
                                        }>
                                        <i className="fa fa-plus"></i>
                                        </button>
                                    </div>
                                    </div>
                                </td>
                                <td className="price">{formatPrice(item.quantity * item.product.price)}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <p className="shopping-cart-total">Total: <strong id="total-amount"></strong></p>
                    <a className="btn pull-right" href="./order">Commander <i className="fa fa-angle-double-right"></i></a>
                    <button className="btn" id="remove-all-items-button" onClick={
                        (e) => {
                            if(window.confirm("Voulez-vous retirer tous les produits du panier?")) {
                                deleteShoppingCart();
                                setLoading(true);
                            }
                        }
                    }><i className="fa fa-trash-o"></i>&nbsp; Vider le panier</button>
                </div>
            </article>
        </main>
            <Footer/>
        </div>
    );
}

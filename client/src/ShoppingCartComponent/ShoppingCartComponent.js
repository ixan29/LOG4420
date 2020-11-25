import '../css/App.css';
import {Header} from "../_Common/Header.js"
import {Footer} from "../_Common/Footer.js"
import {Link} from "react-router-dom"
import { formatPrice } from "../utils.js"
export function ShoppingCartComponent() {
    document.title="OnlineShop - Panier";
    const ordersItems = [];
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
                        {ordersItems.map(item => 
                            <tr>
                                <td><button className="remove-item-button" title="Supprimer"><i className="fa fa-times"></i></button></td>
                                <td><Link href={`./product/${item.product.id}`}>{item.product.name}</Link></td>
                                <td>{formatPrice(item.product["price"])}</td>
                                <td>
                                    <div className="row">
                                    <div className="col"><button className="remove-quantity-button" title="Retirer" disabled={item.quantity <= 1 ? "disabled" : ""}>
                                    <i className="fa fa-minus"></i></button></div>
                                    <div className="col quantity">{item.quantity}</div>
                                    <div className="col"><button className="add-quantity-button" title="Ajouter"><i className="fa fa-plus"></i></button></div>
                                    </div>
                                </td>
                                <td className="price">{formatPrice(item.total)}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <p className="shopping-cart-total">Total: <strong id="total-amount"></strong></p>
                    <a className="btn pull-right" href="./order.html">Commander <i className="fa fa-angle-double-right"></i></a>
                    <button className="btn" id="remove-all-items-button"><i className="fa fa-trash-o"></i>&nbsp; Vider le panier</button>
                </div>
            </article>
        </main>
            <Footer/>
        </div>
    );
}

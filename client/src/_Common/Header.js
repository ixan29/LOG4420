import { Link } from "react-router-dom";
import logo from "../img/logo.svg";
import { useEffect, useState } from 'react';
import { getShoppingCartItems } from "../ShoppingCartComponent/ShoppingCartUtils";

export var reloadHeader = undefined;

function getCount(items)
{
    var count = 0;

    for(const item of items)
        count += item.quantity;

    return count;
}

export function Header(prop) {
  
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(true);
    
    reloadHeader = () => setLoading(true);

    useEffect( () => {
        if(loading)
        {
            getShoppingCartItems().then(res => {
                setCartCount(getCount(res));
                setLoading(false);
            });
        }
    });
    const currentActive = prop.currentActive;
    return (
        <header>
            <div className="header-container">
            <div className="logo">
                <Link to="/">
                    <img alt="logo" src={logo} title="Accueil"/>
                </Link>
            </div>
            <nav>
                <ul>
                    <li className={currentActive==="home" ? "active" : ""}><Link to="/">Accueil</Link></li>
                    <li className={currentActive==="product" ? "active" : ""}><Link to="/products">Produits</Link></li>
                    <li className={currentActive==="contact" ? "active" : ""}><Link to="/contact">Contact</Link></li>
                    <li>
                        <Link className="shopping-cart" to="/shopping-cart" title="Panier">
                            <span className="fa-stack fa-lg">
                                <i className="fa fa-circle fa-stack-2x fa-inverse"></i>
                                <i className="fa fa-shopping-cart fa-stack-1x"></i>
                            </span>
                            <span
                                className="count"
                                style={{display: (cartCount>0 ? "block" : "none")}}
                            >{cartCount}</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            </div>
        </header>
    );
}

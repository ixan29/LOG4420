import { Link } from "react-router-dom";
import logo from "../img/logo.svg";
export function Header(prop) {
  
    const cartCount = 3;
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
                            <span className="count">{cartCount}</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            </div>
        </header>
    );
}

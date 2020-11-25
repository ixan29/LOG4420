import '../css/App.css';
import home from "../img/home.png";
import {Header} from "../_Common/Header.js"
import {Footer} from "../_Common/Footer.js"
import {Link} from "react-router-dom"

export function HomeComponent() {
    document.title="OnlineShop - Accueil";
    return (
        <div>
            <Header currentActive="home"/>
            <main>
                <article>
                    <img alt="home" src={home} id="home-img"/>
                    <h1>Le site n&deg;1 pour les achats en ligne!</h1>
                    <p>Découvrez nos différents produits au meilleur prix.</p>
                    <Link className="btn" to="/products">En savoir plus <i className="fa fa-angle-double-right"></i></Link>
                </article>
            </main>
            <Footer/>
        </div>
    );
}

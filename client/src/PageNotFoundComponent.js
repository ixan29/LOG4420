
import './css/App.css';
import home from "./img/home.png";
import {Header} from "./_Common/Header.js"
import {Footer} from "./_Common/Footer.js"
import {Link} from "react-router-dom"

export function PageNotFoundComponent() {
    document.title="OnlineShop - 404";
    return (
        <div>
            <Header/>
            <main>
                <article>
                    <img alt="home" src={home} id="home-img"/>
                    <h1>Erreur, cette page n'existe pas</h1>
                    <Link className="btn" to="/">retourner à l'accueil <i className="fa fa-angle-double-right"></i></Link>
                </article>
            </main>
            <Footer/>
        </div>
    );
}

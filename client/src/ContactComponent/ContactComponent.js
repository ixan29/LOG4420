
import '../css/App.css';
import {Header} from "../_Common/Header.js"
import {Footer} from "../_Common/Footer.js"

export function ContactComponent() {
    document.title="OnlineShop - Accueil";
    return (
        <div>
            <Header currentActive="contact"/>
            <main>
                <article>
                <h1>Contact</h1>
                <p>Si vous souhaitez contacter <em>OnlineShop</em>, veuillez utiliser les coordonnées suivantes.</p>
                <section className="row contact-info" aria-label="Informations de contact">
                    <div className="col">
                        <i className="fa fa-mobile fa-5x"></i><br/>
                        <a href="tel:5143404711">(514) 340-4711</a>
                    </div>
                    <div className="col">
                        <i className="fa fa-map-marker fa-5x"></i>
                        <p className="address">
                        2900, boul. Édouard-Montpetit<br/>
                        Montréal (Québec)<br/>
                        H3T 1J4
                        </p>
                    </div>
                    <div className="col">
                        <i className="fa fa-envelope fa-5x"></i><br/>
                        <a href="mailto:onlineshop@polymtl.ca">onlineshop@polymtl.ca</a>
                    </div>
                </section>
                </article>
            </main>
            <Footer/>
        </div>
    );
}

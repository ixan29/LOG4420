
import './css/App.css';
import './css/style.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { ConfirmationComponent } from "./ConfirmationComponent/ConfirmationComponent.js"
import { HomeComponent } from "./HomeComponent/HomeComponent.js"
import { ContactComponent } from "./ContactComponent/ContactComponent.js"
import { PageNotFoundComponent } from "./PageNotFoundComponent.js";
import { ProductComponent } from './ProductComponent/ProductComponent';
import { ProductsComponent } from "./ProductsComponent/ProductsComponent";
import { ShoppingCartComponent } from './ShoppingCartComponent/ShoppingCartComponent';
import { OrderComponent } from './OrderComponent/OrderComponent';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/"> <HomeComponent /> </Route>
        <Route path="/confirmation"> <ConfirmationComponent /> </Route>
        <Route path="/contact"> <ContactComponent/> </Route>
        <Route path="/products"> <ProductsComponent/> </Route>
        <Route path="/product/:id"> <ProductComponent/> </Route>
        <Route path="/shopping-cart"> <ShoppingCartComponent/></Route>
        <Route path="/order"><OrderComponent/></Route>
        <Route> <PageNotFoundComponent/> </Route>
      </Switch>
    </Router>
  );
}

export default App;

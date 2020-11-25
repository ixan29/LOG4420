
import {Link} from "react-router-dom"
import { formatPrice } from "../utils.js";
import { imageMap } from "./ProductImageLoader.js";

export function SingleProductPart(props) {
    const product = props.productData;
    if(!product) throw new Error("singleProductPart need productData attribute")
    return (
        <div className="product" data-product-id={product.id}>
            <Link to={`/product/${product.id}`} title="En savoir plus...">
            <h2>{product.name}</h2>
            <img alt="product" src={imageMap[product.image]}/>
            <p className="price"><small>Prix</small> {formatPrice(product.price)}</p>
            </Link>
        </div>
    );
}

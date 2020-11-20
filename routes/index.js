const express = require("express");
const router = express.Router();
const HttpStatus = require('http-status-codes');
const { OrderSchema } = require("../lib/db");

const db = require("../lib/db");

function getType(obj)
{
    switch(typeof obj)
    {
        case 'function': return getType(obj());
        case 'object':
        if(Array.isArray(obj))
            return getType(obj[0]) + "[]";
        else
            return obj.type ? getType(obj.type) : 'object';

        default: return typeof obj;
    }
}

function checkModel(model, obj, errorMessage, parentContext="")
{
    var missing = "";

    for(const attrName in model)
    {
        const modelAttr = model[attrName];
        const objAttr = obj[attrName];

        const modelType = getType(modelAttr);
        const objType = getType(objAttr);

        if(Array.isArray(modelAttr))
        {
            if(objAttr === undefined)
                missing += `    Missing attribute ${parentContext}${attrName}. It must be an array\n`;
            else
            if(!Array.isArray(objAttr))
                missing += `    wrong type for ${parentContext}${attrName}. It must be an array\n`;  
            else
            for(var i=0 ; i<modelAttr.length ; i++)
            {
                const newContext = `${parentContext}${attrName}[${i}].`;
                missing += checkModel(modelAttr[i], objAttr[i], errorMessage, newContext);
            }
        }
        else
        if(modelAttr === "object")
        {
            if(objAttr === undefined)
                missing += `    Missing attribute ${parentContext}${attrName}. It must be an object\n`;
            else
            if(!Array.isArray(objAttr))
                missing += `    wrong type for ${parentContext}${attrName}. It must be an object\n`;  
            else
            {
                const newContext = `${parentContext}${attrName}.`;
                missing += checkModel(modelAttr, objAttr, errorMessage, newContext);
            }
        }
        else
        {

            if(objAttr === undefined)
                missing += `    Missing attribute ${parentContext}${attrName}. It must be a ${modelType}\n`;
            else
            if(objType !== modelType)
                missing += `    wrong type for ${parentContext}${attrName}. It must be a ${modelType}\n`;   
        }
    }

    if(parentContext === "")
        if(missing.length > 0)
            throw new db.RequestError(
                HttpStatus.BAD_REQUEST,
                errorMessage + '\n' + missing
            );

    return missing;
}

function checkString(string, errorMessage)
{
    if( typeof(string) !== "string"
    ||  string === "")
        throw new db.RequestError(
            HttpStatus.BAD_REQUEST,
            errorMessage
        );
}

function checkEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if(!re.test(String(email).toLowerCase()))
        throw new db.RequestError(
            HttpStatus.BAD_REQUEST,
            "L'adresse couriel est invalide!"
        );
}

function checkPhone(phone) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    
    if(!re.test(phone))
        throw new db.RequestError(
            HttpStatus.BAD_REQUEST,
            "Le numéro de téléphone est invalide!"
        );
}

function sendError(res, err)
{
  if(err.httpStatus)
  {
    res
    .status(err.httpStatus)
    .send(err.what);
  }
  else
  {
    res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .send(err);
  }
}

router.get("/", (req, res) => {
    res.redirect("/accueil");
});

router.get("/accueil", (req, res) => {
    res.render("pages/index");
});

router.get("/produits", async (req, res) => {

    const products = await db.getProducts();

    res.render(
        "pages/products",
        {
            products
        }
    );
});

router.get("/produits/:id", async (req, res) => {

    try
    {
        const id = Number.parseInt(req.params.id);
        const product = await db.getProduct(id);
        res.render(
            "pages/product",
            {
                product
            }
        );
    }
    catch(err)
    {
        res.render("pages/productNotFound", {});
    }
});

router.get("/contact", (req, res) => {
    res.render("pages/contact");
});

function initShoppingCart(session)
{
    if(!Array.isArray(session.shoppingCart))
        session.shoppingCart = [];
}

router.get("/panier", async (req, res) => {

    initShoppingCart(req.session);
    const cart = req.session.shoppingCart;

    const products = await db.getProducts(undefined, getSortPolicy('alpha-asc'));

    for(const product of products)
    {
        for(const shop of cart)
            if(product.id === shop.productId)
             product.quantity = shop.quantity;
    }

    const shoppingCart = products.filter(product => product.quantity !== undefined);

    res.render(
        "pages/shopping-cart",
        {
            shoppingCart
        }
    );
});

router.get("/commande", (req, res) => {
    res.render("pages/order");
});

router.post("/confirmation", (req, res) => {

    let order = req.session.lastOrder;

    if(order == undefined)
        order = {
            firstName: "John",
            lastName: "Smith",
            id: 1234
        };

    res.render(
        "pages/confirmation",
        {
            order
        }
    );
});


//api
router.get("/api/session", async (req, res) => {
    res.send(req.session);
});

router.get("/api/products", async (req, res) => {
    try
    {
        const category = req.query.category;
        const criteria = req.query.criteria;

        checkCategory(category);
        const sortPolicy = getSortPolicy(criteria);

        const result = await db.getProducts(category, sortPolicy);

        res
        .status(HttpStatus.OK)
        .json(result);
    }
    catch(err)
    {
        sendError(res, err);
    }
});

router.get("/api/products/:id", async (req, res) => {

    try
    {
        const id = Number.parseInt(req.params.id);
        const result = await db.getProduct(id);

        res
        .status(HttpStatus.OK)
        .json(result);
    }
    catch(err)
    {
        sendError(res, err);
    };
});

router.post("/api/products", async (req, res) => {

    try
    {
        const product = req.body;
        checkModel(db.ProductSchema.obj, product, "the request product body is invalid");
        
        checkString(product.name, "The name is invalid");
        checkString(product.image, "The image is invalid");
        checkCategory(product.category);
        checkString(product.description, "The description is invalid");

        if(!Array.isArray(product.features))
            throw new db.RequestError(
                HttpStatus.BAD_REQUEST,
                "The features must be an array of strings"
            );

        for(const feature of product.features)
            checkString(feature, "The following element in the features attribute is invalid: "+feature);

        await db.postProduct(product);

        res
        .status(HttpStatus.CREATED)
        .send();
    }
    catch(err)
    {
        sendError(res, err);
    };
});

router.delete("/api/products/:id", async (req, res) => {

    try
    {
        const id = Number.parseInt(req.params.id);
        await db.deleteProduct(id);

        res
        .status(HttpStatus.NO_CONTENT)
        .send();
    }
    catch(err)
    {
        sendError(res, err);
    };
});

router.delete("/api/products/", async (req, res) => {

    try
    {
        await db.deleteProducts();

        res
        .status(HttpStatus.NO_CONTENT)
        .send();
    }
    catch(err)
    {
        sendError(res, err);
    };
});

function checkCategory(category)
{
  switch(category)
  {
    case undefined:
    case "cameras":
    case "computers":
    case "consoles":
    case "screens":
      return;

    default: throw new db.RequestError(
      HttpStatus.BAD_REQUEST,
      "Error: Category "+category+" is invalid"
    );
  }
}

function getSortPolicy(sort)
{
  switch(sort)
  {
    case undefined:
    case 'price-asc': return {price: 1};
    case 'price-dsc': return {price: -1};
    case 'alpha-asc': return {name: 1};
    case 'alpha-dsc': return {name: -1};

    default: throw new db.RequestError(
      HttpStatus.BAD_REQUEST,
      "Error: Sort "+sort+" is invalid"
    );
  }
}

function findShoppingCartProduct(shoppingCart, productId)
{
    for(const shop of shoppingCart)
        if(shop.productId === productId)
            return shop;

    return undefined;
}

router.get("/api/shopping-cart/", async (req, res) => {

    try
    {
        initShoppingCart(req.session);

        res
        .status(HttpStatus.OK)
        .json(req.session.shoppingCart);
    }
    catch(err)
    {
        sendError(res, err);
    };
});

router.get("/api/shopping-cart/:productId", async (req, res) => {

    try
    {
        initShoppingCart(req.session);
        const id = Number.parseInt(req.params.productId);

        const result = findShoppingCartProduct(req.session.shoppingCart, id);

        if(result === undefined)
            throw new db.RequestError(
                HttpStatus.NOT_FOUND,
                "the shopping cart product with id "+id+" was not found"
            );

        res
        .status(HttpStatus.OK)
        .json(result);
    }
    catch(err)
    {
        sendError(res, err);
    };
});

const shoppingCartSchema = {
    productId: Number,
    quantity: Number
};

router.post("/api/shopping-cart", async (req, res) => {

    try
    {
        initShoppingCart(req.session);

        const product = req.body;
        console.log(JSON.stringify(product));
        checkModel(shoppingCartSchema, product, "the request shopping cart product body is invalid");

        await db.checkProductExists(product.productId, HttpStatus.BAD_REQUEST);

        if(findShoppingCartProduct(req.session.shoppingCart, product.productId))
            throw new db.RequestError(
                HttpStatus.BAD_REQUEST,
                "The product with id "+product.productId+" already exists in the shopping cart"
            );

        req.session.shoppingCart.push(product);

        res
        .status(HttpStatus.CREATED)
        .send("The product has been added");
    }
    catch(err)
    {
        console.log(JSON.stringify(err));
        sendError(res, err);
    }
});

router.put("/api/shopping-cart/:productId", async (req, res) => {

    try
    {
        initShoppingCart(req.session);

        const productId = Number.parseInt(req.params.productId);
        const quantity = Number.parseInt(req.body.quantity);

        if(Number.isNaN(quantity)
        || quantity <= 0)
            throw new db.RequestError(
                HttpStatus.BAD_REQUEST,
                "The quantity attribute of the body must be a positive integer"
            );

        for(const shop of req.session.shoppingCart)
            if(shop.productId === productId)
            {
                shop.quantity = quantity;

                res
                .status(HttpStatus.NO_CONTENT)
                .send();
                return;
            }

        throw new db.RequestError(
            HttpStatus.NOT_FOUND,
            "The product with id "+productId+" was not found in the shopping cart"
        );
    }
    catch(err)
    {
        sendError(res, err);
    }
});

router.delete("/api/shopping-cart/:productId", async (req, res) => {

    try
    {
        initShoppingCart(req.session);

        const productId = Number.parseInt(req.params.productId);

        if(findShoppingCartProduct(req.session.shoppingCart, productId) === undefined)
            throw new db.RequestError(
                HttpStatus.NOT_FOUND,
                "The product with id "+productId+" was not found"
            );

        //await db.deleteShoppingCartProduct(productId);

        req.session.shoppingCart = req.session.shoppingCart.filter(elem => elem.productId != productId);

        res
        .status(HttpStatus.NO_CONTENT)
        .send();
    }
    catch(err)
    {
        sendError(res, err);
    }
});

router.delete("/api/shopping-cart", async (req, res) => {

    try
    {
        req.session.shoppingCart = [];
        //await db.deleteShoppingCart();

        res
        .status(HttpStatus.NO_CONTENT)
        .send();
    }
    catch(err)
    {
        sendError(res, err);
    }
});

router.get("/api/orders", async (req, res) => {

    try
    {
        const orders = await db.getOrders();

        res
        .status(HttpStatus.OK)
        .send(orders);
    }
    catch(err)
    {
        sendError(res, err);
    }
});

router.get("/api/orders/:id", async (req, res) => {

    try
    {
        const id = Number.parseInt(req.params.id);

        const order = await db.getOrder(id);

        res
        .status(HttpStatus.OK)
        .send(order);
    }
    catch(err)
    {
        sendError(res, err);
    }
});

router.post("/api/orders", async (req, res) => {

    try
    {
        const order = req.body;
        checkModel(OrderSchema.obj, order, "the request order body is invalid");
        await db.postOrder(order);

        checkString(order.firstName, "Le prénom est invalide");
        checkString(order.lastName, "Le nom de famille est invalide");
        checkEmail(order.email);
        checkPhone(order.phone);
        req.session.lastOrder = order;

        res
        .status(HttpStatus.CREATED)
        .send("");
    }
    catch(err)
    {
        sendError(res, err);
    }
});

router.delete("/api/orders/:id", async (req, res) => {

    try
    {
        const id = Number.parseInt(req.params.id);

        const order = await db.deleteOrder(id);

        res
        .status(HttpStatus.NO_CONTENT)
        .send(order);
    }
    catch(err)
    {
        sendError(res, err);
    }
});

router.delete("/api/orders/", async (req, res) => {

    try
    {
        const order = await db.deleteOrders();

        res
        .status(HttpStatus.NO_CONTENT)
        .send(order);
    }
    catch(err)
    {
        sendError(res, err);
    }
});

module.exports = router;

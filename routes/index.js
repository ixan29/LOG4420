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

router.get("/produits", (req, res) => {
    res.render("pages/products");
});

router.get("/produits/:id", (req, res) => {
    const id = req.query.id;
    res.render("pages/products/"+id);
});

router.get("/contact", (req, res) => {
    res.render("pages/contact");
});

router.get("/panier", (req, res) => {
    res.render("pages/shopping-cart");
});

router.get("/commande", (req, res) => {
    res.render("pages/order");
});

router.get("/confirmation", (req, res) => {
    res.render("pages/confirmation");
});


//api
router.get("/api/products", async (req, res) => {
    try
    {
        const category = req.body.category;
        const criteria = req.body.criteria;

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
    case 'price-desc': return {price: -1};
    case 'alpha-asc': return {name: 1};
    case 'alpha-desc': return {name: -1};

    default: throw new db.RequestError(
      HttpStatus.BAD_REQUEST,
      "Error: Sort "+sort+" is invalid"
    );
  }
}

router.get("/api/shopping-cart/", async (req, res) => {

    try
    {
        const result = await db.getShoppingCart();

        res
        .status(HttpStatus.OK)
        .json(result);
    }
    catch(err)
    {
        sendError(res, err);
    };
});

router.get("/api/shopping-cart/:productId", async (req, res) => {

    try
    {
        const id = Number.parseInt(req.params.productId);
        const result = await db.getShoppingCartProduct(id);

        res
        .status(HttpStatus.OK)
        .json(result);
    }
    catch(err)
    {
        sendError(res, err);
    };
});

router.post("/api/shopping-cart", async (req, res) => {

    try
    {
        const product = req.body;
        checkModel(db.ShoppingCartSchema.obj, product, "the request shopping cart product body is invalid");
        await db.postShoppingCartProduct(product);
        
        res
        .status(HttpStatus.CREATED)
        .send();
    }
    catch(err)
    {
        sendError(res, err);
    }
});

router.put("/api/shopping-cart/:productId", async (req, res) => {

    try
    {
        const productId = Number.parseInt(req.params.productId);
        const quantity = Number.parseInt(req.body.quantity);

        if(Number.isNaN(quantity))
            throw {
                httpStatus: HttpStatus.BAD_REQUEST,
                what: "The quantity attribute of the body must be a positive integer"
            }

        await db.putShoppingCartProduct(productId, quantity);
        
        res
        .status(HttpStatus.NO_CONTENT)
        .send();
    }
    catch(err)
    {
        sendError(res, err);
    }
});

router.delete("/api/shopping-cart/:productId", async (req, res) => {

    try
    {
        const productId = Number.parseInt(req.params.productId);
        await db.deleteShoppingCartProduct(productId);

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
        await db.deleteShoppingCart();

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

var express = require('express');
let bodyParser = require("body-parser");
let cors = require("cors");

let app = express();
app.use(cors());
let urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());

app.use(express.static('./'));

var fs = require('fs');
var products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));

app.get('/getProducts', function (req, res) {
   res.json(products);
});

app.get('/getProduct', function (req, res) {

   if(req.query.id == undefined)
   {
      res.json({
         "err": "The url must specify the id as a query parameter (ex: getProduct?id=1)"
      });

      return;
   }

   let id = parseInt(req.query.id);

   for(var idx=0; idx<products.length ; idx++)
   {
      if(products[idx].id === id)
      {
         res.json(products[idx]);
         return;
      }
   }

   res.json({
      "err": "no product was found with the following id: " + id
   });
});

/*
let shoppingCart = [];

app.get('/getShoppingCart', function(req, res) {
   res.json(shoppingCart);
});

app.post('/emptyShoppingCart', function(req, res) {
   shoppingCart = [];
   res.json({
      log: "the shopping cart has been emptied"
   });
});

app.post('/setShoppingCartProductQuantity', urlencodedParser, function(req, res) {

   if(!Number.isInteger(req.body.id))
   {
      res.json({
         err: "Error at setProductQuantity: the request json body must have an id attribute that has an integer value"
      });
      return;
   }


   if(!Number.isInteger(req.body.quantity))
   {
      res.json({
         err: "Error at setProductQuantity: the request json body must have a quantity attribute that has an integer value"
      });
      return;
   }

   var id = Number.parseInt(req.body.id);
   var quantity = Number.parseInt(req.body.quantity);

   (function()
   {
      for(var idx=0 ; idx<shoppingCart.length ; idx++)
      {
         if(shoppingCart[idx].id === id)
         {
            shoppingCart[idx].quantity = quantity;
            return;
         }
      }

      shoppingCart.push({
         id,
         quantity
      });
   })();

   shoppingCart = shoppingCart.filter(function(productQt) {
      return productQt.quantity > 0;
   });

   res.send("updated");
});
*/

app.listen(8000, function () {
   console.log("Le serveur est demarre");
});
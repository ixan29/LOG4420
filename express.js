/*
Code pour le serveur
*/

//initialiser les variables requises
var express = require('express');
let bodyParser = require("body-parser");
let cors = require("cors");

let app = express();
app.use(cors());
let urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());

//Permet d'acceder a n'importe quel fichier qui se trouve dans la meme destination
//que le fichier express.js, notamment les html, les js, le css et les images.
//Cest pas super securitaire mais ca fait le boulot temporairement
app.use(express.static('./'));

//Recueillir les produits contenus dans le fichier products.json
var fs = require('fs');
var products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));

//Requete pour obtenir tous les produits
app.get('/getProducts', function (req, res) {
   res.json(products);
});

//Requete pour obtenir 1 produit en fonction du id ecrit dans le query
app.get('/getProduct', function (req, res) {

   //Si l'id n'existe pas dans le query, envoyer un message d'erreur
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

//Demarrer le serveur
app.listen(8000, function () {
   console.log("Le serveur est demarre");
});
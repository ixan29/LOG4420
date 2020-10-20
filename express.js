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

//Demarrer le serveur
app.listen(8000, function () {
   console.log("Le serveur est demarre");
});
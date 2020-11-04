"use strict";
const HttpStatus = require('http-status-codes');
const mongoose = require("mongoose");
const Products = require('../tests/e2e/1-products');
const Schema = mongoose.Schema;

function RequestError(httpStatus, what) {
  this.httpStatus = httpStatus;
  this.what = what;
}

const ProductSchema = new Schema({
  id: { type: Number, unique: true },
  name: String,
  price: Number,
  image: String,
  category: String,
  description: String,
  features: [String]
}, { versionKey: false });

const ShoppingCartSchema = new Schema({
  productId: { type: Number, unique: true },
  quantity: Number
}, { versionKey: false });

const ShoppingOrderSchema = new Schema({
  id: Number,
  quantity: Number
}, { versionKey: false });

const OrderSchema = new Schema({
  id: { type: Number, unique: true },
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  products: [ShoppingOrderSchema.obj]
}, { versionKey: false });

var orders = mongoose.model("orders", OrderSchema);
var products = mongoose.model("products", ProductSchema);
var shoppingCart = mongoose.model("shoppingCart", ShoppingCartSchema);

mongoose.Promise = global.Promise;

const uri = "mongodb+srv://Ivanmolod:mvanko2901@cluster0.43aaa.mongodb.net/TP-db?retryWrites=true&w=majority";

mongoose
.connect(uri)
.then( () => {
  console.log("connected to database");
})
.catch(err => {
    throw err;
});

async function getProducts(category, sortPolicy)
{
  return await products
  .find(category ? {name: category} : {})
  .sort(sortPolicy);
}

async function checkProductExists(id)
{
  if(!await products.exists({id}))
    throw new RequestError(
      HttpStatus.NOT_FOUND,
      "Product with id "+id+" was not found"
    );
}

async function getProduct(id)
{
  await checkProductExists(id);
  return await products.findOne({id});
}

const MONGO_DUPLICATE_ERROR = 11000;

async function postProduct(product)
{ 
  try
  {
    return await products.create(product);
  }
  catch(err)
  {
    if(err.code === MONGO_DUPLICATE_ERROR)
      throw new RequestError(
        HttpStatus.BAD_REQUEST,
        "A product with the id "+product.id+" already exists"
      );

    throw err;
  };
}

async function deleteProduct(id)
{
  await checkProductExists(id);
  return await products.deleteOne({id});
}

async function deleteProducts()
{
  return await products.deleteMany({});
}


async function getShoppingCart()
{
  return await shoppingCart.find({});
}

async function checkShopppingCartProductExists(productId)
{
  if(!await shoppingCart.exists({productId}))
    throw new RequestError(
      HttpStatus.NOT_FOUND,
      "The product with id "+productId+" was not found in the shopping cart"
    );
}

async function getShoppingCartProduct(productId)
{
  await checkShopppingCartProductExists(productId);
  return await shoppingCart.findOne({productId});
}

async function postShoppingCartProduct(product)
{
  await checkProductExists(product);

  if( product.quantity <= 0
  || !Number.isInteger(product.quantity))
    throw new RequestError(
      HttpStatus.BAD_REQUEST,
      "The shopping cart product quantity must be a strictly positive integer"
    );

  try
  {
    return await shoppingCart.create(product);
  }
  catch(err)
  {
    if(err.code === MONGO_DUPLICATE_ERROR)
      throw new RequestError(
        HttpStatus.BAD_REQUEST,
        "The product with id "+product.productId+" already exists in the shopping cart. You must use the put request (api/shopping-cart/:productId) to update the quantity"
      );

    throw err;
  };
}

async function putShoppingCartProduct(productId, quantity)
{
  checkShopppingCartProductExists(productId);

  const doc = await shoppingCart.findOne({productId});

  if(quantity <= 0
  || !Number.isInteger(quantity))
      throw new RequestError(
        HttpStatus.BAD_REQUEST,
        "The shopping cart product quantity must be a strictly positive integer"
      );

  doc.quantity = quantity;
  doc.save();

  return "";
}

async function deleteShoppingCartProduct(productId)
{
  await checkShopppingCartProductExists(productId);
  return await shoppingCart.deleteOne({productId});
}

async function deleteShoppingCart()
{
  return await shoppingCart.deleteMany({});
}

async function getOrders()
{
  return await orders.find({});
}

async function checkOrderExists(id)
{
  if(!await orders.exists({id}))
    throw new RequestError(
      HttpStatus.NOT_FOUND,
      "Order with id "+id+" was not found"
    );
}

async function getOrder(id)
{
  await checkOrderExists(id);
  return await orders.findOne({id});
}

async function postOrder(order)
{
  if(order.products.length == 0)
  throw new RequestError(
    HttpStatus.BAD_REQUEST,
    "It is forbidden for an order to have zero products"
  );

  for(const product of order.products)
  {
    const id = product.id;

    if(!await products.exists({id}))
    throw new RequestError(
      HttpStatus.BAD_REQUEST,
      "Product with id "+id+" added in the order was not found in the products database"
    );

    if(product.quantity <= 0)
      throw new RequestError(
        HttpStatus.BAD_REQUEST,
        "The order product with id "+order.id+" must have a strictly positive integer quantity"
      );
  }

  try
  {
    return await orders.create(order);
  }
  catch(err)
  {
    if(err.code === MONGO_DUPLICATE_ERROR)
      throw new RequestError(
        HttpStatus.BAD_REQUEST,
        "The order with id "+order.id+" already exists"
      );

    throw err;
  };
}

async function deleteOrder(id)
{
  await checkOrderExists(id);
  await orders.deleteOne({id});
}

async function deleteOrders()
{
  await orders.deleteMany({});
}

module.exports = {
  RequestError,

  OrderSchema,
  ProductSchema,
  ShoppingCartSchema,

  getProducts,
  getProduct,
  postProduct,
  deleteProduct,
  deleteProducts,

  getShoppingCart,
  getShoppingCartProduct,
  postShoppingCartProduct,
  putShoppingCartProduct,
  deleteShoppingCartProduct,
  deleteShoppingCart,

  getOrders,
  getOrder,
  postOrder,
  deleteOrder,
  deleteOrders
}
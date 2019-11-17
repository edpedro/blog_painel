const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

//Controller
const CategoriesController = require("./categories/CategoriesController");
const ArticlesController = require("./articles/ArticlesController");

//Model
const Article = require("./articles/Article");
const Category = require("./categories/Category");

//View engine
app.set("view engine", "ejs");

//Arquivo static
app.use(express.static("public"));

//Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Database
connection
  .authenticate()
  .then(() => {
    console.log("Conectado");
  })
  .catch(error => {
    console.log(error);
  });

//Rotas
app.use("/", CategoriesController);
app.use("/", ArticlesController);

app.get("/", (req, res) => {
  Article.findAll().then(articles =>{
    res.render("index", {articles: articles});
  })  
});

//Conexão maquina
app.listen(8080, () => {
  console.log("Sevidor ON");
});

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

//Controller
const CategoriesController = require("./categories/CategoriesController");
const ArticlesController = require("./articles/ArticlesController");
const UsersController = require("./users/UsersController")

//Model
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User")

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
app.use("/", UsersController)

app.get("/", (req, res) => {
  Article.findAll({
    order:[
      ['id', 'DESC']
    ],
    limit: 4
  }).then(articles =>{
    Category.findAll().then(categories =>{
      res.render("index", {articles: articles, categories: categories});
    })    
  })  
});

app.get("/:slug", (req, res) =>{
  var slug = req.params.slug
  Article.findOne({
    where: {
      slug: slug
    }
  }).then(article =>{
    if(article != undefined){
      Category.findAll().then(categories =>{
        res.render("article", {article: article, categories: categories});
      })      
    }else{
      res.redirect("/")
    }
  }).catch(err =>{
    res.redirect("/")
  })
})

app.get("/category/:slug", (req, res) =>{
  var slug = req.params.slug
  Category.findOne({
    where:{
      slug: slug
    },
    include: [{model: Article}]
  }).then(category =>{
    if(category != undefined){

      Category.findAll().then(categories => {
        res.render("index", {articles: category.articles, categories: categories})
      })
    }else{
      res.redirect("/")
    }
  }).catch(err =>{
    res.redirect("/")
  })
})

//Conexão maquina
app.listen(8080, () => {
  console.log("Sevidor ON");
});

const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Articles = require("./Article")
const Slugify = require("slugify")

router.get("/admin/articles", (req, res) => {
  Articles.findAll({
    include: [{model: Category}]
  }).then(articles =>{
    res.render("admin/articles/index", {articles: articles})

  })
})
router.get("/admin/articles/new", (req, res) => {
  Category.findAll().then(categories => {
    res.render("admin/articles/new", { categories: categories });
  });
});
router.post("/articles/save", (req, res) =>{
  var title = req.body.title;
  var body = req.body.body;
  var category = req.body.category

  Articles.create({
    title: title,
    slug: Slugify(title),
    body: body,
    categoryId: category
  }).then(()=>{
    res.redirect("/admin/articles")
  })
})
//Deleta artigos
router.post("/articles/delete", (req, res) => {
  var id = req.body.id;
  if (id != undefined) {
    if (!isNaN(id)) {
      Articles.destroy({
        where: {
          id: id
        }
      }).then(() => {
        res.redirect("/admin/articles");
      });
    } else {
      res.redirect("/admin/articles");
    }
  } else {
    res.redirect("/admin/articles");
  }
});
//Editar
router.get("/admin/articles/edit/:id", (req, res) =>{
  var id = req.params.id;
  if(isNaN(id)){
    res.redirect("/admin/articles")
  }
  Articles.findByPk(id).then(article =>{
    if(article != undefined){
      Category.findAll().then(categories => {
        res.render("admin/articles/edit", {
          article: article,
          categories: categories

        });
      });
      
    }else{
      res.redirect("/admin/articles")
    }
    }).catch(erro => {
      res.redirect("/admin/articles");
  });
})
//Update
router.post("/articles/update", (req, res) => {
  var id = req.body.id;
  var title = req.body.title;
  var body = req.body.body;
  var category = req.body.category

  Articles.update({
      title: title, 
      body: body,
      categoryId: category
     },
    {
      where: {
        id: id
      }
    }
  ).then(() => {
    res.redirect("/admin/articles");
  });
});
module.exports = router;

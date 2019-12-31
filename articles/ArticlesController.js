const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Articles = require("./Article")
const Slugify = require("slugify")
const moment = require("moment");
const adminAuth = require("../middleware/adminAuth")
const { check, validationResult } = require("express-validator")

router.get("/admin/articles", adminAuth, (req, res) => {
  Articles.findAll({
    include: [{ model: Category }],
    order:[
      ['id', 'DESC']
    ],
  }).then(articles => {
    res.render("admin/articles/index", { articles: articles, msg: req.flash('msg') })

  })
})
router.get("/admin/articles/new", adminAuth, (req, res) => {
  Category.findAll().then(categories => {
    res.render("admin/articles/new", { categories: categories, username: req.session.user, erros:{} });
  });
});
router.post("/articles/save", adminAuth, [
  //Validação
  check('title', "Favor preencher o campo").not().isEmpty(),
  check('body', "Favor inserir texto maior de 20 caracteres").isLength({ min: 20 }),
  check('subTitle', "Favor preencher o campo").not().isEmpty()


], (req, res) => {

  const erros = validationResult(req)
  //Tratamento de erro
  if (!erros.isEmpty()) {
    Category.findAll().then(categories => {
     res.render("admin/articles/new", { erros: erros.mapped(), msg: '', categories:categories, username: req.session.user })
    })
  } else {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category
    var subTitle = req.body.subTitle
    var userName = req.body.userName


    Articles.create({
      title: title,
      slug: Slugify(title),
      body: body,
      subTitle: subTitle,
      categoryId: category,
      userName: userName
    }).then(() => {
      req.flash('msg', 'Artigo criado com sucesso')
      res.redirect("/admin/articles")
    })
  }
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
router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
  var id = req.params.id;
  if (isNaN(id)) {
    res.redirect("/admin/articles")
  }
  Articles.findByPk(id).then(article => {
    if (article != undefined) {
      Category.findAll().then(categories => {
        res.render("admin/articles/edit", {
          article: article,
          categories: categories

        });
      });

    } else {
      res.redirect("/admin/articles")
    }
  }).catch(erro => {
    res.redirect("/admin/articles");
  });
})
//Update
router.post("/articles/update", adminAuth, (req, res) => {
  var id = req.body.id;
  var title = req.body.title;
  var body = req.body.body;
  var category = req.body.category

  Articles.update({
    title: title,
    body: body,
    slug: Slugify(title),
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
//Paginação
router.get("/articles/page/:num", (req, res) => {
  var page = req.params.num
  var offset = 0

  if (isNaN(page) || page == 1) {
    offset = 0
  } else {
    offset = (parseInt(page) - 1) * 2
  }

  Articles.findAndCountAll({
    limit: 4,
    offset: offset,
    order: [
      ['id', 'DESC']
    ]
  }).then(articles => {
    var next;
    if (offset + 4 >= articles.count) {
      next = false
    } else {
      next = true
    }
    var result = {
      page: parseInt(page),
      next: next,
      articles: articles
    }
    //exibir variavel no navbar
    Category.findAll().then(categories => {
      res.render("admin/articles/page", { result: result, categories: categories, moment: moment })
    })
  })
})
module.exports = router;

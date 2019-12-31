const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");
const adminAuth = require("../middleware/adminAuth")
const { check, validationResult } = require("express-validator")

router.get("/admin/categories/new", adminAuth, (req, res) => {
  res.render("admin/categories/new", {erros: {}});
});

//Criar nova categoria
router.post("/categories/save", adminAuth, [
    //Validação
  check('title', "Favor preencher o campo").not().isEmpty()

], (req, res) => {

  const erros = validationResult(req)
  //Tratamento de erro
  if (!erros.isEmpty()) {
    res.render("admin/categories/new", { erros: erros.mapped(), msg: '' })
  } else {
    var title = req.body.title;
    if (title != undefined) {
      Category.create({
        title: title,
        slug: slugify(title)
      }).then(() => {
        req.flash('msg', 'Categoria criado com sucesso')
        res.redirect("/admin/categories");
      });
    } else {
      req.flash('msg', 'Erro, Favor preencher todos dados')
      res.redirect("admin/categories/new");
    }
  }
});
//Listagem de categoria
router.get("/admin/categories", adminAuth, (req, res) => {
  Category.findAll({
    order:[
      ['id', 'DESC']
    ],
  }).then(categories => {
    res.render("admin/categories/index", { categories: categories,  msg: req.flash('msg') });
  });
});

//Deleta categoria
router.post("/categories/delete", adminAuth, (req, res) => {
  var id = req.body.id;
  if (id != undefined) {
    if (!isNaN(id)) {
      Category.destroy({
        where: {
          id: id
        }
      }).then(() => {
        res.redirect("/admin/categories");
      });
    } else {
      res.redirect("/admin/categories");
    }
  } else {
    res.redirect("/admin/categories");
  }
});
//Editando categoria
router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
  var id = req.params.id;
  if (isNaN(id)) {
    res.redirect("/admin/categories");
  }
  Category.findByPk(id)
    .then(category => {
      if (category != undefined) {
        res.render("admin/categories/edit", {
          category: category
        });
      } else {
        res.redirect("/admin/categories");
      }
    })
    .catch(erro => {
      res.redirect("/admin/categories");
    });
});
//Atualizar categoria
router.post("/categories/update", adminAuth, (req, res) => {
  var id = req.body.id;
  var title = req.body.title;

  Category.update(
    { title: title, slug: slugify(title) },
    {
      where: {
        id: id
      }
    }
  ).then(() => {
    res.redirect("/admin/categories");
  });
});

module.exports = router;

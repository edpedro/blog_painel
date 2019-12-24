const express = require("express")
const router = express.Router()
const Category = require("../categories/Category")
const Article = require("../articles/Article")
const User = require('../users/User')
const messege = require("../contact/Contact")

router.get("/admin/panel", (req, res) => {
  Category.findAll().then(categories =>{
    var categoryCount = categories.length
    Article.findAll().then(articles =>{
      var articlesCount = articles.length
      User.findAll().then(users =>{   
        var usersCount = users.length
        messege.findAll().then(messeges =>{  
          var messegesCount = messeges.length 
          res.render("admin/index", {categoryCount, articlesCount, usersCount,  messegesCount, username: req.session.user});
        })
      })    
    })
    
  })
  
})


module.exports = router
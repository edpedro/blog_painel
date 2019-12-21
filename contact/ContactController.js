const express = require("express")
const router = express.Router()
const Category = require("../categories/Category");


router.get("/contact", (req, res) =>{
  Category.findAll().then(categories =>{    
    res.render("contact", {categories: categories});
  })   
})

module.exports = router
const express = require("express")
const router = express.Router()
const Category = require("../categories/Category");

router.get("/about", (req, res) =>{ 
  Category.findAll().then(categories =>{    
    res.render("admin/abouts/about", {categories: categories});
  })  
})


module.exports = router
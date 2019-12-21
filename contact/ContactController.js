const express = require("express")
const router = express.Router()
const Category = require("../categories/Category");
const Contact = require("./Contact")
const adminAuth = require("../middleware/adminAuth")


router.get("/contact", (req, res) =>{
  Category.findAll().then(categories =>{    
    res.render("admin/contacts/contact", {categories: categories});
  })   
})
router.get("/contact/index", (req, res) =>{
  Category.findAll().then(categories =>{    
    res.render("admin/contacts/index", {categories: categories});
  })   
})
router.post("/contact/save", (req, res) =>{
  var name = req.body.name
  var email = req.body.email
  var phone = req.body.phone
  var message = req.body.message

  Contact.create({
    name: name,
    email: email,
    phone: phone,
    message: message

  }).then(() =>{
    res.redirect("index")
  })
})
router.get("/admin/contact", adminAuth, (req, res) =>{
  Contact.findAll().then(contacts =>{
    res.render("admin/contacts/message", {contacts: contacts})
  })  
})

module.exports = router
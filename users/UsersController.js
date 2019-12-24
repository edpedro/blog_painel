const express = require("express")
const router = express.Router()
const User = require("./User")
const bcrypt = require('bcryptjs')
const adminAuth = require("../middleware/adminAuth")

router.get("/admin/users", adminAuth,(req, res) =>{
  User.findAll().then(users =>{
    res.render("admin/users/index", {users: users})
  })
})
router.get("/admin/users/create", (req, res) =>{
  res.render("admin/users/create")
})
router.post("/users/create", adminAuth, (req, res) =>{
  var email = req.body.email
  var password = req.body.password
  var name = req.body.name

  User.findOne({whre:{email: email}}).then(user =>{
    if(user.length > 0){   
      res.redirect("/admin/users/create")
    }else{      
      var salt = bcrypt.genSaltSync(10)
      var hash = bcrypt.hashSync(password, salt)
    
      User.create({
        email: email,
        password: hash,
        name:name
      }).then(() =>{
        res.redirect("/admin/panel")
      }).catch((error) =>{
        res.redirect("/")
      })
    }
  })
})
router.get("/login", (req, res) =>{
  res.render("admin/users/login")
})

router.post("/authenticate", (req, res) =>{
    var email = req.body.email
    var password = req.body.password
    var name = req.body.name

    User.findOne({where: {email: email}}).then(user =>{
      if(user != undefined){
        var correct = bcrypt.compareSync(password, user.password)
        if(correct){
          req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name
          }
          res.redirect("/admin/panel")
        }else{
          res.redirect("/login")
        }
      }else{
        res.redirect("/login")
      }
    })
})
router.get("/logout", (req, res) =>{
  req.session.user = undefined;
  res.redirect("/login")
})
module.exports = router
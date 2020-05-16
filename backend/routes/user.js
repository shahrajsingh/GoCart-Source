const express = require('express');
const User = require('../models/user');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const Product = require('../models/product');
router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash
    });
    user.save().then(result => {
      res.status(201).json({ message: 'New User Created' });
    }).catch(err => {
      res.status(500).json({ error: err });
    });
  });
});

router.get("/signup:userid", (req, res, next) => {
  User.findById(req.params.userid).then((user) => {
    res.status(201).json({ user });
  }).catch(err => {
    res.status(401).json({
      err
    })
  });
});


router.post("/login", (req, res, next) => {
  let fetcheduser;
  console.log(req.body.email);
  if (req.body.email === '') {
    return res.json({
      message: "user not found"
    });
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      return res.json({
        message: "user not found"
      });
    }
    fetcheduser = user;

    return bcrypt.compare(req.body.password, user.password);

  }).then(result => {
    if (!result) {

      return res.status(401).json({
        message: "wrong password"
      });
    }
    const token = jwt.sign({ email: fetcheduser.email, userId: fetcheduser._id },
      process.env.JWT_KEY, { expiresIn: "1h", });
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetcheduser._id,
      name: fetcheduser.name,
      message: "success"
    });
  })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        message: "error",
        error: err
      });

    });
});

router.put("/edit", (req, res, next) => {
  console.log("in put");
  let pass;
  console.log(req.body);
  let password = req.body.password;
  console.log(password);
  bcrypt.hash(password, (10)).then(res => {

    pass = res;

  }).catch(err => {
    console.log(err);
  });
  const id = { _id: req.body._id };
  User.findByIdAndUpdate(id, { name: req.body.name, email: req.body.email, password: pass }).then(result => {
    console.log(result);
    if (result.nModified == 0) {
      res.status(304).json({ message: 'Changes not Saved', result });
    } else {
      res.status(201).json({ message: 'Changes Saved', result });
    }

  }).catch(err => {
    console.log(err);
    res.status(401).json({ message: err });

  });
});

router.delete("/delete:id", (req, res, next) => {
  User.deleteOne({ _id: req.params.id }).then(result => {

    return Product.deleteMany({ seller_id: req.params.id })
  }).then(data => {

    res.status(201).json({ message: 'success' });
  }).catch(err => {
    res.status(500).json({ message: err });
  });
});

router.put("/tocart:id", (req, res, next) => {
  const pid = {
    id: req.body._id,
    name: req.body.name,
    discription: req.body.discription,
    price: req.body.price,
    image: req.body.image,
    seller_id: req.body.seller_id
  };

  User.update({ _id: req.params.id }, { $push: { cart: pid } }).then(result => {
    res.status(201).json({ sucess: 'succes' });
  }).catch(error => {

    res.status(500).json(error);
  });

});

router.put("/order:id", (req, res, next) => {
  console.log(req.params.id);
  console.log(req.body);
  let d = new Date();
  const date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
  const pid = {
    id: req.body.id,
    name: req.body.name,
    discription: req.body.discription,
    price: req.body.price,
    image: req.body.image,
    seller_id: req.body.seller_id,
    ordered_on: date
  };
  User.update({ _id: req.params.id }, { $push: { orders: pid } }).then(result => {

    res.status(201).json({ sucess: 'succes' });
  }).catch(error => {
    console.log(error);
    res.status(500).json(error);
  });

});

router.put("/pull:id", (req, res, next) => {
  User.updateOne({ _id: req.params.id }, { $pull: { cart: { id: req.body.id } } }).then(result => {

    res.status(201).json({ result });
  }).catch(error => {

    res.status(500).json({ error });
  });
});

router.get("/getcart:id", (req, res, next) => {
  User.findById({ _id: req.params.id }).then(result => {
    const pid = result.cart;
    let price = 0;
    pid.forEach(element => {
      price += parseInt(element.price, 10);
    });

    res.status(201).json({ pid, price });
  }).catch(err => {

    res.status(401).json({ error: err, message: 'there is some error' });
  });
});

router.get("/orders:id", (req, res, next) => {
  User.findById({ _id: req.params.id }).then(result => {
    const pid = result.orders;

    res.status(201).json({ pid });
  }).catch(err => {

    res.status(500).json({ error: err, message: 'there is some error' });
  });
});

router.put("/cartpull:id", (req, res, next) => {
  User.updateOne({ _id: req.params.id }, { $pull: { cart: { id: req.body.id } } }).then(result => {

    res.status(201).json({ result });
  }).catch(error => {

    res.status(500).json({ error });
  });
});


router.put("/cancelorder:id", (req, res, next) => {
  console.log(req.body);
  User.updateOne({ _id: req.params.id }, { $pull: { orders: { id: req.body.id } } }).then(result => {
    res.status(201).json({ result, message: 'order canceled' });
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});



module.exports = router;

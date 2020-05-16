const express = require('express');
const Product = require('../models/product');
const checkauth = require("../middleware/check-auth");
const router = express.Router();

const multer = require('multer');

const Mime_type = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg'
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = Mime_type[file.mimetype];
    let error = new Error("invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = Mime_type[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('/post', multer({ storage: storage }).single("image"), (req, res, next) => {
  console.log(req.body);
  const url = req.protocol + '://' + req.get('host');
  const product = new Product({
    name: req.body.name,
    discription: req.body.discription,
    image: url + "/images/" + req.file.filename,
    price: req.body.price,
    seller_id: req.body.seller_id,
    sellername: req.body.sellername
  });
  product.save().then((result) => {

    res.status(201).json({
      message: 'product added',
      id: result._id,
      img: result.imagepath
    });

  });
});

router.get("/get", (req, res, next) => {

  const pageSize = +req.query.pagesize;
  const currentpage = +req.query.page;
  let product;
  const productquary = Product.find();
  if (pageSize && currentpage) {
    productquary.skip(pageSize * (currentpage - 1)).limit(pageSize);
  }
  productquary.then(documents => {
    product = documents;
    return Product.countDocuments();
  })

    .then((count) => {
      res.status(200).json({
        product,
        count

      });

    });
});

router.get("/get:id", (req, res, next) => {
  const id = req.params.id;
  const pageSize = +req.query.pagesize;
  const currentpage = +req.query.page;
  let product;
  const productquary = Product.find({ seller_id: id });
  if (pageSize && currentpage) {
    productquary.skip(pageSize * (currentpage - 1)).limit(pageSize);
  }
  productquary.then(documents => {
    product = documents;
    return Product.countDocuments();
  })

    .then((count) => {
      res.status(200).json({
        product,
        count

      });

    });
});
router.get("/edit:id", (req, res, next) => {
  Product.findById(req.params.id).then(product => {
    if (product) {
      res.status(201).json({ product });
    } else {
      res.status(404).json('not found');
    }
  }).catch(err => {
    res.status(500).json(err);
  });
});

router.put("/editproduct:id",multer({ storage: storage }).single("image"), (req, res, next) => {
  let image = req.body.image;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    image = url + "/images/" + req.file.filename;
  }
  const product = new Product({
    _id: req.body._id,
    name: req.body.name,
    discription: req.body.discription,
    image: image,
    price: req.body.price,
    seller_id: req.body.seller_id
  });
  console.log(product);
  Product.updateOne({ _id: req.params.id }, product).then(result => {
    if (result.nModified > 0) {
      res.status(200).json({ message: "update success" });
    } else {
      res.status(401).json({ message: "not authorized" });
    }
  }).catch(err =>{
    console.log(err);
  });
});

router.get("/search:queryp", (req, res, next) => {
  const query = req.params.queryp;
  let product;
  Product.find({ name: query }).then(products => {
    product = products
    res.status(201).json({ product });
  }).catch(err => {
    res.status(401).json({ err });
  });
});

router.delete("/delete:id",(req,res,next)=>{
  const id = req.params.id;
  Product.deleteOne({_id: id}).then(result =>{
    res.status(201).json({
      message: 'deleted'
    });
  }).catch(error =>{
    console.log(error);
    res.status(500).json({error});
  });
});

module.exports = router;

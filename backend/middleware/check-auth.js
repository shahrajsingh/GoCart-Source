const jwt  = require("jsonwebtoken");

module.exports = (req,res,next) =>{
  console.log("in check Auth)", req.headers.authorization);
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedtoken = jwt.verify(token, process.env.JWT_KEY);
    console.log("exiting checkauth");
    req.userData = {email: decodedtoken.email,userId: decodedtoken.userId};
    next();
  }catch (error){
    console.log(error);
    res.status(401).json({ message: "Auth failed!"});
  }


};

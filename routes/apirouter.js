var express = require('express');
var router = express.Router();
var USER = require("../database/users");
var valid = require('../utils/valid')

//login
router.post("/login", (req, res,next) => {
  var email=req.body.email;
  USER.find({ email:email}).exec().then(users => {
            if (users.length < 1) {
                return res.status(401).json({
                    error: "no existe el usuario"
                });
            }
            console.log(users[0].password);

            if (users[0].password != req.body.password) {
              return res.status(401).json({
                  error: "fallo al autenticar"
              });
            }
            else{
              const token = jwt.sign({
                      email: users[0].email,
                      userId: users[0]._id
                  },
                  process.env.JWT_KEY || 'secret321');
              console.log(users[0]);
              return res.status(200).json({
                  message: "logeo existoso",
                  token: token,
                  idUser:users[0]._id,
                  tipo: users[0].tipo
              });

            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//Middelware for verifity token
function verifytoken (req, res, next) {
  //Recuperar el header
  var header = req.headers["Authorization"];
  if (header  == null) {
      res.status(403).json({
        msn: "No autotizado"
      })
  } else {
      req.token = header;
      //console.log("---->"+ req.originalUrl);
      //console.log(req);
      jwt.verify(req.token, "secret321", (err, authData) => {
        if (err) {
          res.status(403).json({
            msn: "token incorrecto"
          })
        }
          //go to funcion
          next();
          //say user from token
          //res.status(403).json(authData);

      });
  }
}

router.post('/user', async(req, res) => {
var params = req.body;
params["registerdate"] = new Date();

if(!valid.checkEmail(params.email))
    {
      res.status(300).json({
          msn: "campo email no valido"
      });
      return;

    }
if(!valid.checkPassword(params.password))
        {
          res.status(300).json({
              msn: "campo password no valido"
          });
          return;

        }

var users = new USER(params);
var result = await users.save();
res.status(200).json(result);
});



router.get("/user",verifytoken, (req, res) => {
var params = req.query;
console.log(params);var limit = 100;
if (params.limit != null) {
limit = parseInt(params.limit);
}
var order = -1;
if (params.order != null) {
if (params.order == "desc") {
order = -1;
} else if (params.order == "asc") {
order = 1;
}
}
var skip = 10;
if (params.skip != null) {
skip = parseInt(params.skip);
}
USER.find({}).limit(limit).sort({_id: order}).skip(skip).exec((err, docs) => {
res.status(200).json(docs);
});
});


router.patch("/user", (req, res) => {
if (req.query.id == null) {
res.status(300).json({
msn: "Error no existe id"
});
return;
}
var id = req.query.id;
var params = req.body;
USER.findOneAndUpdate({_id: id}, params, (err, docs) => {
res.status(200).json(docs);
});
});


router.delete("/user", async(req, res) => {
if (req.query.id == null) {
res.status(300).json({
msn: "Error no existe id"
});return;
}
var r = await USER.remove({_id: req.query.id});
res.status(300).json(r);
});

module.exports = router;

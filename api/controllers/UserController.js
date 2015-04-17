var crypto    = require('crypto');
var UserController = {


  index: function(req, res){
    User.find().exec(function(err, result){
      if(err) return res.send(500, err);
      res.view('user/index', { users: result });
    });
  },


  findOne: function(req, res){
    User.findOne({ id: req.params.id}).exec(function(err, result){
      if(err) return res.send(500, err);
      // res.view('user/detail', { user: result });
      res.json(result);
    });
  },


  create: function(req, res, next){
    res.view('user/create');
  },


  save: function(req, res){
    var email    = req.param('email'),
      username = req.param('username'),
      password = req.param('password');

    User.create({
      username : username,
      email    : email,
    }, function (err, user) {
      if (err) {
        return res.send(500, err);
      }

      // Generating accessToken for API authentication
      var token = crypto.randomBytes(48).toString('base64');

      Passport.create({
        protocol    : 'local',
        password    : password,
        user        : user.id,
        accessToken : token,
      }, function (err, passport) {
        if (err) {
          return user.destroy(function (destroyErr) {
            res.send(500, destroyErr || err);
          });
        }
        res.json(user);
      });
    });
  },

  destroy: function(req, res){
    User.destroy({ id: req.params.id }).exec(function(err){
      Passport.destroy({user: req.params.id}).exec(function(err){
        res.send(200);
      });
    });
  }
};

module.exports = UserController;

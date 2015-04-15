var async = require('async');
var stripe = require("stripe")("sk_test_ZYHWa9cCO9dWxps9IDDvosmA");


var ApiController = {
  eventIndex: function(req, res){
    Event.find().exec(function(err, events){
      if(err) return res.send(500, err);
      res.json(events);
    });
  },

  EventFind: function(req, res){
    Event.findOne({ id: req.params.id }).exec(function(err, event){
      if(err) return res.send(500, err);
      res.json(event);
    });
  },
  checkout: function(req, res){

    var charge = stripe.charges.create({
      amount: parseFloat(req.body.amount) * 100,
      currency: "usd",
      source: req.body.token,
      description: "AZSupras Events"
    }, function(err, charge) {
      console.log(err);
      if (err && err.type === 'StripeCardError') {
        return res.send(500);
      }

      Payment.create({
        email: req.body.details.email,
        firstname: req.body.details.firstname,
        lastname: req.body.details.lastname,
        phone: req.body.details.phone,
        username: req.body.details.username,
        cart: req.body.cart,
        ip: req.connection.remoteAddress,
        transaction: charge,
      }, function(err, payment){
        if(err) return res.send(500, err);
        res.json(payment);
      });

    });


  }
};

module.exports = ApiController;

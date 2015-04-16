var async = require('async');
var stripe = require("stripe")(sails.config.connections.stripe.apiKey);


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


    Payment.create({
      email: req.body.details.email,
      firstname: req.body.details.firstname,
      lastname: req.body.details.lastname,
      phone: req.body.details.phone,
      username: req.body.details.username,
      cart: req.body.cart,
      ip: req.connection.remoteAddress,
    }, function(err, payment){

      // charge the card
      var charge = stripe.charges.create({
        amount: parseFloat(req.body.amount) * 100,
        currency: sails.config.connections.stripe.currency,
        source: req.body.token,
        description: sails.config.connections.stripe.description,
      }, function(err, charge) {

        if (err && err.type === 'StripeCardError') {
          return res.send(500, err);
        }

        payment.transaction = charge;
        payment.paid = true;

        payment.save(function(err){
          if(err) console.error(err);
        });

        Email.send({
          to: [{
            email: req.body.details.email,
            name: req.body.firstname + ' ' + req.body.lastname,
          }],
          text: 'Congrats!'
        }, function(err, response){
          if(err) {
            console.error(err);
          }else{
            payment.emailSent = true;
            payment.save(function(err){
              if(err) console.error(err);
            });
          }
        });

        if(err) return res.send(500, err);
        res.json(payment);
      });
    });


  }
};

module.exports = ApiController;

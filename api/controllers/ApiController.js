var async = require('async');
var stripe = require("stripe")(sails.config.connections.stripe.apiKey);


var ApiController = {
  eventIndex: function(req, res){

    Event.find().exec(function(err, events){

      //append the attendeeCounts
      async.each(events, function(event, cb){

        Attendee.count().where({
          event: event.id,
          paid: true,
        }).exec(function(err, count){
          if(err) return cb(err);
          event.attendeeCount = count;
          cb();
        });
      }, function(err){
        if(err) return res.send(500, err);
        res.json(events);
      });
    });
  },

  EventFind: function(req, res){
    Event.findOne({ id: req.params.id }).exec(function(err, event){
      if(err) return res.send(500, err);
      Attendee.count().where({ event: event.id }).exec(function(err, count){
        if(err) return res.send(500, err);
        event.attendeeCount = count;
        res.json(event);
      });
    });
  },

  checkout: function(req, res){

    var checkout = req.body;
    console.log(checkout);

    for (var i = 0; i < checkout.cart.length; i++) {
      var event = checkout.cart[i];
      Attendee.findOrCreate({
        email: checkout.details.email,
        firstname: checkout.details.firstname,
        lastname: checkout.details.lastname,
        phone: checkout.details.phone,
        username: checkout.details.username,
        cart: checkout.cart,
        event: event.id
      }, function(err, attendee){
        if(err) {
          console.error(err);
          return res.send(500, err);
        }
        Payment.create({
          ip: req.connection.remoteAddress,
          attendees: attendee.id
        }, function(err, payment){
          if(err) return res.send(500, err);
          // charge the card
          var charge = stripe.charges.create({
            amount: parseFloat(req.body.amount) * 100,
            currency: sails.config.connections.stripe.currency,
            source: checkout.token,
            description: sails.config.connections.stripe.description,
          }, function(err, charge) {

            if (err && err.type === 'StripeCardError') {
              return res.send(500, err);
            }

            console.log(charge.paid);

            payment.transaction = charge;
            attendee.paid = charge.paid;
            attendee.payments = payment.id;
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

                attendee.emailSent = true;
                attendee.save(function(err){
                  if(err) console.error(err);
                });

              }
            });
            res.json(payment);
          });
        });
      });
    }
  }
};

module.exports = ApiController;

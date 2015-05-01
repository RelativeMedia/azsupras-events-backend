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



  testEmail: function(req, res){
    var checkout = req.body;


    var testData = [{
      amount: '20.00',
      currency: 'usd',
      cart:[{
        name: '2nd Annual AZSupras BBQ ',
        id: '55207a73295c856b099ce08e',
        items: [],
      }],
      details:{
        firstname: 'Mike',
        lastname: 'DeVita',
        phone: 6025414137,
        email: 'm.devita@gmail.com',
        username: 'mikedevita'
      },
      token: 'tok_15xQ5eFS8tx6P8nV73DLvqbE'
    }];

    var options = {
      templateName: 'event-confirmation',
      mergeLanguage: 'handlebars',
      to: [],
      globalMergeVars: [],
      mergeVars: []
    };

    for (var i = 0; i < testData.length; i++) {
      var data = testData[i];
      options.to.push({
        'name': data.details.firstname + ' ' + data.details.lastname,
        'email': data.details.email
      });

      options.mergeVars.push({
        'rcpt': data.details.email,
        'vars': [
          {
            'name': 'firstname',
            'content': data.details.firstname,
          },
          {
            'name': 'lastname',
            'content': data.details.lastname,
          },
          {
            'name': 'email',
            'content': data.details.email,
          },
          {
            'name': 'phonenumber',
            'content': data.details.phone,
          },
          {
            'name': 'username',
            'content': data.details.username,
          },
          {
            'name': 'cartItems',
            'content': data.cart[0].items,
          },
          {
            'name': 'totalCost',
            'content': data.amount,
          }
        ]
      });

    }

    console.log(options);

    Email.send(options, function(err, response){
      if(err) return res.send(500, err);
      res.json(response);
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

            payment.transaction = charge;
            attendee.paid = charge.paid;
            attendee.payments = payment.id;

            payment.save(function(err){
              if(err) console.error(err);

              attendee.save(function(err){
                if(err) console.error(err);
              });

            });

            res.json(payment);

          });
        });
      });
    }
  }
};

module.exports = ApiController;

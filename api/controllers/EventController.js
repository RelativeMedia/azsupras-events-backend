var async = require('async');
var gm = require('googlemaps');

var EventController = {

  index: function(req, res){
    Event.find().exec(function(err, events){
      if(err) return res.send(500, err);
      res.view('events/index', { events: events });
    });
  },

  findOne: function(req, res){
    Event.findOne({ id: req.params.id }).exec(function(err, result){
      if(err) return res.send(500, err);
      res.view('events/detail', { event: result });
    });
  },

  create: function(req, res){
    res.view('events/create');
  },

  save: function(req, res){
    var events = req.body;
    var fullAddress = events.address1 + ', ' + events.address2  + ' ' + events.city + ', ' + events.state + ' ' + events.zipcode;
    console.log(fullAddress);
    var staticMap = gm.staticMap(fullAddress, 13, '340x300', false, false, 'roadmap', [{'location': fullAddress}]);

    Event.create({
      name: events.name,
      description: events.description,
      markdownContent: events.content,
      startDate: events.startDate,
      endDate: events.endDate,
      staticMap: staticMap,
      location: {
        name: events.address1,
        address: events.address2,
        city: events.city,
        state: events.state,
        zipCode: events.zipcode
      },
      prices: JSON.parse(events.pricing)
    }, function(err, event){
      if(err) return res.send(500, err);

      req.file('titleImage').upload({
        adapter: require('skipper-s3'),
        key: sails.config.connections.s3FileStore.key,
        secret: sails.config.connections.s3FileStore.secret,
        bucket: sails.config.connections.s3FileStore.bucket,
      }, function whenDone(err, files){

        if(err) return res.send(500, err);
        console.log(err, files);

        Event.update(event.id, {
          titleImage: files[0]
        }).exec(function(err){
          if(err) return res.negotiate(err);
          res.redirect('/event/' + event.id);
        });
      });
    });
  }
};

module.exports = EventController;

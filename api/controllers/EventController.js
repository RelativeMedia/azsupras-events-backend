var async = require('async');

var EventController = {

  index: function(req, res){
    Event.find().exec(function(err, events){
      if(err) return res.send(500, err);
      res.view('events/index', { events: events });
    });
  },

  find: function(req, res){
    Event.findOne({ id: req.params.id }).exec(function(err, result){
      if(err) return res.send(500, err);
      res.view('events/detail', { event: result });
    });
  },

  save: function(req, res){
    var events = req.body;

    Event.create({
      name: events.name,
      description: events.description,
      content: events.content,
      startDate: events.startDate,
      endDate: events.endDate,
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

      async.parallel([
        function(cb){
          req.file('titleImageLarge').upload({
            maxBytes: 10000000,
            dirname: sails.config.events.basePath + '/' + event.id
          }, function whenDone(err, uploadedFiles){
            if(err) return cb(err);
            cb(null, uploadedFiles);
          });
        },
        function(cb){
          req.file('titleImageSmall').upload({
            maxBytes: 10000000,
            dirname: sails.config.events.basePath + '/' + event.id
          }, function whenDone(err, uploadedFiles){
            if(err) return cb(err);
            cb(null, uploadedFiles);
          });
        }
      ], function(err, files){
        if(err) return res.send(500, err);

        var largeTitleImage = files[0][0].fd.split('/');
        var smallTitleImage = files[1][0].fd.split('/');

        console.log(event.id);

        Event.update(event.id, {
          largeTitleImage: sails.config.events.webPath + '/' + event.id + '/' + largeTitleImage[largeTitleImage.length-1],
          smallTitleImage: sails.config.events.webPath + '/' + event.id + '/' + smallTitleImage[smallTitleImage.length-1],
        }).exec(function(err){
          if(err) return res.negotiate(err);
          res.redirect('/event/list/' + event.id);
        });
      });
    });
  }
};

module.exports = EventController;

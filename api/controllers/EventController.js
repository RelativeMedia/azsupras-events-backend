var async = require('async');

var EventController = {

  index: function(req, res){
    if(req.headers['content-type'] === 'application/json, application/x-www-form-urlencoded'){
      Event.find().exec(function(err, events){
        return res.json(events);
      });
    }else{
      return res.view('events/index');
    }
  },

  find: function(req, res){
    Event.findOne({ id: req.params.id }).exec(function(err, event){
      if(err) return res.send(err);

      if(req.headers['content-type'] === 'application/json, application/x-www-form-urlencoded'){
          return res.json(event);
      }else{
        res.view('events/detail', { event: event });
      }
    });
  },

  create: function(req, res){
    return res.view('events/create');
  },

  createSave: function(req, res){
    var event = req.body;

    Event.create({
      name: event.name,
      description: event.description,
      content: event.content,
      startDate: event.startDate,
      endDate: event.endDate,
      location: {
        address: event.address,
        city: event.city,
        state: event.state,
        zipCode: event.zipcode
      },
      prices: JSON.parse(event.pricing)
    }, function(err, event){
      if(err) res.send(500, err);

      async.parallel([
        function(cb){
          req.file('titleImageLarge').upload({
            maxBytes: 10000000,
            dirname: sails.config.events.basePath + '/' + event.id
          }, function whenDone(err, uploadedFiles){
            if(err) cb(err);
            cb(null, uploadedFiles);
          });
        },
        function(cb){
          req.file('titleImageSmall').upload({
            maxBytes: 10000000,
            dirname: sails.config.events.basePath + '/' + event.id
          }, function whenDone(err, uploadedFiles){
            if(err) cb(err);
            cb(null, uploadedFiles);
          });
        }
      ], function(err, files){
        if(err) return res.negotiate(err);

        var largeTitleImage = files[0][0].fd.split('/');
        var smallTitleImage = files[1][0].fd.split('/');

        Event.update(event.id, {
          largeTitleImage: sails.config.events.webPath + '/' + event.id + '/' + largeTitleImage[largeTitleImage.length-1],
          smallTitleImage: sails.config.events.webPath + '/' + event.id + '/' + smallTitleImage[smallTitleImage.length-1],
        }).exec(function(err){
          if(err) return res.negotiate(err);
          res.redirect('/event/' + event.id);
        });
      });
    });
  }
};

module.exports = EventController;

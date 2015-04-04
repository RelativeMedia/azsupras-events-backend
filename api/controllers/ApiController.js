var async = require('async');

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
};

module.exports = ApiController;

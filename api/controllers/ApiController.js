

var ApiController = {
  eventindex: function(req, res){
    Event.find().exec(function(err, events){
      return res.json(events);
    });
  },

  eventfind: function(req, res){
    Event.findOne({ id: req.params.id }).exec(function(err, event){
      if(err) return res.send(err);
      return res.json(event);
    });
  }
};

module.exports = ApiController;

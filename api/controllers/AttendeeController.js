var AttendeeController = {
  index: function(req, res){

    Attendee.find().populate('payment').exec(function(err, result){
      if(err) return res.send(500, err);
      // res.json(result);
      res.view('attendee/index', { attendees: result });
    });
    //res.json({ message: 'This Feature Is Not Implemented Yet' });
  },
  resendEmail: function(req, res){

    Attendee.update(req.params.id, {
      emailSent: false
    }).exec(function(err){
      if(err) return res.send(500, err);
      res.send(200);
    });

  },
};
module.exports = AttendeeController;

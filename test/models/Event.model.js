describe('Event', function(){

  it('should not be empty', function(done){
    Event.find().exec(function(err, events){
      events.length.should.not.be.eql(0);
      done();
    });
  });

  it('should have parsed markdown content on save', function(done){
    Event.find().exec(function(err, events){
      events[0].content.length.should.not.be.eql(0);
      done();
    });
  });

});

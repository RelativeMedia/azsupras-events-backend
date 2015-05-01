/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */
 var validator = require('validator');
 var crypto    = require('crypto');

module.exports.bootstrap = function(cb) {

  // passport middleware to load strategies
  sails.services.passport.loadStrategies();
  var adminUser = sails.config.adminUser;

  User.findOne(adminUser).exec(function(err, result){
    if(typeof result === 'undefined'){
      console.log('Base Admin Not Found, creating it!');
      User.create(adminUser, function (err, user) {
        if (err) {
          return console.error('Error Seeding Admin User', err);
        }else{
          // Generating accessToken for API authentication
          var token = crypto.randomBytes(48).toString('base64');
          var randomPassword = crypto.randomBytes(12).toString('hex');

          Passport.create({
            protocol    : 'local',
            password    : randomPassword,
            user        : user.id,
            accessToken : token
          }, function (err, passport) {
            if (err) {
              console.error(err);
              return user.destroy(function (destroyErr) {
                console.error(err);
              });
            }

            console.log('Seeded DB With User:', user.username, '/', randomPassword);
          });
        }
      });

    }
  });

  sails.log.info('Batch Emailing in ' + sails.config.connections.mandrill.sendInterval/1000 + ' seconds');

  setInterval(function(){
    sails.log.info('Batch Emailing');
    Email.process(function(err, response){
      if(err){
        console.error(err);
      }else if(response !== null){

        sails.log.debug(response);
        for (var i = 0; i < response.length; i++) {
          var res = response[i];

          if(res.status === 'error'){
            console.error(res);
          }else{

            var attendee = Attendee.findOne().where({email: res.email, emailSent: false}).exec(function(err, attendee){
              attendee.emailSent = true;
              sails.log.debug('Updating Attendee: ' + attendee.email + ' as email sent');
              attendee.save(function(err){
                sails.log9debug('Saving attendee: '  + attendee.email);
                if(err) console.error(err);
              });
            });

          }
        }
      }else{
        sails.log.info('No one to batch Email!');
      }
    });
  }, sails.config.connections.mandrill.sendInterval);

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};

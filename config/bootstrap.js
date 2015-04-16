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

  User.findOrCreate({
    username : 'admin',
    email    : 'admin@azsupras.com',
  }, function (err, user) {
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

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};

var Mandrill = require('node-mandrill')(sails.config.connections.mandrill.apiKey);
var _        = require('lodash');


var EmailService = {
  send: function(Message, cb){
    var message = {
      from_email: sails.config.connections.mandrill.from,
      subject: sails.config.connections.mandrill.subject
    };

    message = _.merge(message, Message);
    Mandrill('/messages/send', {
      message: message
    },function (err, response){
        if(err) return cb(err);
        cb(null, response);
    });
  }
};

module.exports = EmailService;

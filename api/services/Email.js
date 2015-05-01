var Mandrill = require('mandrill-api/mandrill');
var mandrill = new Mandrill.Mandrill(sails.config.connections.mandrill.apiKey);


function _send(Email, cb){

  /**
   * compose the message object for the mandrill emails
   * @type {Object}
   */
  var message = {
    from_name: sails.config.connections.mandrill.from.name,
    from_email: sails.config.connections.mandrill.from.email,
    to: Email.to,
    merge_language: Email.mergeLanguage || 'handlebars',
    merge: true,
    global_merge_vars: Email.globalMergeVars,
    merge_vars: Email.mergeVars,
    subject: sails.config.connections.mandrill.subject,
  };

  mandrill.messages.sendTemplate({
    'template_name': Email.templateName,
    'template_content': Email.templateContent || '',
    'message': message,
    'async': sails.config.connections.mandrill.async || false,
  }, function(response){
    cb(null, response);
  }, function(err){
    console.error(err);
    cb(err);
  });
}

var EmailService = {
  process: function(cb){
    Attendee.find().where({ paid: true, emailSent: false}).populate('payment').exec(function(err, attendees){
      if(err) return cb(err);

      if(attendees.length > 0){
        console.log(attendees);

      var options = {
        templateName: 'event-confirmation',
        mergeLanguage: 'handlebars',
        to: [],
        globalMergeVars: [],
        mergeVars: []
      };

      for (var i = 0; i < attendees.length; i++) {
        var data = attendees[i];

          options.to.push({
            'name': data.firstname + ' ' + data.lastname,
            'email': data.email
          });

          options.mergeVars.push({
            'rcpt': data.email,
            'vars': [
              {
                'name': 'firstname',
                'content': data.firstname,
              },
              {
                'name': 'eventName',
                'content': data.cart[0].name
              },
              {
                'name': 'lastname',
                'content': data.lastname,
              },
              {
                'name': 'email',
                'content': data.email,
              },
              {
                'name': 'phonenumber',
                'content': data.phone,
              },
              {
                'name': 'username',
                'content': data.username,
              },
              {
                'name': 'cartItems',
                'content': data.cart[0].items,
              },
              {
                'name': 'totalCost',
                'content': parseFloat(data.payment.transaction.amount/100).toFixed(2),
              }
            ]
          });
        }

        _send(options, function(err, response){
          if(err) return cb(err);
          cb(null, response);
        });
      }else{
        return cb(null, null);
      }
    });
  }
};

module.exports = EmailService;

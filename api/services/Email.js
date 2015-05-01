var Mandrill = require('mandrill-api/mandrill');
var mandrill = new Mandrill.Mandrill(sails.config.connections.mandrill.apiKey);



var EmailService = {

  send: function(Email, cb){

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

    console.log(message);

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
};

module.exports = EmailService;

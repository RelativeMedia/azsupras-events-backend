var Handlebars = require('sails/node_modules/express-handlebars/node_modules/handlebars');
var moment = require('moment');

Handlebars.registerHelper('isCurrentPage', function(req, page){
  page = page.split('.');

  var controller = page[0];
  var action     = page[1];

  if(req.options.controller === controller && req.options.action === action){
    return 'active';
  }else{
    return null;
  }

});


Handlebars.registerHelper('formatDate', function(datetime, format){

  var DateFormats = {
    short: 'MMMM Do, YYYY hh:mm A',
    long: 'ddd DD.MM.YYYY HH:mm'
  };

  if(moment){
    format = DateFormats[format] || format;
    return moment(datetime).format(format);


  }else{
    return datetime;
  }
});

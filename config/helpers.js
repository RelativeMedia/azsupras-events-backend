var Handlebars = require('sails/node_modules/express-handlebars/node_modules/handlebars');

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

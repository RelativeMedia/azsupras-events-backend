var marked = require('marked');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

var Event = {
  // Enforce model schema in the case of schemaless databases
  schema: true,
  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    titleImage: {
      type: 'json',
    },
    startDate: {
      type: 'datetime',
      required: true,
    },
    endDate: {
      type: 'datetime',
      required: true,
    },
    markdownContent: {
      type: 'string',
      required: true,
    },
    content: {
      type: 'string',
    },
    location: {
      type: 'json',
      required: true,
    },
    prices: {
      type: 'json'
    },
    staticMap: {
      type: 'string',
    },
    facebookEvent: {
      type: 'string',
    },
    forumLink: {
      type: 'string',
    },
    attendees: {
      collection: 'attendee',
      via: 'event'
    },
  },
  beforeCreate: function(values, cb){
    var content = marked(values.markdownContent);
    values.content = content;
    cb();
  }
};

module.exports = Event;

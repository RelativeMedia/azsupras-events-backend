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
    largeTitleImage: {
      type: 'string',
    },
    smallTitleImage: {
      type: 'string'
    },
    startDate: {
      type: 'datetime',
      required: true,
    },
    endDate: {
      type: 'datetime',
      required: true,
    },
    content: {
      type: 'string',
      required: true,
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
    attending: {
      type: 'integer',
      defaultsTo: 0,
    }
  }
};

module.exports = Event;

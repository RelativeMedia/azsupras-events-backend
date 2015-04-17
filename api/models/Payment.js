var Payment = {
  // Enforce model schema in the case of schemaless databases
  schema: true,
  attributes: {
    ip: {
      type: 'string',
      required: true,
    },
    transaction: {
      type: 'json',
      required: false,
    },
    attendees: {
      collection: 'attendee',
      via: 'payment'
    }
  }
};

module.exports = Payment;

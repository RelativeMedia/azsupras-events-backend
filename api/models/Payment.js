var Payment = {
  // Enforce model schema in the case of schemaless databases
  schema: true,
  attributes: {
    email: {
      type: 'email',
      email: true,
      required: true,
    },
    firstname: {
      type: 'string',
      required: true,
    },
    lastname: {
      type: 'string',
      required: true,
    },
    phone: {
      type: 'string',
      required: true,
    },
    username: {
      type: 'string',
      required: true,
    },
    cart: {
      type: 'array',
      required: true,
    },
    ip: {
      type: 'string',
      required: true,
    },
    transaction: {
      type: 'json',
      required: false,
    },
    paid: {
      type: 'boolean',
      defaultsTo: false,
    },
    emailSent: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};

module.exports = Payment;

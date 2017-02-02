var constants = {

    externalEvents: {
    FOCUS: 'focus',
    BLUR: 'blur',
    EMPTY: 'empty',
    NOT_EMPTY: 'notEmpty',
    VALIDITY_CHANGE: 'validityChange',
    CARD_TYPE_CHANGE: 'cardTypeChange'
  },

  DEFAULTIFRAMESTYLE: {
    border: 'none',
    width: '100%',
    height: '100%',
    'float': 'left'
  },
  formMap: {
    pan: {
      name: "Pan",
      label: "PAN"
    },
    cvv:{
      name: "cvv",
      label: "CVV"
    },
    pin: {
      name:"pin",
      label: "PIN"
    },
    exp:{
      name: "expiration",
      label: "Expiration Date"
    },
    expMonth:{
      name: "expirationMonth",
      label: "Expiration Month"
    },
    expYear:{
      name: "expirationYear",
      label: "Expiration Year"
    }
    
  }

};

module.exports = constants;
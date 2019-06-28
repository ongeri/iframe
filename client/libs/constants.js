var constants = {

    externalEvents: {
        FOCUS: 'focus',
        BLUR: 'blur',
        EMPTY: 'empty',
        NOT_EMPTY: 'notEmpty',
        VALIDITY_CHANGE: 'validityChange',
        CARD_TYPE_CHANGE: 'cardTypeChange'
    },

    config: {
        host: "https://merchant.interswitch-ke.com:3000"
    },

    externalClasses: {
        FOCUSED: 'isw-hosted-field-focused',
        INVALID: 'isw-hosted-field-invalid',
        VALID: 'isw-hosted-field-valid'
    },

    events: {
        TRIGGER_INPUT_FOCUS: 'TRIGGER_INPUT_FOCUS',
        SET_PLACEHOLDER: 'SET_PLACEHOLDER',
        ADD_CLASS: 'ADD_CLASS',
        REMOVE_CLASS: 'REMOVE_CLASS',
        CLEAR_FIELD: 'CLEAR_FIELD'
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
        token: {
            name: "Token",
            label: "TOKEN"
        },
        cardvstokenradio: {
            name: "cardvstokenradio",
            label: "CARDVSTOKENRADIO"
        },
        cvv: {
            name: "cvv",
            label: "CVV"
        },
        pin: {
            name: "pin",
            label: "PIN"
        },
        exp: {
            name: "expiration",
            label: "Expiration Date"
        },
        expMonth: {
            name: "expirationMonth",
            label: "Expiration Month"
        },
        expYear: {
            name: "expirationYear",
            label: "Expiration Year"
        },
        otp: {
            name: "otp",
            label: "OTP"
        },
        tf1: {
            name: "tf1",
            label: "TF1"
        },
        save: {
            name: "save",
            label: "Save"
        }

    }

};

module.exports = constants;

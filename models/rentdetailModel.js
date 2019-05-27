const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    transactionid: {
        type: String,
        ref: 'Transaction',
        default: '0',
    },
    deal: {
        total: {
            type: Number,
            default: 0,
        },
        deposit: {
            type: Number,
            default: 0,
        },
        typeofpay: {
            type: Number,
            default: 0,
        },
        numofpay: {
            type: Number,
            default: 0,
        },
        datedeal: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
            default: 'no',
        },
        complete: {
            type: Boolean,
            default: false,
        },
    },
    legality: {
        government: {
            type: String,
            default: 'no',
        },
        certificate: {
            type: String,
            default: 'no',
        },
        contract: {
            type: String,
            default: 'no',
        },
        complete: {
            type: Boolean,
            default: false,
        },
    },
    deposit: {
        detail: [{
            ratio: {
                type: Number,
            },
            description: {
                type: String,
            },
            createTime: {
                type: Number,
            },
        }],
        rest: {
            type: String,
            default: 'Chua thanh toan',
        },
        complete: {
            type: Boolean,
            default: false,
        },
    },
    contract: {
        datesign: {
            type: Number,
            default: 0,
        },
        number: {
            type: String,
            default: '0',
        },
        company:{
            type: String,
            default: '0',
        },
        contractImage: [{
            type: String,
        }],
        complete: {
            type: Boolean,
            default: false,
        },
    },
    confirmation: {
        url: {
            type: Boolean,
            default: false,
        },
        complete: {
            type: Boolean,
            default: false,
        },
    },
    tax: {
        seller: {
            datepay: {
                type: Number,
                default: 0,
            },
            place: {
                type: String,
                default: 'no',
            },
            amountmoney: {
                type: Number,
                default: 0,
            },
            complete: {
                type: Boolean,
                default: false,
            },
        },
        buyer: {
            datepay: {
                type: Number,
                default: 0,
            },
            place: {
                type: String,
                default: 'no',
            },
            amountmoney: {
                type: Number,
                default: 0,
            },
            complete: {
                type: Boolean,
                default: false,
            },
        },
        complete: {
            type: Boolean,
            default: false,
        },
    },
    delivery: {
        datecomplete: {
            type: Number,
            default: 0,
        },
        apartmentcode: {
            type: Number,
            default: 0,
        },
        room: {
            type: Number,
            default: 0,
        },
        datein:  {
            type: Number,
            default: 0,
        },
        tax: {
            type: Number,
            default: 0,
        },
        complete: {
            type: Boolean,
            default: false,
        },
    },
    transfer: {
        type: String,
        default: 'no',
    }
});

// Export the model
module.exports = mongoose.model('RentDetail', Schema);
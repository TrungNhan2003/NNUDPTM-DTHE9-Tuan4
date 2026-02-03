let mongoose = require('mongoose')

let productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title không được rỗng"]
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: [true, "price không được rỗng"],
        min: [0, "price phải >= 0"]
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8N7qdG-B9FW47yJaKEKCDpidao3fC1raDbpgldxW-Vr47N8vOGMdT6NrFib3y_QGyLZICFQdatPcNA2TDKw&s&ec=121516180"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('product', productSchema)

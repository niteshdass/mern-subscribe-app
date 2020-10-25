const mongoose = require("mongoose");

const CodeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true
        },
        optradio: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
           
        },
        offer: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
          
        },
        date: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Code", CodeSchema);
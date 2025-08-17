const mongoose = require('mongoose');
 
const ticketSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ["Room Issue","Front Desk Services","Amenities","Safety And Security","Other"],
        default : "Room Issue"
    },
    description: {
        type: String,
 
    },
    room :{
        type: String,
        required: true
    },
    status :{
        type : String,
        enum: ["Open","Pending","Resolved", "Not Resolved"],
        default: "Open",
        required: true
    },
    imageUrl:{
        type: String,
        default: null,
    },
    // need to store the public id of the image in cloudinary
    // so that we can delete it later if needed
    imagePublicId: { 
        type: String, 
        // required: true,
        default: null
    },
 
},{timestamps:true})
 
module.exports = mongoose.model('Ticket', ticketSchema);
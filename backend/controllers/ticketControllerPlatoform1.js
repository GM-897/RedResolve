const Ticket = require("../models/ticketModel");
const { fileUploadCloudinary } = require("../utils/fileUploadCloudinary");

exports.createTicket = (io) => async (req, res) => {
  try {
    const { category, description, room } = req.body;
    const imgFile = req.files && req.files.image ? req.files.image : null;


    let imageUploadresponse = null;
    if (imgFile && imgFile.tempFilePath) {
      imageUploadresponse = await fileUploadCloudinary(
        imgFile,
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      if (!imageUploadresponse || !imageUploadresponse.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed, please try again",
        });
      }
    }

    const createdTicket = await Ticket.create({
      category,
      description,
      room,
      ...(imageUploadresponse && {
        imageUrl: imageUploadresponse.secure_url,
        imagePublicId: imageUploadresponse.public_id,
      }),
    });

    // 💡 NEW: Emit a Socket.IO event to all clients
    io.emit('newTicket', createdTicket);

    return res.status(200).json({
      success: true,
      message: "ticket created successfully",
      ticket: createdTicket,
    });
  } catch (err) {
    console.error("Error in raising complaint:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};


// fetch all the tickets with status open and pending
exports.getAllTicketsUser = async (req, res) => {
    try{
        const tickets = await Ticket.find({ status: { $in: ["Open" ,"Pending"] } })
            .sort({ createdAt: -1 }); // Sort by latest first

        if(!tickets || tickets.length === 0){
            return res.status(404).json({
                success: false,
                message: "No tickets available",
            });
        }

        return res.status(200).json({
            success: true,
            tickets,
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error, please try again",
        });
    }
};
 
// fetch all the tickets with status open and pending and has the same room as the user
exports.getAllTicketsByRoom = async (req, res) => {
    try {
        const { room } = req.query;   // GET http://localhost:4000/api/v1/tickets/getAllTicketsByRoom?room=2222
        if (!room) {
            return res.status(400).json({
                success: false,
                message: "Room is required",
            });
        }
        const tickets = await Ticket.find({
            room: room,
            status: { $in: ["Open", "Pending"] }
        })
        .sort({ createdAt: -1 }); // Sort by latest first

        if (!tickets || tickets.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No tickets available for this room",
            });
        }
        return res.status(200).json({
            success: true,
            tickets,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error, please try again",
        });
    }
};
 
 
const cloudinary = require("cloudinary").v2;
 
exports.deleteTicket = (io) => async (req, res) => {
    try {
        // console.log("req.params:", req.params);
        const { id } = req.params;
 
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Ticket ID is required",
            });
        }
 
        //find the ticket first
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }
 
        const imagePublicId = ticket.imagePublicId;
        if (imagePublicId) {
            await cloudinary.uploader.destroy(imagePublicId);
        }
 
        //now delete the ticket
        await Ticket.findByIdAndDelete(id);
 
        return res.status(200).json({
            success: true,
            message: "Ticket and associated image deleted successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error, please try again",
        });
    }
};
 
exports.changeStatusToResolved =(io) => async (req, res) => {
    try {
        const { id } = req.params;
 
        if(!id){
            return res.status(400).json({
                success: false,
                message: "Ticket ID is required",
            });
        }
 
        const updatedTicket = await Ticket.findByIdAndUpdate(id, { status: "Resolved" }, { new: true });
 
        if(!updatedTicket){
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }
 
        return res.status(200).json({
            success: true,
            message: "Ticket status updated to Resolved",
            updatedTicket,
        });
    } 
    catch(err){
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error, please try again",
        });
    }
};
 
exports.changeStatusToNotResolved =(io)=>  async (req, res) => {
    try {
        const { id } = req.params;
 
        if(!id){
            return res.status(400).json({
                success: false,
                message: "Ticket ID is required",
            });
        }
 
        const updatedTicket = await Ticket.findByIdAndUpdate(id, { status: "Not Resolved" }, { new: true });
 
        if(!updatedTicket){
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }
 
        return res.status(200).json({
            success: true,
            message: "Ticket status updated to Not Resolved",
            updatedTicket,
        });
    } 
    catch(err){
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error, please try again",
        });
    }
};

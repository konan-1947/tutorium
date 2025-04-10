const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    senderId: { type: Number, required: true },
    receiverId: { type: Number, required: true },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
});

module.exports = mongoose.model("Notification", NotificationSchema);

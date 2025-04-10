const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: Number, required: true }, // ID người gửi (User ID từ MySQL)
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    seenBy: { type: [Number], default: [] } // Danh sách user đã đọc tin nhắn (ID từ MySQL)
});

module.exports = mongoose.model('Message', MessageSchema);

const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    participants: {
        type: [Number], // Danh sách User ID từ MySQL
        required: true,
        validate: {
            validator: (arr) => arr.length === 2, // Chỉ hỗ trợ chat 1-1
            message: "Participants must contain exactly 2 user IDs."
        }
    },
    lastMessage: {
        text: { type: String, default: "" },
        sender: { type: Number },
        timestamp: { type: Date, default: Date.now }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conversation', ConversationSchema);

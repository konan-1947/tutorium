const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// Tạo cuộc trò chuyện mới
const  sequelize  = require('../config/db'); // Import Sequelize và kết nối từ file db.js
const  Sequelize  = require('../config/db');
exports.createConversation = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.session.user?.userid || 21; // Lấy senderId từ session

        if (!senderId || !receiverId) {
            return res.status(400).json({ message: "Thiếu senderId hoặc receiverId." });
        }

        // Kiểm tra xem cả 2 user có tồn tại trong MySQL không bằng raw query
        const query = `SELECT userid FROM Users WHERE userid IN (:senderId, :receiverId)`;
        const results = await sequelize.query(query, {
            replacements: { senderId, receiverId },
            type: Sequelize.QueryTypes.SELECT,
        });

        if (results.length !== 2) {
            return res.status(404).json({ message: "Một hoặc cả hai User không tồn tại!" });
        }

        // Kiểm tra xem cuộc trò chuyện đã tồn tại chưa
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            // Nếu chưa có, tạo cuộc trò chuyện mới
            conversation = new Conversation({
                participants: [senderId, receiverId]
            });

            await conversation.save();
        }

        res.status(200).json({ message: "Thành công", conversation });

    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Tam bo 
exports.sendMessage = async (req, res) => {
    try {
        const senderId = req.session.user.userid || 21 ;
        const {  text } = req.body;
        const { conversationId } = req.params;

        if (!conversationId || !senderId || !text) {
            return res.status(400).json({ message: "Thiếu dữ liệu." });
        }

        
         // Lấy tên người gửi từ MySQL bằng Sequelize
         const [userResult] = await sequelize.query(
            `SELECT displayname FROM Users WHERE userid = ?`,
            {
                replacements: [senderId],
                type: Sequelize.QueryTypes.SELECT,
            }
        );

        const senderName = userResult[0]?.displayname || "Không xác định";

        // Lưu tin nhắn vào MongoDB
        const message = new Message({ conversationId, sender: senderId, text });
        await message.save();

        // Cập nhật tin nhắn cuối vào cuộc trò chuyện
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: { text, sender: senderId, timestamp: message.timestamp }
        });

        // Gửi phản hồi về frontend với thông tin đầy đủ
        res.status(200).json({
            message: "Gửi tin nhắn thành công!",
            newMessage: {
                senderId,
                senderName,
                text,
                timestamp: message.timestamp
            }
        });

        res.status(200).json({ message: "Gửi tin nhắn thành công!", message });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.getMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversationId });

        if (!messages.length) {
            return res.status(200).json({ message: "Chưa có tin nhắn nào.", messages: [] });
        }

        // Lấy danh sách senderId cần query. map() sẽ là một mảng chứa tất cả các senderId.
        // Set sẽ tự động loại bỏ các giá trị trùng lặp
        //... (spread operator) được sử dụng để chuyển đổi Obj Set trở lại thành một mảng.
        const senderIds = [...new Set(messages.map(msg => msg.sender))];


        // Query MySQL để lấy thông tin người gửi bằng Sequelize
        const users = await sequelize.query(
            `SELECT userid, displayname FROM Users WHERE userid IN (:senderIds)`, 
            {
                replacements: { senderIds },
                type: Sequelize.QueryTypes.SELECT
            }
        );

        //Tạo một map để lưu thông tin người gửi
        // Chuyển danh sách users thành object { userid: displayname } (key-value)
        const userMap = {};
        users.forEach(user => {
            userMap[user.userid] = user.displayname;
        });

        // Gắn thông tin người gửi vào tin nhắn
        const messagesWithSenderInfo = messages.map(msg => ({
            senderId: msg.sender,
            senderName: userMap[msg.sender] || "Không xác định",
            text: msg.text,
            timestamp: msg.timestamp
        }));

        res.status(200).json({ message: "Lấy tin nhắn thành công!", messages: messagesWithSenderInfo });

    } catch (error) {
        console.error("❌ Lỗi lấy tin nhắn:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};



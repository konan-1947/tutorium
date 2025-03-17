const WebSocket = require("ws");
const Message = require("../models/Message"); // Model tin nhắn
const Conversation = require("../models/Conversation"); // Model cuộc trò chuyện
const Notification = require("../models/Notification"); // Model cuộc trò chuyện
const sequelize = require('../config/db'); // Import Sequelize instance
const  QueryTypes  = require('sequelize'); // Import QueryTypes để chạy raw query

const clients = new Map(); // Lưu userId -> ws connection

function setupWebSocket(server) {
    //Tạo một WebSocket server trên cùng server HTTP.
    // const wss = new WebSocket.Server({ server });
    const wss = new WebSocket.Server({ host: "0.0.0.0", port: 3001 });

    wss.on("connection", (ws, req) => {
        const userId = Number(req.url.split("?userId=")[1]); // Lấy userId từ URL WebSocket 
        if (!userId) {
            ws.close();
            return;
        }

        console.log(`📡 User ${userId} đã kết nối WebSocket`);
        clients.set(userId, ws);

        //Xử lý tin nhắn từ client:
        ws.on("message", async (message) => {
            try {
                const { conversationId, sender, text } = JSON.parse(message);
                if (!conversationId || !sender || !text) return;

                //Dùng sender (ID người gửi) để truy vấn cơ sở dữ liệu MySQL
                const userResult = await sequelize.query(
                    `SELECT displayname FROM Users WHERE userid = :sender`,
                    {
                        replacements: { sender },
                        type: QueryTypes.SELECT
                    }
                );
                const senderName = userResult[0]?.displayname || "Unknown";
                

                // Lưu tin nhắn vào MongoDB
                const newMessage = new Message({ conversationId, sender, text });
                await newMessage.save();

                // Tạo tin nhắn để gửi đi kèm tên người gửi
                const messageToSend = {
                    _id: newMessage._id,
                    conversationId,
                    sender,
                    senderName, // Đã có giá trị hợp lệ
                    text,
                    timestamp: newMessage.timestamp
                };

                // Cập nhật tin nhắn cuối cùng vào cuộc trò chuyện
                await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage: { text, sender, timestamp: newMessage.timestamp }
                });

                // Gửi tin nhắn đến cả 2 người trong cuộc trò chuyện
                const conversation = await Conversation.findById(conversationId);

                //Lặp qua các người tham gia
                for (const participant of conversation.participants) {

                    //check xem user hiện tải xem có là sender kk
                    if (participant !== sender) {
                        // Nếu người nhận đang online, gửi thông báo qua WebSocket
                        if (clients.has(participant)) {
                            const notification = {
                                type: "new_message",
                                message: `${senderName} đã gửi một tin nhắn mới`,
                                senderId: sender,
                                conversationId,
                                timestamp: new Date()
                            };
                            clients.get(participant).send(JSON.stringify({ type: "notification", data: notification }));
                        } else {
                            // Nếu người nhận offline, lưu thông báo vào mongoDB
                            await new Notification({
                                senderId: sender,
                                receiverId: participant,
                                conversationId,
                                message: `${senderName} đã gửi một tin nhắn mới`,
                                isRead: false
                            }).save();

                        }
                    }

                    //Kiểm tra trạng thái kết nối.
                    //Ví dụ User1(send) onl thì 1 nhận(hiển thị message) User2 off thì ko hiển thị.
                    if (clients.has(participant)) {
                        clients.get(participant).send(JSON.stringify(messageToSend));
                    }
                }

            } catch (error) {
                console.error("❌ Lỗi WebSocket:", error);
            }
        });

        ws.on("close", () => {
            console.log(`❌ User ${userId} đã ngắt kết nối WebSocket`);
            clients.delete(userId);
        });
    });

    console.log("✅ WebSocket đã được thiết lập!");
}

module.exports = { setupWebSocket };

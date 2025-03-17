const Conversation = require("../models/Conversation");
const  sequelize  = require('../config/db'); // Import Sequelize instance
const  QueryTypes  = require('sequelize'); // Import QueryTypes để chạy raw query
exports.getConversations = async (req, res) => {
    try {

        const userId = parseInt(req.params.userId);
        if (!userId) {
            return res.status(400).json({ message: "Thiếu userId !" });
        }

        console.log('senderID', userId);

        // Tìm tất cả cuộc trò chuyện mà user tham gia
        const conversations = await Conversation.find({
            participants: userId
        }).sort({ "lastMessage.timestamp": -1 });// sắp sếp theo ông nào nhắn gần nhất

        if (!conversations.length) {
            return res.status(200).json({ message: "Không có cuộc trò chuyện nào.", data: [] });
        }

         // Lấy danh sách userId đối phương để query MySQL
         const otherUserIds = conversations.map(conv =>
            conv.participants.find(id => id !== userId) // Lấy user còn lại trong cuộc trò chuyện
        );

        // Nếu không có user khác, trả luôn danh sách cuộc trò chuyện
        if (otherUserIds.length === 0) {
            return res.status(200).json({ message: "Danh sách cuộc trò chuyện.", data: conversations });
        }

        // Truy vấn này sẽ lấy thông tin của users có userid nằm trong mảng otherUserIds.
        const users = await sequelize.query(
            `SELECT userid, displayname, imgurl FROM Users WHERE userid IN (:otherUserIds)`,
            {
                replacements: { otherUserIds },
                type: QueryTypes.SELECT
            }
        );
        console.log(users);
       
          // Làm phẳng mảng users
          const flattenedUsers = users.flat();
          console.log("Flattened users:", flattenedUsers);
  
          // Map thông tin người dùng vào cuộc trò chuyện
          const conversationsWithUserInfo = conversations.map(conv => {
              const otherUserId = conv.participants.find(id => id !== userId);
              const otherUser = flattenedUsers.find(u => u.userid === otherUserId);
  
              console.log("Cuộc trò chuyện:", conv); // Log cuộc trò chuyện để kiểm tra
              console.log("Other user tìm được:", otherUser); // Log otherUser để kiểm tra
  
              return {
                  _id: conv._id,
                  participants: conv.participants,
                  lastMessage: conv.lastMessage,
                  createdAt: conv.createdAt,
                  otherUser: otherUser ? {
                      userid: otherUser.userid,
                      displayname: otherUser.displayname,
                      imgurl: otherUser.imgurl
                  } : null
              };
          });
        console.log("Danh sách cuộc trò chuyện với thông tin người dùng:", conversationsWithUserInfo);

        res.status(200).json({ message: "Danh sách cuộc trò chuyện.", data: conversationsWithUserInfo });

    } catch (error) {
        console.error("❌ Lỗi lấy danh sách cuộc trò chuyện:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

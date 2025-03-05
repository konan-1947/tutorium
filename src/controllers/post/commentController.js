const Comment = require("../../models/Comment");
const User = require("../../models/User")

const commentController = {
    // Lấy tất cả bình luận của một bài viết (bao gồm tên người dùng)
    async getComments(req, res) {
        try {
            const { postid } = req.params;

            // Tìm tất cả comment theo postid, kèm thông tin người dùng
            const comments = await Comment.findAll({
                where: { postid },
                include: {
                    model: User,
                    attributes: ["displayname"], // Chỉ lấy tên hiển thị
                },
                order: [["comment_time", "DESC"]], // Sắp xếp theo thời gian mới nhất
            });

            // Chuyển đổi dữ liệu để gửi về frontend
            const formattedComments = comments.map(comment => ({
                commentid: comment.commentid,
                content: comment.content,
                comment_time: comment.comment_time,
                displayname: comment.User ? comment.User.displayname : "Ẩn danh",
            }));

            res.json(formattedComments);
        } catch (error) {
            console.error("Lỗi khi lấy bình luận:", error);
            res.status(500).json({ error: "Lỗi server khi lấy bình luận" });
        }
    },

    // Thêm bình luận mới
    async createComment(req, res) {
        try {
            const { postid, content } = req.body;

            //req.session.userid = 1;
            const userid = req.session.userid; // Lấy userid từ session

            if (!userid) {
                return res.status(401).json({ error: "Bạn cần đăng nhập để bình luận" });
            }

            // Tạo bình luận mới
            const newComment = await Comment.create({
                postid,
                userid,
                content,
            });

            res.status(201).json({ message: "Bình luận thành công!", comment: newComment });
        } catch (error) {
            console.error("Lỗi khi tạo bình luận:", error);
            res.status(500).json({ error: "Lỗi server khi tạo bình luận" });
        }
    }
};

module.exports = commentController;

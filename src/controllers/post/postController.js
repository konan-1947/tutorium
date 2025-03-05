const { Op } = require('sequelize');
const Post = require('../../models/Post')
const PostImage = require('../../models/PostImage');
const Comment = require('../../models/Comment');
const User = require('../../models/User');
const { uploadToDrive } = require('../../middlewares/uploadMiddleware');
const { deleteFromDrive } = require('../../middlewares/uploadMiddleware');

// Lấy tất cả bài viết (bao gồm ảnh và bình luận)
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ["username"], // Lấy username từ bảng Users
                },
                {
                    model: PostImage,
                    attributes: ['imageurl'],
                    as: 'images' // Đảm bảo alias khớp với model association
                },
                // {
                //     model: Comment,
                //     attributes: ['commentid', 'content', 'comment_time']
                // }
            ],
            order: [['posttime', 'DESC']]
        });

        // Chuyển đổi dữ liệu để đảm bảo images là một mảng & sửa link Drive
        const formattedPosts = posts.map(post => ({
            postid: post.postid,
            userid: post.userid,
            title: post.title,
            content: post.content,
            posttime: post.posttime,
            // comments: post.Comments || [], // Tránh lỗi undefined khi không có comment
            images: post.images.map(img => convertDriveLink(img.imageurl)) // Chuyển đổi link Drive
        }));

        res.status(200).json(formattedPosts);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bài viết:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};


// lấy thông tin người dùng
exports.getUserProfile = async (req, res) => {
    try {
        const { userid } = req.params;

        // Kiểm tra nếu không có userid
        if (!userid) {
            return res.status(400).json({ message: 'Thiếu userid' });
        }

        // Tìm user trong database
        const user = await User.findOne({
            where: { userid },
            attributes: ['userid', 'displayname'] // Chỉ lấy các trường cần thiết
        });

        // Kiểm tra nếu không tìm thấy user
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Trả về thông tin user
        res.status(200).json(user);
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
// Hàm chuyển đổi link Google Drive
const convertDriveLink = (url) => {
    const match = url.match(/\/d\/(.*)\/view/);
    if (match) {
        console.log(match)
        return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
    return url; // Nếu không đúng định dạng, giữ nguyên link
};

exports.deleteImage = async (req, res) => {
    try {
        const { imageid } = req.params;

        // Tìm ảnh trong database
        const image = await PostImage.findByPk(imageid);
        if (!image) {
            return res.status(404).json({ message: 'Ảnh không tồn tại' });
        }

        // Lấy fileId từ imageurl
        const fileId = image.imageurl.split('id=')[1]; // Lấy ID từ Google Drive link

        // Xóa ảnh trên Google Drive
        const deleted = await deleteFromDrive(fileId);
        if (!deleted) {
            return res.status(500).json({ message: 'Lỗi khi xóa ảnh trên Google Drive' });
        }

        // Xóa ảnh khỏi database
        await image.destroy();

        res.status(200).json({ message: 'Ảnh đã được xóa thành công' });
    } catch (error) {
        console.error('❌ Lỗi khi xóa ảnh:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.createPost = async (req, res) => {
    try {
        //Lấy userid từ session
        //req.session.userid = 1;
        const userid = req.session.userid;
        if (!userid) {
            console.log('lỗi người dùng đăng nhập')
            return res.status(401).json({ message: 'Người dùng chưa đăng nhập' });
        }

        const { title, content } = req.body;
        const files = req.files; // Nhận file từ request
        // Kiểm tra dữ liệu đầu vào
        if (!title || !content) {
            return res.status(400).json({ message: 'Thiếu tiêu đề hoặc nội dung' });
        }

        // Tạo bài viết mới với userid từ session
        const newPost = await Post.create({ userid, title, content });

        // Nếu có ảnh, tải lên Google Drive và lưu vào PostImage
        try {
            if (files && files.length > 0) {
                const imageRecords = await Promise.all(
                    files.map(async (file) => {
                        const fileId = await uploadToDrive(file);
                        return { postid: newPost.postid, imageurl: `https://drive.google.com/file/d/${fileId}/view?usp=sharing` };
                    })
                );

                await PostImage.bulkCreate(imageRecords);
            }
        } catch (error) {
            console.log("aaaaaaaaaaaaaaaaaaaaaaaaa");
            console.log(error)
        }


        res.status(201).json({ message: 'Bài viết đã được tạo', post: newPost });
    } catch (error) {
        console.error('Lỗi khi tạo bài viết:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const { postid } = req.params;

        // Tìm bài viết theo ID
        const post = await Post.findOne({
            where: { postid },
            include: [
                {
                    model: User,
                    attributes: ["displayname"], // Lấy displayname từ bảng Users
                },
                {
                    model: PostImage,
                    attributes: ['imageurl'],
                    as: 'images'
                }
            ]
        });

        // Kiểm tra nếu không tìm thấy bài viết
        if (!post) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }

        // Chuẩn bị dữ liệu trả về
        const formattedPost = {
            postid: post.postid,
            title: post.title,
            content: post.content,
            posttime: post.posttime,
            displayname: post.User ? post.User.displayname : "Ẩn danh",
            images: post.images.map(img => convertDriveLink(img.imageurl))
        };

        res.status(200).json(formattedPost);
    } catch (error) {
        console.error('Lỗi khi lấy bài viết theo ID:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
const { Op } = require('sequelize');
const Post = require('../../models/Post')
const PostImage = require('../../models/PostImage');
const Comment = require('../../models/Comment');
const User = require('../../models/User');
const { uploadToDrive } = require('../../middlewares/uploadMiddleware');
const { deleteFromDrive } = require('../../middlewares/uploadMiddleware');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const Upvote = require('../../models/Upvote');
// Lấy tất cả bài viết (bao gồm ảnh và bình luận)
exports.getAllPosts = async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1; // Lấy page từ query, mặc định là 1
        let limit = 5; // Số bài viết mỗi trang
        let offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
        // Truy vấn danh sách bài viết có phân trang
        const { rows: posts, count: totalPosts } = await Post.findAndCountAll({
            include: [
                {
                    model: User,
                    attributes: ["username"], // Lấy username từ bảng Users
                },
                {
                    model: PostImage,
                    attributes: ["imageurl"],
                    as: "images" // Đảm bảo alias khớp với model association
                },
            ],
            order: [["posttime", "DESC"]],
            limit: limit,
            offset: offset
        });

        // Tính tổng số trang
        const totalPages = Math.ceil(totalPosts / limit);
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

        res.status(200).json({
            success: true,
            posts: formattedPosts,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bài viết:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách bài viết' });
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
        res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng' });
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
        res.status(500).json({ message: 'Lỗi khi xóa ảnh' });
    }
};

// Cấu hình Google Auth
const auth = new google.auth.GoogleAuth({
    keyFile: "../tutorium/src/config/credentials.json", // Thay bằng đường dẫn thật
    scopes: ["https://www.googleapis.com/auth/drive"],
});

// Tạo Google Docs mới
exports.createGoogleDoc = async (req, res) => {
    try {
        const drive = google.drive({ version: "v3", auth: await auth.getClient() });
        const authClient = await auth.getClient();
        const driveService = google.drive({ version: "v3", auth: authClient });
        // Tạo Google Docs
        const fileMetadata = {
            name: "New Document",
            mimeType: "application/vnd.google-apps.document",
        };

        const file = await drive.files.create({
            resource: fileMetadata,
            fields: "id",
        });

        const fileId = file.data.id; // Định nghĩa biến fileId đúng chỗ
        const docs = google.docs({ version: "v1", auth: await auth.getClient() });
        await docs.documents.batchUpdate({
         documentId: fileId,
         requestBody: {
             requests: [
                 {
                     insertText: {
                         location: { index: 1 },
                         text: "Nội dung mẫu"
                     }
                 }
             ]
         }
     });
        // Cấp quyền chỉnh sửa cho tất cả mọi người
        await driveService.permissions.create({
            fileId: fileId, // Truyền fileId đúng
            requestBody: {
                role: "writer",
                type: "anyone",
            },
        });

        const docUrl = `https://docs.google.com/document/d/${fileId}/edit`;

        res.json({ success: true, docUrl });
    } catch (error) {
        console.error("Lỗi khi tạo Google Docs:", error);
        res.status(500).json({ success: false, message: "Lỗi khi tạo Google Docs" });
    }
};

exports.createPost = async (req, res) => {
    try {
        //Lấy userid từ session
        const userid = req.session.user.userid;
        console.log(userid);
        console.log("abc"+userid);
        if (!userid) {
            console.log('lỗi người dùng đăng nhập')
            return res.status(401).json({ message: 'Người dùng chưa đăng nhập' });
        }

        const user = await User.findOne({
            where: { userid },
            attributes: ['email']
        });
        const userEmail = user.email;
        // Kiểm tra nếu không tìm thấy email
        if (!user || !user.email) {
            return res.status(400).json({ message: 'Không tìm thấy email người dùng' });
        }

        const { title, content } = req.body;  // Nhận docUrl từ frontend
        const files = req.files; // Nhận file từ request
        // Kiểm tra dữ liệu đầu vào
        if (!title) {
            return res.status(400).json({ message: 'Thiếu tiêu đề' });
        }

       

       // 🔹 Tạo bài viết với link Google Docs
       const newPost = await Post.create({ userid, title, content }); 
        
        // // 🔹 Tạo bài viết với link Google Docs trong `content`
        // const newPost = await Post.create({ userid, title, content});



        // Nếu có ảnh, tải lên Google Drive và lưu vào PostImage
  
            if (files && files.length > 0) {
                const imageRecords = await Promise.all(
                    files.map(async (file) => {
                        const fileId = await uploadToDrive(file);
                        return { postid: newPost.postid, imageurl: `https://drive.google.com/file/d/${fileId}/view?usp=sharing` };
                    })
                );

                await PostImage.bulkCreate(imageRecords);
            }


            const drive = google.drive({ version: "v3", auth: await auth.getClient() });
            const fileId = content.split("/d/")[1].split("/edit")[0]; // Lấy ID của Google Docs từ URL
    
        //     // 🔹 Sau khi tạo bài viết, chỉ chia sẻ quyền chỉnh sửa cho email của người dùng
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: "writer",
                type: "user",
                emailAddress: userEmail, // Chia sẻ quyền chỉnh sửa cho user
            },
        });


        await drive.permissions.create({
            fileId: fileId, // Truyền fileId đúng
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });

        // // // 🔹 Xóa quyền chỉnh sửa công khai
        // const permissions = await drive.permissions.list({ fileId: fileId });
        // const anyonePermission = permissions.data.permissions.find(p => p.type === "anyone");
        // if (anyonePermission) {
        //     await drive.permissions.delete({
        //         fileId,
        //         permissionId: anyonePermission.id,
        //     });
        // }
            
        res.status(201).json({ message: 'Bài viết đã được tạo', post: newPost });
    } catch (error) {
        console.error('Lỗi khi tạo bài viết:', error);
        res.status(500).json({ message: 'Lỗi khi tạo bài viết' });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const { postid } = req.params;
        const userid = req.session.user.userid; // Lấy userid từ session
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
        // Kiểm tra người dùng có phải chủ bài viết không
        const isOwner = post.User.userid === userid;
        console.log(isOwner);
        console.log("dit me may");
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
        res.status(500).json({ message: 'Lỗi khi lấy bài viết theo ID' });
    }
};

const deletePost = async (req, res) => {
    try {
        const { postid } = req.params;
        const userid = req.session.user.userid;

        const post = await Post.findOne({ where: { postid } });

        if (!post) {
            return res.status(404).json({ message: "Bài viết không tồn tại" });
        }

        if (post.userid !== userid) {
            return res.status(403).json({ message: "Bạn không có quyền xóa bài viết này!" });
        }
        // Xóa tất cả comment liên quan đến bài viết
        await Comment.destroy({
            where: { postid }
        });

        // Xóa tất cả ảnh liên quan đến bài viết
        await PostImage.destroy({
            where: { postid }
        });
        await Post.destroy({ where: { postid } });
        res.json({ success: true, message: "Bài viết đã bị xóa" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi xóa bài viết" });
    }
};
module.exports.deletePost = deletePost;

const getMyPosts = async (req, res) => {
    try {
        const userid = req.session.user.userid; // Lấy userid từ session

        if (!userid) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập" });
        }

        const myPosts = await Post.findAll({
            where: { userid },
            attributes: ['postid', 'title'],
            order: [['posttime', 'DESC']] // Sắp xếp theo ngày tạo mới nhất
        });

        res.json({ success: true, myPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Không lấy được bài viết" });
    }
};
module.exports.getMyPosts = getMyPosts;

// Toggle upvote
const toggleUpvote = async (req, res) => {
    
    try {
        const { postid } = req.body;
        console.log("Request body:", postid);  // Kiểm tra dữ liệu nhận được
        const userid = req.session.user.userid;

        if (!userid) {

            return res.status(401).json({ message: 'Unauthorized' });
            res.status(401).json({ message: 'Bạn cần đăng nhập để upvote!' });
        }

        const upvote = await Upvote.findOne({ where: { postid, userid } });
        console.log("Upvote query result:", upvote);
        console.log("upvote dee")
        if (upvote) {
            await upvote.destroy();
            return res.json({ message: 'Upvote removed' });
        } else {
            await Upvote.create({ postid, userid });
            return res.json({ message: 'Upvote added' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
module.exports.toggleUpvote = toggleUpvote;
// Get upvote count
const getUpvoteCount = async (req, res) => {
    try {
        const { postid } = req.params; // Nhận postid từ URL thay vì body
        console.log("Received postid:", postid);

        if (!postid || isNaN(postid)) {
            return res.status(400).json({ error: "Invalid Post ID" });
        }

        const count = await Upvote.count({
            where: { postid: parseInt(postid, 10) } // Chắc chắn là kiểu số
        });

        console.log(`Upvote count for post ${postid}:`, count);

        return res.json({ upvoteCount: count });
    } catch (error) {
        console.error("Error in getUpvoteCount:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports.getUpvoteCount = getUpvoteCount;


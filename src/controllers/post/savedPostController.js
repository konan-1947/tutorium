const SavedPost = require('../../models/SavedPost');
const Post = require('../../models/Post');
const PostImage = require('../../models/PostImage');

exports.savePost = async (req, res) => {
  const { postid } = req.body;
  const userid = req.session.user.userid;
  console.log("Request body:", postid);  // Kiểm tra dữ liệu nhận được
  console.log("loi roi cac chau oi");
  try {
    await SavedPost.findOrCreate({
      where: { userid, postid }
    });
    req.session.message = 'Đã lưu bài viết!';
    res.redirect('/save'); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not save post.' });
  }
};

exports.getSavedPostsJSON = async (req, res) => {
  const userid = req.session.user.userid;
  if (!userid) {
    return res.status(401).json({ error: 'Bạn chưa đăng nhập' });
  }
  try {
    const saved = await SavedPost.findAll({
      where: { userid },
      include: {
        model: Post,
        as: 'post',
        include: { model: PostImage, as: 'images' }
      }
    });
    console.log(JSON.stringify(saved, null, 2)); // Kiểm tra kết quả
    const posts = saved.map(entry => entry.post);
    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Không thể tải bài viết đã lưu' });
  }
};


exports.unsavePost = async (req, res) => {
  const { postid } = req.params;
  const userid = req.session.user.userid;

  try {
    const deleted = await SavedPost.destroy({
      where: {
        postid,
        userid
      }
    });

    if (deleted === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết đã lưu để xóa.' });
    }

    res.json({ message: 'Đã gỡ bài viết khỏi mục đã lưu.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Xảy ra lỗi khi gỡ bài viết.' });
  }
};
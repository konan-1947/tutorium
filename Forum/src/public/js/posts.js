async function fetchPosts() {
    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        const container = document.getElementById('posts-container');
        container.innerHTML = '';

        if (posts.length === 0) {
            container.innerHTML = '<p>Không có bài viết nào.</p>';
            return;
        }

        posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            postDiv.innerHTML = `
                <h2>${post.title}</h2>
                <p class="meta">Tác giả: ${post.authorName} | Ngày đăng: ${new Date(post.created_at).toLocaleString()}</p>
                
                <div class="content-frame" style="width: 1250px; height: 500px; overflow: hidden; position: relative;">
                    <iframe src="${post.content}" loading="lazy" style="
                        width: 1250px;  /* Để đảm bảo có thể cắt lề */
                        height: 700px;
                        border: none; 
                        position: absolute;
                        left: -200px; /* Dịch sang trái để bỏ sidebar */
                        top: -150px;  /* Điều chỉnh phần header */
                        clip-path: inset(0px 150px 0px 250px);
                        transform: translateX(175px);">
                    </iframe>
                </div>
                
                <div class="comments">
                    <h3>Bình luận:</h3>
                    <ul class="comments-list" data-post-id="${post._id}">
                        ${renderComments(post.comments)}
                    </ul>
                    <div class="add-comment">
                        <input type="text" id="comment-author-${post._id}" placeholder="Tên của bạn..." class="comment-input" data-post-id="${post._id}" />
                        <input type="text" placeholder="Nhập bình luận..." class="comment-input" data-post-id="${post._id}" />
                        <button>Thêm bình luận</button>
                    </div>
                </div>
            `;

            container.appendChild(postDiv);

            const commentList = postDiv.querySelector('.comments-list');
            const addButton = postDiv.querySelector('.add-comment button');

            addButton.onclick = () => addComment(post._id, commentList);

            // Gán event listeners cho nút "Sửa" và "Xóa" của các bình luận cũ
            const commentElements = commentList.querySelectorAll('.comment');
            commentElements.forEach(commentElement => {
                const commentId = commentElement.dataset.commentId;
                const commentContent = commentElement.querySelector('p:nth-child(2)').textContent;

                const editButton = commentElement.querySelector('.edit-button');
                const deleteButton = commentElement.querySelector('.delete-button');

                if (editButton && deleteButton) { // Kiểm tra nút tồn tại trước khi thêm listener
                    editButton.addEventListener('click', () => {
                        showEditForm(commentId, commentContent, commentElement);
                    });

                    deleteButton.addEventListener('click', () => {
                        if (confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
                            deleteComment(commentId, commentElement);
                        }
                    });
                }
            });
        });
    } catch (error) {
        console.error('Lỗi khi lấy bài viết:', error);
        document.getElementById('posts-container').innerHTML = '<p>Lỗi khi tải bài viết.</p>';
    }
}

function renderComments(comments) {
    if (!comments || comments.length === 0) {
        return '<li><p>Chưa có bình luận nào.</p></li>';
    }

    const tempDiv = document.createElement('div'); // Tạo div tạm thời

    comments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        tempDiv.appendChild(commentElement); // Thêm comment vào div tạm thời
    });

    return tempDiv.innerHTML; // Lấy innerHTML của div tạm thời
}

async function addComment(postId, commentList) {
    const inputElem = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
    const commentText = inputElem.value.trim();
    const authorNameInput = document.getElementById(`comment-author-${postId}`);
    const authorName = authorNameInput.value.trim();
    
    

    if (!authorName) {
        alert('Vui lòng nhập tên của bạn.');
        return;
    }

    if (!commentText) {
        alert('Vui lòng nhập nội dung bình luận.');
        return;
    } 

    //const authorName = 'Minh';

    try {
        const response = await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post: postId, authorName, content: commentText })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Lỗi khi thêm bình luận');
        }

        const newComment = await response.json();
        inputElem.value = '';
        authorNameInput.value = '';

        const newCommentElement = createCommentElement(newComment); // Tạo element *sau* khi có newComment
        commentList.appendChild(newCommentElement);
        if (commentList) {
            const newCommentElement = document.createElement('li');
            newCommentElement.className = 'comment'; // Thêm class 'comment' cho li
            newCommentElement.innerHTML = `
        <p><strong>${newComment.authorName}</strong> nói:</p>
        <p>${newComment.content}</p>
        <p class="meta">Ngày: ${new Date(newComment.created_at).toLocaleString()}</p>
    `;
            commentList.appendChild(newCommentElement);
        } else {
            console.error("Không tìm thấy danh sách bình luận cho bài viết:", postId);
        }
    } catch (error) {
        console.error(error);
        alert(error.message || 'Thêm bình luận không thành công.');
    }
}

function createCommentElement(comment) {
    const commentElement = document.createElement('li');
    commentElement.className = 'comment';
    commentElement.dataset.commentId = comment._id;

    commentElement.innerHTML = `
        <p><strong>${comment.authorName}</strong> nói:</p>
        <p>${comment.content}</p>
        <p class="meta">Ngày: ${new Date(comment.created_at).toLocaleString()}</p>
        <button class="edit-button">Sửa</button> <button class="delete-button">Xóa</button> 
    `;

    const editButton = commentElement.querySelector('.edit-button');
    const deleteButton = commentElement.querySelector('.delete-button');

    // Thêm event listener cho nút "Sửa"
    editButton.addEventListener('click', () => {
        showEditForm(comment._id, comment.content, commentElement);
    });

    // Thêm event listener cho nút "Xóa"
    deleteButton.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
            deleteComment(comment._id, commentElement);
        }
    });

    return commentElement;
}

async function addComment(postId, commentList) {
    const inputElem = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
    const commentText = inputElem.value.trim();
    const authorNameInput = document.getElementById(`comment-author-${postId}`);
    const authorName = authorNameInput.value.trim();

    if (!commentText) {
        alert('Vui lòng nhập nội dung bình luận.');
        return;
    }

    if (!authorName) {
        alert('Vui lòng nhập tên của bạn.');
        return;
    }

    try {
        const response = await fetch('/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post: postId,
                authorName,
                content: commentText
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Lỗi khi thêm bình luận');
        }

        const newComment = await response.json();

        inputElem.value = '';
        authorNameInput.value = '';

        const newCommentElement = createCommentElement(newComment);
        commentList.appendChild(newCommentElement);

    } catch (error) {
        console.error(error);
        alert(error.message || 'Thêm bình luận không thành công.');
    }
}

function showEditForm(commentId, commentContent, commentElement) {
    const editForm = document.createElement('form');
    editForm.className = 'edit-comment-form';
    editForm.dataset.commentId = commentId;
    editForm.innerHTML = `
        <input type="text" value="${commentContent}" />
        <button type="submit">Lưu</button>
        <button type="button">Hủy</button>
    `;

    commentElement.innerHTML = '';
    commentElement.appendChild(editForm);

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newContent = editForm.querySelector('input').value;
        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: newContent })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lỗi khi cập nhật bình luận');
            }

            const updatedComment = await response.json();

            // Cập nhật nội dung bình luận *trực tiếp*
            const authorElement = commentElement.querySelector('p:nth-child(1)');
            if (authorElement) {
                authorElement.textContent = updatedComment.authorName;
            }

            const contentElement = commentElement.querySelector('p:nth-child(2)');
            if (contentElement) {
                contentElement.textContent = updatedComment.content;
            }

            const metaElement = commentElement.querySelector('.meta');
            if (metaElement) {
                metaElement.textContent = new Date(updatedComment.created_at).toLocaleString();
            }

            // Khôi phục nút bấm "Sửa" và "Xóa" (nếu cần)
            const editButton = commentElement.querySelector('.edit-button');
            const deleteButton = commentElement.querySelector('.delete-button');

            if (!editButton || !deleteButton) {
                commentElement.innerHTML = `
                    <p><strong>${updatedComment.authorName}</strong> nói:</p>
                    <p>${updatedComment.content}</p>
                    <p class="meta">Ngày: ${new Date(updatedComment.created_at).toLocaleString()}</p>
                    <button class="edit-button">Sửa</button> <button class="delete-button">Xóa</button> 
                `;
            }

            const editButtonNew = commentElement.querySelector('.edit-button');
            const deleteButtonNew = commentElement.querySelector('.delete-button');
            editButtonNew.addEventListener('click', () => {
                showEditForm(updatedComment._id, updatedComment.content, commentElement);
            });

            deleteButtonNew.addEventListener('click', () => {
                if (confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
                    deleteComment(updatedComment._id, commentElement);
                }
            });
        } catch (error) {
            console.error(error);
            alert(error.message || 'Cập nhật bình luận không thành công.');
        }
    });

    editForm.querySelector('button[type="button"]').addEventListener('click', () => {
        commentElement.innerHTML = `
            <p><strong>${comment.authorName}</strong> nói:</p>
            <p>${comment.content}</p>
            <p class="meta">Ngày: ${new Date(comment.created_at).toLocaleString()}</p>
            <button class="edit-button">Sửa</button> <button class="delete-button">Xóa</button> 
        `;

        // Thêm lại event listener cho nút "Sửa" và "Xóa"
        const editButton = commentElement.querySelector('.edit-button');
        const deleteButton = commentElement.querySelector('.delete-button');

        editButton.addEventListener('click', () => {
            showEditForm(comment._id, comment.content, commentElement);
        });

        deleteButton.addEventListener('click', () => {
            if (confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
                deleteComment(comment._id, commentElement);
            }
        });
    });
}

async function deleteComment(commentId, commentElement) {
    try {
        const response = await fetch(`/api/comments/${commentId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Lỗi khi xóa bình luận');
        }

        commentElement.remove();

    } catch (error) {
        console.error(error);
        alert(error.message || 'Xóa bình luận không thành công.');
    }
}


window.addEventListener('DOMContentLoaded', fetchPosts);
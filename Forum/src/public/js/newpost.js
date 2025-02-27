// document.getElementById('newPostForm').addEventListener('submit', async function (e) {
//     e.preventDefault();
//     const form = e.target;
//     const data = {
//         title: form.title.value,
//         content: form.content.value,
//         authorName: form.authorName.value
//     };
//     try {
//         const response = await fetch('/api/posts', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(data)
//         });
//         const messageDiv = document.getElementById('message');
//         if (response.ok) {
//             messageDiv.textContent = 'Đã thêm mới thành công!';
//         } else {
//             messageDiv.textContent = 'Thêm bài viết không thành công.';
//         }
//     } catch (error) {
//         console.error(error);
//         document.getElementById('message').textContent = 'Thêm bài viết không thành công.';
//     }
//     // Sau 2 giây chuyển hướng về trang danh sách bài viết
//     setTimeout(() => {
//         window.location.href = '/posts';
//     }, 2000);
// });

document.getElementById('newPostForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = e.target;
    const data = {
        title: form.title.value,
        content: form.content.value,
        authorName: form.authorName.value
    };

    console.log("Dữ liệu gửi lên:", data); // In dữ liệu trước khi gửi

    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        console.log("Response từ server:", response); // In response

        if (response.ok) {
            const responseData = await response.json(); // Lấy dữ liệu từ response body
            console.log("Dữ liệu trả về từ server:", responseData); // In dữ liệu trả về
            document.getElementById('message').textContent = 'Đã thêm mới thành công!';
        } else {
            const errorData = await response.json(); // Lấy dữ liệu lỗi từ response body
            console.error("Lỗi từ server:", errorData); // In chi tiết lỗi
            document.getElementById('message').textContent = 'Thêm bài viết không thành công.';
        }
    } catch (error) {
        console.error("Lỗi client:", error); // In lỗi client
        document.getElementById('message').textContent = 'Thêm bài viết không thành công.';
    }

    setTimeout(() => {
        window.location.href = '/posts';
    }, 2000);
});
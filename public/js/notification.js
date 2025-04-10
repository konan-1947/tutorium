const userId = localStorage.getItem("userId"); // Lấy userId từ localStorage
// const userId = 21;

const notificationIcon = document.getElementById("notificationIcon");
const notificationBadge = document.getElementById("notificationBadge");
const notificationDropdown = document.getElementById("notificationDropdown");
const notificationList = document.getElementById("notificationList");

// Kết nối WebSocket
const socket = new WebSocket(`ws://localhost:3001?userId=${userId}`);

socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);

    // Nếu nhận được sự kiện "notification"
    if (data.type === "notification") {
        showNotification(data.message);
    }
});

// Gọi API lấy thông báo chưa đọc khi mở app
async function fetchNotifications() {
    try {
        const res = await fetch(`/api/notification/${userId}`);
        const data = await res.json();

        // Kiểm tra xem phản hồi có thành công và dữ liệu có phải là một mảng không
        if (data.success && Array.isArray(data.data)) {
            const notifications = data.data;
            
            // Duyệt qua từng thông báo và show chúng
            notifications.forEach((notif) => {
                showNotification(notif.message);
            });
        } else {
            console.error("Dữ liệu thông báo không hợp lệ:", data);
        }
    } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
    }
}

// Hiển thị thông báo trong danh sách
function showNotification(message) {
    const item = document.createElement("div");
    item.classList.add("notification-item"); //thêm css để vào đúng định dạng 
    item.textContent = message;

    // Thêm phần tử thông báo vào danh sách thông báo
    notificationList.appendChild(item);


    // Đếm và show số notif 
    const count = notificationList.children.length;
    notificationBadge.textContent = count;
    notificationBadge.style.display = "inline-block";
}

// Xử lý khi nhấn vào biểu tượng 🔔
notificationIcon.addEventListener("click", () => {
    notificationDropdown.style.display =
        notificationDropdown.style.display === "block" ? "none" : "block";
});

// Lấy thông báo chưa đọc khi mở lại app
fetchNotifications();

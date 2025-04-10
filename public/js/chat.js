document.addEventListener("DOMContentLoaded", async function () {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("Bạn chưa đăng nhập!");
        return;
    }
    // const userId = 21; // Sử dụng userId mặc định là 21 để test
    // if (!userId) {
    //     alert("Bạn chưa đăng nhập!");
    //     return;
    // }

    const conversationsContainer = document.getElementById("conversations");
    const messagesContainer = document.getElementById("messages");
    const messageInput = document.getElementById("messageText");
    const sendMessageButton = document.getElementById("sendMessage");

    let activeConversationId = null; //Lưu ID cuộc trò chuyện đang mở
    let socket = null; //Lưu kết nối WebSocket

    // Kết nối WebSocket
    function connectWebSocket() {
        socket = new WebSocket(`wss://localhost:3001?userId=${userId}`);

        socket.onopen = () => console.log("✅ Kết nối WebSocket thành công!");

        // Khi server gửi tin nhắn mới, nếu nó thuộc cuộc trò chuyện đang mở, hiển thị tin nhắn.
        socket.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            if (newMessage.conversationId === activeConversationId) {
                appendMessage(newMessage);
            }
        };

        socket.onclose = () => console.log("Mất kết nối WebSocket.");
    }

    connectWebSocket();

    // Lấy danh sách cuộc trò chuyện
    async function loadConversations() {
        try {
            const response = await fetch(`/api/user/conversations/${userId}`);
            const result = await response.json();

            console.log("Phản hồi từ API:", result); // Log phản hồi để kiểm tra
            //check result.data (mảng chứa các cuộc trò chuyện) rỗng
            if (result.data.length === 0) {
                conversationsContainer.innerHTML = "<p>Không có cuộc trò chuyện nào.</p>";
                return;
            }

            //Dùng để duyệt qua từng phần tử trong mảng result.data và tạo ra một mảng mới chứa  chuỗi HTML đại diện conversation.
            conversationsContainer.innerHTML = result.data.map(conv => {
                const { _id, otherUser, lastMessage } = conv;
                return `
                    <div class="conversation" data-id="${_id}">
                        <div class="avatar-placeholder">${otherUser?.displayname?.charAt(0) || "null"}</div>
                        <div>
                            <strong>${otherUser?.displayname || "Người dùng"}</strong>
                            <p>${lastMessage?.text || "Chưa có tin nhắn"}</p>
                        </div>
                    </div>
                `;
            }).join(""); // kết hợp các chuỗi HTML lại.

            //Khi click conversation , cập nhật activeConversationId vaf load message của conversation
            document.querySelectorAll(".conversation").forEach(item => {
                item.addEventListener("click", async function () {
                    activeConversationId = this.getAttribute("data-id");
                    await loadMessages(activeConversationId);
                });
            });

        } catch (error) {
            console.error("Lỗi khi lấy danh sách cuộc trò chuyện:", error);
            conversationsContainer.innerHTML = "<p>Lỗi tải dữ liệu.</p>";
        }
    }

    // Lấy tin nhắn của cuộc trò chuyện
    async function loadMessages(conversationId) {
        try {
            const response = await fetch(`/api/messages/message/${conversationId}`);
            const result = await response.json();

            console.log('Phan hoi api',result)
            //check result.data (mảng chứa cuộc trò chuyện) rỗng
            if (!result.messages.length) {
                messagesContainer.innerHTML = "<p>Chưa có tin nhắn nào.</p>";
                return;
            }

            messagesContainer.innerHTML = result.messages.map(msg => `
                <div class="message ${msg.senderId == userId ? 'sent' : 'received'}">
                    <p><strong>${msg.senderName}</strong>: ${msg.text}</p>
                    <span>${new Date(msg.timestamp).toLocaleString()}</span>
                </div>
            `).join("");

        } catch (error) {
            console.error("Lỗi khi lấy tin nhắn:", error);
            messagesContainer.innerHTML = "<p>Lỗi tải tin nhắn.</p>";
        }
    }

    // Gửi tin nhắn
    sendMessageButton.addEventListener("click", async function () {
        const text = messageInput.value.trim();
        if (!text || !activeConversationId) return;

        //Tạo đối tượng chứa dữ liệu tin nhắn
        const messageData = {
            conversationId: activeConversationId,
            sender: userId,
            text: text
        };

        //Gửi tin nhắn qua WebSocket.
        socket.send(JSON.stringify(messageData));

        //Xóa nội dung trong ô nhập tin nhắn sau khi gửi.
        messageInput.value = "";
    });

    // Hiển thị tin nhắn mới trên UI (nối tin nhắn)
    function appendMessage(msg) {
        messagesContainer.innerHTML += renderMessage(msg);
    }

    // Hàm định dạng tin nhắn
    function renderMessage(msg) {
        return `
           <div class="message ${msg.sender === userId ? 'sent' : 'received'}">
            <p><strong>${msg.senderName || "Không xác định"}</strong>: ${msg.text}</p>
            <span>${new Date(msg.timestamp).toLocaleString()}</span>
        </div>

        `;
    }

    loadConversations();
});

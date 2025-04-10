/**
 * Service để lấy lịch sử tin nhắn giữa hai người dùng
 * @param {number|string} userid - ID của người dùng hiện tại
 * @param {number|string} receiverId - ID của người nhận
 * @returns {Array} - Danh sách tin nhắn
 * @throws {Error} - Nếu lỗi khi gọi API CometChat
 */
const getConversationService = async (userid, receiverId) => {
    // Gọi API CometChat để lấy lịch sử tin nhắn
    const messagesUrl = `https://${process.env.COMETCHAT_APP_ID}.api-${process.env.COMETCHAT_REGION}.cometchat.io/v3/messages?uid=${receiverId}&msgType=text&perPage=50&page=1`;
    const messagesOptions = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'apikey': process.env.COMETCHAT_REST_API_KEY
        }
    };

    const messagesResponse = await fetch(messagesUrl, messagesOptions);
    if (!messagesResponse.ok) {
        const errorData = await messagesResponse.json();
        throw new Error(`Lấy lịch sử tin nhắn thất bại: ${messagesResponse.status} - ${JSON.stringify(errorData)}`);
    }

    const messagesData = await messagesResponse.json();
    const messages = messagesData.data || [];

    // Trả về danh sách tin nhắn
    return messages;
};

module.exports = { getConversationService };
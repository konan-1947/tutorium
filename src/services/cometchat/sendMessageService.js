// file: services/cometchat/sendMessageService.js

/**
 * Service để gửi tin nhắn
 * @param {number|string} senderId - ID của người gửi
 * @param {number|string} receiverId - ID của người nhận
 * @param {string} message - Nội dung tin nhắn
 * @returns {Object} - Thông tin tin nhắn đã gửi
 * @throws {Error} - Nếu lỗi khi gọi API CometChat
 */
const sendMessageService = async (senderId, receiverId, message) => {
    const url = `https://${process.env.COMETCHAT_APP_ID}.api-${process.env.COMETCHAT_REGION}.cometchat.io/v3/messages`;
    const options = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'apikey': process.env.COMETCHAT_REST_API_KEY
      },
      body: JSON.stringify({
        receiver: receiverId.toString(),
        receiverType: 'user',
        category: 'message',
        type: 'text',
        data: { text: message }
      })
    };
  
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gửi tin nhắn thất bại: ${response.status} - ${JSON.stringify(errorData)}`);
    }
  
    return await response.json();
  };
  
  module.exports = { sendMessageService };
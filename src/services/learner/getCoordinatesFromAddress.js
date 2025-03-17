const axios = require('axios');

// Hàm lấy tọa độ từ địa chỉ
async function getCoordinatesFromAddress(address) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=1`;
    const response = await axios.get(url);
    const data = response.data;

    if (data.length > 0) {
      const latitude = parseFloat(data[0].lat);
      const longitude = parseFloat(data[0].lon);
      return { latitude, longitude };
    } else {
      throw new Error('Không tìm thấy địa chỉ này');
    }
  } catch (error) {
    throw new Error('Có lỗi khi tìm kiếm: ' + error.message);
  }
}

module.exports = { getCoordinatesFromAddress };
// Hàm chuyển đổi độ sang radian
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
  };
  
  // Hàm tính khoảng cách Haversine
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Bán kính Trái Đất (km)
    const phi1 = Math.radians(lat1);
    const phi2 = Math.radians(lat2);
    const deltaPhi = Math.radians(lat2 - lat1);
    const deltaLambda = Math.radians(lon2 - lon1);
  
    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c; // Khoảng cách tính bằng km
    return distance;
  }
  
  module.exports = { haversine };
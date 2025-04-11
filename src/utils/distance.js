// Hàm chuyển đổi độ sang radian
Math.radians = function(degrees) {
  const radians = degrees * Math.PI / 180;
  console.log(`Chuyển đổi độ ${degrees} => radian ${radians}`);
  return radians;
};

// Hàm tính khoảng cách Haversine
function haversine(lat1, lon1, lat2, lon2) {
  console.log("=== Bắt đầu tính Haversine ===");
  console.log(`Tọa độ điểm 1: lat1 = ${lat1}, lon1 = ${lon1}`);
  console.log(`Tọa độ điểm 2: lat2 = ${lat2}, lon2 = ${lon2}`);

  const R = 6371; // Bán kính Trái Đất (km)
  const phi1 = Math.radians(lat1);
  const phi2 = Math.radians(lat2);
  const deltaPhi = Math.radians(lat2 - lat1);
  const deltaLambda = Math.radians(lon2 - lon1);

  console.log(`phi1: ${phi1}, phi2: ${phi2}`);
  console.log(`deltaPhi: ${deltaPhi}, deltaLambda: ${deltaLambda}`);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  console.log(`Giá trị a: ${a}`);
  console.log(`Giá trị c (góc trung tâm): ${c}`);
  console.log(`Khoảng cách: ${distance} km`);
  console.log("=== Kết thúc tính Haversine ===");

  return distance;
}

module.exports = { haversine };

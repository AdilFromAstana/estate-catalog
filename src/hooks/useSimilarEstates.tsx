// import { type Estate } from "../contants/estates";

// export const useSimilarEstates = (currentEstate: Estate) => {
//   // 1. Похожие по цене (±20%)
//   const similarByPrice = astanaEstates.filter(
//     (e) =>
//       e.id !== currentEstate.id &&
//       Math.abs(e.price - currentEstate.price) <= currentEstate.price * 0.2
//   );

//   // 2. В том же районе
//   const sameDistrict = astanaEstates.filter(
//     (e) => e.id !== currentEstate.id && e.district === currentEstate.district
//   );

//   // 3. Точное совпадение по комнатам и категории
//   const similarByRooms = astanaEstates.filter(
//     (e) =>
//       e.id !== currentEstate.id &&
//       e.category === currentEstate.category &&
//       e.roomCount === currentEstate.roomCount
//   );

//   // 4. Самые похожие (все критерии вместе)
//   const mostSimilar = astanaEstates.filter(
//     (e) =>
//       e.id !== currentEstate.id &&
//       e.district === currentEstate.district &&
//       Math.abs(e.price - currentEstate.price) <= currentEstate.price * 0.2 &&
//       Math.abs(e.roomCount - currentEstate.roomCount) <= 1
//   );

//   return {
//     similarByPrice,
//     sameDistrict,
//     similarByRooms,
//     mostSimilar,
//   };
// };

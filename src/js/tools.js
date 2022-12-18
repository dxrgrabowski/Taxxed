export function hyperboleEq(v) {
  //return v * (1 / (v * 0.46868) + 0.886797) ** 1.22426;
  return v * (1 / (v * 0.299) + 0.8139) ** 1.107;
}
export function clickedEmplType(id) {
  employmentForm = id;
  console.log("worked");
}
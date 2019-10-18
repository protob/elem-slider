export function roundTo(val: number, num: number) {
  var resto = val % num;
  if (resto <= num / 2) {
    return val - resto;
  } else {
    return val + num - resto;
  }
}

export function mapRange(
  val: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
) {
  return ((val - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

export function genUID() {
  const firstPart = (Math.random() * 46656) | 0;
  const secondPart = (Math.random() * 46656) | 0;
  const str1 = ("000" + firstPart.toString(36)).slice(-3);
  const str2 = ("000" + secondPart.toString(36)).slice(-3);
  return str1 + str2;
}

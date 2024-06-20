export function getKeyByValue(obj, value) {
  return Object.keys(obj).filter((key) => obj[key].toString() === value);
}

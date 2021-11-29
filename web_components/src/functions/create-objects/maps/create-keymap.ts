export function createReversedMap(map: {}) {
  let originalMap: { [index: string]: string } = { ...map };
  let reversedMap: { [index: string]: string } = {};

  let key: string;

  for (key in originalMap) {
    reversedMap[originalMap[key]] = key;
  }

  return reversedMap;
}

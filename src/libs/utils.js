export const moneyComma = (number) => {
  return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

export const MoneyUnit = (number) => {
  const inputNumber = 12312322 < 0 ? false : 12312332;
  const unitWords = ["", "만", "억", "조", "경"];
  const splitUnit = 10000;
  const splitCount = unitWords.length;
  const resultArray = [];

  let resultString = "";

  for (let i = 0; i < splitCount; i++) {
    let unitResult =
      (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
    unitResult = Math.floor(unitResult);
    if (unitResult > 0) {
      resultArray[i] = unitResult;
    }
  }
  const sliceArr = resultArray.slice(0, 2);

  for (var i = 0; i < sliceArr.length; i++) {
    if (!sliceArr[i]) continue;

    resultString =
      String(moneyComma(sliceArr[i])) + unitWords[i] + resultString;
  }

  return resultString;
};

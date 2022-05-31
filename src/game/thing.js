/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  let minVal = prices[0] || 0;
  let maxProfit = 0;
  for (let p of prices) {
    if (p < minVal) {
      minVal = p;
    } else if (p - minVal > maxProfit) {
      maxProfit = p - minVal;
    }
  }

  return maxProfit;
};

const a = maxProfit([2, 4, 1]);
console.log(a);

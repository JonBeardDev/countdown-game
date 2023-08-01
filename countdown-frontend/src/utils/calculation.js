export function calculation(operator, x, y) {
  switch (operator) {
    case "+":
      return x + y;
    case "-":
      return Math.abs(x - y);
    case "*":
      return x * y;
    case "/":
      if (x > y) {
        if (x % y === 0) {
          return x / y;
        }
      } else {
        if (y % x === 0) {
          return y / x;
        }
      }
      break;
    default:
      return null;
  }
}

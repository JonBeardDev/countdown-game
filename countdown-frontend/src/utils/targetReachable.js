export function targetReachable(numbers, target) {
  if (numbers.length === 1) {
    return numbers[0] === target ? [{ operation: null, numbers }] : [];
  }

  const steps = [];

  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      if (i !== j) {
        const x = numbers[i];
        const y = numbers[j];
        const nextNumbers = numbers.filter(
          (num, index) => index !== i && index !== j
        );

        // Addition
        steps.push({ operation: "+", numbers: [x, y] });
        const resultAdd = targetReachable([...nextNumbers, x + y], target);
        if (resultAdd.length > 0) {
          return [...steps, ...resultAdd];
        }
        steps.pop();

        // Subtraction
        if (x > y) {
          steps.push({ operation: "-", numbers: [x, y] });
          const resultSubtract = targetReachable(
            [...nextNumbers, x - y],
            target
          );
          if (resultSubtract.length > 0) {
            return [...steps, ...resultSubtract];
          }
          steps.pop();
        }

        // Multiplication
        steps.push({ operation: "*", numbers: [x, y] });
        const resultMultiply = targetReachable([...nextNumbers, x * y], target);
        if (resultMultiply.length > 0) {
          return [...steps, ...resultMultiply];
        }
        steps.pop();

        // Division
        if (x % y === 0) {
          steps.push({ operation: "/", numbers: [x, y] });
          const resultDivide = targetReachable([...nextNumbers, x / y], target);
          if (resultDivide.length > 0) {
            return [...steps, ...resultDivide];
          }
          steps.pop();
        }
      }
    }
  }

  return [];
}

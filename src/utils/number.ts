import { Decimal } from "decimal.js";

/**
 * Converts a number in exponential notation to a string representation.
 * @param number - The number in exponential notation.
 * @returns A string representation of the number without exponential notation.
 */
export function convertExponentialToString(number: Number) : string {
  const decimalNum = new Decimal(String(number));
  return decimalNum.toFixed();
}

/**
 * Normalizes a token value by converting it to a human-readable format based on decimals.
 * @param value - The token value.
 * @param decimals - The number of decimal places.
 * @returns The normalized token value as a string.
 */
export function normalizedValue(value:string,decimals:number) :string {
  return convertExponentialToString(parseInt(value) / (10 ** decimals))
}


export function getRandomPositiveInteger() {
  var timestamp = new Date().getTime().toString();
  var randomNumber = Math.floor(Math.random() * 1000000); // Generate random number between 0 and 999999
  var combinedValue = timestamp + randomNumber.toString(); // Combine timestamp and random number
  var shuffledValue = shuffleString(combinedValue); // Shuffle the combined string
  var finalNumber = parseInt(shuffledValue.slice(0, 6)); // Take first 6 digits after shuffling
  return finalNumber;
}

// Function to shuffle a string (Fisher-Yates shuffle)
export function shuffleString(str:string) {
  var array = str.split('');
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array.join('');
}
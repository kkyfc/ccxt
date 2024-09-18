// ----------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code
// EDIT THE CORRESPONDENT .ts FILE INSTEAD

// import * as json from 'lossless-json';
const json = global.JSON;
/**
 * Convert string to number or bigint based on size
 */
const parseIntAsNumberOrBigInt = (x) => {
    // if (!json.isInteger(x)) return parseFloat(x);
    const v = parseInt(x, 10);
    return Number.isSafeInteger(v) ? v : BigInt(x);
};
/**
 * Convert JSON string to JSON object
 *
 * NOTE: the String() wrapping is used so the behavior conforms to JSON.parse()
 * which can accept simple data types but is not represented in the default typing
 * @param x JSON string
 */
// export const parse = (x: string): any => json.parse(String(x), undefined, parseIntAsNumberOrBigInt);
export const parse = (x) => json.parse(String(x), undefined);
/**
 * Convert JSON string to JSON object with all numbers as bigint
 * @param x JSON string
 */
// json.parse(String(x), undefined, json.parseNumberAndBigInt);
export const parseAlwaysAsBig = (x) => json.parse(String(x), undefined);
/**
 * Convert JSON object to JSON string
 *
 * NOTE: the not-null assertion is used so the return type conforms to JSON.stringify()
 * which can also return undefined but is not represented in the default typing
 * json.NumberStringifier[]
 * @returns JSON string
 */
// json.stringify(value, replacer, space, numberStringifiers)!;
export const stringify = (value, replacer, space, numberStringifiers) => json.stringify(value, replacer, space);
/** @deprecated equivalent to 'stringify', alias will be removed */
export const stringifyAlwaysAsBig = stringify;

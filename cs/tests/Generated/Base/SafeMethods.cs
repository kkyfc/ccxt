using ccxt;
namespace Tests;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

public partial class BaseTest
{
        public void testSafeMethods()
        {
            var exchange = new ccxt.Exchange(new Dictionary<string, object>() {
                { "id", "regirock" },
            });
            object inputDict = new Dictionary<string, object>() {
                { "a", 1 },
                { "bool", true },
                { "list", new List<object>() {1, 2, 3} },
                { "dict", new Dictionary<string, object>() {
                    { "a", 1 },
                } },
                { "str", "hello" },
            };
            object inputList = new List<object>() {"hi", 2};
            // safeValue
            Assert(isEqual(exchange.safeValue(inputDict, "a"), 1));
            Assert(isEqual(exchange.safeValue(inputDict, "bool"), true));
            Assert(equals(exchange.safeValue(inputDict, "list"), new List<object>() {1, 2, 3}));
            object dictObject = exchange.safeValue(inputDict, "dict");
            Assert(equals(dictObject, new Dictionary<string, object>() {
                { "a", 1 },
            }));
            Assert(isEqual(exchange.safeValue(inputList, 0), "hi"));
            // safeValue2
            Assert(isEqual(exchange.safeValue2(inputDict, "b", "a"), 1));
            Assert(isEqual(exchange.safeValue2(inputDict, "s", "bool"), true));
            // safeString
            Assert(isEqual(exchange.safeString(inputDict, "a"), "1"));
            // Assert (exchange.safeString (inputDict, 'bool') === 'true'); returns True in python and 'true' in js
            Assert(isEqual(exchange.safeString(inputList, 0), "hi"));
            Assert(isEqual(exchange.safeString(inputDict, "str"), "hello"));
            // safeInteger
            Assert(isEqual(exchange.safeInteger(inputDict, "a"), 1));
            Assert(isEqual(exchange.safeInteger2(inputDict, "b", "a"), 1));
        }
}
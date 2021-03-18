"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEncodableNum = exports.getExpMantissa = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const BN = bignumber_js_1.default.clone({ EXPONENTIAL_AT: 1e9 });
const smallEnoughNumber = new BN('100000000');
// Returns the mantissa of an Exp with given floating value
function getExpMantissa(float) {
    // Workaround from https://github.com/ethereum/web3.js/issues/1920
    const str = Math.floor(float * 1.0e18).toString();
    return toEncodableNum(str);
}
exports.getExpMantissa = getExpMantissa;
function toEncodableNum(amountArgRaw) {
    const bigNumber = new BN(amountArgRaw);
    return bigNumber.lt(smallEnoughNumber) ? bigNumber.toNumber() : bigNumber;
}
exports.toEncodableNum = toEncodableNum;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW5jb2RpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvRW5jb2RpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0VBQXFDO0FBRXJDLE1BQU0sRUFBRSxHQUFHLHNCQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsY0FBYyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUE7QUFDbkQsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUk5QywyREFBMkQ7QUFDM0QsU0FBZ0IsY0FBYyxDQUFDLEtBQWE7SUFDMUMsa0VBQWtFO0lBQ2xFLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBRWxELE9BQU8sY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFMRCx3Q0FLQztBQUVELFNBQWdCLGNBQWMsQ0FBQyxZQUFvQztJQUMvRCxNQUFNLFNBQVMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN2QyxPQUFPLFNBQVMsQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDOUUsQ0FBQztBQUhELHdDQUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJpZ051bWJlciBmcm9tICdiaWdudW1iZXIuanMnO1xuXG5jb25zdCBCTiA9IEJpZ051bWJlci5jbG9uZSh7IEVYUE9ORU5USUFMX0FUOiAxZTkgfSlcbmNvbnN0IHNtYWxsRW5vdWdoTnVtYmVyID0gbmV3IEJOKCcxMDAwMDAwMDAnKTtcblxuZXhwb3J0IHR5cGUgZW5jb2RlZE51bWJlciA9IG51bWJlciB8IEJpZ051bWJlcjtcblxuLy8gUmV0dXJucyB0aGUgbWFudGlzc2Egb2YgYW4gRXhwIHdpdGggZ2l2ZW4gZmxvYXRpbmcgdmFsdWVcbmV4cG9ydCBmdW5jdGlvbiBnZXRFeHBNYW50aXNzYShmbG9hdDogbnVtYmVyKTogZW5jb2RlZE51bWJlciB7XG4gIC8vIFdvcmthcm91bmQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZXRoZXJldW0vd2ViMy5qcy9pc3N1ZXMvMTkyMFxuICBjb25zdCBzdHIgPSBNYXRoLmZsb29yKGZsb2F0ICogMS4wZTE4KS50b1N0cmluZygpO1xuXG4gIHJldHVybiB0b0VuY29kYWJsZU51bShzdHIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9FbmNvZGFibGVOdW0oYW1vdW50QXJnUmF3OiBzdHJpbmcgfCBlbmNvZGVkTnVtYmVyKTogZW5jb2RlZE51bWJlciB7XG4gICAgY29uc3QgYmlnTnVtYmVyID0gbmV3IEJOKGFtb3VudEFyZ1Jhdyk7XG4gICAgcmV0dXJuIGJpZ051bWJlci5sdChzbWFsbEVub3VnaE51bWJlcikgPyBiaWdOdW1iZXIudG9OdW1iZXIoKSA6IGJpZ051bWJlcjtcbn1cbiJdfQ==
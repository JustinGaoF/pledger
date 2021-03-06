"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwExpect = void 0;
exports.throwExpect = (x) => {
    return {
        toEqual: (y) => {
            let xEnc = JSON.stringify(x);
            let yEnc = JSON.stringify(y);
            if (xEnc !== yEnc) {
                throw new Error(`expected ${x} to equal ${y}`);
            }
        },
        fail: (reason) => {
            throw new Error(reason);
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXNzZXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0Fzc2VydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFLYSxRQUFBLFdBQVcsR0FBVyxDQUFDLENBQUMsRUFBRSxFQUFFO0lBQ3ZDLE9BQU87UUFDTCxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUNiLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNoRDtRQUNILENBQUM7UUFDRCxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDekIsQ0FBQztLQUNGLENBQUE7QUFDSCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgdHlwZSBFeHBlY3QgPSAoYWN0dWFsOiBhbnkpID0+IHtcbiAgdG9FcXVhbDogKGV4cGVjdGVkOiBhbnkpID0+IGFueVxuICBmYWlsOiAobWVzc2FnZTogc3RyaW5nKSA9PiBhbnlcbn1cblxuZXhwb3J0IGNvbnN0IHRocm93RXhwZWN0OiBFeHBlY3QgPSAoeCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHRvRXF1YWw6ICh5KSA9PiB7XG4gICAgICBsZXQgeEVuYyA9IEpTT04uc3RyaW5naWZ5KHgpO1xuICAgICAgbGV0IHlFbmMgPSBKU09OLnN0cmluZ2lmeSh5KTtcbiAgICAgIGlmICh4RW5jICE9PSB5RW5jKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgZXhwZWN0ZWQgJHt4fSB0byBlcXVhbCAke3l9YCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBmYWlsOiAocmVhc29uKSA9PiB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IocmVhc29uKVxuICAgIH1cbiAgfVxufTtcbiJdfQ==
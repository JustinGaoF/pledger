"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRPC = exports.sleep = exports.getCurrentTimestamp = exports.getCurrentBlockNumber = exports.decodeParameters = exports.encodeParameters = exports.encodeABI = exports.rawValues = exports.mustString = exports.mustLen = exports.mustArray = void 0;
// Wraps the element in an array, if it was not already an array
// If array is null or undefined, return the empty array
function mustArray(arg) {
    if (Array.isArray(arg)) {
        return arg;
    }
    else {
        if (arg === null || arg === undefined) {
            return [];
        }
        else {
            return [arg];
        }
    }
}
exports.mustArray = mustArray;
// Asserts that the array must be given length and if so returns it, otherwise
// it will raise an error
function mustLen(arg, len, maxLen) {
    if (!Array.isArray(arg)) {
        throw `Expected array of length ${len}, got ${arg}`;
    }
    else if (maxLen === undefined && arg.length !== len) {
        throw `Expected array of length ${len}, got length ${arg.length} (${arg})`;
    }
    else if (maxLen !== undefined && (arg.length < len || arg.length > maxLen)) {
        throw `Expected array of length ${len}-${maxLen}, got length ${arg.length} (${arg})`;
    }
    else {
        return arg;
    }
}
exports.mustLen = mustLen;
function mustString(arg) {
    if (typeof arg === 'string') {
        return arg;
    }
    throw new Error(`Expected string argument, got ${arg.toString()}`);
}
exports.mustString = mustString;
function rawValues(args) {
    if (Array.isArray(args))
        return args.map(rawValues);
    if (Array.isArray(args.val))
        return args.val.map(rawValues);
    return args.val;
}
exports.rawValues = rawValues;
// Web3 doesn't have a function ABI parser.. not sure why.. but we build a simple encoder
// that accepts "fun(uint256,uint256)" and params and returns the encoded value.
function encodeABI(world, fnABI, fnParams) {
    if (fnParams.length == 0) {
        return world.web3.eth.abi.encodeFunctionSignature(fnABI);
    }
    else {
        const regex = /(\w+)\(([\w,\[\]]+)\)/;
        const res = regex.exec(fnABI);
        if (!res) {
            throw new Error(`Expected ABI signature, got: ${fnABI}`);
        }
        const [_, fnName, fnInputs] = res;
        const jsonInterface = {
            name: fnName,
            inputs: fnInputs.split(',').map(i => ({ name: '', type: i }))
        };
        // XXXS
        return world.web3.eth.abi.encodeFunctionCall(jsonInterface, fnParams);
    }
}
exports.encodeABI = encodeABI;
function encodeParameters(world, fnABI, fnParams) {
    const regex = /(\w+)\(([\w,\[\]]+)\)/;
    const res = regex.exec(fnABI);
    if (!res) {
        return '0x0';
    }
    const [_, __, fnInputs] = res;
    return world.web3.eth.abi.encodeParameters(fnInputs.split(','), fnParams);
}
exports.encodeParameters = encodeParameters;
function decodeParameters(world, fnABI, data) {
    const regex = /(\w+)\(([\w,\[\]]+)\)/;
    const res = regex.exec(fnABI);
    if (!res) {
        return [];
    }
    const [_, __, fnInputs] = res;
    const inputTypes = fnInputs.split(',');
    const parameters = world.web3.eth.abi.decodeParameters(inputTypes, data);
    return inputTypes.map((_, index) => parameters[index]);
}
exports.decodeParameters = decodeParameters;
async function getCurrentBlockNumber(world) {
    const { result: currentBlockNumber } = await sendRPC(world, 'eth_blockNumber', []);
    return parseInt(currentBlockNumber);
}
exports.getCurrentBlockNumber = getCurrentBlockNumber;
function getCurrentTimestamp() {
    return Math.floor(Date.now() / 1000);
}
exports.getCurrentTimestamp = getCurrentTimestamp;
function sleep(timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
}
exports.sleep = sleep;
function sendRPC(world, method, params) {
    return new Promise((resolve, reject) => {
        if (!world.web3.currentProvider || typeof (world.web3.currentProvider) === 'string') {
            return reject(`cannot send from currentProvider=${world.web3.currentProvider}`);
        }
        world.web3.currentProvider.send({
            jsonrpc: '2.0',
            method: method,
            params: params,
            id: new Date().getTime() // Id of the request; anything works, really
        }, (err, response) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    });
}
exports.sendRPC = sendRPC;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsZ0VBQWdFO0FBQ2hFLHdEQUF3RDtBQUN4RCxTQUFnQixTQUFTLENBQUksR0FBWTtJQUN2QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDdEIsT0FBTyxHQUFHLENBQUM7S0FDWjtTQUFNO1FBQ0wsSUFBSSxHQUFHLEtBQUssSUFBSSxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFDckMsT0FBTyxFQUFFLENBQUM7U0FDWDthQUFNO1lBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2Q7S0FDRjtBQUNILENBQUM7QUFWRCw4QkFVQztBQUVELDhFQUE4RTtBQUM5RSx5QkFBeUI7QUFDekIsU0FBZ0IsT0FBTyxDQUFDLEdBQWdCLEVBQUUsR0FBVyxFQUFFLE1BQWU7SUFDcEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDdkIsTUFBTSw0QkFBNEIsR0FBRyxTQUFTLEdBQUcsRUFBRSxDQUFDO0tBQ3JEO1NBQU0sSUFBSSxNQUFNLEtBQUssU0FBUyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFO1FBQ3JELE1BQU0sNEJBQTRCLEdBQUcsZ0JBQWdCLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUM7S0FDNUU7U0FBTSxJQUFJLE1BQU0sS0FBSyxTQUFTLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxFQUFFO1FBQzVFLE1BQU0sNEJBQTRCLEdBQUcsSUFBSSxNQUFNLGdCQUFnQixHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDO0tBQ3RGO1NBQU07UUFDTCxPQUFPLEdBQUcsQ0FBQztLQUNaO0FBQ0gsQ0FBQztB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RUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQ25GLE9BQU8sTUFBTSxDQUFDLG9DQUFvQyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7U0FDakY7UUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQzdCO1lBQ0UsT0FBTyxFQUFFLEtBQUs7WUFDZCxNQUFNLEVBQUUsTUFBTTtZQUNkLE1BQU0sRUFBRSxNQUFNO1lBQ2QsRUFBRSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsNENBQTRDO1NBQ3RFLEVBQ0QsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUU7WUFDaEIsSUFBSSxHQUFHLEVBQUU7Z0JBQ1AsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2I7aUJBQU07Z0JBQ0wsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ25CO1FBQ0gsQ0FBQyxDQUNGLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUF0QkQsMEJBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnQgfSBmcm9tICcuL0V2ZW50JztcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSAnLi9Xb3JsZCc7XG5pbXBvcnQgeyBBYmlJdGVtIH0gZnJvbSAnd2ViMy11dGlscyc7XG5cbi8vIFdyYXBzIHRoZSBlbGVtZW50IGluIGFuIGFycmF5LCBpZiBpdCB3YXMgbm90IGFscmVhZHkgYW4gYXJyYXlcbi8vIElmIGFycmF5IGlzIG51bGwgb3IgdW5kZWZpbmVkLCByZXR1cm4gdGhlIGVtcHR5IGFycmF5XG5leHBvcnQgZnVuY3Rpb24gbXVzdEFycmF5PFQ+KGFyZzogVFtdIHwgVCk6IFRbXSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcbiAgICByZXR1cm4gYXJnO1xuICB9IGVsc2Uge1xuICAgIGlmIChhcmcgPT09IG51bGwgfHwgYXJnID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFthcmddO1xuICAgIH1cbiAgfVxufVxuXG4vLyBBc3NlcnRzIHRoYXQgdGhlIGFycmF5IG11c3QgYmUgZ2l2ZW4gbGVuZ3RoIGFuZCBpZiBzbyByZXR1cm5zIGl0LCBvdGhlcndpc2Vcbi8vIGl0IHdpbGwgcmFpc2UgYW4gZXJyb3JcbmV4cG9ydCBmdW5jdGlvbiBtdXN0TGVuKGFyZzogYW55W10gfCBhbnksIGxlbjogbnVtYmVyLCBtYXhMZW4/OiBudW1iZXIpOiBhbnlbXSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShhcmcpKSB7XG4gICAgdGhyb3cgYEV4cGVjdGVkIGFycmF5IG9mIGxlbmd0aCAke2xlbn0sIGdvdCAke2FyZ31gO1xuICB9IGVsc2UgaWYgKG1heExlbiA9PT0gdW5kZWZpbmVkICYmIGFyZy5sZW5ndGggIT09IGxlbikge1xuICAgIHRocm93IGBFeHBlY3RlZCBhcnJheSBvZiBsZW5ndGggJHtsZW59LCBnb3QgbGVuZ3RoICR7YXJnLmxlbmd0aH0gKCR7YXJnfSlgO1xuICB9IGVsc2UgaWYgKG1heExlbiAhPT0gdW5kZWZpbmVkICYmIChhcmcubGVuZ3RoIDwgbGVuIHx8IGFyZy5sZW5ndGggPiBtYXhMZW4pKSB7XG4gICAgdGhyb3cgYEV4cGVjdGVkIGFycmF5IG9mIGxlbmd0aCAke2xlbn0tJHttYXhMZW59LCBnb3QgbGVuZ3RoICR7YXJnLmxlbmd0aH0gKCR7YXJnfSlgO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBhcmc7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG11c3RTdHJpbmcoYXJnOiBFdmVudCk6IHN0cmluZyB7XG4gIGlmICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBhcmc7XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHN0cmluZyBhcmd1bWVudCwgZ290ICR7YXJnLnRvU3RyaW5nKCl9YCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByYXdWYWx1ZXMoYXJncykge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcmdzKSlcbiAgICByZXR1cm4gYXJncy5tYXAocmF3VmFsdWVzKTtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJncy52YWwpKVxuICAgIHJldHVybiBhcmdzLnZhbC5tYXAocmF3VmFsdWVzKTtcbiAgcmV0dXJuIGFyZ3MudmFsO1xufVxuXG4vLyBXZWIzIGRvZXNuJ3QgaGF2ZSBhIGZ1bmN0aW9uIEFCSSBwYXJzZXIuLiBub3Qgc3VyZSB3aHkuLiBidXQgd2UgYnVpbGQgYSBzaW1wbGUgZW5jb2RlclxuLy8gdGhhdCBhY2NlcHRzIFwiZnVuKHVpbnQyNTYsdWludDI1NilcIiBhbmQgcGFyYW1zIGFuZCByZXR1cm5zIHRoZSBlbmNvZGVkIHZhbHVlLlxuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZUFCSSh3b3JsZDogV29ybGQsIGZuQUJJOiBzdHJpbmcsIGZuUGFyYW1zOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gIGlmIChmblBhcmFtcy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiB3b3JsZC53ZWIzLmV0aC5hYmkuZW5jb2RlRnVuY3Rpb25TaWduYXR1cmUoZm5BQkkpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHJlZ2V4ID0gLyhcXHcrKVxcKChbXFx3LFxcW1xcXV0rKVxcKS87XG4gICAgY29uc3QgcmVzID0gcmVnZXguZXhlYyhmbkFCSSk7XG4gICAgaWYgKCFyZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgQUJJIHNpZ25hdHVyZSwgZ290OiAke2ZuQUJJfWApO1xuICAgIH1cbiAgICBjb25zdCBbXywgZm5OYW1lLCBmbklucHV0c10gPSA8W3N0cmluZywgc3RyaW5nLCBzdHJpbmddPig8dW5rbm93bj5yZXMpO1xuICAgIGNvbnN0IGpzb25JbnRlcmZhY2UgPSB7XG4gICAgICBuYW1lOiBmbk5hbWUsXG4gICAgICBpbnB1dHM6IGZuSW5wdXRzLnNwbGl0KCcsJykubWFwKGkgPT4gKHsgbmFtZTogJycsIHR5cGU6IGkgfSkpXG4gICAgfTtcbiAgICAvLyBYWFhTXG4gICAgcmV0dXJuIHdvcmxkLndlYjMuZXRoLmFiaS5lbmNvZGVGdW5jdGlvbkNhbGwoPEFiaUl0ZW0+anNvbkludGVyZmFjZSwgZm5QYXJhbXMpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmNvZGVQYXJhbWV0ZXJzKHdvcmxkOiBXb3JsZCwgZm5BQkk6IHN0cmluZywgZm5QYXJhbXM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgY29uc3QgcmVnZXggPSAvKFxcdyspXFwoKFtcXHcsXFxbXFxdXSspXFwpLztcbiAgY29uc3QgcmVzID0gcmVnZXguZXhlYyhmbkFCSSk7XG4gIGlmICghcmVzKSB7XG4gICAgcmV0dXJuICcweDAnO1xuICB9XG4gIGNvbnN0IFtfLCBfXywgZm5JbnB1dHNdID0gPFtzdHJpbmcsIHN0cmluZywgc3RyaW5nXT4oPHVua25vd24+cmVzKTtcbiAgcmV0dXJuIHdvcmxkLndlYjMuZXRoLmFiaS5lbmNvZGVQYXJhbWV0ZXJzKGZuSW5wdXRzLnNwbGl0KCcsJyksIGZuUGFyYW1zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY29kZVBhcmFtZXRlcnMod29ybGQ6IFdvcmxkLCBmbkFCSTogc3RyaW5nLCBkYXRhOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IHJlZ2V4ID0gLyhcXHcrKVxcKChbXFx3LFxcW1xcXV0rKVxcKS87XG4gIGNvbnN0IHJlcyA9IHJlZ2V4LmV4ZWMoZm5BQkkpO1xuICBpZiAoIXJlcykge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBjb25zdCBbXywgX18sIGZuSW5wdXRzXSA9IDxbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10+KDx1bmtub3duPnJlcyk7XG4gIGNvbnN0IGlucHV0VHlwZXMgPSBmbklucHV0cy5zcGxpdCgnLCcpO1xuICBjb25zdCBwYXJhbWV0ZXJzID0gd29ybGQud2ViMy5ldGguYWJpLmRlY29kZVBhcmFtZXRlcnMoaW5wdXRUeXBlcywgZGF0YSk7XG5cbiAgcmV0dXJuIGlucHV0VHlwZXMubWFwKChfLCBpbmRleCkgPT4gcGFyYW1ldGVyc1tpbmRleF0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q3VycmVudEJsb2NrTnVtYmVyKHdvcmxkOiBXb3JsZCk6IFByb21pc2U8bnVtYmVyPiB7XG4gIGNvbnN0IHsgcmVzdWx0OiBjdXJyZW50QmxvY2tOdW1iZXIgfTogYW55ID0gYXdhaXQgc2VuZFJQQyh3b3JsZCwgJ2V0aF9ibG9ja051bWJlcicsIFtdKTtcbiAgcmV0dXJuIHBhcnNlSW50KGN1cnJlbnRCbG9ja051bWJlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50VGltZXN0YW1wKCk6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gc2xlZXAodGltZW91dDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICByZXNvbHZlKCk7XG4gICAgfSwgdGltZW91dCk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VuZFJQQyh3b3JsZDogV29ybGQsIG1ldGhvZDogc3RyaW5nLCBwYXJhbXM6IGFueVtdKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgaWYgKCF3b3JsZC53ZWIzLmN1cnJlbnRQcm92aWRlciB8fCB0eXBlb2YgKHdvcmxkLndlYjMuY3VycmVudFByb3ZpZGVyKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiByZWplY3QoYGNhbm5vdCBzZW5kIGZyb20gY3VycmVudFByb3ZpZGVyPSR7d29ybGQud2ViMy5jdXJyZW50UHJvdmlkZXJ9YCk7XG4gICAgfVxuXG4gICAgd29ybGQud2ViMy5jdXJyZW50UHJvdmlkZXIuc2VuZChcbiAgICAgIHtcbiAgICAgICAganNvbnJwYzogJzIuMCcsXG4gICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICBwYXJhbXM6IHBhcmFtcyxcbiAgICAgICAgaWQ6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8vIElkIG9mIHRoZSByZXF1ZXN0OyBhbnl0aGluZyB3b3JrcywgcmVhbGx5XG4gICAgICB9LFxuICAgICAgKGVyciwgcmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcbiAgfSk7XG59XG4iXX0=
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandMacro = exports.expandEvent = void 0;
function expandEvent(macros, event) {
    const [eventName, ...eventArgs] = event;
    if (macros[eventName]) {
        let expanded = expandMacro(macros[eventName], eventArgs);
        // Recursively expand steps
        return expanded.map(event => expandEvent(macros, event)).flat();
    }
    else {
        return [event];
    }
}
exports.expandEvent = expandEvent;
function getArgValues(eventArgs, macroArgs) {
    const eventArgNameMap = {};
    const eventArgIndexed = [];
    const argValues = {};
    let usedNamedArg = false;
    let usedSplat = false;
    eventArgs.forEach((eventArg) => {
        if (eventArg.hasOwnProperty('argName')) {
            const { argName, argValue } = eventArg;
            eventArgNameMap[argName] = argValue;
            usedNamedArg = true;
        }
        else {
            if (usedNamedArg) {
                throw new Error("Cannot use positional arg after named arg in macro invokation.");
            }
            eventArgIndexed.push(eventArg);
        }
    });
    macroArgs.forEach(({ arg, def, splat }, argIndex) => {
        let val;
        if (usedSplat) {
            throw new Error("Cannot have arg after splat arg");
        }
        if (eventArgNameMap[arg] !== undefined) {
            val = eventArgNameMap[arg];
        }
        else if (splat) {
            val = eventArgIndexed.slice(argIndex);
            usedSplat = true;
        }
        else if (eventArgIndexed[argIndex] !== undefined) {
            val = eventArgIndexed[argIndex];
        }
        else if (def !== undefined) {
            val = def;
        }
        else {
            throw new Error("Macro cannot find arg value for " + arg);
        }
        argValues[arg] = val;
    });
    return argValues;
}
function expandMacro(macro, event) {
    const argValues = getArgValues(event, macro.args);
    function expandStep(step) {
        return step.map((token) => {
            if (argValues[token] !== undefined) {
                return argValues[token];
            }
            else {
                if (Array.isArray(token)) {
                    return expandStep(token);
                }
                else {
                    return token;
                }
            }
        });
    }
    ;
    return macro.steps.map(expandStep);
}
exports.expandMacro = expandMacro;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFjcm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTWFjcm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBbUJBLFNBQWdCLFdBQVcsQ0FBQyxNQUFjLEVBQUUsS0FBWTtJQUN0RCxNQUFNLENBQUMsU0FBUyxFQUFFLEdBQUcsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBRXhDLElBQUksTUFBTSxDQUFTLFNBQVMsQ0FBQyxFQUFFO1FBQzdCLElBQUksUUFBUSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQVMsU0FBUyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFakUsMkJBQTJCO1FBQzNCLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNqRTtTQUFNO1FBQ0wsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2hCO0FBQ0gsQ0FBQztBQVhELGtDQVdDO0FBRUQsU0FBUyxZQUFZLENBQUMsU0FBcUIsRUFBRSxTQUFnQjtJQUMzRCxNQUFNLGVBQWUsR0FBVyxFQUFFLENBQUM7SUFDbkMsTUFBTSxlQUFlLEdBQVksRUFBRSxDQUFDO0lBQ3BDLE1BQU0sU0FBUyxHQUFXLEVBQUUsQ0FBQztJQUM3QixJQUFJLFlBQVksR0FBWSxLQUFLLENBQUM7SUFDbEMsSUFBSSxTQUFTLEdBQVksS0FBSyxDQUFDO0lBRS9CLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtRQUM3QixJQUFJLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDdEMsTUFBTSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUMsR0FBYSxRQUFRLENBQUM7WUFFL0MsZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLFFBQVEsQ0FBQztZQUNwQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1NBQ3JCO2FBQU07WUFDTCxJQUFJLFlBQVksRUFBRTtnQkFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDO2FBQ25GO1lBRUQsZUFBZSxDQUFDLElBQUksQ0FBUSxRQUFRLENBQUMsQ0FBQztTQUN2QztJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRTtRQUNoRCxJQUFJLEdBQUcsQ0FBQztRQUVSLElBQUksU0FBUyxFQUFFO1lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1NBQ3BEO1FBRUQsSUFBSSxlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQ3RDLEdBQUcsR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDNUI7YUFBTSxJQUFJLEtBQUssRUFBRTtZQUNoQixHQUFHLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QyxTQUFTLEdBQUcsSUFBSSxDQUFDO1NBQ2xCO2FBQU0sSUFBSSxlQUFlLENBQUMsUUFBUSxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQ2xELEdBQUcsR0FBRyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDakM7YUFBTSxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFDNUIsR0FBRyxHQUFHLEdBQUcsQ0FBQztTQUNYO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1NBQzNEO1FBQ0QsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUN2QixDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFFRCxTQUFnQixXQUFXLENBQUMsS0FBWSxFQUFFLEtBQVk7SUFDcEQsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFhLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFOUQsU0FBUyxVQUFVLENBQUMsSUFBSTtRQUN0QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUN4QixJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxTQUFTLEVBQUU7Z0JBQ2xDLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3pCO2lCQUFNO2dCQUNMLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDeEIsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQzFCO3FCQUFNO29CQUNMLE9BQU8sS0FBSyxDQUFDO2lCQUNkO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFBQSxDQUFDO0lBRUYsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNyQyxDQUFDO0FBbEJELGtDQWtCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RXZlbnR9IGZyb20gJy4vRXZlbnQnO1xuXG5pbnRlcmZhY2UgQXJnIHtcbiAgYXJnOiBhbnlcbiAgZGVmOiBhbnlcbiAgc3BsYXQ6IGFueVxufVxuXG5pbnRlcmZhY2UgTWFjcm8ge1xuICBhcmdzOiBBcmdbXVxuICBzdGVwczogRXZlbnRcbn1cblxudHlwZSBBcmdNYXAgPSB7W2FyZzogc3RyaW5nXTogRXZlbnR9O1xudHlwZSBOYW1lZEFyZyA9IHsgYXJnTmFtZTogc3RyaW5nLCBhcmdWYWx1ZTogRXZlbnQgfTtcbnR5cGUgQXJnVmFsdWUgPSBFdmVudCB8IE5hbWVkQXJnO1xuXG5leHBvcnQgdHlwZSBNYWNyb3MgPSB7W2V2ZW50TmFtZTogc3RyaW5nXTogTWFjcm99O1xuXG5leHBvcnQgZnVuY3Rpb24gZXhwYW5kRXZlbnQobWFjcm9zOiBNYWNyb3MsIGV2ZW50OiBFdmVudCk6IEV2ZW50W10ge1xuICBjb25zdCBbZXZlbnROYW1lLCAuLi5ldmVudEFyZ3NdID0gZXZlbnQ7XG5cbiAgaWYgKG1hY3Jvc1s8c3RyaW5nPmV2ZW50TmFtZV0pIHtcbiAgICBsZXQgZXhwYW5kZWQgPSBleHBhbmRNYWNybyhtYWNyb3NbPHN0cmluZz5ldmVudE5hbWVdLCBldmVudEFyZ3MpO1xuXG4gICAgLy8gUmVjdXJzaXZlbHkgZXhwYW5kIHN0ZXBzXG4gICAgcmV0dXJuIGV4cGFuZGVkLm1hcChldmVudCA9PiBleHBhbmRFdmVudChtYWNyb3MsIGV2ZW50KSkuZmxhdCgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBbZXZlbnRdO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldEFyZ1ZhbHVlcyhldmVudEFyZ3M6IEFyZ1ZhbHVlW10sIG1hY3JvQXJnczogQXJnW10pOiBBcmdNYXAge1xuICBjb25zdCBldmVudEFyZ05hbWVNYXA6IEFyZ01hcCA9IHt9O1xuICBjb25zdCBldmVudEFyZ0luZGV4ZWQ6IEV2ZW50W10gPSBbXTtcbiAgY29uc3QgYXJnVmFsdWVzOiBBcmdNYXAgPSB7fTtcbiAgbGV0IHVzZWROYW1lZEFyZzogYm9vbGVhbiA9IGZhbHNlO1xuICBsZXQgdXNlZFNwbGF0OiBib29sZWFuID0gZmFsc2U7XG5cbiAgZXZlbnRBcmdzLmZvckVhY2goKGV2ZW50QXJnKSA9PiB7XG4gICAgaWYgKGV2ZW50QXJnLmhhc093blByb3BlcnR5KCdhcmdOYW1lJykpIHtcbiAgICAgIGNvbnN0IHthcmdOYW1lLCBhcmdWYWx1ZX0gPSA8TmFtZWRBcmc+ZXZlbnRBcmc7XG5cbiAgICAgIGV2ZW50QXJnTmFtZU1hcFthcmdOYW1lXSA9IGFyZ1ZhbHVlO1xuICAgICAgdXNlZE5hbWVkQXJnID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHVzZWROYW1lZEFyZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgdXNlIHBvc2l0aW9uYWwgYXJnIGFmdGVyIG5hbWVkIGFyZyBpbiBtYWNybyBpbnZva2F0aW9uLlwiKTtcbiAgICAgIH1cblxuICAgICAgZXZlbnRBcmdJbmRleGVkLnB1c2goPEV2ZW50PmV2ZW50QXJnKTtcbiAgICB9XG4gIH0pO1xuXG4gIG1hY3JvQXJncy5mb3JFYWNoKCh7YXJnLCBkZWYsIHNwbGF0fSwgYXJnSW5kZXgpID0+IHtcbiAgICBsZXQgdmFsO1xuXG4gICAgaWYgKHVzZWRTcGxhdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGhhdmUgYXJnIGFmdGVyIHNwbGF0IGFyZ1wiKTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnRBcmdOYW1lTWFwW2FyZ10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0gZXZlbnRBcmdOYW1lTWFwW2FyZ107XG4gICAgfSBlbHNlIGlmIChzcGxhdCkge1xuICAgICAgdmFsID0gZXZlbnRBcmdJbmRleGVkLnNsaWNlKGFyZ0luZGV4KTtcbiAgICAgIHVzZWRTcGxhdCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChldmVudEFyZ0luZGV4ZWRbYXJnSW5kZXhdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IGV2ZW50QXJnSW5kZXhlZFthcmdJbmRleF07XG4gICAgfSBlbHNlIGlmIChkZWYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0gZGVmO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNYWNybyBjYW5ub3QgZmluZCBhcmcgdmFsdWUgZm9yIFwiICsgYXJnKTtcbiAgICB9XG4gICAgYXJnVmFsdWVzW2FyZ10gPSB2YWw7XG4gIH0pO1xuXG4gIHJldHVybiBhcmdWYWx1ZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHBhbmRNYWNybyhtYWNybzogTWFjcm8sIGV2ZW50OiBFdmVudCk6IEV2ZW50W10ge1xuICBjb25zdCBhcmdWYWx1ZXMgPSBnZXRBcmdWYWx1ZXMoPEFyZ1ZhbHVlW10+ZXZlbnQsIG1hY3JvLmFyZ3MpO1xuXG4gIGZ1bmN0aW9uIGV4cGFuZFN0ZXAoc3RlcCkge1xuICAgIHJldHVybiBzdGVwLm1hcCgodG9rZW4pID0+IHtcbiAgICAgIGlmIChhcmdWYWx1ZXNbdG9rZW5dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGFyZ1ZhbHVlc1t0b2tlbl07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0b2tlbikpIHtcbiAgICAgICAgICByZXR1cm4gZXhwYW5kU3RlcCh0b2tlbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIG1hY3JvLnN0ZXBzLm1hcChleHBhbmRTdGVwKTtcbn1cbiJdfQ==
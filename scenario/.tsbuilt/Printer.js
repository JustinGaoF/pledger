"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplPrinter = exports.ConsolePrinter = exports.CallbackPrinter = void 0;
const CoreEvent_1 = require("./CoreEvent");
const Formatter_1 = require("./Formatter");
class CallbackPrinter {
    constructor(callback) {
        this.callback = callback;
    }
    printLine(str) {
        this.callback(str, {});
    }
    printMarkdown(str) {
        this.callback(str, { markdown: true });
    }
    printValue(val) {
        this.callback(val.toString(), { value: true });
    }
    printError(err) {
        if (process.env['verbose']) {
            this.callback(err, { error: true });
        }
        this.callback(`Error: ${err.toString()}`, { error: true });
    }
    printAction(action) {
        // Do nothing
    }
}
exports.CallbackPrinter = CallbackPrinter;
class ConsolePrinter {
    constructor(verbose) {
        this.verbose = verbose;
    }
    printLine(str) {
        console.log(str);
    }
    printMarkdown(str) {
        console.log(str);
    }
    printValue(val) {
        console.log(val.toString());
    }
    printError(err) {
        if (this.verbose) {
            console.log(err);
        }
        console.log(`Error: ${err.toString()}`);
    }
    printAction(action) {
        if (this.verbose) {
            console.log(`Action: ${action.log}`);
        }
    }
}
exports.ConsolePrinter = ConsolePrinter;
class ReplPrinter {
    constructor(rl, verbose) {
        this.rl = rl;
        this.verbose = verbose;
    }
    printLine(str) {
        console.log(`${str}`);
    }
    printMarkdown(str) {
        console.log(`${str}`);
    }
    printValue(val) {
        console.log(val.toString());
    }
    printError(err) {
        if (this.verbose) {
            console.log(err);
        }
        if (err instanceof CoreEvent_1.EventProcessingError) {
            console.log(`Event Processing Error:`);
            console.log(`\t${err.error.toString()}`);
            console.log(`\twhen processing event \`${Formatter_1.formatEvent(err.event)}\``);
        }
        else {
            console.log(`Error: ${err.toString()}`);
        }
    }
    printAction(action) {
        console.log(`Action: ${action.log}`);
    }
}
exports.ReplPrinter = ReplPrinter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJpbnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9QcmludGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLDJDQUFnRDtBQUNoRCwyQ0FBd0M7QUFZeEMsTUFBYSxlQUFlO0lBRzFCLFlBQVksUUFBbUM7UUFDN0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVELFNBQVMsQ0FBQyxHQUFXO1FBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxhQUFhLENBQUMsR0FBVztRQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxVQUFVLENBQUMsR0FBVTtRQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxVQUFVLENBQUMsR0FBVTtRQUNuQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztTQUNuQztRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCxXQUFXLENBQUMsTUFBbUI7UUFDN0IsYUFBYTtJQUNmLENBQUM7Q0FDRjtBQTlCRCwwQ0E4QkM7QUFFRCxNQUFhLGNBQWM7SUFHekIsWUFBWSxPQUFnQjtRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN6QixDQUFDO0lBRUQsU0FBUyxDQUFDLEdBQVc7UUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBRUQsYUFBYSxDQUFDLEdBQVc7UUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBRUQsVUFBVSxDQUFDLEdBQVU7UUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsVUFBVSxDQUFDLEdBQVU7UUFDbkIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEI7UUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsV0FBVyxDQUFDLE1BQW1CO1FBQzdCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDdEM7SUFDSCxDQUFDO0NBQ0Y7QUFoQ0Qsd0NBZ0NDO0FBRUQsTUFBYSxXQUFXO0lBSXRCLFlBQVksRUFBc0IsRUFBRSxPQUFnQjtRQUNsRCxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxTQUFTLENBQUMsR0FBVztRQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRUQsYUFBYSxDQUFDLEdBQVc7UUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVELFVBQVUsQ0FBQyxHQUFVO1FBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELFVBQVUsQ0FBQyxHQUFVO1FBQ25CLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xCO1FBRUQsSUFBSSxHQUFHLFlBQVksZ0NBQW9CLEVBQUU7WUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2Qix1QkFBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEU7YUFBTTtZQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQztJQUVELFdBQVcsQ0FBQyxNQUFtQjtRQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdkMsQ0FBQztDQUNGO0FBdENELGtDQXNDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VmFsdWV9IGZyb20gJy4vVmFsdWUnO1xuaW1wb3J0IHtBY3Rpb259IGZyb20gJy4vQWN0aW9uJztcbmltcG9ydCB7RXZlbnRQcm9jZXNzaW5nRXJyb3J9IGZyb20gJy4vQ29yZUV2ZW50J1xuaW1wb3J0IHtmb3JtYXRFdmVudH0gZnJvbSAnLi9Gb3JtYXR0ZXInO1xuXG5pbXBvcnQgKiBhcyByZWFkbGluZSBmcm9tICdyZWFkbGluZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJpbnRlciB7XG4gIHByaW50TGluZShzdHI6IHN0cmluZyk6IHZvaWRcbiAgcHJpbnRNYXJrZG93bihzdHI6IHN0cmluZyk6IHZvaWRcbiAgcHJpbnRWYWx1ZSh2YWw6IFZhbHVlKTogdm9pZFxuICBwcmludEVycm9yKGVycjogRXJyb3IpOiB2b2lkXG4gIHByaW50QWN0aW9uKGFjdGlvbjogQWN0aW9uPGFueT4pOiB2b2lkXG59XG5cbmV4cG9ydCBjbGFzcyBDYWxsYmFja1ByaW50ZXIgaW1wbGVtZW50cyBQcmludGVyIHtcbiAgY2FsbGJhY2s6IChtZXNzYWdlOiBhbnksIGZvcm1hdDogb2JqZWN0KSA9PiB2b2lkXG5cbiAgY29uc3RydWN0b3IoY2FsbGJhY2s6IChtZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQpIHtcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gIH1cblxuICBwcmludExpbmUoc3RyOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmNhbGxiYWNrKHN0ciwge30pO1xuICB9XG5cbiAgcHJpbnRNYXJrZG93bihzdHI6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuY2FsbGJhY2soc3RyLCB7bWFya2Rvd246IHRydWV9KTtcbiAgfVxuXG4gIHByaW50VmFsdWUodmFsOiBWYWx1ZSk6IHZvaWQge1xuICAgIHRoaXMuY2FsbGJhY2sodmFsLnRvU3RyaW5nKCksIHt2YWx1ZTogdHJ1ZX0pO1xuICB9XG5cbiAgcHJpbnRFcnJvcihlcnI6IEVycm9yKTogdm9pZCB7XG4gICAgaWYgKHByb2Nlc3MuZW52Wyd2ZXJib3NlJ10pIHtcbiAgICAgIHRoaXMuY2FsbGJhY2soZXJyLCB7ZXJyb3I6IHRydWV9KTtcbiAgICB9XG5cbiAgICB0aGlzLmNhbGxiYWNrKGBFcnJvcjogJHtlcnIudG9TdHJpbmcoKX1gLCB7ZXJyb3I6IHRydWV9KTtcbiAgfVxuXG4gIHByaW50QWN0aW9uKGFjdGlvbjogQWN0aW9uPGFueT4pOiB2b2lkIHtcbiAgICAvLyBEbyBub3RoaW5nXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbnNvbGVQcmludGVyIGltcGxlbWVudHMgUHJpbnRlciB7XG4gIHZlcmJvc2U6IGJvb2xlYW5cblxuICBjb25zdHJ1Y3Rvcih2ZXJib3NlOiBib29sZWFuKSB7XG4gICAgdGhpcy52ZXJib3NlID0gdmVyYm9zZTtcbiAgfVxuXG4gIHByaW50TGluZShzdHI6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKHN0cik7XG4gIH1cblxuICBwcmludE1hcmtkb3duKHN0cjogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coc3RyKTtcbiAgfVxuXG4gIHByaW50VmFsdWUodmFsOiBWYWx1ZSk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKHZhbC50b1N0cmluZygpKTtcbiAgfVxuXG4gIHByaW50RXJyb3IoZXJyOiBFcnJvcik6IHZvaWQge1xuICAgIGlmICh0aGlzLnZlcmJvc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coYEVycm9yOiAke2Vyci50b1N0cmluZygpfWApO1xuICB9XG5cbiAgcHJpbnRBY3Rpb24oYWN0aW9uOiBBY3Rpb248YW55Pik6IHZvaWQge1xuICAgIGlmICh0aGlzLnZlcmJvc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBBY3Rpb246ICR7YWN0aW9uLmxvZ31gKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJlcGxQcmludGVyIGltcGxlbWVudHMgUHJpbnRlciB7XG4gIHJsIDogcmVhZGxpbmUuSW50ZXJmYWNlO1xuICB2ZXJib3NlIDogYm9vbGVhblxuXG4gIGNvbnN0cnVjdG9yKHJsOiByZWFkbGluZS5JbnRlcmZhY2UsIHZlcmJvc2U6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnJsID0gcmw7XG4gICAgdGhpcy52ZXJib3NlID0gdmVyYm9zZTtcbiAgfVxuXG4gIHByaW50TGluZShzdHI6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKGAke3N0cn1gKTtcbiAgfVxuXG4gIHByaW50TWFya2Rvd24oc3RyOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZyhgJHtzdHJ9YCk7XG4gIH1cblxuICBwcmludFZhbHVlKHZhbDogVmFsdWUpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZyh2YWwudG9TdHJpbmcoKSk7XG4gIH1cblxuICBwcmludEVycm9yKGVycjogRXJyb3IpOiB2b2lkIHtcbiAgICBpZiAodGhpcy52ZXJib3NlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH1cblxuICAgIGlmIChlcnIgaW5zdGFuY2VvZiBFdmVudFByb2Nlc3NpbmdFcnJvcikge1xuICAgICAgY29uc29sZS5sb2coYEV2ZW50IFByb2Nlc3NpbmcgRXJyb3I6YCk7XG4gICAgICBjb25zb2xlLmxvZyhgXFx0JHtlcnIuZXJyb3IudG9TdHJpbmcoKX1gKTtcbiAgICAgIGNvbnNvbGUubG9nKGBcXHR3aGVuIHByb2Nlc3NpbmcgZXZlbnQgXFxgJHtmb3JtYXRFdmVudChlcnIuZXZlbnQpfVxcYGApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhgRXJyb3I6ICR7ZXJyLnRvU3RyaW5nKCl9YCk7XG4gICAgfVxuICB9XG5cbiAgcHJpbnRBY3Rpb24oYWN0aW9uOiBBY3Rpb248YW55Pik6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKGBBY3Rpb246ICR7YWN0aW9uLmxvZ31gKTtcbiAgfVxufVxuIl19
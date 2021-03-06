"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCTokenDelegateEvent = exports.cTokenDelegateCommands = void 0;
const World_1 = require("../World");
const CoreValue_1 = require("../CoreValue");
const Command_1 = require("../Command");
const ContractLookup_1 = require("../ContractLookup");
const CTokenDelegateBuilder_1 = require("../Builder/CTokenDelegateBuilder");
const Verify_1 = require("../Verify");
async function genCTokenDelegate(world, from, event) {
    let { world: nextWorld, cTokenDelegate, delegateData } = await CTokenDelegateBuilder_1.buildCTokenDelegate(world, from, event);
    world = nextWorld;
    world = World_1.addAction(world, `Added cToken ${delegateData.name} (${delegateData.contract}) at address ${cTokenDelegate._address}`, delegateData.invokation);
    return world;
}
async function verifyCTokenDelegate(world, cTokenDelegate, name, contract, apiKey) {
    if (world.isLocalNetwork()) {
        world.printer.printLine(`Politely declining to verify on local network: ${world.network}.`);
    }
    else {
        await Verify_1.verify(world, apiKey, name, contract, cTokenDelegate._address);
    }
    return world;
}
function cTokenDelegateCommands() {
    return [
        new Command_1.Command(`
        #### Deploy

        * "CTokenDelegate Deploy ...cTokenDelegateParams" - Generates a new CTokenDelegate
          * E.g. "CTokenDelegate Deploy CDaiDelegate cDAIDelegate"
      `, "Deploy", [new Command_1.Arg("cTokenDelegateParams", CoreValue_1.getEventV, { variadic: true })], (world, from, { cTokenDelegateParams }) => genCTokenDelegate(world, from, cTokenDelegateParams.val)),
        new Command_1.View(`
        #### Verify

        * "CTokenDelegate <cTokenDelegate> Verify apiKey:<String>" - Verifies CTokenDelegate in Etherscan
          * E.g. "CTokenDelegate cDaiDelegate Verify "myApiKey"
      `, "Verify", [
            new Command_1.Arg("cTokenDelegateArg", CoreValue_1.getStringV),
            new Command_1.Arg("apiKey", CoreValue_1.getStringV)
        ], async (world, { cTokenDelegateArg, apiKey }) => {
            let [cToken, name, data] = await ContractLookup_1.getCTokenDelegateData(world, cTokenDelegateArg.val);
            return await verifyCTokenDelegate(world, cToken, name, data.get('contract'), apiKey.val);
        }, { namePos: 1 }),
    ];
}
exports.cTokenDelegateCommands = cTokenDelegateCommands;
async function processCTokenDelegateEvent(world, event, from) {
    return await Command_1.processCommandEvent("CTokenDelegate", cTokenDelegateCommands(), world, event, from);
}
exports.processCTokenDelegateEvent = processCTokenDelegateEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ1Rva2VuRGVsZWdhdGVFdmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9FdmVudC9DVG9rZW5EZWxlZ2F0ZUV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG9DQUEwRDtBQUsxRCw0Q0FPc0I7QUFTdEIsd0NBQXFFO0FBQ3JFLHNEQUEwRDtBQUMxRCw0RUFBdUU7QUFDdkUsc0NBQW1DO0FBRW5DLEtBQUssVUFBVSxpQkFBaUIsQ0FBQyxLQUFZLEVBQUUsSUFBWSxFQUFFLEtBQVk7SUFDdkUsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFLFlBQVksRUFBRSxHQUFHLE1BQU0sMkNBQW1CLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN2RyxLQUFLLEdBQUcsU0FBUyxDQUFDO0lBRWxCLEtBQUssR0FBRyxpQkFBUyxDQUNmLEtBQUssRUFDTCxnQkFBZ0IsWUFBWSxDQUFDLElBQUksS0FBSyxZQUFZLENBQUMsUUFBUSxnQkFBZ0IsY0FBYyxDQUFDLFFBQVEsRUFBRSxFQUNwRyxZQUFZLENBQUMsVUFBVSxDQUN4QixDQUFDO0lBRUYsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQsS0FBSyxVQUFVLG9CQUFvQixDQUFDLEtBQVksRUFBRSxjQUE4QixFQUFFLElBQVksRUFBRSxRQUFnQixFQUFFLE1BQWM7SUFDOUgsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLEVBQUU7UUFDMUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsa0RBQWtELEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0tBQzdGO1NBQU07UUFDTCxNQUFNLGVBQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3RFO0lBRUQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQsU0FBZ0Isc0JBQXNCO0lBQ3BDLE9BQU87UUFDTCxJQUFJLGlCQUFPLENBQW1DOzs7OztPQUszQyxFQUNELFFBQVEsRUFDUixDQUFDLElBQUksYUFBRyxDQUFDLHNCQUFzQixFQUFFLHFCQUFTLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUNoRSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxvQkFBb0IsRUFBRSxFQUFFLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUNwRztRQUNELElBQUksY0FBSSxDQUFrRDs7Ozs7T0FLdkQsRUFDRCxRQUFRLEVBQ1I7WUFDRSxJQUFJLGFBQUcsQ0FBQyxtQkFBbUIsRUFBRSxzQkFBVSxDQUFDO1lBQ3hDLElBQUksYUFBRyxDQUFDLFFBQVEsRUFBRSxzQkFBVSxDQUFDO1NBQzlCLEVBQ0QsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUU7WUFDN0MsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsTUFBTSxzQ0FBcUIsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFckYsT0FBTyxNQUFNLG9CQUFvQixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVGLENBQUMsRUFDRCxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FDZjtLQUNGLENBQUM7QUFDSixDQUFDO0FBL0JELHdEQStCQztBQUVNLEtBQUssVUFBVSwwQkFBMEIsQ0FBQyxLQUFZLEVBQUUsS0FBWSxFQUFFLElBQW1CO0lBQzlGLE9BQU8sTUFBTSw2QkFBbUIsQ0FBTSxnQkFBZ0IsRUFBRSxzQkFBc0IsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDeEcsQ0FBQztBQUZELGdFQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnQgfSBmcm9tICcuLi9FdmVudCc7XG5pbXBvcnQgeyBhZGRBY3Rpb24sIGRlc2NyaWJlVXNlciwgV29ybGQgfSBmcm9tICcuLi9Xb3JsZCc7XG5pbXBvcnQgeyBkZWNvZGVDYWxsLCBnZXRQYXN0RXZlbnRzIH0gZnJvbSAnLi4vQ29udHJhY3QnO1xuaW1wb3J0IHsgQ1Rva2VuLCBDVG9rZW5TY2VuYXJpbyB9IGZyb20gJy4uL0NvbnRyYWN0L0NUb2tlbic7XG5pbXBvcnQgeyBDRXJjMjBEZWxlZ2F0ZSB9IGZyb20gJy4uL0NvbnRyYWN0L0NFcmMyMERlbGVnYXRlJ1xuaW1wb3J0IHsgaW52b2tlLCBTZW5kYWJsZSB9IGZyb20gJy4uL0ludm9rYXRpb24nO1xuaW1wb3J0IHtcbiAgZ2V0QWRkcmVzc1YsXG4gIGdldEV2ZW50VixcbiAgZ2V0RXhwTnVtYmVyVixcbiAgZ2V0TnVtYmVyVixcbiAgZ2V0U3RyaW5nVixcbiAgZ2V0Qm9vbFZcbn0gZnJvbSAnLi4vQ29yZVZhbHVlJztcbmltcG9ydCB7XG4gIEFkZHJlc3NWLFxuICBCb29sVixcbiAgRXZlbnRWLFxuICBOb3RoaW5nVixcbiAgTnVtYmVyVixcbiAgU3RyaW5nVlxufSBmcm9tICcuLi9WYWx1ZSc7XG5pbXBvcnQgeyBBcmcsIENvbW1hbmQsIFZpZXcsIHByb2Nlc3NDb21tYW5kRXZlbnQgfSBmcm9tICcuLi9Db21tYW5kJztcbmltcG9ydCB7IGdldENUb2tlbkRlbGVnYXRlRGF0YSB9IGZyb20gJy4uL0NvbnRyYWN0TG9va3VwJztcbmltcG9ydCB7IGJ1aWxkQ1Rva2VuRGVsZWdhdGUgfSBmcm9tICcuLi9CdWlsZGVyL0NUb2tlbkRlbGVnYXRlQnVpbGRlcic7XG5pbXBvcnQgeyB2ZXJpZnkgfSBmcm9tICcuLi9WZXJpZnknO1xuXG5hc3luYyBmdW5jdGlvbiBnZW5DVG9rZW5EZWxlZ2F0ZSh3b3JsZDogV29ybGQsIGZyb206IHN0cmluZywgZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTxXb3JsZD4ge1xuICBsZXQgeyB3b3JsZDogbmV4dFdvcmxkLCBjVG9rZW5EZWxlZ2F0ZSwgZGVsZWdhdGVEYXRhIH0gPSBhd2FpdCBidWlsZENUb2tlbkRlbGVnYXRlKHdvcmxkLCBmcm9tLCBldmVudCk7XG4gIHdvcmxkID0gbmV4dFdvcmxkO1xuXG4gIHdvcmxkID0gYWRkQWN0aW9uKFxuICAgIHdvcmxkLFxuICAgIGBBZGRlZCBjVG9rZW4gJHtkZWxlZ2F0ZURhdGEubmFtZX0gKCR7ZGVsZWdhdGVEYXRhLmNvbnRyYWN0fSkgYXQgYWRkcmVzcyAke2NUb2tlbkRlbGVnYXRlLl9hZGRyZXNzfWAsXG4gICAgZGVsZWdhdGVEYXRhLmludm9rYXRpb25cbiAgKTtcblxuICByZXR1cm4gd29ybGQ7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHZlcmlmeUNUb2tlbkRlbGVnYXRlKHdvcmxkOiBXb3JsZCwgY1Rva2VuRGVsZWdhdGU6IENFcmMyMERlbGVnYXRlLCBuYW1lOiBzdHJpbmcsIGNvbnRyYWN0OiBzdHJpbmcsIGFwaUtleTogc3RyaW5nKTogUHJvbWlzZTxXb3JsZD4ge1xuICBpZiAod29ybGQuaXNMb2NhbE5ldHdvcmsoKSkge1xuICAgIHdvcmxkLnByaW50ZXIucHJpbnRMaW5lKGBQb2xpdGVseSBkZWNsaW5pbmcgdG8gdmVyaWZ5IG9uIGxvY2FsIG5ldHdvcms6ICR7d29ybGQubmV0d29ya30uYCk7XG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgdmVyaWZ5KHdvcmxkLCBhcGlLZXksIG5hbWUsIGNvbnRyYWN0LCBjVG9rZW5EZWxlZ2F0ZS5fYWRkcmVzcyk7XG4gIH1cblxuICByZXR1cm4gd29ybGQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjVG9rZW5EZWxlZ2F0ZUNvbW1hbmRzKCkge1xuICByZXR1cm4gW1xuICAgIG5ldyBDb21tYW5kPHsgY1Rva2VuRGVsZWdhdGVQYXJhbXM6IEV2ZW50ViB9PihgXG4gICAgICAgICMjIyMgRGVwbG95XG5cbiAgICAgICAgKiBcIkNUb2tlbkRlbGVnYXRlIERlcGxveSAuLi5jVG9rZW5EZWxlZ2F0ZVBhcmFtc1wiIC0gR2VuZXJhdGVzIGEgbmV3IENUb2tlbkRlbGVnYXRlXG4gICAgICAgICAgKiBFLmcuIFwiQ1Rva2VuRGVsZWdhdGUgRGVwbG95IENEYWlEZWxlZ2F0ZSBjREFJRGVsZWdhdGVcIlxuICAgICAgYCxcbiAgICAgIFwiRGVwbG95XCIsXG4gICAgICBbbmV3IEFyZyhcImNUb2tlbkRlbGVnYXRlUGFyYW1zXCIsIGdldEV2ZW50ViwgeyB2YXJpYWRpYzogdHJ1ZSB9KV0sXG4gICAgICAod29ybGQsIGZyb20sIHsgY1Rva2VuRGVsZWdhdGVQYXJhbXMgfSkgPT4gZ2VuQ1Rva2VuRGVsZWdhdGUod29ybGQsIGZyb20sIGNUb2tlbkRlbGVnYXRlUGFyYW1zLnZhbClcbiAgICApLFxuICAgIG5ldyBWaWV3PHsgY1Rva2VuRGVsZWdhdGVBcmc6IFN0cmluZ1YsIGFwaUtleTogU3RyaW5nViB9PihgXG4gICAgICAgICMjIyMgVmVyaWZ5XG5cbiAgICAgICAgKiBcIkNUb2tlbkRlbGVnYXRlIDxjVG9rZW5EZWxlZ2F0ZT4gVmVyaWZ5IGFwaUtleTo8U3RyaW5nPlwiIC0gVmVyaWZpZXMgQ1Rva2VuRGVsZWdhdGUgaW4gRXRoZXJzY2FuXG4gICAgICAgICAgKiBFLmcuIFwiQ1Rva2VuRGVsZWdhdGUgY0RhaURlbGVnYXRlIFZlcmlmeSBcIm15QXBpS2V5XCJcbiAgICAgIGAsXG4gICAgICBcIlZlcmlmeVwiLFxuICAgICAgW1xuICAgICAgICBuZXcgQXJnKFwiY1Rva2VuRGVsZWdhdGVBcmdcIiwgZ2V0U3RyaW5nViksXG4gICAgICAgIG5ldyBBcmcoXCJhcGlLZXlcIiwgZ2V0U3RyaW5nVilcbiAgICAgIF0sXG4gICAgICBhc3luYyAod29ybGQsIHsgY1Rva2VuRGVsZWdhdGVBcmcsIGFwaUtleSB9KSA9PiB7XG4gICAgICAgIGxldCBbY1Rva2VuLCBuYW1lLCBkYXRhXSA9IGF3YWl0IGdldENUb2tlbkRlbGVnYXRlRGF0YSh3b3JsZCwgY1Rva2VuRGVsZWdhdGVBcmcudmFsKTtcblxuICAgICAgICByZXR1cm4gYXdhaXQgdmVyaWZ5Q1Rva2VuRGVsZWdhdGUod29ybGQsIGNUb2tlbiwgbmFtZSwgZGF0YS5nZXQoJ2NvbnRyYWN0JykhLCBhcGlLZXkudmFsKTtcbiAgICAgIH0sXG4gICAgICB7IG5hbWVQb3M6IDEgfVxuICAgICksXG4gIF07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcm9jZXNzQ1Rva2VuRGVsZWdhdGVFdmVudCh3b3JsZDogV29ybGQsIGV2ZW50OiBFdmVudCwgZnJvbTogc3RyaW5nIHwgbnVsbCk6IFByb21pc2U8V29ybGQ+IHtcbiAgcmV0dXJuIGF3YWl0IHByb2Nlc3NDb21tYW5kRXZlbnQ8YW55PihcIkNUb2tlbkRlbGVnYXRlXCIsIGNUb2tlbkRlbGVnYXRlQ29tbWFuZHMoKSwgd29ybGQsIGV2ZW50LCBmcm9tKTtcbn1cbiJdfQ==
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPriceOracleEvent = exports.priceOracleCommands = void 0;
const World_1 = require("../World");
const PriceOracleBuilder_1 = require("../Builder/PriceOracleBuilder");
const Invokation_1 = require("../Invokation");
const CoreValue_1 = require("../CoreValue");
const Value_1 = require("../Value");
const Command_1 = require("../Command");
const ContractLookup_1 = require("../ContractLookup");
const Verify_1 = require("../Verify");
async function genPriceOracle(world, from, params) {
    let { world: nextWorld, priceOracle, priceOracleData } = await PriceOracleBuilder_1.buildPriceOracle(world, from, params);
    world = nextWorld;
    world = World_1.addAction(world, `Deployed PriceOracle (${priceOracleData.description}) to address ${priceOracle._address}`, priceOracleData.invokation);
    return world;
}
async function setPriceOracleFn(world, params) {
    let { world: nextWorld, priceOracle, priceOracleData } = await PriceOracleBuilder_1.setPriceOracle(world, params);
    return nextWorld;
}
async function setPrice(world, from, priceOracle, cToken, amount) {
    return World_1.addAction(world, `Set price oracle price for ${cToken} to ${amount.show()}`, await Invokation_1.invoke(world, priceOracle.methods.setUnderlyingPrice(cToken, amount.encode()), from));
}
async function setDirectPrice(world, from, priceOracle, address, amount) {
    return World_1.addAction(world, `Set price oracle price for ${address} to ${amount.show()}`, await Invokation_1.invoke(world, priceOracle.methods.setDirectPrice(address, amount.encode()), from));
}
async function verifyPriceOracle(world, priceOracle, apiKey, contractName) {
    if (world.isLocalNetwork()) {
        world.printer.printLine(`Politely declining to verify on local network: ${world.network}.`);
    }
    else {
        await Verify_1.verify(world, apiKey, "PriceOracle", contractName, priceOracle._address);
    }
    return world;
}
function priceOracleCommands() {
    return [
        new Command_1.Command(`
        #### Deploy

        * "Deploy ...params" - Generates a new price oracle
          * E.g. "PriceOracle Deploy Fixed 1.0"
          * E.g. "PriceOracle Deploy Simple"
          * E.g. "PriceOracle Deploy NotPriceOracle"
      `, "Deploy", [
            new Command_1.Arg("params", CoreValue_1.getEventV, { variadic: true })
        ], (world, from, { params }) => genPriceOracle(world, from, params.val)),
        new Command_1.Command(`
        #### Set

        * "Set ...params" - Sets the price oracle to given deployed contract
          * E.g. "PriceOracle Set Standard \"0x...\" \"My Already Deployed Oracle\""
      `, "Set", [
            new Command_1.Arg("params", CoreValue_1.getEventV, { variadic: true })
        ], (world, from, { params }) => setPriceOracleFn(world, params.val)),
        new Command_1.Command(`
        #### SetPrice

        * "SetPrice <CToken> <Amount>" - Sets the per-ether price for the given cToken
          * E.g. "PriceOracle SetPrice cZRX 1.0"
      `, "SetPrice", [
            new Command_1.Arg("priceOracle", ContractLookup_1.getPriceOracle, { implicit: true }),
            new Command_1.Arg("cToken", CoreValue_1.getAddressV),
            new Command_1.Arg("amount", CoreValue_1.getExpNumberV)
        ], (world, from, { priceOracle, cToken, amount }) => setPrice(world, from, priceOracle, cToken.val, amount)),
        new Command_1.Command(`
        #### SetDirectPrice

        * "SetDirectPrice <Address> <Amount>" - Sets the per-ether price for the given cToken
          * E.g. "PriceOracle SetDirectPrice (Address Zero) 1.0"
      `, "SetDirectPrice", [
            new Command_1.Arg("priceOracle", ContractLookup_1.getPriceOracle, { implicit: true }),
            new Command_1.Arg("address", CoreValue_1.getAddressV),
            new Command_1.Arg("amount", CoreValue_1.getExpNumberV)
        ], (world, from, { priceOracle, address, amount }) => setDirectPrice(world, from, priceOracle, address.val, amount)),
        new Command_1.View(`
        #### Verify

        * "Verify apiKey:<String> contractName:<String>=PriceOracle" - Verifies PriceOracle in Etherscan
          * E.g. "PriceOracle Verify "myApiKey"
      `, "Verify", [
            new Command_1.Arg("priceOracle", ContractLookup_1.getPriceOracle, { implicit: true }),
            new Command_1.Arg("apiKey", CoreValue_1.getStringV),
            new Command_1.Arg("contractName", CoreValue_1.getStringV, { default: new Value_1.StringV("PriceOracle") })
        ], (world, { priceOracle, apiKey, contractName }) => verifyPriceOracle(world, priceOracle, apiKey.val, contractName.val))
    ];
}
exports.priceOracleCommands = priceOracleCommands;
async function processPriceOracleEvent(world, event, from) {
    return await Command_1.processCommandEvent("PriceOracle", priceOracleCommands(), world, event, from);
}
exports.processPriceOracleEvent = processPriceOracleEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJpY2VPcmFjbGVFdmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9FdmVudC9QcmljZU9yYWNsZUV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG9DQUEwQztBQUUxQyxzRUFBK0U7QUFDL0UsOENBQXFDO0FBQ3JDLDRDQUtzQjtBQUN0QixvQ0FLa0I7QUFDbEIsd0NBQW1FO0FBQ25FLHNEQUFpRDtBQUNqRCxzQ0FBaUM7QUFHakMsS0FBSyxVQUFVLGNBQWMsQ0FBQyxLQUFZLEVBQUUsSUFBWSxFQUFFLE1BQWE7SUFDckUsSUFBSSxFQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBQyxHQUFHLE1BQU0scUNBQWdCLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuRyxLQUFLLEdBQUcsU0FBUyxDQUFDO0lBRWxCLEtBQUssR0FBRyxpQkFBUyxDQUNmLEtBQUssRUFDTCx5QkFBeUIsZUFBZSxDQUFDLFdBQVcsZ0JBQWdCLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFDMUYsZUFBZSxDQUFDLFVBQVcsQ0FDNUIsQ0FBQztJQUVGLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELEtBQUssVUFBVSxnQkFBZ0IsQ0FBQyxLQUFZLEVBQUUsTUFBYTtJQUN6RCxJQUFJLEVBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFDLEdBQUcsTUFBTSxtQ0FBYyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUUzRixPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBRUQsS0FBSyxVQUFVLFFBQVEsQ0FBQyxLQUFZLEVBQUUsSUFBWSxFQUFFLFdBQXdCLEVBQUUsTUFBYyxFQUFFLE1BQWU7SUFDM0csT0FBTyxpQkFBUyxDQUNkLEtBQUssRUFDTCw4QkFBOEIsTUFBTSxPQUFPLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUMx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QyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUMsRUFBRSxFQUFFLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQy9HO1FBRUQsSUFBSSxjQUFJLENBQXFFOzs7OztPQUsxRSxFQUNELFFBQVEsRUFDUjtZQUNFLElBQUksYUFBRyxDQUFDLGFBQWEsRUFBRSwrQkFBYyxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDO1lBQ3hELElBQUksYUFBRyxDQUFDLFFBQVEsRUFBRSxzQkFBVSxDQUFDO1lBQzdCLElBQUksYUFBRyxDQUFDLGNBQWMsRUFBRSxzQkFBVSxFQUFFLEVBQUMsT0FBTyxFQUFFLElBQUksZUFBTyxDQUFDLGFBQWEsQ0FBQyxFQUFDLENBQUM7U0FDM0UsRUFDRCxDQUFDLEtBQUssRUFBRSxFQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFDLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQ3BIO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUExRUQsa0RBMEVDO0FBRU0sS0FBSyxVQUFVLHVCQUF1QixDQUFDLEtBQVksRUFBRSxLQUFZLEVBQUUsSUFBbUI7SUFDM0YsT0FBTyxNQUFNLDZCQUFtQixDQUFNLGFBQWEsRUFBRSxtQkFBbUIsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDbEcsQ0FBQztBQUZELDBEQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtFdmVudH0gZnJvbSAnLi4vRXZlbnQnO1xuaW1wb3J0IHthZGRBY3Rpb24sIFdvcmxkfSBmcm9tICcuLi9Xb3JsZCc7XG5pbXBvcnQge1ByaWNlT3JhY2xlfSBmcm9tICcuLi9Db250cmFjdC9QcmljZU9yYWNsZSc7XG5pbXBvcnQge2J1aWxkUHJpY2VPcmFjbGUsIHNldFByaWNlT3JhY2xlfSBmcm9tICcuLi9CdWlsZGVyL1ByaWNlT3JhY2xlQnVpbGRlcic7XG5pbXBvcnQge2ludm9rZX0gZnJvbSAnLi4vSW52b2thdGlvbic7XG5pbXBvcnQge1xuICBnZXRBZGRyZXNzVixcbiAgZ2V0RXZlbnRWLFxuICBnZXRFeHBOdW1iZXJWLFxuICBnZXRTdHJpbmdWXG59IGZyb20gJy4uL0NvcmVWYWx1ZSc7XG5pbXBvcnQge1xuICBBZGRyZXNzVixcbiAgRXZlbnRWLFxuICBOdW1iZXJWLFxuICBTdHJpbmdWXG59IGZyb20gJy4uL1ZhbHVlJztcbmltcG9ydCB7QXJnLCBDb21tYW5kLCBwcm9jZXNzQ29tbWFuZEV2ZW50LCBWaWV3fSBmcm9tICcuLi9Db21tYW5kJztcbmltcG9ydCB7Z2V0UHJpY2VPcmFjbGV9IGZyb20gJy4uL0NvbnRyYWN0TG9va3VwJztcbmltcG9ydCB7dmVyaWZ5fSBmcm9tICcuLi9WZXJpZnknO1xuaW1wb3J0IHtlbmNvZGVkTnVtYmVyfSBmcm9tICcuLi9FbmNvZGluZyc7XG5cbmFzeW5jIGZ1bmN0aW9uIGdlblByaWNlT3JhY2xlKHdvcmxkOiBXb3JsZCwgZnJvbTogc3RyaW5nLCBwYXJhbXM6IEV2ZW50KTogUHJvbWlzZTxXb3JsZD4ge1xuICBsZXQge3dvcmxkOiBuZXh0V29ybGQsIHByaWNlT3JhY2xlLCBwcmljZU9yYWNsZURhdGF9ID0gYXdhaXQgYnVpbGRQcmljZU9yYWNsZSh3b3JsZCwgZnJvbSwgcGFyYW1zKTtcbiAgd29ybGQgPSBuZXh0V29ybGQ7XG5cbiAgd29ybGQgPSBhZGRBY3Rpb24oXG4gICAgd29ybGQsXG4gICAgYERlcGxveWVkIFByaWNlT3JhY2xlICgke3ByaWNlT3JhY2xlRGF0YS5kZXNjcmlwdGlvbn0pIHRvIGFkZHJlc3MgJHtwcmljZU9yYWNsZS5fYWRkcmVzc31gLFxuICAgIHByaWNlT3JhY2xlRGF0YS5pbnZva2F0aW9uIVxuICApO1xuXG4gIHJldHVybiB3b3JsZDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2V0UHJpY2VPcmFjbGVGbih3b3JsZDogV29ybGQsIHBhcmFtczogRXZlbnQpOiBQcm9taXNlPFdvcmxkPiB7XG4gIGxldCB7d29ybGQ6IG5leHRXb3JsZCwgcHJpY2VPcmFjbGUsIHByaWNlT3JhY2xlRGF0YX0gPSBhd2FpdCBzZXRQcmljZU9yYWNsZSh3b3JsZCwgcGFyYW1zKTtcblxuICByZXR1cm4gbmV4dFdvcmxkO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzZXRQcmljZSh3b3JsZDogV29ybGQsIGZyb206IHN0cmluZywgcHJpY2VPcmFjbGU6IFByaWNlT3JhY2xlLCBjVG9rZW46IHN0cmluZywgYW1vdW50OiBOdW1iZXJWKTogUHJvbWlzZTxXb3JsZD4ge1xuICByZXR1cm4gYWRkQWN0aW9uKFxuICAgIHdvcmxkLFxuICAgIGBTZXQgcHJpY2Ugb3JhY2xlIHByaWNlIGZvciAke2NUb2tlbn0gdG8gJHthbW91bnQuc2hvdygpfWAsXG4gICAgYXdhaXQgaW52b2tlKHdvcmxkLCBwcmljZU9yYWNsZS5tZXRob2RzLnNldFVuZGVybHlpbmdQcmljZShjVG9rZW4sIGFtb3VudC5lbmNvZGUoKSksIGZyb20pXG4gICk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNldERpcmVjdFByaWNlKHdvcmxkOiBXb3JsZCwgZnJvbTogc3RyaW5nLCBwcmljZU9yYWNsZTogUHJpY2VPcmFjbGUsIGFkZHJlc3M6IHN0cmluZywgYW1vdW50OiBOdW1iZXJWKTogUHJvbWlzZTxXb3JsZD4ge1xuICByZXR1cm4gYWRkQWN0aW9uKFxuICAgIHdvcmxkLFxuICAgIGBTZXQgcHJpY2Ugb3JhY2xlIHByaWNlIGZvciAke2FkZHJlc3N9IHRvICR7YW1vdW50LnNob3coKX1gLFxuICAgIGF3YWl0IGludm9rZSh3b3JsZCwgcHJpY2VPcmFjbGUubWV0aG9kcy5zZXREaXJlY3RQcmljZShhZGRyZXNzLCBhbW91bnQuZW5jb2RlKCkpLCBmcm9tKVxuICApO1xufVxuXG5hc3luYyBmdW5jdGlvbiB2ZXJpZnlQcmljZU9yYWNsZSh3b3JsZDogV29ybGQsIHByaWNlT3JhY2xlOiBQcmljZU9yYWNsZSwgYXBpS2V5OiBzdHJpbmcsIGNvbnRyYWN0TmFtZTogc3RyaW5nKTogUHJvbWlzZTxXb3JsZD4ge1xuICBpZiAod29ybGQuaXNMb2NhbE5ldHdvcmsoKSkge1xuICAgIHdvcmxkLnByaW50ZXIucHJpbnRMaW5lKGBQb2xpdGVseSBkZWNsaW5pbmcgdG8gdmVyaWZ5IG9uIGxvY2FsIG5ldHdvcms6ICR7d29ybGQubmV0d29ya30uYCk7XG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgdmVyaWZ5KHdvcmxkLCBhcGlLZXksIFwiUHJpY2VPcmFjbGVcIiwgY29udHJhY3ROYW1lLCBwcmljZU9yYWNsZS5fYWRkcmVzcyk7XG4gIH1cblxuICByZXR1cm4gd29ybGQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmljZU9yYWNsZUNvbW1hbmRzKCkge1xuICByZXR1cm4gW1xuICAgIG5ldyBDb21tYW5kPHtwYXJhbXM6IEV2ZW50Vn0+KGBcbiAgICAgICAgIyMjIyBEZXBsb3lcblxuICAgICAgICAqIFwiRGVwbG95IC4uLnBhcmFtc1wiIC0gR2VuZXJhdGVzIGEgbmV3IHByaWNlIG9yYWNsZVxuICAgICAgICAgICogRS5nLiBcIlByaWNlT3JhY2xlIERlcGxveSBGaXhlZCAxLjBcIlxuICAgICAgICAgICogRS5nLiBcIlByaWNlT3JhY2xlIERlcGxveSBTaW1wbGVcIlxuICAgICAgICAgICogRS5nLiBcIlByaWNlT3JhY2xlIERlcGxveSBOb3RQcmljZU9yYWNsZVwiXG4gICAgICBgLFxuICAgICAgXCJEZXBsb3lcIixcbiAgICAgIFtcbiAgICAgICAgbmV3IEFyZyhcInBhcmFtc1wiLCBnZXRFdmVudFYsIHt2YXJpYWRpYzogdHJ1ZX0pXG4gICAgICBdLFxuICAgICAgKHdvcmxkLCBmcm9tLCB7cGFyYW1zfSkgPT4gZ2VuUHJpY2VPcmFjbGUod29ybGQsIGZyb20sIHBhcmFtcy52YWwpXG4gICAgKSxcbiAgICBuZXcgQ29tbWFuZDx7cGFyYW1zOiBFdmVudFZ9PihgXG4gICAgICAgICMjIyMgU2V0XG5cbiAgICAgICAgKiBcIlNldCAuLi5wYXJhbXNcIiAtIFNldHMgdGhlIHByaWNlIG9yYWNsZSB0byBnaXZlbiBkZXBsb3llZCBjb250cmFjdFxuICAgICAgICAgICogRS5nLiBcIlByaWNlT3JhY2xlIFNldCBTdGFuZGFyZCBcXFwiMHguLi5cXFwiIFxcXCJNeSBBbHJlYWR5IERlcGxveWVkIE9yYWNsZVxcXCJcIlxuICAgICAgYCxcbiAgICAgIFwiU2V0XCIsXG4gICAgICBbXG4gICAgICAgIG5ldyBBcmcoXCJwYXJhbXNcIiwgZ2V0RXZlbnRWLCB7dmFyaWFkaWM6IHRydWV9KVxuICAgICAgXSxcbiAgICAgICh3b3JsZCwgZnJvbSwge3BhcmFtc30pID0+IHNldFByaWNlT3JhY2xlRm4od29ybGQsIHBhcmFtcy52YWwpXG4gICAgKSxcblxuICAgIG5ldyBDb21tYW5kPHtwcmljZU9yYWNsZTogUHJpY2VPcmFjbGUsIGNUb2tlbjogQWRkcmVzc1YsIGFtb3VudDogTnVtYmVyVn0+KGBcbiAgICAgICAgIyMjIyBTZXRQcmljZVxuXG4gICAgICAgICogXCJTZXRQcmljZSA8Q1Rva2VuPiA8QW1vdW50PlwiIC0gU2V0cyB0aGUgcGVyLWV0aGVyIHByaWNlIGZvciB0aGUgZ2l2ZW4gY1Rva2VuXG4gICAgICAgICAgKiBFLmcuIFwiUHJpY2VPcmFjbGUgU2V0UHJpY2UgY1pSWCAxLjBcIlxuICAgICAgYCxcbiAgICAgIFwiU2V0UHJpY2VcIixcbiAgICAgIFtcbiAgICAgICAgbmV3IEFyZyhcInByaWNlT3JhY2xlXCIsIGdldFByaWNlT3JhY2xlLCB7aW1wbGljaXQ6IHRydWV9KSxcbiAgICAgICAgbmV3IEFyZyhcImNUb2tlblwiLCBnZXRBZGRyZXNzViksXG4gICAgICAgIG5ldyBBcmcoXCJhbW91bnRcIiwgZ2V0RXhwTnVtYmVyVilcbiAgICAgIF0sXG4gICAgICAod29ybGQsIGZyb20sIHtwcmljZU9yYWNsZSwgY1Rva2VuLCBhbW91bnR9KSA9PiBzZXRQcmljZSh3b3JsZCwgZnJvbSwgcHJpY2VPcmFjbGUsIGNUb2tlbi52YWwsIGFtb3VudClcbiAgICApLFxuXG4gICAgbmV3IENvbW1hbmQ8e3ByaWNlT3JhY2xlOiBQcmljZU9yYWNsZSwgYWRkcmVzczogQWRkcmVzc1YsIGFtb3VudDogTnVtYmVyVn0+KGBcbiAgICAgICAgIyMjIyBTZXREaXJlY3RQcmljZVxuXG4gICAgICAgICogXCJTZXREaXJlY3RQcmljZSA8QWRkcmVzcz4gPEFtb3VudD5cIiAtIFNldHMgdGhlIHBlci1ldGhlciBwcmljZSBmb3IgdGhlIGdpdmVuIGNUb2tlblxuICAgICAgICAgICogRS5nLiBcIlByaWNlT3JhY2xlIFNldERpcmVjdFByaWNlIChBZGRyZXNzIFplcm8pIDEuMFwiXG4gICAgICBgLFxuICAgICAgXCJTZXREaXJlY3RQcmljZVwiLFxuICAgICAgW1xuICAgICAgICBuZXcgQXJnKFwicHJpY2VPcmFjbGVcIiwgZ2V0UHJpY2VPcmFjbGUsIHtpbXBsaWNpdDogdHJ1ZX0pLFxuICAgICAgICBuZXcgQXJnKFwiYWRkcmVzc1wiLCBnZXRBZGRyZXNzViksXG4gICAgICAgIG5ldyBBcmcoXCJhbW91bnRcIiwgZ2V0RXhwTnVtYmVyVilcbiAgICAgIF0sXG4gICAgICAod29ybGQsIGZyb20sIHtwcmljZU9yYWNsZSwgYWRkcmVzcywgYW1vdW50fSkgPT4gc2V0RGlyZWN0UHJpY2Uod29ybGQsIGZyb20sIHByaWNlT3JhY2xlLCBhZGRyZXNzLnZhbCwgYW1vdW50KVxuICAgICksXG5cbiAgICBuZXcgVmlldzx7cHJpY2VPcmFjbGU6IFByaWNlT3JhY2xlLCBhcGlLZXk6IFN0cmluZ1YsIGNvbnRyYWN0TmFtZTogU3RyaW5nVn0+KGBcbiAgICAgICAgIyMjIyBWZXJpZnlcblxuICAgICAgICAqIFwiVmVyaWZ5IGFwaUtleTo8U3RyaW5nPiBjb250cmFjdE5hbWU6PFN0cmluZz49UHJpY2VPcmFjbGVcIiAtIFZlcmlmaWVzIFByaWNlT3JhY2xlIGluIEV0aGVyc2NhblxuICAgICAgICAgICogRS5nLiBcIlByaWNlT3JhY2xlIFZlcmlmeSBcIm15QXBpS2V5XCJcbiAgICAgIGAsXG4gICAgICBcIlZlcmlmeVwiLFxuICAgICAgW1xuICAgICAgICBuZXcgQXJnKFwicHJpY2VPcmFjbGVcIiwgZ2V0UHJpY2VPcmFjbGUsIHtpbXBsaWNpdDogdHJ1ZX0pLFxuICAgICAgICBuZXcgQXJnKFwiYXBpS2V5XCIsIGdldFN0cmluZ1YpLFxuICAgICAgICBuZXcgQXJnKFwiY29udHJhY3ROYW1lXCIsIGdldFN0cmluZ1YsIHtkZWZhdWx0OiBuZXcgU3RyaW5nVihcIlByaWNlT3JhY2xlXCIpfSlcbiAgICAgIF0sXG4gICAgICAod29ybGQsIHtwcmljZU9yYWNsZSwgYXBpS2V5LCBjb250cmFjdE5hbWV9KSA9PiB2ZXJpZnlQcmljZU9yYWNsZSh3b3JsZCwgcHJpY2VPcmFjbGUsIGFwaUtleS52YWwsIGNvbnRyYWN0TmFtZS52YWwpXG4gICAgKVxuICBdO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJvY2Vzc1ByaWNlT3JhY2xlRXZlbnQod29ybGQ6IFdvcmxkLCBldmVudDogRXZlbnQsIGZyb206IHN0cmluZyB8IG51bGwpOiBQcm9taXNlPFdvcmxkPiB7XG4gIHJldHVybiBhd2FpdCBwcm9jZXNzQ29tbWFuZEV2ZW50PGFueT4oXCJQcmljZU9yYWNsZVwiLCBwcmljZU9yYWNsZUNvbW1hbmRzKCksIHdvcmxkLCBldmVudCwgZnJvbSk7XG59XG4iXX0=
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComptrollerValue = exports.comptrollerFetchers = exports.getHypotheticalLiquidity = exports.getLiquidity = exports.getComptrollerAddress = void 0;
const CoreValue_1 = require("../CoreValue");
const Value_1 = require("../Value");
const Command_1 = require("../Command");
const ContractLookup_1 = require("../ContractLookup");
const CTokenValue_1 = require("../Value/CTokenValue");
const Utils_1 = require("../Utils");
async function getComptrollerAddress(world, comptroller) {
    return new Value_1.AddressV(comptroller._address);
}
exports.getComptrollerAddress = getComptrollerAddress;
async function getLiquidity(world, comptroller, user) {
    let { 0: error, 1: liquidity, 2: shortfall } = await comptroller.methods.getAccountLiquidity(user).call();
    if (Number(error) != 0) {
        throw new Error(`Failed to compute account liquidity: error code = ${error}`);
    }
    return new Value_1.NumberV(Number(liquidity) - Number(shortfall));
}
exports.getLiquidity = getLiquidity;
async function getHypotheticalLiquidity(world, comptroller, account, asset, redeemTokens, borrowAmount) {
    let { 0: error, 1: liquidity, 2: shortfall } = await comptroller.methods.getHypotheticalAccountLiquidity(account, asset, redeemTokens, borrowAmount).call();
    if (Number(error) != 0) {
        throw new Error(`Failed to compute account hypothetical liquidity: error code = ${error}`);
    }
    return new Value_1.NumberV(Number(liquidity) - Number(shortfall));
}
exports.getHypotheticalLiquidity = getHypotheticalLiquidity;
async function getPriceOracle(world, comptroller) {
    return new Value_1.AddressV(await comptroller.methods.oracle().call());
}
async function getCloseFactor(world, comptroller) {
    return new Value_1.NumberV(await comptroller.methods.closeFactorMantissa().call(), 1e18);
}
async function getMaxAssets(world, comptroller) {
    return new Value_1.NumberV(await comptroller.methods.maxAssets().call());
}
async function getLiquidationIncentive(world, comptroller) {
    return new Value_1.NumberV(await comptroller.methods.liquidationIncentiveMantissa().call(), 1e18);
}
async function getImplementation(world, comptroller) {
    return new Value_1.AddressV(await comptroller.methods.comptrollerImplementation().call());
}
async function getBlockNumber(world, comptroller) {
    return new Value_1.NumberV(await comptroller.methods.getBlockNumber().call());
}
async function getAdmin(world, comptroller) {
    return new Value_1.AddressV(await comptroller.methods.admin().call());
}
async function getPendingAdmin(world, comptroller) {
    return new Value_1.AddressV(await comptroller.methods.pendingAdmin().call());
}
async function getCollateralFactor(world, comptroller, cToken) {
    let { 0: _isListed, 1: collateralFactorMantissa } = await comptroller.methods.markets(cToken._address).call();
    return new Value_1.NumberV(collateralFactorMantissa, 1e18);
}
async function membershipLength(world, comptroller, user) {
    return new Value_1.NumberV(await comptroller.methods.membershipLength(user).call());
}
async function checkMembership(world, comptroller, user, cToken) {
    return new Value_1.BoolV(await comptroller.methods.checkMembership(user, cToken._address).call());
}
async function getAssetsIn(world, comptroller, user) {
    let assetsList = await comptroller.methods.getAssetsIn(user).call();
    return new Value_1.ListV(assetsList.map((a) => new Value_1.AddressV(a)));
}
async function getCompMarkets(world, comptroller) {
    let mkts = await comptroller.methods.getCompMarkets().call();
    return new Value_1.ListV(mkts.map((a) => new Value_1.AddressV(a)));
}
async function checkListed(world, comptroller, cToken) {
    let { 0: isListed, 1: _collateralFactorMantissa } = await comptroller.methods.markets(cToken._address).call();
    return new Value_1.BoolV(isListed);
}
async function checkIsComped(world, comptroller, cToken) {
    let { 0: isListed, 1: _collateralFactorMantissa, 2: isComped } = await comptroller.methods.markets(cToken._address).call();
    return new Value_1.BoolV(isComped);
}
function comptrollerFetchers() {
    return [
        new Command_1.Fetcher(`
        #### Address

        * "Comptroller Address" - Returns address of comptroller
      `, "Address", [new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true })], (world, { comptroller }) => getComptrollerAddress(world, comptroller)),
        new Command_1.Fetcher(`
        #### Liquidity

        * "Comptroller Liquidity <User>" - Returns a given user's trued up liquidity
          * E.g. "Comptroller Liquidity Geoff"
      `, "Liquidity", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
            new Command_1.Arg("account", CoreValue_1.getAddressV)
        ], (world, { comptroller, account }) => getLiquidity(world, comptroller, account.val)),
        new Command_1.Fetcher(`
        #### Hypothetical

        * "Comptroller Hypothetical <User> <Action> <Asset> <Number>" - Returns a given user's trued up liquidity given a hypothetical change in asset with redeeming a certain number of tokens and/or borrowing a given amount.
          * E.g. "Comptroller Hypothetical Geoff Redeems 6.0 cZRX"
          * E.g. "Comptroller Hypothetical Geoff Borrows 5.0 cZRX"
      `, "Hypothetical", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
            new Command_1.Arg("account", CoreValue_1.getAddressV),
            new Command_1.Arg("action", CoreValue_1.getStringV),
            new Command_1.Arg("amount", CoreValue_1.getNumberV),
            new Command_1.Arg("cToken", CTokenValue_1.getCTokenV)
        ], async (world, { comptroller, account, action, cToken, amount }) => {
            let redeemTokens;
            let borrowAmount;
            switch (action.val.toLowerCase()) {
                case "borrows":
                    redeemTokens = new Value_1.NumberV(0);
                    borrowAmount = amount;
                    break;
                case "redeems":
                    redeemTokens = amount;
                    borrowAmount = new Value_1.NumberV(0);
                    break;
                default:
                    throw new Error(`Unknown hypothetical: ${action.val}`);
            }
            return await getHypotheticalLiquidity(world, comptroller, account.val, cToken._address, redeemTokens.encode(), borrowAmount.encode());
        }),
        new Command_1.Fetcher(`
        #### Admin

        * "Comptroller Admin" - Returns the Comptrollers's admin
          * E.g. "Comptroller Admin"
      `, "Admin", [new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true })], (world, { comptroller }) => getAdmin(world, comptroller)),
        new Command_1.Fetcher(`
        #### PendingAdmin

        * "Comptroller PendingAdmin" - Returns the pending admin of the Comptroller
          * E.g. "Comptroller PendingAdmin" - Returns Comptroller's pending admin
      `, "PendingAdmin", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
        ], (world, { comptroller }) => getPendingAdmin(world, comptroller)),
        new Command_1.Fetcher(`
        #### PriceOracle

        * "Comptroller PriceOracle" - Returns the Comptrollers's price oracle
          * E.g. "Comptroller PriceOracle"
      `, "PriceOracle", [new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true })], (world, { comptroller }) => getPriceOracle(world, comptroller)),
        new Command_1.Fetcher(`
        #### CloseFactor

        * "Comptroller CloseFactor" - Returns the Comptrollers's price oracle
          * E.g. "Comptroller CloseFactor"
      `, "CloseFactor", [new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true })], (world, { comptroller }) => getCloseFactor(world, comptroller)),
        new Command_1.Fetcher(`
        #### MaxAssets

        * "Comptroller MaxAssets" - Returns the Comptrollers's price oracle
          * E.g. "Comptroller MaxAssets"
      `, "MaxAssets", [new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true })], (world, { comptroller }) => getMaxAssets(world, comptroller)),
        new Command_1.Fetcher(`
        #### LiquidationIncentive

        * "Comptroller LiquidationIncentive" - Returns the Comptrollers's liquidation incentive
          * E.g. "Comptroller LiquidationIncentive"
      `, "LiquidationIncentive", [new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true })], (world, { comptroller }) => getLiquidationIncentive(world, comptroller)),
        new Command_1.Fetcher(`
        #### Implementation

        * "Comptroller Implementation" - Returns the Comptrollers's implementation
          * E.g. "Comptroller Implementation"
      `, "Implementation", [new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true })], (world, { comptroller }) => getImplementation(world, comptroller)),
        new Command_1.Fetcher(`
        #### BlockNumber

        * "Comptroller BlockNumber" - Returns the Comptrollers's mocked block number (for scenario runner)
          * E.g. "Comptroller BlockNumber"
      `, "BlockNumber", [new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true })], (world, { comptroller }) => getBlockNumber(world, comptroller)),
        new Command_1.Fetcher(`
        #### CollateralFactor

        * "Comptroller CollateralFactor <CToken>" - Returns the collateralFactor associated with a given asset
          * E.g. "Comptroller CollateralFactor cZRX"
      `, "CollateralFactor", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
            new Command_1.Arg("cToken", CTokenValue_1.getCTokenV)
        ], (world, { comptroller, cToken }) => getCollateralFactor(world, comptroller, cToken)),
        new Command_1.Fetcher(`
        #### MembershipLength

        * "Comptroller MembershipLength <User>" - Returns a given user's length of membership
          * E.g. "Comptroller MembershipLength Geoff"
      `, "MembershipLength", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
            new Command_1.Arg("account", CoreValue_1.getAddressV)
        ], (world, { comptroller, account }) => membershipLength(world, comptroller, account.val)),
        new Command_1.Fetcher(`
        #### CheckMembership

        * "Comptroller CheckMembership <User> <CToken>" - Returns one if user is in asset, zero otherwise.
          * E.g. "Comptroller CheckMembership Geoff cZRX"
      `, "CheckMembership", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
            new Command_1.Arg("account", CoreValue_1.getAddressV),
            new Command_1.Arg("cToken", CTokenValue_1.getCTokenV)
        ], (world, { comptroller, account, cToken }) => checkMembership(world, comptroller, account.val, cToken)),
        new Command_1.Fetcher(`
        #### AssetsIn

        * "Comptroller AssetsIn <User>" - Returns the assets a user is in
          * E.g. "Comptroller AssetsIn Geoff"
      `, "AssetsIn", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
            new Command_1.Arg("account", CoreValue_1.getAddressV)
        ], (world, { comptroller, account }) => getAssetsIn(world, comptroller, account.val)),
        new Command_1.Fetcher(`
        #### CheckListed

        * "Comptroller CheckListed <CToken>" - Returns true if market is listed, false otherwise.
          * E.g. "Comptroller CheckListed cZRX"
      `, "CheckListed", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
            new Command_1.Arg("cToken", CTokenValue_1.getCTokenV)
        ], (world, { comptroller, cToken }) => checkListed(world, comptroller, cToken)),
        new Command_1.Fetcher(`
        #### CheckIsComped

        * "Comptroller CheckIsComped <CToken>" - Returns true if market is listed, false otherwise.
          * E.g. "Comptroller CheckIsComped cZRX"
      `, "CheckIsComped", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
            new Command_1.Arg("cToken", CTokenValue_1.getCTokenV)
        ], (world, { comptroller, cToken }) => checkIsComped(world, comptroller, cToken)),
        new Command_1.Fetcher(`
        #### PauseGuardian

        * "PauseGuardian" - Returns the Comptrollers's PauseGuardian
        * E.g. "Comptroller PauseGuardian"
        `, "PauseGuardian", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true })
        ], async (world, { comptroller }) => new Value_1.AddressV(await comptroller.methods.pauseGuardian().call())),
        new Command_1.Fetcher(`
        #### _MintGuardianPaused

        * "_MintGuardianPaused" - Returns the Comptrollers's original global Mint paused status
        * E.g. "Comptroller _MintGuardianPaused"
        `, "_MintGuardianPaused", [new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true })], async (world, { comptroller }) => new Value_1.BoolV(await comptroller.methods._mintGuardianPaused().call())),
        new Command_1.Fetcher(`
        #### _BorrowGuardianPaused

        * "_BorrowGuardianPaused" - Returns the Comptrollers's original global Borrow paused status
        * E.g. "Comptroller _BorrowGuardianPaused"
        `, "_BorrowGuardianPaused", [new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true })], async (world, { comptroller }) => new Value_1.BoolV(await comptroller.methods._borrowGuardianPaused().call())),
        new Command_1.Fetcher(`
        #### TransferGuardianPaused

        * "TransferGuardianPaused" - Returns the Comptrollers's Transfer paused status
        * E.g. "Comptroller TransferGuardianPaused"
        `, "TransferGuardianPaused", [new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true })], async (world, { comptroller }) => new Value_1.BoolV(await comptroller.methods.transferGuardianPaused().call())),
        new Command_1.Fetcher(`
        #### SeizeGuardianPaused

        * "SeizeGuardianPaused" - Returns the Comptrollers's Seize paused status
        * E.g. "Comptroller SeizeGuardianPaused"
        `, "SeizeGuardianPaused", [new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true })], async (world, { comptroller }) => new Value_1.BoolV(await comptroller.methods.seizeGuardianPaused().call())),
        new Command_1.Fetcher(`
        #### MintGuardianMarketPaused

        * "MintGuardianMarketPaused" - Returns the Comptrollers's Mint paused status in market
        * E.g. "Comptroller MintGuardianMarketPaused cREP"
        `, "MintGuardianMarketPaused", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
            new Command_1.Arg("cToken", CTokenValue_1.getCTokenV)
        ], async (world, { comptroller, cToken }) => new Value_1.BoolV(await comptroller.methods.mintGuardianPaused(cToken._address).call())),
        new Command_1.Fetcher(`
        #### BorrowGuardianMarketPaused

        * "BorrowGuardianMarketPaused" - Returns the Comptrollers's Borrow paused status in market
        * E.g. "Comptroller BorrowGuardianMarketPaused cREP"
        `, "BorrowGuardianMarketPaused", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
            new Command_1.Arg("cToken", CTokenValue_1.getCTokenV)
        ], async (world, { comptroller, cToken }) => new Value_1.BoolV(await comptroller.methods.borrowGuardianPaused(cToken._address).call())),
        new Command_1.Fetcher(`
      #### GetCompMarkets

      * "GetCompMarkets" - Returns an array of the currently enabled Comp markets. To use the auto-gen array getter compMarkets(uint), use CompMarkets
      * E.g. "Comptroller GetCompMarkets"
      `, "GetCompMarkets", [new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true })], async (world, { comptroller }) => await getCompMarkets(world, comptroller)),
        new Command_1.Fetcher(`
      #### CompRate

      * "CompRate" - Returns the current comp rate.
      * E.g. "Comptroller CompRate"
      `, "CompRate", [new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true })], async (world, { comptroller }) => new Value_1.NumberV(await comptroller.methods.compRate().call())),
        new Command_1.Fetcher(`
        #### CallNum

        * "CallNum signature:<String> ...callArgs<CoreValue>" - Simple direct call method
          * E.g. "Comptroller CallNum \"compSpeeds(address)\" (Address Coburn)"
      `, "CallNum", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
            new Command_1.Arg("signature", CoreValue_1.getStringV),
            new Command_1.Arg("callArgs", CoreValue_1.getCoreValue, { variadic: true, mapped: true })
        ], async (world, { comptroller, signature, callArgs }) => {
            const fnData = Utils_1.encodeABI(world, signature.val, callArgs.map(a => a.val));
            const res = await world.web3.eth.call({
                to: comptroller._address,
                data: fnData
            });
            const resNum = world.web3.eth.abi.decodeParameter('uint256', res);
            return new Value_1.NumberV(resNum);
        }),
        new Command_1.Fetcher(`
        #### CompSupplyState(address)

        * "Comptroller CompBorrowState cZRX "index"
      `, "CompSupplyState", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
            new Command_1.Arg("CToken", CTokenValue_1.getCTokenV),
            new Command_1.Arg("key", CoreValue_1.getStringV),
        ], async (world, { comptroller, CToken, key }) => {
            const result = await comptroller.methods.compSupplyState(CToken._address).call();
            return new Value_1.NumberV(result[key.val]);
        }),
        new Command_1.Fetcher(`
        #### CompBorrowState(address)

        * "Comptroller CompBorrowState cZRX "index"
      `, "CompBorrowState", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
            new Command_1.Arg("CToken", CTokenValue_1.getCTokenV),
            new Command_1.Arg("key", CoreValue_1.getStringV),
        ], async (world, { comptroller, CToken, key }) => {
            const result = await comptroller.methods.compBorrowState(CToken._address).call();
            return new Value_1.NumberV(result[key.val]);
        }),
        new Command_1.Fetcher(`
        #### CompAccrued(address)

        * "Comptroller CompAccrued Coburn
      `, "CompAccrued", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
            new Command_1.Arg("account", CoreValue_1.getAddressV),
        ], async (world, { comptroller, account }) => {
            const result = await comptroller.methods.compAccrued(account.val).call();
            return new Value_1.NumberV(result);
        }),
        new Command_1.Fetcher(`
        #### compSupplierIndex

        * "Comptroller CompSupplierIndex cZRX Coburn
      `, "CompSupplierIndex", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
            new Command_1.Arg("CToken", CTokenValue_1.getCTokenV),
            new Command_1.Arg("account", CoreValue_1.getAddressV),
        ], async (world, { comptroller, CToken, account }) => {
            return new Value_1.NumberV(await comptroller.methods.compSupplierIndex(CToken._address, account.val).call());
        }),
        new Command_1.Fetcher(`
        #### CompBorrowerIndex

        * "Comptroller CompBorrowerIndex cZRX Coburn
      `, "CompBorrowerIndex", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
            new Command_1.Arg("CToken", CTokenValue_1.getCTokenV),
            new Command_1.Arg("account", CoreValue_1.getAddressV),
        ], async (world, { comptroller, CToken, account }) => {
            return new Value_1.NumberV(await comptroller.methods.compBorrowerIndex(CToken._address, account.val).call());
        }),
        new Command_1.Fetcher(`
        #### CompSpeed

        * "Comptroller CompSpeed cZRX
      `, "CompSpeed", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
            new Command_1.Arg("CToken", CTokenValue_1.getCTokenV),
        ], async (world, { comptroller, CToken }) => {
            return new Value_1.NumberV(await comptroller.methods.compSpeeds(CToken._address).call());
        }),
        new Command_1.Fetcher(`
        #### SupplyCapGuardian

        * "SupplyCapGuardian" - Returns the Comptrollers's SupplyCapGuardian
        * E.g. "Comptroller SupplyCapGuardian"
        `, "SupplyCapGuardian", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true })
        ], async (world, { comptroller }) => new Value_1.AddressV(await comptroller.methods.supplyCapGuardian().call())),
        new Command_1.Fetcher(`
        #### SupplyCaps

        * "Comptroller SupplyCaps cZRX
      `, "SupplyCaps", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
            new Command_1.Arg("CToken", CTokenValue_1.getCTokenV),
        ], async (world, { comptroller, CToken }) => {
            return new Value_1.NumberV(await comptroller.methods.supplyCaps(CToken._address).call());
        }),
        new Command_1.Fetcher(`
        #### BorrowCapGuardian

        * "BorrowCapGuardian" - Returns the Comptrollers's BorrowCapGuardian
        * E.g. "Comptroller BorrowCapGuardian"
        `, "BorrowCapGuardian", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true })
        ], async (world, { comptroller }) => new Value_1.AddressV(await comptroller.methods.borrowCapGuardian().call())),
        new Command_1.Fetcher(`
        #### BorrowCaps

        * "Comptroller BorrowCaps cZRX
      `, "BorrowCaps", [
            new Command_1.Arg("comptroller", ContractLookup_1.getComptroller, { implicit: true }),
            new Command_1.Arg("CToken", CTokenValue_1.getCTokenV),
        ], async (world, { comptroller, CToken }) => {
            return new Value_1.NumberV(await comptroller.methods.borrowCaps(CToken._address).call());
        })
    ];
}
exports.comptrollerFetchers = comptrollerFetchers;
async function getComptrollerValue(world, event) {
    return await Command_1.getFetcherValue("Comptroller", comptrollerFetchers(), world, event);
}
exports.getComptrollerValue = getComptrollerValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcHRyb2xsZXJWYWx1ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9WYWx1ZS9Db21wdHJvbGxlclZhbHVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLDRDQUtzQjtBQUN0QixvQ0FPa0I7QUFDbEIsd0NBQXlEO0FBQ3pELHNEQUFpRDtBQUVqRCxzREFBZ0Q7QUFDaEQsb0NBQXVEO0FBRWhELEtBQUssVUFBVSxxQkFBcUIsQ0FBQyxLQUFZLEVBQUUsV0FBd0I7SUFDaEYsT0FBTyxJQUFJLGdCQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFGRCxzREFFQztBQUVNLEtBQUssVUFBVSxZQUFZLENBQUMsS0FBWSxFQUFFLFdBQXdCLEVBQUUsSUFBWTtJQUNyRixJQUFJLEVBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUMsR0FBRyxNQUFNLFdBQVcsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMscURBQXFELEtBQUssRUFBRSxDQUFDLENBQUM7S0FDL0U7SUFDRCxPQUFPLElBQUksZUFBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUM1RCxDQUFDO0FBTkQsb0NBTUM7QUFFTSxLQUFLLFVBQVUsd0JBQXdCLENBQUMsS0FBWSxFQUFFLFdBQXdCLEVBQUUsT0FBZSxFQUFFLEtBQWEsRUFBRSxZQUEyQixFQUFFLFlBQTJCO0lBQzdLLElBQUksRUFBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBQyxHQUFH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QUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FDckc7UUFDRCxJQUFJLGlCQUFPLENBQXNEOzs7O09BSTlELEVBQ0QsWUFBWSxFQUNaO1lBQ0UsSUFBSSxhQUFHLENBQUMsYUFBYSxFQUFFLCtCQUFjLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUM7WUFDeEQsSUFBSSxhQUFHLENBQUMsUUFBUSxFQUFFLHdCQUFVLENBQUM7U0FDOUIsRUFDRCxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUMsV0FBVyxFQUFFLE1BQU0sRUFBQyxFQUFFLEVBQUU7WUFDckMsT0FBTyxJQUFJLGVBQU8sQ0FBQyxNQUFNLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ25GLENBQUMsQ0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBMWVELGtEQTBlQztBQUVNLEtBQUssVUFBVSxtQkFBbUIsQ0FBQyxLQUFZLEVBQUUsS0FBWTtJQUNsRSxPQUFPLE1BQU0seUJBQWUsQ0FBVyxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDN0YsQ0FBQztBQUZELGtEQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtFdmVudH0gZnJvbSAnLi4vRXZlbnQnO1xuaW1wb3J0IHtXb3JsZH0gZnJvbSAnLi4vV29ybGQnO1xuaW1wb3J0IHtDb21wdHJvbGxlcn0gZnJvbSAnLi4vQ29udHJhY3QvQ29tcHRyb2xsZXInO1xuaW1wb3J0IHtDVG9rZW59IGZyb20gJy4uL0NvbnRyYWN0L0NUb2tlbic7XG5pbXBvcnQge1xuICBnZXRBZGRyZXNzVixcbiAgZ2V0Q29yZVZhbHVlLFxuICBnZXRTdHJpbmdWLFxuICBnZXROdW1iZXJWXG59IGZyb20gJy4uL0NvcmVWYWx1ZSc7XG5pbXBvcnQge1xuICBBZGRyZXNzVixcbiAgQm9vbFYsXG4gIExpc3RWLFxuICBOdW1iZXJWLFxuICBTdHJpbmdWLFxuICBWYWx1ZVxufSBmcm9tICcuLi9WYWx1ZSc7XG5pbXBvcnQge0FyZywgRmV0Y2hlciwgZ2V0RmV0Y2hlclZhbHVlfSBmcm9tICcuLi9Db21tYW5kJztcbmltcG9ydCB7Z2V0Q29tcHRyb2xsZXJ9IGZyb20gJy4uL0NvbnRyYWN0TG9va3VwJztcbmltcG9ydCB7ZW5jb2RlZE51bWJlcn0gZnJvbSAnLi4vRW5jb2RpbmcnO1xuaW1wb3J0IHtnZXRDVG9rZW5WfSBmcm9tICcuLi9WYWx1ZS9DVG9rZW5WYWx1ZSc7XG5pbXBvcnQgeyBlbmNvZGVQYXJhbWV0ZXJzLCBlbmNvZGVBQkkgfSBmcm9tICcuLi9VdGlscyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDb21wdHJvbGxlckFkZHJlc3Mod29ybGQ6IFdvcmxkLCBjb21wdHJvbGxlcjogQ29tcHRyb2xsZXIpOiBQcm9taXNlPEFkZHJlc3NWPiB7XG4gIHJldHVybiBuZXcgQWRkcmVzc1YoY29tcHRyb2xsZXIuX2FkZHJlc3MpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TGlxdWlkaXR5KHdvcmxkOiBXb3JsZCwgY29tcHRyb2xsZXI6IENvbXB0cm9sbGVyLCB1c2VyOiBzdHJpbmcpOiBQcm9taXNlPE51bWJlclY+IHtcbiAgbGV0IHswOiBlcnJvciwgMTogbGlxdWlkaXR5LCAyOiBzaG9ydGZhbGx9ID0gYXdhaXQgY29tcHRyb2xsZXIubWV0aG9kcy5nZXRBY2NvdW50TGlxdWlkaXR5KHVzZXIpLmNhbGwoKTtcbiAgaWYgKE51bWJlcihlcnJvcikgIT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGNvbXB1dGUgYWNjb3VudCBsaXF1aWRpdHk6IGVycm9yIGNvZGUgPSAke2Vycm9yfWApO1xuICB9XG4gIHJldHVybiBuZXcgTnVtYmVyVihOdW1iZXIobGlxdWlkaXR5KSAtIE51bWJlcihzaG9ydGZhbGwpKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEh5cG90aGV0aWNhbExpcXVpZGl0eSh3b3JsZDogV29ybGQsIGNvbXB0cm9sbGVyOiBDb21wdHJvbGxlciwgYWNjb3VudDogc3RyaW5nLCBhc3NldDogc3RyaW5nLCByZWRlZW1Ub2tlbnM6IGVuY29kZWROdW1iZXIsIGJvcnJvd0Ftb3VudDogZW5jb2RlZE51bWJlcik6IFByb21pc2U8TnVtYmVyVj4ge1xuICBsZXQgezA6IGVycm9yLCAxOiBsaXF1aWRpdHksIDI6IHNob3J0ZmFsbH0gPSBhd2FpdCBjb21wdHJvbGxlci5tZXRob2RzLmdldEh5cG90aGV0aWNhbEFjY291bnRMaXF1aWRpdHkoYWNjb3VudCwgYXNzZXQsIHJlZGVlbVRva2VucywgYm9ycm93QW1vdW50KS5jYWxsKCk7XG4gIGlmIChOdW1iZXIoZXJyb3IpICE9IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBjb21wdXRlIGFjY291bnQgaHlwb3RoZXRpY2FsIGxpcXVpZGl0eTogZXJyb3IgY29kZSA9ICR7ZXJyb3J9YCk7XG4gIH1cbiAgcmV0dXJuIG5ldyBOdW1iZXJWKE51bWJlcihsaXF1aWRpdHkpIC0gTnVtYmVyKHNob3J0ZmFsbCkpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRQcmljZU9yYWNsZSh3b3JsZDogV29ybGQsIGNvbXB0cm9sbGVyOiBDb21wdHJvbGxlcik6IFByb21pc2U8QWRkcmVzc1Y+IHtcbiAgcmV0dXJuIG5ldyBBZGRyZXNzVihhd2FpdCBjb21wdHJvbGxlci5tZXRob2RzLm9yYWNsZSgpLmNhbGwoKSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldENsb3NlRmFjdG9yKHdvcmxkOiBXb3JsZCwgY29tcHRyb2xsZXI6IENvbXB0cm9sbGVyKTogUHJvbWlzZTxOdW1iZXJWPiB7XG4gIHJldHVybiBuZXcgTnVtYmVyVihhd2FpdCBjb21wdHJvbGxlci5tZXRob2RzLmNsb3NlRmFjdG9yTWFudGlzc2EoKS5jYWxsKCksIDFlMTgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRNYXhBc3NldHMod29ybGQ6IFdvcmxkLCBjb21wdHJvbGxlcjogQ29tcHRyb2xsZXIpOiBQcm9taXNlPE51bWJlclY+IHtcbiAgcmV0dXJuIG5ldyBOdW1iZXJWKGF3YWl0IGNvbXB0cm9sbGVyLm1ldGhvZHMubWF4QXNzZXRzKCkuY2FsbCgpKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0TGlxdWlkYXRpb25JbmNlbnRpdmUod29ybGQ6IFdvcmxkLCBjb21wdHJvbGxlcjogQ29tcHRyb2xsZXIpOiBQcm9taXNlPE51bWJlclY+IHtcbiAgcmV0dXJuIG5ldyBOdW1iZXJWKGF3YWl0IGNvbXB0cm9sbGVyLm1ldGhvZHMubGlxdWlkYXRpb25JbmNlbnRpdmVNYW50aXNzYSgpLmNhbGwoKSwgMWUxOCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEltcGxlbWVudGF0aW9uKHdvcmxkOiBXb3JsZCwgY29tcHRyb2xsZXI6IENvbXB0cm9sbGVyKTogUHJvbWlzZTxBZGRyZXNzVj4ge1xuICByZXR1cm4gbmV3IEFkZHJlc3NWKGF3YWl0IGNvbXB0cm9sbGVyLm1ldGhvZHMuY29tcHRyb2xsZXJJbXBsZW1lbnRhdGlvbigpLmNhbGwoKSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEJsb2NrTnVtYmVyKHdvcmxkOiBXb3JsZCwgY29tcHRyb2xsZXI6IENvbXB0cm9sbGVyKTogUHJvbWlzZTxOdW1iZXJWPiB7XG4gIHJldHVybiBuZXcgTnVtYmVyVihhd2FpdCBjb21wdHJvbGxlci5tZXRob2RzLmdldEJsb2NrTnVtYmVyKCkuY2FsbCgpKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWRtaW4od29ybGQ6IFdvcmxkLCBjb21wdHJvbGxlcjogQ29tcHRyb2xsZXIpOiBQcm9taXNlPEFkZHJlc3NWPiB7XG4gIHJldHVybiBuZXcgQWRkcmVzc1YoYXdhaXQgY29tcHRyb2xsZXIubWV0aG9kcy5hZG1pbigpLmNhbGwoKSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFBlbmRpbmdBZG1pbih3b3JsZDogV29ybGQsIGNvbXB0cm9sbGVyOiBDb21wdHJvbGxlcik6IFByb21pc2U8QWRkcmVzc1Y+IHtcbiAgcmV0dXJuIG5ldyBBZGRyZXNzVihhd2FpdCBjb21wdHJvbGxlci5tZXRob2RzLnBlbmRpbmdBZG1pbigpLmNhbGwoKSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldENvbGxhdGVyYWxGYWN0b3Iod29ybGQ6IFdvcmxkLCBjb21wdHJvbGxlcjogQ29tcHRyb2xsZXIsIGNUb2tlbjogQ1Rva2VuKTogUHJvbWlzZTxOdW1iZXJWPiB7XG4gIGxldCB7MDogX2lzTGlzdGVkLCAxOiBjb2xsYXRlcmFsRmFjdG9yTWFudGlzc2F9ID0gYXdhaXQgY29tcHRyb2xsZXIubWV0aG9kcy5tYXJrZXRzKGNUb2tlbi5fYWRkcmVzcykuY2FsbCgpO1xuICByZXR1cm4gbmV3IE51bWJlclYoY29sbGF0ZXJhbEZhY3Rvck1hbnRpc3NhLCAxZTE4KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbWVtYmVyc2hpcExlbmd0aCh3b3JsZDogV29ybGQsIGNvbXB0cm9sbGVyOiBDb21wdHJvbGxlciwgdXNlcjogc3RyaW5nKTogUHJvbWlzZTxOdW1iZXJWPiB7XG4gIHJldHVybiBuZXcgTnVtYmVyVihhd2FpdCBjb21wdHJvbGxlci5tZXRob2RzLm1lbWJlcnNoaXBMZW5ndGgodXNlcikuY2FsbCgpKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY2hlY2tNZW1iZXJzaGlwKHdvcmxkOiBXb3JsZCwgY29tcHRyb2xsZXI6IENvbXB0cm9sbGVyLCB1c2VyOiBzdHJpbmcsIGNUb2tlbjogQ1Rva2VuKTogUHJvbWlzZTxCb29sVj4ge1xuICByZXR1cm4gbmV3IEJvb2xWKGF3YWl0IGNvbXB0cm9sbGVyLm1ldGhvZHMuY2hlY2tNZW1iZXJzaGlwKHVzZXIsIGNUb2tlbi5fYWRkcmVzcykuY2FsbCgpKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QXNzZXRzSW4od29ybGQ6IFdvcmxkLCBjb21wdHJvbGxlcjogQ29tcHRyb2xsZXIsIHVzZXI6IHN0cmluZyk6IFByb21pc2U8TGlzdFY+IHtcbiAgbGV0IGFzc2V0c0xpc3QgPSBhd2FpdCBjb21wdHJvbGxlci5tZXRob2RzLmdldEFzc2V0c0luKHVzZXIpLmNhbGwoKTtcblxuICByZXR1cm4gbmV3IExpc3RWKGFzc2V0c0xpc3QubWFwKChhKSA9PiBuZXcgQWRkcmVzc1YoYSkpKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0Q29tcE1hcmtldHMod29ybGQ6IFdvcmxkLCBjb21wdHJvbGxlcjogQ29tcHRyb2xsZXIpOiBQcm9taXNlPExpc3RWPiB7XG4gIGxldCBta3RzID0gYXdhaXQgY29tcHRyb2xsZXIubWV0aG9kcy5nZXRDb21wTWFya2V0cygpLmNhbGwoKTtcblxuICByZXR1cm4gbmV3IExpc3RWKG1rdHMubWFwKChhKSA9PiBuZXcgQWRkcmVzc1YoYSkpKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY2hlY2tMaXN0ZWQod29ybGQ6IFdvcmxkLCBjb21wdHJvbGxlcjogQ29tcHRyb2xsZXIsIGNUb2tlbjogQ1Rva2VuKTogUHJvbWlzZTxCb29sVj4ge1xuICBsZXQgezA6IGlzTGlzdGVkLCAxOiBfY29sbGF0ZXJhbEZhY3Rvck1hbnRpc3NhfSA9IGF3YWl0IGNvbXB0cm9sbGVyLm1ldGhvZHMubWFya2V0cyhjVG9rZW4uX2FkZHJlc3MpLmNhbGwoKTtcblxuICByZXR1cm4gbmV3IEJvb2xWKGlzTGlzdGVkKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY2hlY2tJc0NvbXBlZCh3b3JsZDogV29ybGQsIGNvbXB0cm9sbGVyOiBDb21wdHJvbGxlciwgY1Rva2VuOiBDVG9rZW4pOiBQcm9taXNlPEJvb2xWPiB7XG4gIGxldCB7MDogaXNMaXN0ZWQsIDE6IF9jb2xsYXRlcmFsRmFjdG9yTWFudGlzc2EsIDI6IGlzQ29tcGVkfSA9IGF3YWl0IGNvbXB0cm9sbGVyLm1ldGhvZHMubWFya2V0cyhjVG9rZW4uX2FkZHJlc3MpLmNhbGwoKTtcbiAgcmV0dXJuIG5ldyBCb29sVihpc0NvbXBlZCk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB0cm9sbGVyRmV0Y2hlcnMoKSB7XG4gIHJldHVybiBbXG4gICAgbmV3IEZldGNoZXI8e2NvbXB0cm9sbGVyOiBDb21wdHJvbGxlcn0sIEFkZHJlc3NWPihgXG4gICAgICAgICMjIyMgQWRkcmVzc1xuXG4gICAgICAgICogXCJDb21wdHJvbGxlciBBZGRyZXNzXCIgLSBSZXR1cm5zIGFkZHJlc3Mgb2YgY29tcHRyb2xsZXJcbiAgICAgIGAsXG4gICAgICBcIkFkZHJlc3NcIixcbiAgICAgIFtuZXcgQXJnKFwiY29tcHRyb2xsZXJcIiwgZ2V0Q29tcHRyb2xsZXIsIHtpbXBsaWNpdDogdHJ1ZX0pXSxcbiAgICAgICh3b3JsZCwge2NvbXB0cm9sbGVyfSkgPT4gZ2V0Q29tcHRyb2xsZXJBZGRyZXNzKHdvcmxkLCBjb21wdHJvbGxlcilcbiAgICApLFxuICAgIG5ldyBGZXRjaGVyPHtjb21wdHJvbGxlcjogQ29tcHRyb2xsZXIsIGFjY291bnQ6IEFkZHJlc3NWfSwgTnVtYmVyVj4oYFxuICAgICAgICAjIyMjIExpcXVpZGl0eVxuXG4gICAgICAgICogXCJDb21wdHJvbGxlciBMaXF1aWRpdHkgPFVzZXI+XCIgLSBSZXR1cm5zIGEgZ2l2ZW4gdXNlcidzIHRydWVkIHVwIGxpcXVpZGl0eVxuICAgICAgICAgICogRS5nLiBcIkNvbXB0cm9sbGVyIExpcXVpZGl0eSBHZW9mZlwiXG4gICAgICBgLFxuICAgICAgXCJMaXF1aWRpdHlcIixcbiAgICAgIFtcbiAgICAgICAgbmV3IEFyZyhcImNvbXB0cm9sbGVyXCIsIGdldENvbXB0cm9sbGVyLCB7aW1wbGljaXQ6IHRydWV9KSxcbiAgICAgICAgbmV3IEFyZyhcImFjY291bnRcIiwgZ2V0QWRkcmVzc1YpXG4gICAgICBdLFxuICAgICAgKHdvcmxkLCB7Y29tcHRyb2xsZXIsIGFjY291bnR9KSA9PiBnZXRMaXF1aWRpdHkod29ybGQsIGNvbXB0cm9sbGVyLCBhY2NvdW50LnZhbClcbiAgICApLFxuICAgIG5ldyBGZXRjaGVyPHtjb21wdHJvbGxlcjogQ29tcHRyb2xsZXIsIGFjY291bnQ6IEFkZHJlc3NWLCBhY3Rpb246IFN0cmluZ1YsIGFtb3VudDogTnVtYmVyViwgY1Rva2VuOiBDVG9rZW59LCBOdW1iZXJWPihgXG4gICAgICAgICMjIyMgSHlwb3RoZXRpY2FsXG5cbiAgICAgICAgKiBcIkNvbXB0cm9sbGVyIEh5cG90aGV0aWNhbCA8VXNlcj4gPEFjdGlvbj4gPEFzc2V0PiA8TnVtYmVyPlwiIC0gUmV0dXJucyBhIGdpdmVuIHVzZXIncyB0cnVlZCB1cCBsaXF1aWRpdHkgZ2l2ZW4gYSBoeXBvdGhldGljYWwgY2hhbmdlIGluIGFzc2V0IHdpdGggcmVkZWVtaW5nIGEgY2VydGFpbiBudW1iZXIgb2YgdG9rZW5zIGFuZC9vciBib3Jyb3dpbmcgYSBnaXZlbiBhbW91bnQuXG4gICAgICAgICAgKiBFLmcuIFwiQ29tcHRyb2xsZXIgSHlwb3RoZXRpY2FsIEdlb2ZmIFJlZGVlbXMgNi4wIGNaUlhcIlxuICAgICAgICAgICogRS5nLiBcIkNvbXB0cm9sbGVyIEh5cG90aGV0aWNhbCBHZW9mZiBCb3Jyb3dzIDUuMCBjWlJYXCJcbiAgICAgIGAsXG4gICAgICBcIkh5cG90aGV0aWNhbFwiLFxuICAgICAgW1xuICAgICAgICBuZXcgQXJnKFwiY29tcHRyb2xsZXJcIiwgZ2V0Q29tcHRyb2xsZXIsIHtpbXBsaWNpdDogdHJ1ZX0pLFxuICAgICAgICBuZXcgQXJnKFwiYWNjb3VudFwiLCBnZXRBZGRyZXNzViksXG4gICAgICAgIG5ldyBBcmcoXCJhY3Rpb25cIiwgZ2V0U3RyaW5nViksXG4gICAgICAgIG5ldyBBcmcoXCJhbW91bnRcIiwgZ2V0TnVtYmVyViksXG4gICAgICAgIG5ldyBBcmcoXCJjVG9rZW5cIiwgZ2V0Q1Rva2VuVilcbiAgICAgIF0sXG4gICAgICBhc3luYyAod29ybGQsIHtjb21wdHJvbGxlciwgYWNjb3VudCwgYWN0aW9uLCBjVG9rZW4sIGFtb3VudH0pID0+IHtcbiAgICAgICAgbGV0IHJlZGVlbVRva2VuczogTnVtYmVyVjtcbiAgICAgICAgbGV0IGJvcnJvd0Ftb3VudDogTnVtYmVyVjtcblxuICAgICAgICBzd2l0Y2ggKGFjdGlvbi52YWwudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgIGNhc2UgXCJib3Jyb3dzXCI6XG4gICAgICAgICAgICByZWRlZW1Ub2tlbnMgPSBuZXcgTnVtYmVyVigwKTtcbiAgICAgICAgICAgIGJvcnJvd0Ftb3VudCA9IGFtb3VudDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJyZWRlZW1zXCI6XG4gICAgICAgICAgICByZWRlZW1Ub2tlbnMgPSBhbW91bnQ7XG4gICAgICAgICAgICBib3Jyb3dBbW91bnQgPSBuZXcgTnVtYmVyVigwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gaHlwb3RoZXRpY2FsOiAke2FjdGlvbi52YWx9YCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXdhaXQgZ2V0SHlwb3RoZXRpY2FsTGlxdWlkaXR5KHdvcmxkLCBjb21wdHJvbGxlciwgYWNjb3VudC52YWwsIGNUb2tlbi5fYWRkcmVzcywgcmVkZWVtVG9rZW5zLmVuY29kZSgpLCBib3Jyb3dBbW91bnQuZW5jb2RlKCkpO1xuICAgICAgfVxuICAgICksXG4gICAgbmV3IEZldGNoZXI8e2NvbXB0cm9sbGVyOiBDb21wdHJvbGxlcn0sIEFkZHJlc3NWPihgXG4gICAgICAgICMjIyMgQWRtaW5cblxuICAgICAgICAqIFwiQ29tcHRyb2xsZXIgQWRtaW5cIiAtIFJldHVybnMgdGhlIENvbXB0cm9sbGVycydzIGFkbWluXG4gICAgICAgICAgKiBFLmcuIFwiQ29tcHRyb2xsZXIgQWRtaW5cIlxuICAgICAgYCxcbiAgICAgIFwiQWRtaW5cIixcbiAgICAgIFtuZXcgQXJnKFwiY29tcHRyb2xsZXJcIiwgZ2V0Q29tcHRyb2xsZXIsIHtpbXBsaWNpdDogdHJ1ZX0pXSxcbiAgICAgICh3b3JsZCwge2NvbXB0cm9sbGVyfSkgPT4gZ2V0QWRtaW4od29ybGQsIGNvbXB0cm9sbGVyKVxuICAgICksXG4gICAgbmV3IEZldGNoZXI8e2NvbXB0cm9sbGVyOiBDb21wdHJvbGxlcn0sIEFkZHJlc3NWPihgXG4gICAgICAgICMjIyMgUGVuZGluZ0FkbWluXG5cbiAgICAgICAgKiBcIkNvbXB0cm9sbGVyIFBlbmRpbmdBZG1pblwiIC0gUmV0dXJucyB0aGUgcGVuZGluZyBhZG1pbiBvZiB0aGUgQ29tcHRyb2xsZXJcbiAgICAgICAgICAqIEUuZy4gXCJDb21wdHJvbGxlciBQZW5kaW5nQWRtaW5cIiAtIFJldHVybnMgQ29tcHRyb2xsZXIncyBwZW5kaW5nIGFkbWluXG4gICAgICBgLFxuICAgICAgXCJQZW5kaW5nQWRtaW5cIixcbiAgICAgIFtcbiAgICAgICAgbmV3IEFyZyhcImNvbXB0cm9sbGVyXCIsIGdldENvbXB0cm9sbGVyLCB7aW1wbGljaXQ6IHRydWV9KSxcbiAgICAgIF0sXG4gICAgICAod29ybGQsIHtjb21wdHJvbGxlcn0pID0+IGdldFBlbmRpbmdBZG1pbih3b3JsZCwgY29tcHRyb2xsZXIpXG4gICAgKSxcbiAgICBuZXcgRmV0Y2hlcjx7Y29tcHRyb2xsZXI6IENvbXB0cm9sbGVyfSwgQWRkcmVzc1Y+KGBcbiAgICAgICAgIyMjIyBQcmljZU9yYWNsZVxuXG4gICAgICAgICogXCJDb21wdHJvbGxlciBQcmljZU9yYWNsZVwiIC0gUmV0dXJucyB0aGUgQ29tcHRyb2xsZXJzJ3MgcHJpY2Ugb3JhY2xlXG4gICAgICAgICAgKiBFLmcuIFwiQ29tcHRyb2xsZXIgUHJpY2VPcmFjbGVcIlxuICAgICAgYCxcbiAgICAgIFwiUHJpY2VPcmFjbGVcIixcbiAgICAgIFtuZXcgQXJnKFwiY29tcHRyb2xsZXJcIiwgZ2V0Q29tcHRyb2xsZXIsIHtpbXBsaWNpdDogdHJ1ZX0pXSxcbiAgICAgICh3b3JsZCwge2NvbXB0cm9sbGVyfSkgPT4gZ2V0UHJpY2VPcmFjbGUod29ybGQsIGNvbXB0cm9sbGVyKVxuICAgICksXG4gICAgbmV3IEZldGNoZXI8e2NvbXB0cm9sbGVyOiBDb21wdHJvbGxlcn0sIE51bWJlclY+KGBcbiAgICAgICAgIyMjIyBDbG9zZUZhY3RvclxuXG4gICAgICAgICogXCJDb21wdHJvbGxlciBDbG9zZUZhY3RvclwiIC0gUmV0dXJucyB0aGUgQ29tcHRyb2xsZXJzJ3MgcHJpY2Ugb3JhY2xlXG4gICAgICAgICAgKiBFLmcuIFwiQ29tcHRyb2xsZXIgQ2xvc2VGYWN0b3JcIlxuICAgICAgYCxcbiAgICAgIFwiQ2xvc2VGYWN0b3JcIixcbiAgICAgIFtuZXcgQXJnKFwiY29tcHRyb2xsZXJcIiwgZ2V0Q29tcHRyb2xsZXIsIHtpbXBsaWNpdDogdHJ1ZX0pXSxcbiAgICAgICh3b3JsZCwge2NvbXB0cm9sbGVyfSkgPT4gZ2V0Q2xvc2VGYWN0b3Iod29ybGQsIGNvbXB0cm9sbGVyKVxuICAgICksXG4gICAgbmV3IEZldGNoZXI8e2NvbXB0cm9sbGVyOiBDb21wdHJvbGxlcn0sIE51bWJlclY+KGBcbiAgICAgICAgIyMjIyBNYXhBc3NldHNcblxuICAgICAgICAqIFwiQ29tcHRyb2xsZXIgTWF4QXNzZXRzXCIgLSBSZXR1cm5zIHRoZSBDb21wdHJvbGxlcnMncyBwcmljZSBvcmFjbGVcbiAgICAgICAgICAqIEUuZy4gXCJDb21wdHJvbGxlciBNYXhBc3NldHNcIlxuICAgICAgYCxcbiAgICAgIFwiTWF4QXNzZXRzXCIsXG4gICAgICBbbmV3IEFyZyhcImNvbXB0cm9sbGVyXCIsIGdldENvbXB0cm9sbGVyLCB7aW1wbGljaXQ6IHRydWV9KV0sXG4gICAgICAod29ybGQsIHtjb21wdHJvbGxlcn0pID0+IGdldE1heEFzc2V0cyh3b3JsZCwgY29tcHRyb2xsZXIpXG4gICAgKSxcbiAgICBuZXcgRmV0Y2hlcjx7Y29tcHRyb2xsZXI6IENvbXB0cm9sbGVyfSwgTnVtYmVyVj4oYFxuICAgICAgICAjIyMjIExpcXVpZGF0aW9uSW5jZW50aXZlXG5cbiAgICAgICAgKiBcIkNvbXB0cm9sbGVyIExpcXVpZGF0aW9uSW5jZW50aXZlXCIgLSBSZXR1cm5zIHRoZSBDb21wdHJvbGxlcnMncyBsaXF1aWRhdGlvbiBpbmNlbnRpdmVcbiAgICAgICAgICAqIEUuZy4gXCJDb21wdHJvbGxlciBMaXF1aWRhdGlvbkluY2VudGl2ZVwiXG4gICAgICBgLFxuICAgICAgXCJMaXF1aWRhdGlvbkluY2VudGl2ZVwiLFxuICAgICAgW25ldyBBcmcoXCJjb21wdHJvbGxlclwiLCBnZXRDb21wdHJvbGxlciwge2ltcGxpY2l0OiB0cnVlfSldLFxuICAgICAgKHdvcmxkLCB7Y29tcHRyb2xsZXJ9KSA9PiBnZXRMaXF1aWRhdGlvbkluY2VudGl2ZSh3b3JsZCwgY29tcHRyb2xsZXIpXG4gICAgKSxcbiAgICBuZXcgRmV0Y2hlcjx7Y29tcHRyb2xsZXI6IENvbXB0cm9sbGVyfSwgQWRkcmVzc1Y+KGBcbiAgICAgICAgIyMjIyBJbXBsZW1lbnRhdGlvblxuXG4gICAgICAgICogXCJDb21wdHJvbGxlciBJbXBsZW1lbnRhdGlvblwiIC0gUmV0dXJucyB0aGUgQ29tcHRyb2xsZXJzJ3MgaW1wbGVtZW50YXRpb25cbiAgICAgICAgICAqIEUuZy4gXCJDb21wdHJvbGxlciBJbXBsZW1lbnRhdGlvblwiXG4gICAgICBgLFxuICAgICAgXCJJbXBsZW1lbnRhdGlvblwiLFxuICAgICAgW25ldyBBcmcoXCJjb21wdHJvbGxlclwiLCBnZXRDb21wdHJvbGxlciwge2ltcGxpY2l0OiB0cnVlfSldLFxuICAgICAgKHdvcmxkLCB7Y29tcHRyb2xsZXJ9KSA9PiBnZXRJbXBsZW1lbnRhdGlvbih3b3JsZCwgY29tcHRyb2xsZXIpXG4gICAgKSxcbiAgICBuZXcgRmV0Y2hlcjx7Y29tcHRyb2xsZXI6IENvbXB0cm9sbGVyfSwgTnVtYmVyVj4oYFxuICAgICAgICAjIyMjIEJsb2NrTnVtYmVyXG5cbiAgICAgICAgKiBcIkNvbXB0cm9sbGVyIEJsb2NrTnVtYmVyXCIgLSBSZXR1cm5zIHRoZSBDb21wdHJvbGxlcnMncyBtb2NrZWQgYmxvY2sgbnVtYmVyIChmb3Igc2NlbmFyaW8gcnVubmVyKVxuICAgICAgICAgICogRS5nLiBcIkNvbXB0cm9sbGVyIEJsb2NrTnVtYmVyXCJcbiAgICAgIGAsXG4gICAgICBcIkJsb2NrTnVtYmVyXCIsXG4gICAgICBbbmV3IEFyZyhcImNvbXB0cm9sbGVyXCIsIGdldENvbXB0cm9sbGVyLCB7aW1wbGljaXQ6IHRydWV9KV0sXG4gICAgICAod29ybGQsIHtjb21wdHJvbGxlcn0pID0+IGdldEJsb2NrTnVtYmVyKHdvcmxkLCBjb21wdHJvbGxlcilcbiAgICApLFxuICAgIG5ldyBGZXRjaGVyPHtjb21wdHJvbGxlcjogQ29tcHRyb2xsZXIsIGNUb2tlbjogQ1Rva2VufSwgTnVtYmVyVj4oYFxuICAgICAgICAjIyMjIENvbGxhdGVyYWxGYWN0b3JcblxuICAgICAgICAqIFwiQ29tcHRyb2xsZXIgQ29sbGF0ZXJhbEZhY3RvciA8Q1Rva2VuPlwiIC0gUmV0dXJucyB0aGUgY29sbGF0ZXJhbEZhY3RvciBhc3NvY2lhdGVkIHdpdGggYSBnaXZlbiBhc3NldFxuICAgICAgICAgICogRS5nLiBcIkNvbXB0cm9sbGVyIENvbGxhdGVyYWxGYWN0b3IgY1pSWFwiXG4gICAgICBgLFxuICAgICAgXCJDb2xsYXRlcmFsRmFjdG9yXCIsXG4gICAgICBbXG4gICAgICAgIG5ldyBBcmcoXCJjb21wdHJvbGxlclwiLCBnZXRDb21wdHJvbGxlciwge2ltcGxpY2l0OiB0cnVlfSksXG4gICAgICAgIG5ldyBBcmcoXCJjVG9rZW5cIiwgZ2V0Q1Rva2VuVilcbiAgICAgIF0sXG4gICAgICAod29ybGQsIHtjb21wdHJvbGxlciwgY1Rva2VufSkgPT4gZ2V0Q29sbGF0ZXJhbEZhY3Rvcih3b3JsZCwgY29tcHRyb2xsZXIsIGNUb2tlbilcbiAgICApLFxuICAgIG5ldyBGZXRjaGVyPHtjb21wdHJvbGxlcjogQ29tcHRyb2xsZXIsIGFjY291bnQ6IEFkZHJlc3NWfSwgTnVtYmVyVj4oYFxuICAgICAgICAjIyMjIE1lbWJlcnNoaXBMZW5ndGhcblxuICAgICAgICAqIFwiQ29tcHRyb2xsZXIgTWVtYmVyc2hpcExlbmd0aCA8VXNlcj5cIiAtIFJldHVybnMgYSBnaXZlbiB1c2VyJ3MgbGVuZ3RoIG9mIG1lbWJlcnNoaXBcbiAgICAgICAgICAqIEUuZy4gXCJDb21wdHJvbGxlciBNZW1iZXJzaGlwTGVuZ3RoIEdlb2ZmXCJcbiAgICAgIGAsXG4gICAgICBcIk1lbWJlcnNoaXBMZW5ndGhcIixcbiAgICAgIFtcbiAgICAgICAgbmV3IEFyZyhcImNvbXB0cm9sbGVyXCIsIGdldENvbXB0cm9sbGVyLCB7aW1wbGljaXQ6IHRydWV9KSxcbiAgICAgICAgbmV3IEFyZyhcImFjY291bnRcIiwgZ2V0QWRkcmVzc1YpXG4gICAgICBdLFxuICAgICAgKHdvcmxkLCB7Y29tcHRyb2xsZXIsIGFjY291bnR9KSA9PiBtZW1iZXJzaGlwTGVuZ3RoKHdvcmxkLCBjb21wdHJvbGxlciwgYWNjb3VudC52YWwpXG4gICAgKSxcbiAgICBuZXcgRmV0Y2hlcjx7Y29tcHRyb2xsZXI6IENvbXB0cm9sbGVyLCBhY2NvdW50OiBBZGRyZXNzViwgY1Rva2VuOiBDVG9rZW59LCBCb29sVj4oYFxuICAgICAgICAjIyMjIENoZWNrTWVtYmVyc2hpcFxuXG4gICAgICAgICogXCJDb21wdHJvbGxlciBDaGVja01lbWJlcnNoaXAgPFVzZXI+IDxDVG9rZW4+XCIgLSBSZXR1cm5zIG9uZSBpZiB1c2VyIGlzIGluIGFzc2V0LCB6ZXJvIG90aGVyd2lzZS5cbiAgICAgICAgICAqIEUuZy4gXCJDb21wdHJvbGxlciBDaGVja01lbWJlcnNoaXAgR2VvZmYgY1pSWFwiXG4gICAgICBgLFxuICAgICAgXCJDaGVja01lbWJlcnNoaXBcIixcbiAgICAgIFtcbiAgICAgICAgbmV3IEFyZyhcImNvbXB0cm9sbGVyXCIsIGdldENvbXB0cm9sbGVyLCB7aW1wbGljaXQ6IHRydWV9KSxcbiAgICAgICAgbmV3IEFyZyhcImFjY291bnRcIiwgZ2V0QWRkcmVzc1YpLFxuICAgICAgICBuZXcgQXJnKFwiY1Rva2VuXCIsIGdldENUb2tlblYpXG4gICAgICBdLFxuICAgICAgKHdvcmxkLCB7Y29tcHRyb2xsZXIsIGFjY291bnQsIGNUb2tlbn0pID0+IGNoZWNrTWVtYmVyc2hpcCh3b3JsZCwgY29tcHRyb2xsZXIsIGFjY291bnQudmFsLCBjVG9rZW4pXG4gICAgKSxcbiAgICBuZXcgRmV0Y2hlcjx7Y29tcHRyb2xsZXI6IENvbXB0cm9sbGVyLCBhY2NvdW50OiBBZGRyZXNzVn0sIExpc3RWPihgXG4gICAgICAgICMjIyMgQXNzZXRzSW5cblxuICAgICAgICAqIFwiQ29tcHRyb2xsZXIgQXNzZXRzSW4gPFVzZXI+XCIgLSBSZXR1cm5zIHRoZSBhc3NldHMgYSB1c2VyIGlzIGluXG4gICAgICAgICAgKiBFLmcuIFwiQ29tcHRyb2xsZXIgQXNzZXRzSW4gR2VvZmZcIlxuICAgICAgYCxcbiAgICAgIFwiQXNzZXRzSW5cIixcbiAgICAgIFtcbiAgICAgICAgbmV3IEFyZyhcImNvbXB0cm9sbGVyXCIsIGdldENvbXB0cm9sbGVyLCB7aW1wbGljaXQ6IHRydWV9KSxcbiAgICAgICAgbmV3IEFyZyhcImFjY291bnRcIiwgZ2V0QWRkcmVzc1YpXG4gICAgICBdLFxuICAgICAgKHdvcmxkLCB7Y29tcHRyb2xsZXIsIGFjY291bnR9KSA9PiBnZXRBc3NldHNJbih3b3JsZCwgY29tcHRyb2xsZXIsIGFjY291bnQudmFsKVxuICAgICksXG4gICAgbmV3IEZldGNoZXI8e2NvbXB0cm9sbGVyOiBDb21wdHJvbGxlciwgY1Rva2VuOiBDVG9rZW59LCBCb29sVj4oYFxuICAgICAgICAjIyMjIENoZWNrTGlzdGVkXG5cbiAgICAgICAgKiBcIkNvbXB0cm9sbGVyIENoZWNrTGlzdGVkIDxDVG9rZW4+XCIgLSBSZXR1cm5zIHRydWUgaWYgbWFya2V0IGlzIGxpc3RlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAgICAgICogRS5nLiBcIkNvbXB0cm9sbGVyIENoZWNrTGlzdGVkIGNaUlhcIlxuICAgICAgYCxcbiAgICAgIFwiQ2hlY2tMaXN0ZWRcIixcbiAgICAgIFtcbiAgICAgICAgbmV3IEFyZyhcImNvbXB0cm9sbGVyXCIsIGdldENvbXB0cm9sbGVyLCB7aW1wbGljaXQ6IHRydWV9KSxcbiAgICAgICAgbmV3IEFyZyhcImNUb2tlblwiLCBnZXRDVG9rZW5WKVxuICAgICAgXSxcbiAgICAgICh3b3JsZCwge2NvbXB0cm9sbGVyLCBjVG9rZW59KSA9PiBjaGVja0xpc3RlZCh3b3JsZCwgY29tcHRyb2xsZXIsIGNUb2tlbilcbiAgICApLFxuICAgIG5ldyBGZXRjaGVyPHtjb21wdHJvbGxlcjogQ29tcHRyb2xsZXIsIGNUb2tlbjogQ1Rva2VufSwgQm9vbFY+KGBcbiAgICAgICAgIyMjIyBDaGVja0lzQ29tcGVkXG5cbiAgICAgICAgKiBcIkNvbXB0cm9sbGVyIENoZWNrSXNDb21wZWQgPENUb2tlbj5cIiAtIFJldHVybnMgdHJ1ZSBpZiBtYXJrZXQgaXMgbGlzdGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICAgICAgKiBFLmcuIFwiQ29tcHRyb2xsZXIgQ2hlY2tJc0NvbXBlZCBjWlJYXCJcbiAgICAgIGAsXG4gICAgICBcIkNoZWNrSXNDb21wZWRcIixcbiAgICAgIFtcbiAgICAgICAgbmV3IEFyZyhcImNvbXB0cm9sbGVyXCIsIGdldENvbXB0cm9sbGVyLCB7aW1wbGljaXQ6IHRydWV9KSxcbiAgICAgICAgbmV3IEFyZyhcImNUb2tlblwiLCBnZXRDVG9rZW5WKVxuICAgICAgXSxcbiAgICAgICh3b3JsZCwge2NvbXB0cm9sbGVyLCBjVG9rZW59KSA9PiBjaGVja0lzQ29tcGVkKHdvcmxkLCBjb21wdHJvbGxlciwgY1Rva2VuKVxuICAgICksXG4gICAgbmV3IEZldGNoZXI8e2NvbXB0cm9sbGVyOiBDb21wdHJvbGxlcn0sIEFkZHJlc3NWPihgXG4gICAgICAgICMjIyMgUGF1c2VHdWFyZGlhblxuXG4gICAgICAgICogXCJQYXVzZUd1YXJkaWFuXCIgLSBSZXR1cm5zIHRoZSBDb21wdHJvbGxlcnMncyBQYXVzZUd1YXJkaWFuXG4gICAgICAgICogRS5nLiBcIkNvbXB0cm9sbGVyIFBhdXNlR3VhcmRpYW5cIlxuICAgICAgICBgLFxuICAgICAgICBcIlBhdXNlR3VhcmRpYW5cIixcbiAgICAgICAgW1xuICAgICAgICAgIG5ldyBBcmcoXCJjb21wdHJvbGxlclwiLCBnZXRDb21wdHJvbGxlciwge2ltcGxpY2l0OiB0cnVlfSlcbiAgICAgICAgXSxcbiAgICAgICAgYXN5bmMgKHdvcmxkLCB7Y29tcHRyb2xsZXJ9KSA9PiBuZXcgQWRkcmVzc1YoYXdhaXQgY29tcHRyb2xsZXIubWV0aG9kcy5wYXVzZUd1YXJkaWFuKCkuY2FsbCgpKVxuICAgICksXG5cbiAgICBuZXcgRmV0Y2hlcjx7Y29tcHRyb2xsZXI6IENvbXB0cm9sbGVyfSwgQm9vbFY+KGBcbiAgICAgICAgIyMjIyBfTWludEd1YXJkaWFuUGF1c2VkXG5cbiAgICAgICAgKiBcIl9NaW50R3VhcmRpYW5QYXVzZWRcIiAtIFJldHVybnMgdGhlIENvbXB0cm9sbGVycydzIG9yaWdpbmFsIGdsb2JhbCBNaW50IHBhdXNlZCBzdGF0dXNcbiAgICAgICAgKiBFLmcuIFwiQ29tcHRyb2xsZXIgX01pbnRHdWFyZGlhblBhdXNlZFwiXG4gICAgICAgIGAsXG4gICAgICAgIFwiX01pbnRHdWFyZGlhblBhdXNlZFwiLFxuICAgICAgICBbbmV3IEFyZyhcImNvbXB0cm9sbGVyXCIsIGdldENvbXB0cm9sbGVyLCB7aW1wbGljaXQ6IHRydWV9KV0sXG4gICAgICAgIGFzeW5jICh3b3JsZCwge2NvbXB0cm9sbGVyfSkgPT4gbmV3IEJvb2xWKGF3YWl0IGNvbXB0cm9sbGVyLm1ldGhvZHMuX21pbnRHdWFyZGlhblBhdXNlZCgpLmNhbGwoKSlcbiAgICApLFxuICAgIG5ldyBGZXRjaGVyPHtjb21wdHJvbGxlcjogQ29tcHRyb2xsZXJ9LCBCb29sVj4oYFxuICAgICAgICAjIyMjIF9Cb3Jyb3dHdWFyZGlhblBhdXNlZFxuXG4gICAgICAgICogXCJfQm9ycm93R3VhcmRpYW5QYXVzZWRcIiAtIFJldHVybnMgdGhlIENvbXB0cm9sbGVycydzIG9yaWdpbmFsIGdsb2JhbCBCb3Jyb3cgcGF1c2VkIHN0YXR1c1xuICAgICAgICAqIEUuZy4gXCJDb21wdHJvbGxlciBfQm9ycm93R3VhcmRpYW5QYXVzZWRcIlxuICAgICAgICBgLFxuICAgICAgICBcIl9Cb3Jyb3dHdWFyZGlhblBhdXNlZFwiLFxuICAgICAgICBbbmV3IEFyZyhcImNvbXB0cm9sbGVyXCIsIGdldENvbXB0cm9sbGVyLCB7aW1wbGljaXQ6IHRydWV9KV0sXG4gICAgICAgIGFzeW5jICh3b3JsZCwge2NvbXB0cm9sbGVyfSkgPT4gbmV3IEJvb2xWKGF3YWl0IGNvbXB0cm9sbGVyLm1ldGhvZHMuX2JvcnJvd0d1YXJkaWFuUGF1c2VkKCkuY2FsbCgpKVxuICAgICksXG5cbiAgICBuZXcgRmV0Y2hlcjx7Y29tcHRyb2xsZXI6IENvbXB0cm9sbGVyfSwgQm9vbFY+KGBcbiAgICAgICAgIyMjIyBUcmFuc2Zlckd1YXJkaWFuUGF1c2VkXG5cbiAgICAgICAgKiBcIlRyYW5zZmVyR3VhcmRpYW5QYXVzZWRcIiAtIFJldHVybnMgdGhlIENvbXB0cm9sbGVycydzIFRyYW5zZmVyIHBhdXNlZCBzdGF0dXNcbiAgICAgICAgKiBFLmcuIFwiQ29tcHRyb2xsZXIgVHJhbnNmZXJHdWFyZGlhblBhdXNlZFwiXG4gICAgICAgIGAsXG4gICAgICAgIFwiVHJhbnNmZXJHdWFyZGlhblBhdXNlZFwiLFxuICAgICAgICBbbmV3IEFyZyhcImNvbXB0cm9sbGVyXCIsIGdldENvbXB0cm9sbGVyLCB7aW1wbGljaXQ6IHRydWV9KV0sXG4gICAgICAgIGFzeW5jICh3b3JsZCwge2NvbXB0cm9sbGVyfSkgPT4gbmV3IEJvb2xWKGF3YWl0IGNvbXB0cm9sbGVyLm1ldGhvZHMudHJhbnNmZXJHdWFyZGlhblBhdXNlZCgpLmNhbGwoKSlcbiAgICApLFxuICAgIG5ldyBGZXRjaGVyPHtjb21wdHJvbGxlcjogQ29tcHRyb2xsZXJ9LCBCb29sVj4oYFxuICAgICAgICAjIyMjIFNlaXplR3VhcmRpYW5QYXVzZWRcblxuICAgICAgICAqIFwiU2VpemVHdWFyZGlhblBhdXNlZFwiIC0gUmV0dXJucyB0aGUgQ29tcHRyb2xsZXJzJ3MgU2VpemUgcGF1c2VkIHN0YXR1c1xuICAgICAgICAqIEUuZy4gXCJDb21wdHJvbGxlciBTZWl6ZUd1YXJkaWFuUGF1c2VkXCJcbiAgICAgICAgYCxcbiAgICAgICAgXCJTZWl6ZUd1YXJkaWFuUGF1c2VkXCIsXG4gICAgICAgIFtuZXcgQXJnKFwiY29tcHRyb2xsZXJcIiwgZ2V0Q29tcHRyb2xsZXIsIHtpbXBsaWNpdDogdHJ1ZX0pXSxcbiAgICAgICAgYXN5bmMgKHdvcmxkLCB7Y29tcHRyb2xsZXJ9KSA9PiBuZXcgQm9vbFYoYXdhaXQgY29tcHRyb2xsZXIubWV0aG9kcy5zZWl6ZUd1YXJkaWFuUGF1c2VkKCkuY2FsbCgpKVxuICAgICksXG5cbiAgICBuZXcgRmV0Y2hlcjx7Y29tcHRyb2xsZXI6IENvbXB0cm9sbGVyLCBjVG9rZW46IENUb2tlbn0sIEJvb2xWPihgXG4gICAgICAgICMjIyMgTWludEd1YXJkaWFuTWFya2V0UGF1c2VkXG5cbiAgICAgICAgKiBcIk1pbnRHdWFyZGlhbk1hcmtldFBhdXNlZFwiIC0gUmV0dXJucyB0aGUgQ29tcHRyb2xsZXJzJ3MgTWludCBwYXVzZWQgc3RhdHVzIGluIG1hcmtldFxuICAgICAgICAqIEUuZy4gXCJDb21wdHJvbGxlciBNaW50R3VhcmRpYW5NYXJrZXRQYXVzZWQgY1JFUFwiXG4gICAgICAgIGAsXG4gICAgICAgIFwiTWludEd1YXJkaWFuTWFya2V0UGF1c2VkXCIsXG4gICAgICAgIFtcbiAgICAgICAgICBuZXcgQXJnKFwiY29tcHRyb2xsZXJcIiwgZ2V0Q29tcHRyb2xsZXIsIHtpbXBsaWNpdDogdHJ1ZX0pLFxuICAgICAgICAgIG5ldyBBcmcoXCJjVG9rZW5cIiwgZ2V0Q1Rva2VuVilcbiAgICAgICAgXSxcbiAgICAgICAgYXN5bmMgKHdvcmxkLCB7Y29tcHRyb2xsZXIsIGNUb2tlbn0pID0+IG5ldyBCb29sVihhd2FpdCBjb21wdHJvbGxlci5tZXRob2RzLm1pbnRHdWFyZGlhblBhdXNlZChjVG9rZW4uX2FkZHJlc3MpLmNhbGwoKSlcbiAgICApLFxuICAgIG5ldyBGZXRjaGVyPHtjb21wdHJvbGxlcjogQ29tcHRyb2xsZXIsIGNUb2tlbjogQ1Rva2VufSwgQm9vbFY+KGBcbiAgICAgICAgIyMjIyBCb3Jyb3dHdWFyZGlhbk1hcmtldFBhdXNlZFxuXG4gICAgICAgICogXCJCb3Jyb3dHdWFyZGlhbk1hcmtldFBhdXNlZFwiIC0gUmV0dXJucyB0aGUgQ29tcHRyb2xsZXJzJ3MgQm9ycm93IHBhdXNlZCBzdGF0dXMgaW4gbWFya2V0XG4gICAgICAgICogRS5nLiBcIkNvbXB0cm9sbGVyIEJvcnJvd0d1YXJkaWFuTWFya2V0UGF1c2VkIGNSRVBcIlxuICAgICAgICBgLFxuICAgICAgICBcIkJvcnJvd0d1YXJkaWFuTWFya2V0UGF1c2VkXCIsXG4gICAgICAgIFtcbiAgICAgICAgICBuZXcgQXJnKFwiY29tcHRyb2xsZXJcIiwgZ2V0Q29tcHRyb2xsZXIsIHtpbXBsaWNpdDogdHJ1ZX0pLFxuICAgICAgICAgIG5ldyBBcmcoXCJjVG9rZW5cIiwgZ2V0Q1Rva2VuVilcbiAgICAgICAgXSxcbiAgICAgICAgYXN5bmMgKHdvcmxkLCB7Y29tcHRyb2xsZXIsIGNUb2tlbn0pID0+IG5ldyBCb29sVihhd2FpdCBjb21wdHJvbGxlci5tZXRob2RzLmJvcnJvd0d1YXJkaWFuUGF1c2VkKGNUb2tlbi5fYWRkcmVzcykuY2FsbCgpKVxuICAgICksXG5cbiAgICBuZXcgRmV0Y2hlcjx7Y29tcHRyb2xsZXI6IENvbXB0cm9sbGVyfSwgTGlzdFY+KGBcbiAgICAgICMjIyMgR2V0Q29tcE1hcmtldHNcblxuICAgICAgKiBcIkdldENvbXBNYXJrZXRzXCIgLSBSZXR1cm5zIGFuIGFycmF5IG9mIHRoZSBjdXJyZW50bHkgZW5hYmxlZCBDb21wIG1hcmtldHMuIFRvIHVzZSB0aGUgYXV0by1nZW4gYXJyYXkgZ2V0dGVyIGNvbXBNYXJrZXRzKHVpbnQpLCB1c2UgQ29tcE1hcmtldHNcbiAgICAgICogRS5nLiBcIkNvbXB0cm9sbGVyIEdldENvbXBNYXJrZXRzXCJcbiAgICAgIGAsXG4gICAgICBcIkdldENvbXBNYXJrZXRzXCIsXG4gICAgICBbbmV3IEFyZyhcImNvbXB0cm9sbGVyXCIsIGdldENvbXB0cm9sbGVyLCB7aW1wbGljaXQ6IHRydWV9KV0sXG4gICAgICBhc3luYyh3b3JsZCwge2NvbXB0cm9sbGVyfSkgPT4gYXdhaXQgZ2V0Q29tcE1hcmtldHMod29ybGQsIGNvbXB0cm9sbGVyKVxuICAgICApLFxuXG4gICAgbmV3IEZldGNoZXI8e2NvbXB0cm9sbGVyOiBDb21wdHJvbGxlcn0sIE51bWJlclY+KGBcbiAgICAgICMjIyMgQ29tcFJhdGVcblxuICAgICAgKiBcIkNvbXBSYXRlXCIgLSBSZXR1cm5zIHRoZSBjdXJyZW50IGNvbXAgcmF0ZS5cbiAgICAgICogRS5nLiBcIkNvbXB0cm9sbGVyIENvbXBSYXRlXCJcbiAgICAgIGAsXG4gICAgICBcIkNvbXBSYXRlXCIsXG4gICAgICBbbmV3IEFyZyhcImNvbXB0cm9sbGVyXCIsIGdldENvbXB0cm9sbGVyLCB7aW1wbGljaXQ6IHRydWV9KV0sXG4gICAgICBhc3luYyh3b3JsZCwge2NvbXB0cm9sbGVyfSkgPT4gbmV3IE51bWJlclYoYXdhaXQgY29tcHRyb2xsZXIubWV0aG9kcy5jb21wUmF0ZSgpLmNhbGwoKSlcbiAgICApLFxuXG4gICAgbmV3IEZldGNoZXI8e2NvbXB0cm9sbGVyOiBDb21wdHJvbGxlciwgc2lnbmF0dXJlOiBTdHJpbmdWLCBjYWxsQXJnczogU3RyaW5nVltdfSwgTnVtYmVyVj4oYFxuICAgICAgICAjIyMjIENhbGxOdW1cblxuICAgICAgICAqIFwiQ2FsbE51bSBzaWduYXR1cmU6PFN0cmluZz4gLi4uY2FsbEFyZ3M8Q29yZVZhbHVlPlwiIC0gU2ltcGxlIGRpcmVjdCBjYWxsIG1ldGhvZFxuICAgICAgICAgICogRS5nLiBcIkNvbXB0cm9sbGVyIENhbGxOdW0gXFxcImNvbXBTcGVlZHMoYWRkcmVzcylcXFwiIChBZGRyZXNzIENvYnVybilcIlxuICAgICAgYCxcbiAgICAgIFwiQ2FsbE51bVwiLFxuICAgICAgW1xuICAgICAgICBuZXcgQXJnKFwiY29tcHRyb2xsZXJcIiwgZ2V0Q29tcHRyb2xsZXIsIHtpbXBsaWNpdDogdHJ1ZX0pLFxuICAgICAgICBuZXcgQXJnKFwic2lnbmF0dXJlXCIsIGdldFN0cmluZ1YpLFxuICAgICAgICBuZXcgQXJnKFwiY2FsbEFyZ3NcIiwgZ2V0Q29yZVZhbHVlLCB7dmFyaWFkaWM6IHRydWUsIG1hcHBlZDogdHJ1ZX0pXG4gICAgICBdLFxuICAgICAgYXN5bmMgKHdvcmxkLCB7Y29tcHRyb2xsZXIsIHNpZ25hdHVyZSwgY2FsbEFyZ3N9KSA9PiB7XG4gICAgICAgIGNvbnN0IGZuRGF0YSA9IGVuY29kZUFCSSh3b3JsZCwgc2lnbmF0dXJlLnZhbCwgY2FsbEFyZ3MubWFwKGEgPT4gYS52YWwpKTtcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgd29ybGQud2ViMy5ldGguY2FsbCh7XG4gICAgICAgICAgICB0bzogY29tcHRyb2xsZXIuX2FkZHJlc3MsXG4gICAgICAgICAgICBkYXRhOiBmbkRhdGFcbiAgICAgICAgICB9KVxuICAgICAgICBjb25zdCByZXNOdW0gOiBhbnkgPSB3b3JsZC53ZWIzLmV0aC5hYmkuZGVjb2RlUGFyYW1ldGVyKCd1aW50MjU2JyxyZXMpO1xuICAgICAgICByZXR1cm4gbmV3IE51bWJlclYocmVzTnVtKTtcbiAgICAgIH1cbiAgICApLFxuICAgIG5ldyBGZXRjaGVyPHtjb21wdHJvbGxlcjogQ29tcHRyb2xsZXIsIENUb2tlbjogQ1Rva2VuLCBrZXk6IFN0cmluZ1Z9LCBOdW1iZXJWPihgXG4gICAgICAgICMjIyMgQ29tcFN1cHBseVN0YXRlKGFkZHJlc3MpXG5cbiAgICAgICAgKiBcIkNvbXB0cm9sbGVyIENvbXBCb3Jyb3dTdGF0ZSBjWlJYIFwiaW5kZXhcIlxuICAgICAgYCxcbiAgICAgIFwiQ29tcFN1cHBseVN0YXRlXCIsXG4gICAgICBbXG4gICAgICAgIG5ldyBBcmcoXCJjb21wdHJvbGxlclwiLCBnZXRDb21wdHJvbGxlciwge2ltcGxpY2l0OiB0cnVlfSksXG4gICAgICAgIG5ldyBBcmcoXCJDVG9rZW5cIiwgZ2V0Q1Rva2VuViksXG4gICAgICAgIG5ldyBBcmcoXCJrZXlcIiwgZ2V0U3RyaW5nViksXG4gICAgICBdLFxuICAgICAgYXN5bmMgKHdvcmxkLCB7Y29tcHRyb2xsZXIsIENUb2tlbiwga2V5fSkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjb21wdHJvbGxlci5tZXRob2RzLmNvbXBTdXBwbHlTdGF0ZShDVG9rZW4uX2FkZHJlc3MpLmNhbGwoKTtcbiAgICAgICAgcmV0dXJuIG5ldyBOdW1iZXJWKHJlc3VsdFtrZXkudmFsXSk7XG4gICAgICB9XG4gICAgKSxcbiAgICBuZXcgRmV0Y2hlcjx7Y29tcHRyb2xsZXI6IENvbXB0cm9sbGVyLCBDVG9rZW46IENUb2tlbiwga2V5OiBTdHJpbmdWfSwgTnVtYmVyVj4oYFxuICAgICAgICAjIyMjIENvbXBCb3Jyb3dTdGF0ZShhZGRyZXNzKVxuXG4gICAgICAgICogXCJDb21wdHJvbGxlciBDb21wQm9ycm93U3RhdGUgY1pSWCBcImluZGV4XCJcbiAgICAgIGAsXG4gICAgICBcIkNvbXBCb3Jyb3dTdGF0ZVwiLFxuICAgICAgW1xuICAgICAgICBuZXcgQXJnKFwiY29tcHRyb2xsZXJcIiwgZ2V0Q29tcHRyb2xsZXIsIHtpbXBsaWNpdDogdHJ1ZX0pLFxuICAgICAgICBuZXcgQXJnKFwiQ1Rva2VuXCIsIGdldENUb2tlblYpLFxuICAgICAgICBuZXcgQXJnKFwia2V5XCIsIGdldFN0cmluZ1YpLFxuICAgICAgXSxcbiAgICAgIGFzeW5jICh3b3JsZCwge2NvbXB0cm9sbGVyLCBDVG9rZW4sIGtleX0pID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY29tcHRyb2xsZXIubWV0aG9kcy5jb21wQm9ycm93U3RhdGUoQ1Rva2VuLl9hZGRyZXNzKS5jYWxsKCk7XG4gICAgICAgIHJldHVybiBuZXcgTnVtYmVyVihyZXN1bHRba2V5LnZhbF0pO1xuICAgICAgfVxuICAgICksXG4gICAgbmV3IEZldGNoZXI8e2NvbXB0cm9sbGVyOiBDb21wdHJvbGxlciwgYWNjb3VudDogQWRkcmVzc1YsIGtleTogU3RyaW5nVn0sIE51bWJlclY+KGBcbiAgICAgICAgIyMjIyBDb21wQWNjcnVlZChhZGRyZXNzKVxuXG4gICAgICAgICogXCJDb21wdHJvbGxlciBDb21wQWNjcnVlZCBDb2J1cm5cbiAgICAgIGAsXG4gICAgICBcIkNvbXBBY2NydWVkXCIsXG4gICAgICBbXG4gICAgICAgIG5ldyBBcmcoXCJjb21wdHJvbGxlclwiLCBnZXRDb21wdHJvbGxlciwge2ltcGxpY2l0OiB0cnVlfSksXG4gICAgICAgIG5ldyBBcmcoXCJhY2NvdW50XCIsIGdldEFkZHJlc3NWKSxcbiAgICAgIF0sXG4gICAgICBhc3luYyAod29ybGQsIHtjb21wdHJvbGxlcixhY2NvdW50fSkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjb21wdHJvbGxlci5tZXRob2RzLmNvbXBBY2NydWVkKGFjY291bnQudmFsKS5jYWxsKCk7XG4gICAgICAgIHJldHVybiBuZXcgTnVtYmVyVihyZXN1bHQpO1xuICAgICAgfVxuICAgICksXG4gICAgbmV3IEZldGNoZXI8e2NvbXB0cm9sbGVyOiBDb21wdHJvbGxlciwgQ1Rva2VuOiBDVG9rZW4sIGFjY291bnQ6IEFkZHJlc3NWfSwgTnVtYmVyVj4oYFxuICAgICAgICAjIyMjIGNvbXBTdXBwbGllckluZGV4XG5cbiAgICAgICAgKiBcIkNvbXB0cm9sbGVyIENvbXBTdXBwbGllckluZGV4IGNaUlggQ29idXJuXG4gICAgICBgLFxuICAgICAgXCJDb21wU3VwcGxpZXJJbmRleFwiLFxuICAgICAgW1xuICAgICAgICBuZXcgQXJnKFwiY29tcHRyb2xsZXJcIiwgZ2V0Q29tcHRyb2xsZXIsIHtpbXBsaWNpdDogdHJ1ZX0pLFxuICAgICAgICBuZXcgQXJnKFwiQ1Rva2VuXCIsIGdldENUb2tlblYpLFxuICAgICAgICBuZXcgQXJnKFwiYWNjb3VudFwiLCBnZXRBZGRyZXNzViksXG4gICAgICBdLFxuICAgICAgYXN5bmMgKHdvcmxkLCB7Y29tcHRyb2xsZXIsIENUb2tlbiwgYWNjb3VudH0pID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBOdW1iZXJWKGF3YWl0IGNvbXB0cm9sbGVyLm1ldGhvZHMuY29tcFN1cHBsaWVySW5kZXgoQ1Rva2VuLl9hZGRyZXNzLCBhY2NvdW50LnZhbCkuY2FsbCgpKTtcbiAgICAgIH1cbiAgICApLFxuICAgIG5ldyBGZXRjaGVyPHtjb21wdHJvbGxlcjogQ29tcHRyb2xsZXIsIENUb2tlbjogQ1Rva2VuLCBhY2NvdW50OiBBZGRyZXNzVn0sIE51bWJlclY+KGBcbiAgICAgICAgIyMjIyBDb21wQm9ycm93ZXJJbmRleFxuXG4gICAgICAgICogXCJDb21wdHJvbGxlciBDb21wQm9ycm93ZXJJbmRleCBjWlJYIENvYnVyblxuICAgICAgYCxcbiAgICAgIFwiQ29tcEJvcnJvd2VySW5kZXhcIixcbiAgICAgIFtcbiAgICAgICAgbmV3IEFyZyhcImNvbXB0cm9sbGVyXCIsIGdldENvbXB0cm9sbGVyLCB7aW1wbGljaXQ6IHRydWV9KSxcbiAgICAgICAgbmV3IEFyZyhcIkNUb2tlblwiLCBnZXRDVG9rZW5WKSxcbiAgICAgICAgbmV3IEFyZyhcImFjY291bnRcIiwgZ2V0QWRkcmVzc1YpLFxuICAgICAgXSxcbiAgICAgIGFzeW5jICh3b3JsZCwge2NvbXB0cm9sbGVyLCBDVG9rZW4sIGFjY291bnR9KSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgTnVtYmVyVihhd2FpdCBjb21wdHJvbGxlci5tZXRob2RzLmNvbXBCb3Jyb3dlckluZGV4KENUb2tlbi5fYWRkcmVzcywgYWNjb3VudC52YWwpLmNhbGwoKSk7XG4gICAgICB9XG4gICAgKSxcbiAgICBuZXcgRmV0Y2hlcjx7Y29tcHRyb2xsZXI6IENvbXB0cm9sbGVyLCBDVG9rZW46IENUb2tlbn0sIE51bWJlclY+KGBcbiAgICAgICAgIyMjIyBDb21wU3BlZWRcblxuICAgICAgICAqIFwiQ29tcHRyb2xsZXIgQ29tcFNwZWVkIGNaUlhcbiAgICAgIGAsXG4gICAgICBcIkNvbXBTcGVlZFwiLFxuICAgICAgW1xuICAgICAgICBuZXcgQXJnKFwiY29tcHRyb2xsZXJcIiwgZ2V0Q29tcHRyb2xsZXIsIHtpbXBsaWNpdDogdHJ1ZX0pLFxuICAgICAgICBuZXcgQXJnKFwiQ1Rva2VuXCIsIGdldENUb2tlblYpLFxuICAgICAgXSxcbiAgICAgIGFzeW5jICh3b3JsZCwge2NvbXB0cm9sbGVyLCBDVG9rZW59KSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgTnVtYmVyVihhd2FpdCBjb21wdHJvbGxlci5tZXRob2RzLmNvbXBTcGVlZHMoQ1Rva2VuLl9hZGRyZXNzKS5jYWxsKCkpO1xuICAgICAgfVxuICAgICksXG4gICAgbmV3IEZldGNoZXI8e2NvbXB0cm9sbGVyOiBDb21wdHJvbGxlcn0sIEFkZHJlc3NWPihgXG4gICAgICAgICMjIyMgU3VwcGx5Q2FwR3VhcmRpYW5cblxuICAgICAgICAqIFwiU3VwcGx5Q2FwR3VhcmRpYW5cIiAtIFJldHVybnMgdGhlIENvbXB0cm9sbGVycydzIFN1cHBseUNhcEd1YXJkaWFuXG4gICAgICAgICogRS5nLiBcIkNvbXB0cm9sbGVyIFN1cHBseUNhcEd1YXJkaWFuXCJcbiAgICAgICAgYCxcbiAgICAgICAgXCJTdXBwbHlDYXBHdWFyZGlhblwiLFxuICAgICAgICBbXG4gICAgICAgICAgbmV3IEFyZyhcImNvbXB0cm9sbGVyXCIsIGdldENvbXB0cm9sbGVyLCB7aW1wbGljaXQ6IHRydWV9KVxuICAgICAgICBdLFxuICAgICAgICBhc3luYyAod29ybGQsIHtjb21wdHJvbGxlcn0pID0+IG5ldyBBZGRyZXNzVihhd2FpdCBjb21wdHJvbGxlci5tZXRob2RzLnN1cHBseUNhcEd1YXJkaWFuKCkuY2FsbCgpKVxuICAgICksXG4gICAgbmV3IEZldGNoZXI8e2NvbXB0cm9sbGVyOiBDb21wdHJvbGxlciwgQ1Rva2VuOiBDVG9rZW59LCBOdW1iZXJWPihgXG4gICAgICAgICMjIyMgU3VwcGx5Q2Fwc1xuXG4gICAgICAgICogXCJDb21wdHJvbGxlciBTdXBwbHlDYXBzIGNaUlhcbiAgICAgIGAsXG4gICAgICAgIFwiU3VwcGx5Q2Fwc1wiLFxuICAgICAgICBbXG4gICAgICAgICAgbmV3IEFyZyhcImNvbXB0cm9sbGVyXCIsIGdldENvbXB0cm9sbGVyLCB7aW1wbGljaXQ6IHRydWV9KSxcbiAgICAgICAgICBuZXcgQXJnKFwiQ1Rva2VuXCIsIGdldENUb2tlblYpLFxuICAgICAgICBdLFxuICAgICAgICBhc3luYyAod29ybGQsIHtjb21wdHJvbGxlciwgQ1Rva2VufSkgPT4ge1xuICAgICAgICAgIHJldHVybiBuZXcgTnVtYmVyVihhd2FpdCBjb21wdHJvbGxlci5tZXRob2RzLnN1cHBseUNhcHMoQ1Rva2VuLl9hZGRyZXNzKS5jYWxsKCkpO1xuICAgICAgICB9XG4gICAgKSxcbiAgICBuZXcgRmV0Y2hlcjx7Y29tcHRyb2xsZXI6IENvbXB0cm9sbGVyfSwgQWRkcmVzc1Y+KGBcbiAgICAgICAgIyMjIyBCb3Jyb3dDYXBHdWFyZGlhblxuXG4gICAgICAgICogXCJCb3Jyb3dDYXBHdWFyZGlhblwiIC0gUmV0dXJucyB0aGUgQ29tcHRyb2xsZXJzJ3MgQm9ycm93Q2FwR3VhcmRpYW5cbiAgICAgICAgKiBFLmcuIFwiQ29tcHRyb2xsZXIgQm9ycm93Q2FwR3VhcmRpYW5cIlxuICAgICAgICBgLFxuICAgICAgICBcIkJvcnJvd0NhcEd1YXJkaWFuXCIsXG4gICAgICAgIFtcbiAgICAgICAgICBuZXcgQXJnKFwiY29tcHRyb2xsZXJcIiwgZ2V0Q29tcHRyb2xsZXIsIHtpbXBsaWNpdDogdHJ1ZX0pXG4gICAgICAgIF0sXG4gICAgICAgIGFzeW5jICh3b3JsZCwge2NvbXB0cm9sbGVyfSkgPT4gbmV3IEFkZHJlc3NWKGF3YWl0IGNvbXB0cm9sbGVyLm1ldGhvZHMuYm9ycm93Q2FwR3VhcmRpYW4oKS5jYWxsKCkpXG4gICAgKSxcbiAgICBuZXcgRmV0Y2hlcjx7Y29tcHRyb2xsZXI6IENvbXB0cm9sbGVyLCBDVG9rZW46IENUb2tlbn0sIE51bWJlclY+KGBcbiAgICAgICAgIyMjIyBCb3Jyb3dDYXBzXG5cbiAgICAgICAgKiBcIkNvbXB0cm9sbGVyIEJvcnJvd0NhcHMgY1pSWFxuICAgICAgYCxcbiAgICAgIFwiQm9ycm93Q2Fwc1wiLFxuICAgICAgW1xuICAgICAgICBuZXcgQXJnKFwiY29tcHRyb2xsZXJcIiwgZ2V0Q29tcHRyb2xsZXIsIHtpbXBsaWNpdDogdHJ1ZX0pLFxuICAgICAgICBuZXcgQXJnKFwiQ1Rva2VuXCIsIGdldENUb2tlblYpLFxuICAgICAgXSxcbiAgICAgIGFzeW5jICh3b3JsZCwge2NvbXB0cm9sbGVyLCBDVG9rZW59KSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgTnVtYmVyVihhd2FpdCBjb21wdHJvbGxlci5tZXRob2RzLmJvcnJvd0NhcHMoQ1Rva2VuLl9hZGRyZXNzKS5jYWxsKCkpO1xuICAgICAgfVxuICAgIClcbiAgXTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENvbXB0cm9sbGVyVmFsdWUod29ybGQ6IFdvcmxkLCBldmVudDogRXZlbnQpOiBQcm9taXNlPFZhbHVlPiB7XG4gIHJldHVybiBhd2FpdCBnZXRGZXRjaGVyVmFsdWU8YW55LCBhbnk+KFwiQ29tcHRyb2xsZXJcIiwgY29tcHRyb2xsZXJGZXRjaGVycygpLCB3b3JsZCwgZXZlbnQpO1xufVxuIl19
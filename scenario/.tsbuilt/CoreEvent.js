"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCoreEvent = exports.commands = exports.processEvents = exports.EventProcessingError = void 0;
const World_1 = require("./World");
const CoreValue_1 = require("./CoreValue");
const Value_1 = require("./Value");
const Command_1 = require("./Command");
const AssertionEvent_1 = require("./Event/AssertionEvent");
const ComptrollerEvent_1 = require("./Event/ComptrollerEvent");
const UnitrollerEvent_1 = require("./Event/UnitrollerEvent");
const ComptrollerImplEvent_1 = require("./Event/ComptrollerImplEvent");
const CTokenEvent_1 = require("./Event/CTokenEvent");
const CTokenDelegateEvent_1 = require("./Event/CTokenDelegateEvent");
const Erc20Event_1 = require("./Event/Erc20Event");
const InterestRateModelEvent_1 = require("./Event/InterestRateModelEvent");
const PriceOracleEvent_1 = require("./Event/PriceOracleEvent");
const PriceOracleProxyEvent_1 = require("./Event/PriceOracleProxyEvent");
const InvariantEvent_1 = require("./Event/InvariantEvent");
const ExpectationEvent_1 = require("./Event/ExpectationEvent");
const CompEvent_1 = require("./Event/CompEvent");
const TrxEvent_1 = require("./Event/TrxEvent");
const CoreValue_2 = require("./CoreValue");
const Formatter_1 = require("./Formatter");
const Invokation_1 = require("./Invokation");
const Utils_1 = require("./Utils");
const immutable_1 = require("immutable");
const Help_1 = require("./Help");
const Networks_1 = require("./Networks");
const Hypothetical_1 = require("./Hypothetical");
const EventBuilder_1 = require("./EventBuilder");
class EventProcessingError extends Error {
    constructor(error, event) {
        super(error.message);
        this.error = error;
        this.event = event;
        this.message = `Error: \`${this.error.toString()}\` when processing \`${Formatter_1.formatEvent(this.event)}\``;
        this.stack = error.stack;
    }
}
exports.EventProcessingError = EventProcessingError;
async function processEvents(originalWorld, events) {
    return events.reduce(async (pWorld, event) => {
        let world = await pWorld;
        try {
            world = await processCoreEvent(World_1.setEvent(world, event), event, world.defaultFrom());
        }
        catch (err) {
            if (world.verbose) {
                console.error(err);
            }
            throw new EventProcessingError(err, event);
        }
        // Next, check any unchecked invariants
        world = await World_1.checkInvariants(world);
        // Check any expectations
        world = await World_1.checkExpectations(world);
        // Also clear trx related fields
        world = world.set('trxInvokationOpts', immutable_1.Map({}));
        world = world.set('newInvokation', false);
        if (!world) {
            throw new Error(`Encountered null world result when processing event ${event[0]}: ${world}`);
        }
        else if (!(world instanceof World_1.World)) {
            throw new Error(`Encountered world result which was not isWorld when processing event ${event[0]}: ${world}`);
        }
        return world;
    }, Promise.resolve(originalWorld));
}
exports.processEvents = processEvents;
async function print(world, message) {
    world.printer.printLine(message);
    return world;
}
async function inspect(world, string) {
    if (string !== null) {
        console.log(['Inspect', string, world.toJS()]);
    }
    else {
        console.log(['Inspect', world.toJS()]);
    }
    return world;
}
async function sendEther(world, from, to, amount) {
    let invokation = await Invokation_1.fallback(world, from, to, amount);
    world = World_1.addAction(world, `Send ${amount} from ${from} to ${to}`, invokation);
    return world;
}
exports.commands = [
    new Command_1.View(`
      #### History

      * "History n:<Number>=5" - Prints history of actions
        * E.g. "History"
        * E.g. "History 10"
    `, 'History', [new Command_1.Arg('n', CoreValue_1.getNumberV, { default: new Value_1.NumberV(5) })], async (world, { n }) => {
        world.actions.slice(0, Number(n.val)).forEach(action => {
            world.printer.printLine(action.toString());
        });
        return world;
    }),
    new Command_1.View(`
      #### SleepSeconds

      * "SleepSeconds s:<Number>" - Sleeps for given amount of time.
        * E.g. "SleepSeconds 1" - Sleeps for one second
    `, 'SleepSeconds', [new Command_1.Arg('seconds', CoreValue_1.getNumberV)], async (world, { seconds }) => {
        await Utils_1.sleep(seconds.toNumber() * 1000);
        return world;
    }),
    new Command_1.View(`
      #### SleepUntilTimestamp

      * "SleepUntil timestamp:<Number>" - Sleeps until the given timestamp
        * E.g. "SleepUntil 1579123423" - Sleeps from now until 1579123423
    `, 'SleepUntilTimestamp', [new Command_1.Arg('timestamp', CoreValue_1.getNumberV)], async (world, { timestamp }) => {
        const delay = timestamp.toNumber() - Utils_1.getCurrentTimestamp();
        if (delay > 0) {
            await Utils_1.sleep(delay * 1000);
        }
        return world;
    }),
    new Command_1.View(`
      #### SleepBlocks

      * "SleepForBlocks blocks:<Number>" - Sleeps for a given number of blocks
        * E.g. "SleepBlocks 20" - Sleeps for 20 blocks
    `, 'SleepBlocks', [new Command_1.Arg('blocks', CoreValue_1.getNumberV)], async (world, { blocks }) => {
        const targetBlockNumber = blocks.toNumber() + await Utils_1.getCurrentBlockNumber(world);
        while (await Utils_1.getCurrentBlockNumber(world) < targetBlockNumber) {
            await Utils_1.sleep(1000);
        }
        return world;
    }),
    new Command_1.View(`
      #### SleepUntilBlock

      * "SleepUntilBlock blockNumber:<Number>" - Sleeps until the given blockNumber
        * E.g. "SleepUntilBlock 2006868" - Sleeps from now until block 2006868.
    `, 'SleepUntilBlock', [new Command_1.Arg('blockNumber', CoreValue_1.getNumberV)], async (world, { blockNumber }) => {
        const delay = blockNumber.toNumber() - await Utils_1.getCurrentBlockNumber(world);
        while (blockNumber.toNumber() > await Utils_1.getCurrentBlockNumber(world)) {
            await Utils_1.sleep(1000);
        }
        return world;
    }),
    new Command_1.View(`
      #### Throw

      * "Throw errMsg:<String>" - Throws given error
        * E.g. "Throw \"my error message\""
    `, 'Throw', [new Command_1.Arg('errMsg', CoreValue_1.getStringV)], async (world, { errMsg }) => {
        throw new Error(errMsg.val);
        return world;
    }),
    async (world) => new Command_1.View(`
        #### Read

        * "Read ..." - Reads given value and prints result
          * E.g. "Read CToken cBAT ExchangeRateStored" - Returns exchange rate of cBAT
      `, 'Read', [new Command_1.Arg('res', CoreValue_2.getCoreValue, { variadic: true })], async (world, { res }) => {
        world.printer.printValue(res);
        return world;
    }, { subExpressions: (await CoreValue_2.getFetchers(world)).fetchers }),
    new Command_1.View(`
      #### Print

      * "Print ..." - Prints given string
        * E.g. "Print \"Hello there\""
    `, 'Print', [new Command_1.Arg('message', CoreValue_1.getStringV)], async (world, { message }) => print(world, message.val)),
    new Command_1.View(`
      #### PrintTransactionLogs

      * "PrintTransactionLogs" - Prints logs from all transacions
    `, 'PrintTransactionLogs', [], async (world, {}) => {
        return await world.updateSettings(async (settings) => {
            settings.printTxLogs = true;
            return settings;
        });
    }),
    new Command_1.View(`
      #### Web3Fork

      * "Web3Fork url:<String> unlockedAccounts:<String>[]" - Creates an in-memory ganache
        * E.g. "Web3Fork \"https://mainnet.infura.io/v3/e1a5d4d2c06a4e81945fca56d0d5d8ea\" (\"0x8b8592e9570e96166336603a1b4bd1e8db20fa20\")"
    `, 'Web3Fork', [
        new Command_1.Arg('url', CoreValue_1.getStringV),
        new Command_1.Arg('unlockedAccounts', CoreValue_1.getAddressV, { default: [], mapped: true })
    ], async (world, { url, unlockedAccounts }) => Hypothetical_1.fork(world, url.val, unlockedAccounts.map(v => v.val))),
    new Command_1.View(`
      #### UseConfigs

      * "UseConfigs networkVal:<String>" - Updates world to use the configs for specified network
        * E.g. "UseConfigs mainnet"
    `, 'UseConfigs', [new Command_1.Arg('networkVal', CoreValue_1.getStringV)], async (world, { networkVal }) => {
        const network = networkVal.val;
        if (world.basePath && (network === 'mainnet' || network === 'kovan' || network === 'goerli' || network === 'rinkeby' || network == 'ropsten')) {
            let newWorld = world.set('network', network);
            let contractInfo;
            [newWorld, contractInfo] = await Networks_1.loadContracts(newWorld);
            if (contractInfo.length > 0) {
                world.printer.printLine(`Contracts:`);
                contractInfo.forEach((info) => world.printer.printLine(`\t${info}`));
            }
            return newWorld;
        }
        return world;
    }),
    new Command_1.View(`
      #### MyAddress

      * "MyAddress address:<String>" - Sets default from address (same as "Alias Me <addr>")
        * E.g. "MyAddress \"0x9C1856636d78C051deAd6CAB9c5699e4E25549e9\""
    `, 'MyAddress', [new Command_1.Arg('address', CoreValue_1.getAddressV)], async (world, { address }) => {
        return await world.updateSettings(async (settings) => {
            settings.aliases['Me'] = address.val;
            return settings;
        });
    }),
    new Command_1.View(`
      #### Alias

      * "Alias name:<String> address:<String>" - Stores an alias between name and address
        * E.g. "Alias Me \"0x9C1856636d78C051deAd6CAB9c5699e4E25549e9\""
    `, 'Alias', [new Command_1.Arg('name', CoreValue_1.getStringV), new Command_1.Arg('address', CoreValue_1.getAddressV)], async (world, { name, address }) => {
        return await world.updateSettings(async (settings) => {
            settings.aliases[name.val] = address.val;
            return settings;
        });
    }),
    new Command_1.View(`
      #### Aliases

      * "Aliases - Prints all aliases
    `, 'Aliases', [], async (world, { name, address }) => {
        world.printer.printLine('Aliases:');
        Object.entries(world.settings.aliases).forEach(([name, address]) => {
            world.printer.printLine(`\t${name}: ${address}`);
        });
        return world;
    }),
    new Command_1.View(`
      #### IncreaseTime

      * "IncreaseTime seconds:<Number>" - Increase Ganache evm time by a number of seconds
        * E.g. "IncreaseTime 60"
    `, 'IncreaseTime', [new Command_1.Arg('seconds', CoreValue_1.getNumberV)], async (world, { seconds }) => {
        await Utils_1.sendRPC(world, 'evm_increaseTime', [Number(seconds.val)]);
        await Utils_1.sendRPC(world, 'evm_mine', []);
        return world;
    }),
    new Command_1.View(`
      #### SetTime

      * "SetTime timestamp:<Number>" - Increase Ganache evm time to specific timestamp
        * E.g. "SetTime 1573597400"
    `, 'SetTime', [new Command_1.Arg('timestamp', CoreValue_1.getNumberV)], async (world, { timestamp }) => {
        await Utils_1.sendRPC(world, 'evm_mine', [timestamp.val]);
        return world;
    }),
    new Command_1.View(`
      #### FreezeTime

      * "FreezeTime timestamp:<Number>" - Freeze Ganache evm time to specific timestamp
        * E.g. "FreezeTime 1573597400"
    `, 'FreezeTime', [new Command_1.Arg('timestamp', CoreValue_1.getNumberV)], async (world, { timestamp }) => {
        await Utils_1.sendRPC(world, 'evm_freezeTime', [timestamp.val]);
        return world;
    }),
    new Command_1.View(`
      #### MineBlock

      * "MineBlock" - Increase Ganache evm block number
        * E.g. "MineBlock"
    `, 'MineBlock', [], async (world, {}) => {
        await Utils_1.sendRPC(world, 'evm_mine', []);
        return world;
    }),
    new Command_1.Command(`
      #### SetBlockNumber

      * "SetBlockNumber 10" - Increase Ganache evm block number
        * E.g. "SetBlockNumber 10"
    `, 'SetBlockNumber', [new Command_1.Arg('blockNumber', CoreValue_1.getNumberV)], async (world, from, { blockNumber }) => {
        await Utils_1.sendRPC(world, 'evm_mineBlockNumber', [blockNumber.toNumber() - 1]);
        return world;
    }),
    new Command_1.Command(`
      #### Block

      * "Block 10 (...event)" - Set block to block N and run event
        * E.g. "Block 10 (Comp Deploy Admin)"
    `, 'Block', [
        new Command_1.Arg('blockNumber', CoreValue_1.getNumberV),
        new Command_1.Arg('event', CoreValue_1.getEventV)
    ], async (world, from, { blockNumber, event }) => {
        await Utils_1.sendRPC(world, 'evm_mineBlockNumber', [blockNumber.toNumber() - 2]);
        return await processCoreEvent(world, event.val, from);
    }),
    new Command_1.Command(`
      #### AdvanceBlocks

      * "AdvanceBlocks 10" - Increase Ganache latest + block number
        * E.g. "AdvanceBlocks 10"
    `, 'AdvanceBlocks', [new Command_1.Arg('blockNumber', CoreValue_1.getNumberV)], async (world, from, { blockNumber }) => {
        const currentBlockNumber = await Utils_1.getCurrentBlockNumber(world);
        await Utils_1.sendRPC(world, 'evm_mineBlockNumber', [Number(blockNumber.val) + currentBlockNumber]);
        return world;
    }),
    new Command_1.View(`
      #### Inspect

      * "Inspect" - Prints debugging information about the world
    `, 'Inspect', [], async (world, {}) => inspect(world, null)),
    new Command_1.View(`
      #### Debug

      * "Debug message:<String>" - Same as inspect but prepends with a string
    `, 'Debug', [new Command_1.Arg('message', CoreValue_1.getStringV)], async (world, { message }) => inspect(world, message.val)),
    new Command_1.View(`
      #### From

      * "From <User> <Event>" - Runs event as the given user
        * E.g. "From Geoff (CToken cZRX Mint 5e18)"
    `, 'From', [new Command_1.Arg('account', CoreValue_1.getAddressV), new Command_1.Arg('event', CoreValue_1.getEventV)], async (world, { account, event }) => processCoreEvent(world, event.val, account.val)),
    new Command_1.Command(`
      #### Trx

      * "Trx ...trxEvent" - Handles event to set details of next transaction
        * E.g. "Trx Value 1.0e18 (CToken cEth Mint 1.0e18)"
    `, 'Trx', [new Command_1.Arg('event', CoreValue_1.getEventV, { variadic: true })], async (world, from, { event }) => TrxEvent_1.processTrxEvent(world, event.val, from), { subExpressions: TrxEvent_1.trxCommands() }),
    new Command_1.Command(`
      #### Invariant

      * "Invariant ...invariant" - Adds a new invariant to the world which is checked after each transaction
        * E.g. "Invariant Static (CToken cZRX TotalSupply)"
    `, 'Invariant', [new Command_1.Arg('event', CoreValue_1.getEventV, { variadic: true })], async (world, from, { event }) => InvariantEvent_1.processInvariantEvent(world, event.val, from), { subExpressions: InvariantEvent_1.invariantCommands() }),
    new Command_1.Command(`
      #### Expect

      * "Expect ...expectation" - Adds an expectation to hold after the next transaction
        * E.g. "Expect Changes (CToken cZRX TotalSupply) +10.0e18"
    `, 'Expect', [new Command_1.Arg('event', CoreValue_1.getEventV, { variadic: true })], async (world, from, { event }) => ExpectationEvent_1.processExpectationEvent(world, event.val, from), { subExpressions: ExpectationEvent_1.expectationCommands() }),
    new Command_1.View(`
      #### HoldInvariants

      * "HoldInvariants type:<String>" - Skips checking invariants on next command.
        * E.g. "HoldInvariants" - Skips all invariants
        * E.g. "HoldInvariants All" - Skips all invariants
        * E.g. "HoldInvariants Success" - Skips "success" invariants
        * E.g. "HoldInvariants Remains" - Skips "remains" invariants
        * E.g. "HoldInvariants Static" - Skips "static" invariants
    `, 'HoldInvariants', [new Command_1.Arg('type', CoreValue_1.getStringV, { default: new Value_1.StringV('All') })], async (world, { type }) => World_1.holdInvariants(world, type.val)),
    new Command_1.View(`
      #### ClearInvariants

      * "ClearInvariants type:<String>" - Removes all invariants.
        * E.g. "ClearInvariants" - Removes all invariants
        * E.g. "ClearInvariants All" - Removes all invariants
        * E.g. "ClearInvariants Success" - Removes "success" invariants
        * E.g. "ClearInvariants Remains" - Removes "remains" invariants
        * E.g. "ClearInvariants Static" - Removes "static" invariants
    `, 'ClearInvariants', [new Command_1.Arg('type', CoreValue_1.getStringV, { default: new Value_1.StringV('All') })], async (world, { type }) => World_1.clearInvariants(world, type.val)),
    new Command_1.Command(`
      #### Assert

      * "Assert ...event" - Validates given assertion, raising an exception if assertion fails
        * E.g. "Assert Equal (Erc20 BAT TokenBalance Geoff) (Exactly 5.0)"
    `, 'Assert', [new Command_1.Arg('event', CoreValue_1.getEventV, { variadic: true })], async (world, from, { event }) => AssertionEvent_1.processAssertionEvent(world, event.val, from), { subExpressions: AssertionEvent_1.assertionCommands() }),
    new Command_1.Command(`
      #### Gate

      * "Gate value event" - Runs event only if value is falsey. Thus, gate can be used to build idempotency.
        * E.g. "Gate (Erc20 ZRX Address) (Erc20 Deploy BAT)"
    `, 'Gate', [new Command_1.Arg('gate', CoreValue_2.getCoreValue, { rescue: new Value_1.NothingV() }), new Command_1.Arg('event', CoreValue_1.getEventV)], async (world, from, { gate, event }) => {
        if (gate.truthy()) {
            return world;
        }
        else {
            return processCoreEvent(world, event.val, from);
        }
    }),
    new Command_1.Command(`
      #### Given

      * "Given value event" - Runs event only if value is truthy. Thus, given can be used to build existence checks.
        * E.g. "Given ($var) (PriceOracle SetPrice cBAT $var)"
    `, 'Given', [new Command_1.Arg('given', CoreValue_2.getCoreValue, { rescue: new Value_1.NothingV() }), new Command_1.Arg('event', CoreValue_1.getEventV)], async (world, from, { given, event }) => {
        if (given.truthy()) {
            return processCoreEvent(world, event.val, from);
        }
        else {
            return world;
        }
    }),
    new Command_1.Command(`
      #### Send

      * "Send <Address> <Amount>" - Sends a given amount of eth to given address
        * E.g. "Send cETH 0.5e18"
    `, 'Send', [new Command_1.Arg('address', CoreValue_1.getAddressV), new Command_1.Arg('amount', CoreValue_1.getNumberV)], (world, from, { address, amount }) => sendEther(world, from, address.val, amount.encode())),
    new Command_1.Command(`
      #### Unitroller

      * "Unitroller ...event" - Runs given Unitroller event
        * E.g. "Unitroller SetPendingImpl MyComptrollerImpl"
    `, 'Unitroller', [new Command_1.Arg('event', CoreValue_1.getEventV, { variadic: true })], (world, from, { event }) => UnitrollerEvent_1.processUnitrollerEvent(world, event.val, from), { subExpressions: UnitrollerEvent_1.unitrollerCommands() }),
    new Command_1.Command(`
      #### Comptroller

      * "Comptroller ...event" - Runs given Comptroller event
        * E.g. "Comptroller _setReserveFactor 0.5"
    `, 'Comptroller', [new Command_1.Arg('event', CoreValue_1.getEventV, { variadic: true })], (world, from, { event }) => ComptrollerEvent_1.processComptrollerEvent(world, event.val, from), { subExpressions: ComptrollerEvent_1.comptrollerCommands() }),
    new Command_1.Command(`
      #### ComptrollerImpl

      * "ComptrollerImpl ...event" - Runs given ComptrollerImpl event
        * E.g. "ComptrollerImpl MyImpl Become"
    `, 'ComptrollerImpl', [new Command_1.Arg('event', CoreValue_1.getEventV, { variadic: true })], (world, from, { event }) => ComptrollerImplEvent_1.processComptrollerImplEvent(world, event.val, from), { subExpressions: ComptrollerImplEvent_1.comptrollerImplCommands() }),
    new Command_1.Command(`
      #### CToken

      * "CToken ...event" - Runs given CToken event
        * E.g. "CToken cZRX Mint 5e18"
    `, 'CToken', [new Command_1.Arg('event', CoreValue_1.getEventV, { variadic: true })], (world, from, { event }) => CTokenEvent_1.processCTokenEvent(world, event.val, from), { subExpressions: CTokenEvent_1.cTokenCommands() }),
    new Command_1.Command(`
      #### CTokenDelegate

      * "CTokenDelegate ...event" - Runs given CTokenDelegate event
        * E.g. "CTokenDelegate Deploy CDaiDelegate cDaiDelegate"
    `, 'CTokenDelegate', [new Command_1.Arg('event', CoreValue_1.getEventV, { variadic: true })], (world, from, { event }) => CTokenDelegateEvent_1.processCTokenDelegateEvent(world, event.val, from), { subExpressions: CTokenDelegateEvent_1.cTokenDelegateCommands() }),
    new Command_1.Command(`
      #### Erc20

      * "Erc20 ...event" - Runs given Erc20 event
        * E.g. "Erc20 ZRX Facuet Geoff 5e18"
    `, 'Erc20', [new Command_1.Arg('event', CoreValue_1.getEventV, { variadic: true })], (world, from, { event }) => Erc20Event_1.processErc20Event(world, event.val, from), { subExpressions: Erc20Event_1.erc20Commands() }),
    new Command_1.Command(`
      #### InterestRateModel

      * "InterestRateModel ...event" - Runs given interest rate model event
        * E.g. "InterestRateModel Deploy Fixed StdRate 0.5"
    `, 'InterestRateModel', [new Command_1.Arg('event', CoreValue_1.getEventV, { variadic: true })], (world, from, { event }) => InterestRateModelEvent_1.processInterestRateModelEvent(world, event.val, from), { subExpressions: InterestRateModelEvent_1.interestRateModelCommands() }),
    new Command_1.Command(`
      #### PriceOracle

      * "PriceOracle ...event" - Runs given Price Oracle event
        * E.g. "PriceOracle SetPrice cZRX 1.5"
    `, 'PriceOracle', [new Command_1.Arg('event', CoreValue_1.getEventV, { variadic: true })], (world, from, { event }) => PriceOracleEvent_1.processPriceOracleEvent(world, event.val, from), { subExpressions: PriceOracleEvent_1.priceOracleCommands() }),
    new Command_1.Command(`
      #### PriceOracleProxy

      * "PriceOracleProxy ...event" - Runs given Price Oracle event
      * E.g. "PriceOracleProxy Deploy (Unitroller Address) (PriceOracle Address) (CToken cETH Address)"
    `, 'PriceOracleProxy', [new Command_1.Arg('event', CoreValue_1.getEventV, { variadic: true })], (world, from, { event }) => {
        return PriceOracleProxyEvent_1.processPriceOracleProxyEvent(world, event.val, from);
    }, { subExpressions: PriceOracleProxyEvent_1.priceOracleProxyCommands() }),
    new Command_1.Command(`
      #### Comp

      * "Comp ...event" - Runs given comp event
      * E.g. "Comp Deploy"
    `, 'Comp', [new Command_1.Arg('event', CoreValue_1.getEventV, { variadic: true })], (world, from, { event }) => {
        return CompEvent_1.processCompEvent(world, event.val, from);
    }, { subExpressions: CompEvent_1.compCommands() }),
    EventBuilder_1.buildContractEvent("Counter", false),
    EventBuilder_1.buildContractEvent("CompoundLens", false),
    new Command_1.View(`
      #### Help

      * "Help ...event" - Prints help for given command
      * E.g. "Help From"
    `, 'Help', [new Command_1.Arg('event', CoreValue_1.getEventV, { variadic: true })], async (world, { event }) => {
        world.printer.printLine('');
        let { commands } = await getCommands(world);
        Help_1.printHelp(world.printer, event.val, commands);
        return world;
    })
];
async function getCommands(world) {
    if (world.commands) {
        return { world, commands: world.commands };
    }
    let allCommands = await Promise.all(exports.commands.map((command) => {
        if (typeof (command) === 'function') {
            return command(world);
        }
        else {
            return Promise.resolve(command);
        }
    }));
    return { world: world.set('commands', allCommands), commands: allCommands };
}
async function processCoreEvent(world, event, from) {
    let { world: nextWorld, commands } = await getCommands(world);
    return await Command_1.processCommandEvent('Core', commands, nextWorld, event, from);
}
exports.processCoreEvent = processCoreEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29yZUV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NvcmVFdmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FTaUI7QUFFakIsMkNBQTZFO0FBQzdFLG1DQUE4RTtBQUM5RSx1Q0FBb0U7QUFDcEUsMkRBQWtGO0FBQ2xGLCtEQUF3RjtBQUN4Riw2REFBcUY7QUFDckYsdUVBQW9HO0FBQ3BHLHFEQUF5RTtBQUN6RSxxRUFBaUc7QUFDakcsbURBQXNFO0FBQ3RFLDJFQUEwRztBQUMxRywrREFBd0Y7QUFDeEYseUVBQXVHO0FBQ3ZHLDJEQUFrRjtBQUNsRiwrREFBd0Y7QUFDeEYsaURBQW1FO0FBQ25FLCtDQUFnRTtBQUNoRSwyQ0FBd0Q7QUFDeEQsMkNBQTBDO0FBQzFDLDZDQUF3QztBQUN4QyxtQ0FBcUY7QUFDckYseUNBQWdDO0FBRWhDLGlDQUFtQztBQUNuQyx5Q0FBMkM7QUFDM0MsaURBQXNDO0FBQ3RDLGlEQUFvRDtBQUtwRCxNQUFhLG9CQUFxQixTQUFRLEtBQUs7SUFJN0MsWUFBWSxLQUFZLEVBQUUsS0FBWTtRQUNwQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXJCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsWUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSx3QkFBd0IsdUJBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztRQUNwRyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDM0IsQ0FBQztDQUNGO0FBWkQsb0RBWUM7QUFFTSxLQUFLLFVBQVUsYUFBYSxDQUFDLGFBQW9CLEVBQUUsTUFBZTtJQUN2RSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQXNCLEVB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LEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUM1QztJQUVELElBQUksV0FBVyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1FBQzNELElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFVBQVUsRUFBRTtZQUNuQyxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN2QjthQUFNO1lBQ0wsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2pDO0lBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVKLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxDQUFDO0FBQzlFLENBQUM7QUFFTSxLQUFLLFVBQVUsZ0JBQWdCLENBQUMsS0FBWSxFQUFFLEtBQVksRUFBRSxJQUFtQjtJQUNwRixJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsR0FBRyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5RCxPQUFPLE1BQU0sNkJBQW1CLENBQU0sTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2xGLENBQUM7QUFIRCw0Q0FHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGFkZEFjdGlvbixcbiAgY2hlY2tFeHBlY3RhdGlvbnMsXG4gIGNoZWNrSW52YXJpYW50cyxcbiAgY2xlYXJJbnZhcmlhbnRzLFxuICBkZXNjcmliZVVzZXIsXG4gIGhvbGRJbnZhcmlhbnRzLFxuICBzZXRFdmVudCxcbiAgV29ybGRcbn0gZnJvbSAnLi9Xb3JsZCc7XG5pbXBvcnQgeyBFdmVudCB9IGZyb20gJy4vRXZlbnQnO1xuaW1wb3J0IHsgZ2V0QWRkcmVzc1YsIGdldEV2ZW50ViwgZ2V0TnVtYmVyViwgZ2V0U3RyaW5nViB9IGZyb20gJy4vQ29yZVZhbHVlJztcbmltcG9ydCB7IEFkZHJlc3NWLCBFdmVudFYsIE5vdGhpbmdWLCBOdW1iZXJWLCBTdHJpbmdWLCBWYWx1ZSB9IGZyb20gJy4vVmFsdWUnO1xuaW1wb3J0IHsgQXJnLCBDb21tYW5kLCBwcm9jZXNzQ29tbWFuZEV2ZW50LCBWaWV3IH0gZnJvbSAnLi9Db21tYW5kJztcbmltcG9ydCB7IGFzc2VydGlvbkNvbW1hbmRzLCBwcm9jZXNzQXNzZXJ0aW9uRXZlbnQgfSBmcm9tICcuL0V2ZW50L0Fzc2VydGlvbkV2ZW50JztcbmltcG9ydCB7IGNvbXB0cm9sbGVyQ29tbWFuZHMsIHByb2Nlc3NDb21wdHJvbGxlckV2ZW50IH0gZnJvbSAnLi9FdmVudC9Db21wdHJvbGxlckV2ZW50JztcbmltcG9ydCB7IHByb2Nlc3NVbml0cm9sbGVyRXZlbnQsIHVuaXRyb2xsZXJDb21tYW5kcyB9IGZyb20gJy4vRXZlbnQvVW5pdHJvbGxlckV2ZW50JztcbmltcG9ydCB7IGNvbXB0cm9sbGVySW1wbENvbW1hbmRzLCBwcm9jZXNzQ29tcHRyb2xsZXJJbXBsRXZlbnQgfSBmcm9tICcuL0V2ZW50L0NvbXB0cm9sbGVySW1wbEV2ZW50JztcbmltcG9ydCB7IGNUb2tlbkNvbW1hbmRzLCBwcm9jZXNzQ1Rva2VuRXZlbnQgfSBmcm9tICcuL0V2ZW50L0NUb2tlbkV2ZW50JztcbmltcG9ydCB7IGNUb2tlbkRlbGVnYXRlQ29tbWFuZHMsIHByb2Nlc3NDVG9rZW5EZWxlZ2F0ZUV2ZW50IH0gZnJvbSAnLi9FdmVudC9DVG9rZW5EZWxlZ2F0ZUV2ZW50JztcbmltcG9ydCB7IGVyYzIwQ29tbWFuZHMsIHByb2Nlc3NFcmMyMEV2ZW50IH0gZnJvbSAnLi9FdmVudC9FcmMyMEV2ZW50JztcbmltcG9ydCB7IGludGVyZXN0UmF0ZU1vZGVsQ29tbWFuZHMsIHByb2Nlc3NJbnRlcmVzdFJhdGVNb2RlbEV2ZW50IH0gZnJvbSAnLi9FdmVudC9JbnRlcmVzdFJhdGVNb2RlbEV2ZW50JztcbmltcG9ydCB7IHByaWNlT3JhY2xlQ29tbWFuZHMsIHByb2Nlc3NQcmljZU9yYWNsZUV2ZW50IH0gZnJvbSAnLi9FdmVudC9QcmljZU9yYWNsZUV2ZW50JztcbmltcG9ydCB7IHByaWNlT3JhY2xlUHJveHlDb21tYW5kcywgcHJvY2Vzc1ByaWNlT3JhY2xlUHJveHlFdmVudCB9IGZyb20gJy4vRXZlbnQvUHJpY2VPcmFjbGVQcm94eUV2ZW50JztcbmltcG9ydCB7IGludmFyaWFudENvbW1hbmRzLCBwcm9jZXNzSW52YXJpYW50RXZlbnQgfSBmcm9tICcuL0V2ZW50L0ludmFyaWFudEV2ZW50JztcbmltcG9ydCB7IGV4cGVjdGF0aW9uQ29tbWFuZHMsIHByb2Nlc3NFeHBlY3RhdGlvbkV2ZW50IH0gZnJvbSAnLi9FdmVudC9FeHBlY3RhdGlvbkV2ZW50JztcbmltcG9ydCB7IGNvbXBDb21tYW5kcywgcHJvY2Vzc0NvbXBFdmVudCB9IGZyb20gJy4vRXZlbnQvQ29tcEV2ZW50JztcbmltcG9ydCB7IHByb2Nlc3NUcnhFdmVudCwgdHJ4Q29tbWFuZHMgfSBmcm9tICcuL0V2ZW50L1RyeEV2ZW50JztcbmltcG9ydCB7IGdldEZldGNoZXJzLCBnZXRDb3JlVmFsdWUgfSBmcm9tICcuL0NvcmVWYWx1ZSc7XG5pbXBvcnQgeyBmb3JtYXRFdmVudCB9IGZyb20gJy4vRm9ybWF0dGVyJztcbmltcG9ydCB7IGZhbGxiYWNrIH0gZnJvbSAnLi9JbnZva2F0aW9uJztcbmltcG9ydCB7IGdldEN1cnJlbnRCbG9ja051bWJlciwgZ2V0Q3VycmVudFRpbWVzdGFtcCwgc2VuZFJQQywgc2xlZXAgfSBmcm9tICcuL1V0aWxzJztcbmltcG9ydCB7IE1hcCB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQgeyBlbmNvZGVkTnVtYmVyIH0gZnJvbSAnLi9FbmNvZGluZyc7XG5pbXBvcnQgeyBwcmludEhlbHAgfSBmcm9tICcuL0hlbHAnO1xuaW1wb3J0IHsgbG9hZENvbnRyYWN0cyB9IGZyb20gJy4vTmV0d29ya3MnO1xuaW1wb3J0IHsgZm9yayB9IGZyb20gJy4vSHlwb3RoZXRpY2FsJztcbmltcG9ydCB7IGJ1aWxkQ29udHJhY3RFdmVudCB9IGZyb20gJy4vRXZlbnRCdWlsZGVyJztcbmltcG9ydCB7IENvdW50ZXIgfSBmcm9tICcuL0NvbnRyYWN0L0NvdW50ZXInO1xuaW1wb3J0IHsgQ29tcG91bmRMZW5zIH0gZnJvbSAnLi9Db250cmFjdC9Db21wb3VuZExlbnMnO1xuaW1wb3J0IFdlYjMgZnJvbSAnd2ViMyc7XG5cbmV4cG9ydCBjbGFzcyBFdmVudFByb2Nlc3NpbmdFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgZXJyb3I6IEVycm9yO1xuICBldmVudDogRXZlbnQ7XG5cbiAgY29uc3RydWN0b3IoZXJyb3I6IEVycm9yLCBldmVudDogRXZlbnQpIHtcbiAgICBzdXBlcihlcnJvci5tZXNzYWdlKTtcblxuICAgIHRoaXMuZXJyb3IgPSBlcnJvcjtcbiAgICB0aGlzLmV2ZW50ID0gZXZlbnQ7XG4gICAgdGhpcy5tZXNzYWdlID0gYEVycm9yOiBcXGAke3RoaXMuZXJyb3IudG9TdHJpbmcoKX1cXGAgd2hlbiBwcm9jZXNzaW5nIFxcYCR7Zm9ybWF0RXZlbnQodGhpcy5ldmVudCl9XFxgYDtcbiAgICB0aGlzLnN0YWNrID0gZXJyb3Iuc3RhY2s7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHByb2Nlc3NFdmVudHMob3JpZ2luYWxXb3JsZDogV29ybGQsIGV2ZW50czogRXZlbnRbXSk6IFByb21pc2U8V29ybGQ+IHtcbiAgcmV0dXJuIGV2ZW50cy5yZWR1Y2UoYXN5bmMgKHBXb3JsZDogUHJvbWlzZTxXb3JsZD4sIGV2ZW50OiBFdmVudCk6IFByb21pc2U8V29ybGQ+ID0+IHtcbiAgICBsZXQgd29ybGQgPSBhd2FpdCBwV29ybGQ7XG5cbiAgICB0cnkge1xuICAgICAgd29ybGQgPSBhd2FpdCBwcm9jZXNzQ29yZUV2ZW50KHNldEV2ZW50KHdvcmxkLCBldmVudCksIGV2ZW50LCB3b3JsZC5kZWZhdWx0RnJvbSgpKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmICh3b3JsZC52ZXJib3NlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBFdmVudFByb2Nlc3NpbmdFcnJvcihlcnIsIGV2ZW50KTtcbiAgICB9XG5cbiAgICAvLyBOZXh0LCBjaGVjayBhbnkgdW5jaGVja2VkIGludmFyaWFudHNcbiAgICB3b3JsZCA9IGF3YWl0IGNoZWNrSW52YXJpYW50cyh3b3JsZCk7XG5cbiAgICAvLyBDaGVjayBhbnkgZXhwZWN0YXRpb25zXG4gICAgd29ybGQgPSBhd2FpdCBjaGVja0V4cGVjdGF0aW9ucyh3b3JsZCk7XG5cbiAgICAvLyBBbHNvIGNsZWFyIHRyeCByZWxhdGVkIGZpZWxkc1xuICAgIHdvcmxkID0gd29ybGQuc2V0KCd0cnhJbnZva2F0aW9uT3B0cycsIE1hcCh7fSkpO1xuICAgIHdvcmxkID0gd29ybGQuc2V0KCduZXdJbnZva2F0aW9uJywgZmFsc2UpO1xuXG4gICAgaWYgKCF3b3JsZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbmNvdW50ZXJlZCBudWxsIHdvcmxkIHJlc3VsdCB3aGVuIHByb2Nlc3NpbmcgZXZlbnQgJHtldmVudFswXX06ICR7d29ybGR9YCk7XG4gICAgfSBlbHNlIGlmICghKHdvcmxkIGluc3RhbmNlb2YgV29ybGQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBFbmNvdW50ZXJlZCB3b3JsZCByZXN1bHQgd2hpY2ggd2FzIG5vdCBpc1dvcmxkIHdoZW4gcHJvY2Vzc2luZyBldmVudCAke2V2ZW50WzBdfTogJHt3b3JsZH1gXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB3b3JsZDtcbiAgfSwgUHJvbWlzZS5yZXNvbHZlKG9yaWdpbmFsV29ybGQpKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcHJpbnQod29ybGQ6IFdvcmxkLCBtZXNzYWdlOiBzdHJpbmcpOiBQcm9taXNlPFdvcmxkPiB7XG4gIHdvcmxkLnByaW50ZXIucHJpbnRMaW5lKG1lc3NhZ2UpO1xuXG4gIHJldHVybiB3b3JsZDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaW5zcGVjdCh3b3JsZDogV29ybGQsIHN0cmluZzogc3RyaW5nIHwgbnVsbCk6IFByb21pc2U8V29ybGQ+IHtcbiAgaWYgKHN0cmluZyAhPT0gbnVsbCkge1xuICAgIGNvbnNvbGUubG9nKFsnSW5zcGVjdCcsIHN0cmluZywgd29ybGQudG9KUygpXSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coWydJbnNwZWN0Jywgd29ybGQudG9KUygpXSk7XG4gIH1cblxuICByZXR1cm4gd29ybGQ7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNlbmRFdGhlcih3b3JsZDogV29ybGQsIGZyb206IHN0cmluZywgdG86IHN0cmluZywgYW1vdW50OiBlbmNvZGVkTnVtYmVyKTogUHJvbWlzZTxXb3JsZD4ge1xuICBsZXQgaW52b2thdGlvbiA9IGF3YWl0IGZhbGxiYWNrKHdvcmxkLCBmcm9tLCB0bywgYW1vdW50KTtcblxuICB3b3JsZCA9IGFkZEFjdGlvbih3b3JsZCwgYFNlbmQgJHthbW91bnR9IGZyb20gJHtmcm9tfSB0byAke3RvfWAsIGludm9rYXRpb24pO1xuXG4gIHJldHVybiB3b3JsZDtcbn1cblxuZXhwb3J0IGNvbnN0IGNvbW1hbmRzOiAoVmlldzxhbnk+IHwgKCh3b3JsZDogV29ybGQpID0+IFByb21pc2U8Vmlldzxhbnk+PikpW10gPSBbXG4gIG5ldyBWaWV3PHsgbjogTnVtYmVyViB9PihcbiAgICBgXG4gICAgICAjIyMjIEhpc3RvcnlcblxuICAgICAgKiBcIkhpc3Rvcnkgbjo8TnVtYmVyPj01XCIgLSBQcmludHMgaGlzdG9yeSBvZiBhY3Rpb25zXG4gICAgICAgICogRS5nLiBcIkhpc3RvcnlcIlxuICAgICAgICAqIEUuZy4gXCJIaXN0b3J5IDEwXCJcbiAgICBgLFxuICAgICdIaXN0b3J5JyxcbiAgICBbbmV3IEFyZygnbicsIGdldE51bWJlclYsIHsgZGVmYXVsdDogbmV3IE51bWJlclYoNSkgfSldLFxuICAgIGFzeW5jICh3b3JsZCwgeyBuIH0pID0+IHtcbiAgICAgIHdvcmxkLmFjdGlvbnMuc2xpY2UoMCwgTnVtYmVyKG4udmFsKSkuZm9yRWFjaChhY3Rpb24gPT4ge1xuICAgICAgICB3b3JsZC5wcmludGVyLnByaW50TGluZShhY3Rpb24udG9TdHJpbmcoKSk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHdvcmxkO1xuICAgIH1cbiAgKSxcbiAgbmV3IFZpZXc8eyBzZWNvbmRzOiBOdW1iZXJWIH0+KFxuICAgIGBcbiAgICAgICMjIyMgU2xlZXBTZWNvbmRzXG5cbiAgICAgICogXCJTbGVlcFNlY29uZHMgczo8TnVtYmVyPlwiIC0gU2xlZXBzIGZvciBnaXZlbiBhbW91bnQgb2YgdGltZS5cbiAgICAgICAgKiBFLmcuIFwiU2xlZXBTZWNvbmRzIDFcIiAtIFNsZWVwcyBmb3Igb25lIHNlY29uZFxuICAgIGAsXG4gICAgJ1NsZWVwU2Vjb25kcycsXG4gICAgW25ldyBBcmcoJ3NlY29uZHMnLCBnZXROdW1iZXJWKV0sXG4gICAgYXN5bmMgKHdvcmxkLCB7IHNlY29uZHMgfSkgPT4ge1xuICAgICAgYXdhaXQgc2xlZXAoc2Vjb25kcy50b051bWJlcigpICogMTAwMCk7XG4gICAgICByZXR1cm4gd29ybGQ7XG4gICAgfVxuICApLFxuICBuZXcgVmlldzx7IHRpbWVzdGFtcDogTnVtYmVyViB9PihcbiAgICBgXG4gICAgICAjIyMjIFNsZWVwVW50aWxUaW1lc3RhbXBcblxuICAgICAgKiBcIlNsZWVwVW50aWwgdGltZXN0YW1wOjxOdW1iZXI+XCIgLSBTbGVlcHMgdW50aWwgdGhlIGdpdmVuIHRpbWVzdGFtcFxuICAgICAgICAqIEUuZy4gXCJTbGVlcFVudGlsIDE1NzkxMjM0MjNcIiAtIFNsZWVwcyBmcm9tIG5vdyB1bnRpbCAxNTc5MTIzNDIzXG4gICAgYCxcbiAgICAnU2xlZXBVbnRpbFRpbWVzdGFtcCcsXG4gICAgW25ldyBBcmcoJ3RpbWVzdGFtcCcsIGdldE51bWJlclYpXSxcbiAgICBhc3luYyAod29ybGQsIHsgdGltZXN0YW1wIH0pID0+IHtcbiAgICAgIGNvbnN0IGRlbGF5ID0gdGltZXN0YW1wLnRvTnVtYmVyKCkgLSBnZXRDdXJyZW50VGltZXN0YW1wKCk7XG4gICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgIGF3YWl0IHNsZWVwKGRlbGF5ICogMTAwMCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gd29ybGQ7XG4gICAgfVxuICApLFxuICBuZXcgVmlldzx7IGJsb2NrczogTnVtYmVyViB9PihcbiAgICBgXG4gICAgICAjIyMjIFNsZWVwQmxvY2tzXG5cbiAgICAgICogXCJTbGVlcEZvckJsb2NrcyBibG9ja3M6PE51bWJlcj5cIiAtIFNsZWVwcyBmb3IgYSBnaXZlbiBudW1iZXIgb2YgYmxvY2tzXG4gICAgICAgICogRS5nLiBcIlNsZWVwQmxvY2tzIDIwXCIgLSBTbGVlcHMgZm9yIDIwIGJsb2Nrc1xuICAgIGAsXG4gICAgJ1NsZWVwQmxvY2tzJyxcbiAgICBbbmV3IEFyZygnYmxvY2tzJywgZ2V0TnVtYmVyVildLFxuICAgIGFzeW5jICh3b3JsZCwgeyBibG9ja3MgfSkgPT4ge1xuICAgICAgY29uc3QgdGFyZ2V0QmxvY2tOdW1iZXIgPSBibG9ja3MudG9OdW1iZXIoKSArIGF3YWl0IGdldEN1cnJlbnRCbG9ja051bWJlcih3b3JsZCk7XG4gICAgICB3aGlsZSAoYXdhaXQgZ2V0Q3VycmVudEJsb2NrTnVtYmVyKHdvcmxkKSA8IHRhcmdldEJsb2NrTnVtYmVyKSB7XG4gICAgICAgIGF3YWl0IHNsZWVwKDEwMDApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHdvcmxkO1xuICAgIH1cbiAgKSxcbiAgbmV3IFZpZXc8eyBibG9ja051bWJlcjogTnVtYmVyViB9PihcbiAgICBgXG4gICAgICAjIyMjIFNsZWVwVW50aWxCbG9ja1xuXG4gICAgICAqIFwiU2xlZXBVbnRpbEJsb2NrIGJsb2NrTnVtYmVyOjxOdW1iZXI+XCIgLSBTbGVlcHMgdW50aWwgdGhlIGdpdmVuIGJsb2NrTnVtYmVyXG4gICAgICAgICogRS5nLiBcIlNsZWVwVW50aWxCbG9jayAyMDA2ODY4XCIgLSBTbGVlcHMgZnJvbSBub3cgdW50aWwgYmxvY2sgMjAwNjg2OC5cbiAgICBgLFxuICAgICdTbGVlcFVudGlsQmxvY2snLFxuICAgIFtuZXcgQXJnKCdibG9ja051bWJlcicsIGdldE51bWJlclYpXSxcbiAgICBhc3luYyAod29ybGQsIHsgYmxvY2tOdW1iZXIgfSkgPT4ge1xuICAgICAgY29uc3QgZGVsYXkgPSBibG9ja051bWJlci50b051bWJlcigpIC0gYXdhaXQgZ2V0Q3VycmVudEJsb2NrTnVtYmVyKHdvcmxkKTtcbiAgICAgIHdoaWxlIChibG9ja051bWJlci50b051bWJlcigpID4gYXdhaXQgZ2V0Q3VycmVudEJsb2NrTnVtYmVyKHdvcmxkKSkge1xuICAgICAgICBhd2FpdCBzbGVlcCgxMDAwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB3b3JsZDtcbiAgICB9XG4gICksXG4gIG5ldyBWaWV3PHsgZXJyTXNnOiBTdHJpbmdWIH0+KFxuICAgIGBcbiAgICAgICMjIyMgVGhyb3dcblxuICAgICAgKiBcIlRocm93IGVyck1zZzo8U3RyaW5nPlwiIC0gVGhyb3dzIGdpdmVuIGVycm9yXG4gICAgICAgICogRS5nLiBcIlRocm93IFxcXCJteSBlcnJvciBtZXNzYWdlXFxcIlwiXG4gICAgYCxcbiAgICAnVGhyb3cnLFxuICAgIFtuZXcgQXJnKCdlcnJNc2cnLCBnZXRTdHJpbmdWKV0sXG4gICAgYXN5bmMgKHdvcmxkLCB7IGVyck1zZyB9KSA9PiB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyTXNnLnZhbCk7XG5cbiAgICAgIHJldHVybiB3b3JsZDtcbiAgICB9XG4gICksXG4gIGFzeW5jICh3b3JsZDogV29ybGQpID0+XG4gICAgbmV3IFZpZXc8eyByZXM6IFZhbHVlIH0+KFxuICAgICAgYFxuICAgICAgICAjIyMjIFJlYWRcblxuICAgICAgICAqIFwiUmVhZCAuLi5cIiAtIFJlYWRzIGdpdmVuIHZhbHVlIGFuZCBwcmludHMgcmVzdWx0XG4gICAgICAgICAgKiBFLmcuIFwiUmVhZCBDVG9rZW4gY0JBVCBFeGNoYW5nZVJhdGVTdG9yZWRcIiAtIFJldHVybnMgZXhjaGFuZ2UgcmF0ZSBvZiBjQkFUXG4gICAgICBgLFxuICAgICAgJ1JlYWQnLFxuICAgICAgW25ldyBBcmcoJ3JlcycsIGdldENvcmVWYWx1ZSwgeyB2YXJpYWRpYzogdHJ1ZSB9KV0sXG4gICAgICBhc3luYyAod29ybGQsIHsgcmVzIH0pID0+IHtcbiAgICAgICAgd29ybGQucHJpbnRlci5wcmludFZhbHVlKHJlcyk7XG5cbiAgICAgICAgcmV0dXJuIHdvcmxkO1xuICAgICAgfSxcbiAgICAgIHsgc3ViRXhwcmVzc2lvbnM6IChhd2FpdCBnZXRGZXRjaGVycyh3b3JsZCkpLmZldGNoZXJzIH1cbiAgICApLFxuICBuZXcgVmlldzx7IG1lc3NhZ2U6IFN0cmluZ1YgfT4oXG4gICAgYFxuICAgICAgIyMjIyBQcmludFxuXG4gICAgICAqIFwiUHJpbnQgLi4uXCIgLSBQcmludHMgZ2l2ZW4gc3RyaW5nXG4gICAgICAgICogRS5nLiBcIlByaW50IFxcXCJIZWxsbyB0aGVyZVxcXCJcIlxuICAgIGAsXG4gICAgJ1ByaW50JyxcbiAgICBbbmV3IEFyZygnbWVzc2FnZScsIGdldFN0cmluZ1YpXSxcbiAgICBhc3luYyAod29ybGQsIHsgbWVzc2FnZSB9KSA9PiBwcmludCh3b3JsZCwgbWVzc2FnZS52YWwpXG4gICksXG4gIG5ldyBWaWV3PHt9PihcbiAgICBgXG4gICAgICAjIyMjIFByaW50VHJhbnNhY3Rpb25Mb2dzXG5cbiAgICAgICogXCJQcmludFRyYW5zYWN0aW9uTG9nc1wiIC0gUHJpbnRzIGxvZ3MgZnJvbSBhbGwgdHJhbnNhY2lvbnNcbiAgICBgLFxuICAgICdQcmludFRyYW5zYWN0aW9uTG9ncycsXG4gICAgW10sXG4gICAgYXN5bmMgKHdvcmxkLCB7IH0pID0+IHtcbiAgICAgIHJldHVybiBhd2FpdCB3b3JsZC51cGRhdGVTZXR0aW5ncyhhc3luYyBzZXR0aW5ncyA9PiB7XG4gICAgICAgIHNldHRpbmdzLnByaW50VHhMb2dzID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gc2V0dGluZ3M7XG4gICAgICB9KTtcbiAgICB9XG4gICksXG4gIG5ldyBWaWV3PHsgdXJsOiBTdHJpbmdWOyB1bmxvY2tlZEFjY291bnRzOiBBZGRyZXNzVltdIH0+KFxuICAgIGBcbiAgICAgICMjIyMgV2ViM0ZvcmtcblxuICAgICAgKiBcIldlYjNGb3JrIHVybDo8U3RyaW5nPiB1bmxvY2tlZEFjY291bnRzOjxTdHJpbmc+W11cIiAtIENyZWF0ZXMgYW4gaW4tbWVtb3J5IGdhbmFjaGVcbiAgICAgICAgKiBFLmcuIFwiV2ViM0ZvcmsgXFxcImh0dHBzOi8vbWFpbm5ldC5pbmZ1cmEuaW8vdjMvZTFhNWQ0ZDJjMDZhNGU4MTk0NWZjYTU2ZDBkNWQ4ZWFcXFwiIChcXFwiMHg4Yjg1OTJlOTU3MGU5NjE2NjMzNjYwM2ExYjRiZDFlOGRiMjBmYTIwXFxcIilcIlxuICAgIGAsXG4gICAgJ1dlYjNGb3JrJyxcbiAgICBbXG4gICAgICBuZXcgQXJnKCd1cmwnLCBnZXRTdHJpbmdWKSxcbiAgICAgIG5ldyBBcmcoJ3VubG9ja2VkQWNjb3VudHMnLCBnZXRBZGRyZXNzViwgeyBkZWZhdWx0OiBbXSwgbWFwcGVkOiB0cnVlIH0pXG4gICAgXSxcbiAgICBhc3luYyAod29ybGQsIHsgdXJsLCB1bmxvY2tlZEFjY291bnRzIH0pID0+IGZvcmsod29ybGQsIHVybC52YWwsIHVubG9ja2VkQWNjb3VudHMubWFwKHYgPT4gdi52YWwpKVxuICApLFxuXG4gIG5ldyBWaWV3PHsgbmV0d29ya1ZhbDogU3RyaW5nVjsgfT4oXG4gICAgYFxuICAgICAgIyMjIyBVc2VDb25maWdzXG5cbiAgICAgICogXCJVc2VDb25maWdzIG5ldHdvcmtWYWw6PFN0cmluZz5cIiAtIFVwZGF0ZXMgd29ybGQgdG8gdXNlIHRoZSBjb25maWdzIGZvciBzcGVjaWZpZWQgbmV0d29ya1xuICAgICAgICAqIEUuZy4gXCJVc2VDb25maWdzIG1haW5uZXRcIlxuICAgIGAsXG4gICAgJ1VzZUNvbmZpZ3MnLFxuICAgIFtuZXcgQXJnKCduZXR3b3JrVmFsJywgZ2V0U3RyaW5nVildLFxuICAgIGFzeW5jICh3b3JsZCwgeyBuZXR3b3JrVmFsIH0pID0+IHtcbiAgICAgIGNvbnN0IG5ldHdvcmsgPSBuZXR3b3JrVmFsLnZhbDtcbiAgICAgIGlmICh3b3JsZC5iYXNlUGF0aCAmJiAobmV0d29yayA9PT0gJ21haW5uZXQnIHx8IG5ldHdvcmsgPT09ICdrb3ZhbicgfHwgbmV0d29yayA9PT0gJ2dvZXJsaScgfHwgbmV0d29yayA9PT0gJ3JpbmtlYnknIHx8IG5ldHdvcmsgPT0gJ3JvcHN0ZW4nKSkge1xuICAgICAgICBsZXQgbmV3V29ybGQgPSB3b3JsZC5zZXQoJ25ldHdvcmsnLCBuZXR3b3JrKTtcbiAgICAgICAgbGV0IGNvbnRyYWN0SW5mbztcbiAgICAgICAgW25ld1dvcmxkLCBjb250cmFjdEluZm9dID0gYXdhaXQgbG9hZENvbnRyYWN0cyhuZXdXb3JsZCk7XG4gICAgICAgIGlmIChjb250cmFjdEluZm8ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHdvcmxkLnByaW50ZXIucHJpbnRMaW5lKGBDb250cmFjdHM6YCk7XG4gICAgICAgICAgY29udHJhY3RJbmZvLmZvckVhY2goKGluZm8pID0+IHdvcmxkLnByaW50ZXIucHJpbnRMaW5lKGBcXHQke2luZm99YCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1dvcmxkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gd29ybGQ7XG4gICAgfVxuICApLFxuXG4gIG5ldyBWaWV3PHsgYWRkcmVzczogQWRkcmVzc1YgfT4oXG4gICAgYFxuICAgICAgIyMjIyBNeUFkZHJlc3NcblxuICAgICAgKiBcIk15QWRkcmVzcyBhZGRyZXNzOjxTdHJpbmc+XCIgLSBTZXRzIGRlZmF1bHQgZnJvbSBhZGRyZXNzIChzYW1lIGFzIFwiQWxpYXMgTWUgPGFkZHI+XCIpXG4gICAgICAgICogRS5nLiBcIk15QWRkcmVzcyBcXFwiMHg5QzE4NTY2MzZkNzhDMDUxZGVBZDZDQUI5YzU2OTllNEUyNTU0OWU5XFxcIlwiXG4gICAgYCxcbiAgICAnTXlBZGRyZXNzJyxcbiAgICBbbmV3IEFyZygnYWRkcmVzcycsIGdldEFkZHJlc3NWKV0sXG4gICAgYXN5bmMgKHdvcmxkLCB7IGFkZHJlc3MgfSkgPT4ge1xuICAgICAgcmV0dXJuIGF3YWl0IHdvcmxkLnVwZGF0ZVNldHRpbmdzKGFzeW5jIHNldHRpbmdzID0+IHtcbiAgICAgICAgc2V0dGluZ3MuYWxpYXNlc1snTWUnXSA9IGFkZHJlc3MudmFsO1xuXG4gICAgICAgIHJldHVybiBzZXR0aW5ncztcbiAgICAgIH0pO1xuICAgIH1cbiAgKSxcbiAgbmV3IFZpZXc8eyBuYW1lOiBTdHJpbmdWOyBhZGRyZXNzOiBBZGRyZXNzViB9PihcbiAgICBgXG4gICAgICAjIyMjIEFsaWFzXG5cbiAgICAgICogXCJBbGlhcyBuYW1lOjxTdHJpbmc+IGFkZHJlc3M6PFN0cmluZz5cIiAtIFN0b3JlcyBhbiBhbGlhcyBiZXR3ZWVuIG5hbWUgYW5kIGFkZHJlc3NcbiAgICAgICAgKiBFLmcuIFwiQWxpYXMgTWUgXFxcIjB4OUMxODU2NjM2ZDc4QzA1MWRlQWQ2Q0FCOWM1Njk5ZTRFMjU1NDllOVxcXCJcIlxuICAgIGAsXG4gICAgJ0FsaWFzJyxcbiAgICBbbmV3IEFyZygnbmFtZScsIGdldFN0cmluZ1YpLCBuZXcgQXJnKCdhZGRyZXNzJywgZ2V0QWRkcmVzc1YpXSxcbiAgICBhc3luYyAod29ybGQsIHsgbmFtZSwgYWRkcmVzcyB9KSA9PiB7XG4gICAgICByZXR1cm4gYXdhaXQgd29ybGQudXBkYXRlU2V0dGluZ3MoYXN5bmMgc2V0dGluZ3MgPT4ge1xuICAgICAgICBzZXR0aW5ncy5hbGlhc2VzW25hbWUudmFsXSA9IGFkZHJlc3MudmFsO1xuXG4gICAgICAgIHJldHVybiBzZXR0aW5ncztcbiAgICAgIH0pO1xuICAgIH1cbiAgKSxcblxuICBuZXcgVmlldzx7IG5hbWU6IFN0cmluZ1Y7IGFkZHJlc3M6IEFkZHJlc3NWIH0+KFxuICAgIGBcbiAgICAgICMjIyMgQWxpYXNlc1xuXG4gICAgICAqIFwiQWxpYXNlcyAtIFByaW50cyBhbGwgYWxpYXNlc1xuICAgIGAsXG4gICAgJ0FsaWFzZXMnLFxuICAgIFtdLFxuICAgIGFzeW5jICh3b3JsZCwgeyBuYW1lLCBhZGRyZXNzIH0pID0+IHtcbiAgICAgIHdvcmxkLnByaW50ZXIucHJpbnRMaW5lKCdBbGlhc2VzOicpO1xuICAgICAgT2JqZWN0LmVudHJpZXMod29ybGQuc2V0dGluZ3MuYWxpYXNlcykuZm9yRWFjaCgoW25hbWUsIGFkZHJlc3NdKSA9PiB7XG4gICAgICAgIHdvcmxkLnByaW50ZXIucHJpbnRMaW5lKGBcXHQke25hbWV9OiAke2FkZHJlc3N9YCk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHdvcmxkO1xuICAgIH1cbiAgKSxcblxuICBuZXcgVmlldzx7IHNlY29uZHM6IE51bWJlclYgfT4oXG4gICAgYFxuICAgICAgIyMjIyBJbmNyZWFzZVRpbWVcblxuICAgICAgKiBcIkluY3JlYXNlVGltZSBzZWNvbmRzOjxOdW1iZXI+XCIgLSBJbmNyZWFzZSBHYW5hY2hlIGV2bSB0aW1lIGJ5IGEgbnVtYmVyIG9mIHNlY29uZHNcbiAgICAgICAgKiBFLmcuIFwiSW5jcmVhc2VUaW1lIDYwXCJcbiAgICBgLFxuICAgICdJbmNyZWFzZVRpbWUnLFxuICAgIFtuZXcgQXJnKCdzZWNvbmRzJywgZ2V0TnVtYmVyVildLFxuICAgIGFzeW5jICh3b3JsZCwgeyBzZWNvbmRzIH0pID0+IHtcbiAgICAgIGF3YWl0IHNlbmRSUEMod29ybGQsICdldm1faW5jcmVhc2VUaW1lJywgW051bWJlcihzZWNvbmRzLnZhbCldKTtcbiAgICAgIGF3YWl0IHNlbmRSUEMod29ybGQsICdldm1fbWluZScsIFtdKTtcbiAgICAgIHJldHVybiB3b3JsZDtcbiAgICB9XG4gICksXG5cbiAgbmV3IFZpZXc8eyB0aW1lc3RhbXA6IE51bWJlclYgfT4oXG4gICAgYFxuICAgICAgIyMjIyBTZXRUaW1lXG5cbiAgICAgICogXCJTZXRUaW1lIHRpbWVzdGFtcDo8TnVtYmVyPlwiIC0gSW5jcmVhc2UgR2FuYWNoZSBldm0gdGltZSB0byBzcGVjaWZpYyB0aW1lc3RhbXBcbiAgICAgICAgKiBFLmcuIFwiU2V0VGltZSAxNTczNTk3NDAwXCJcbiAgICBgLFxuICAgICdTZXRUaW1lJyxcbiAgICBbbmV3IEFyZygndGltZXN0YW1wJywgZ2V0TnVtYmVyVildLFxuICAgIGFzeW5jICh3b3JsZCwgeyB0aW1lc3RhbXAgfSkgPT4ge1xuICAgICAgYXdhaXQgc2VuZFJQQyh3b3JsZCwgJ2V2bV9taW5lJywgW3RpbWVzdGFtcC52YWxdKTtcbiAgICAgIHJldHVybiB3b3JsZDtcbiAgICB9XG4gICksXG5cbiAgbmV3IFZpZXc8eyB0aW1lc3RhbXA6IE51bWJlclYgfT4oXG4gICAgYFxuICAgICAgIyMjIyBGcmVlemVUaW1lXG5cbiAgICAgICogXCJGcmVlemVUaW1lIHRpbWVzdGFtcDo8TnVtYmVyPlwiIC0gRnJlZXplIEdhbmFjaGUgZXZtIHRpbWUgdG8gc3BlY2lmaWMgdGltZXN0YW1wXG4gICAgICAgICogRS5nLiBcIkZyZWV6ZVRpbWUgMTU3MzU5NzQwMFwiXG4gICAgYCxcbiAgICAnRnJlZXplVGltZScsXG4gICAgW25ldyBBcmcoJ3RpbWVzdGFtcCcsIGdldE51bWJlclYpXSxcbiAgICBhc3luYyAod29ybGQsIHsgdGltZXN0YW1wIH0pID0+IHtcbiAgICAgIGF3YWl0IHNlbmRSUEMod29ybGQsICdldm1fZnJlZXplVGltZScsIFt0aW1lc3RhbXAudmFsXSk7XG4gICAgICByZXR1cm4gd29ybGQ7XG4gICAgfVxuICApLFxuXG4gIG5ldyBWaWV3PHt9PihcbiAgICBgXG4gICAgICAjIyMjIE1pbmVCbG9ja1xuXG4gICAgICAqIFwiTWluZUJsb2NrXCIgLSBJbmNyZWFzZSBHYW5hY2hlIGV2bSBibG9jayBudW1iZXJcbiAgICAgICAgKiBFLmcuIFwiTWluZUJsb2NrXCJcbiAgICBgLFxuICAgICdNaW5lQmxvY2snLFxuICAgIFtdLFxuICAgIGFzeW5jICh3b3JsZCwgeyB9KSA9PiB7XG4gICAgICBhd2FpdCBzZW5kUlBDKHdvcmxkLCAnZXZtX21pbmUnLCBbXSk7XG4gICAgICByZXR1cm4gd29ybGQ7XG4gICAgfVxuICApLFxuXG4gIG5ldyBDb21tYW5kPHsgYmxvY2tOdW1iZXI6IE51bWJlclYgfT4oXG4gICAgYFxuICAgICAgIyMjIyBTZXRCbG9ja051bWJlclxuXG4gICAgICAqIFwiU2V0QmxvY2tOdW1iZXIgMTBcIiAtIEluY3JlYXNlIEdhbmFjaGUgZXZtIGJsb2NrIG51bWJlclxuICAgICAgICAqIEUuZy4gXCJTZXRCbG9ja051bWJlciAxMFwiXG4gICAgYCxcbiAgICAnU2V0QmxvY2tOdW1iZXInLFxuICAgIFtuZXcgQXJnKCdibG9ja051bWJlcicsIGdldE51bWJlclYpXSxcbiAgICBhc3luYyAod29ybGQsIGZyb20sIHsgYmxvY2tOdW1iZXIgfSkgPT4ge1xuICAgICAgYXdhaXQgc2VuZFJQQyh3b3JsZCwgJ2V2bV9taW5lQmxvY2tOdW1iZXInLCBbYmxvY2tOdW1iZXIudG9OdW1iZXIoKSAtIDFdKVxuICAgICAgcmV0dXJuIHdvcmxkO1xuICAgIH1cbiAgKSxcblxuICBuZXcgQ29tbWFuZDx7IGJsb2NrTnVtYmVyOiBOdW1iZXJWLCBldmVudDogRXZlbnRWIH0+KFxuICAgIGBcbiAgICAgICMjIyMgQmxvY2tcblxuICAgICAgKiBcIkJsb2NrIDEwICguLi5ldmVudClcIiAtIFNldCBibG9jayB0byBibG9jayBOIGFuZCBydW4gZXZlbnRcbiAgICAgICAgKiBFLmcuIFwiQmxvY2sgMTAgKENvbXAgRGVwbG95IEFkbWluKVwiXG4gICAgYCxcbiAgICAnQmxvY2snLFxuICAgIFtcbiAgICAgIG5ldyBBcmcoJ2Jsb2NrTnVtYmVyJywgZ2V0TnVtYmVyViksXG4gICAgICBuZXcgQXJnKCdldmVudCcsIGdldEV2ZW50VilcbiAgICBdLFxuICAgIGFzeW5jICh3b3JsZCwgZnJvbSwgeyBibG9ja051bWJlciwgZXZlbnQgfSkgPT4ge1xuICAgICAgYXdhaXQgc2VuZFJQQyh3b3JsZCwgJ2V2bV9taW5lQmxvY2tOdW1iZXInLCBbYmxvY2tOdW1iZXIudG9OdW1iZXIoKSAtIDJdKVxuICAgICAgcmV0dXJuIGF3YWl0IHByb2Nlc3NDb3JlRXZlbnQod29ybGQsIGV2ZW50LnZhbCwgZnJvbSk7XG4gICAgfVxuICApLFxuXG4gIG5ldyBDb21tYW5kPHsgYmxvY2tOdW1iZXI6IE51bWJlclYgfT4oXG4gICAgYFxuICAgICAgIyMjIyBBZHZhbmNlQmxvY2tzXG5cbiAgICAgICogXCJBZHZhbmNlQmxvY2tzIDEwXCIgLSBJbmNyZWFzZSBHYW5hY2hlIGxhdGVzdCArIGJsb2NrIG51bWJlclxuICAgICAgICAqIEUuZy4gXCJBZHZhbmNlQmxvY2tzIDEwXCJcbiAgICBgLFxuICAgICdBZHZhbmNlQmxvY2tzJyxcbiAgICBbbmV3IEFyZygnYmxvY2tOdW1iZXInLCBnZXROdW1iZXJWKV0sXG4gICAgYXN5bmMgKHdvcmxkLCBmcm9tLCB7IGJsb2NrTnVtYmVyIH0pID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRCbG9ja051bWJlciA9IGF3YWl0IGdldEN1cnJlbnRCbG9ja051bWJlcih3b3JsZCk7XG4gICAgICBhd2FpdCBzZW5kUlBDKHdvcmxkLCAnZXZtX21pbmVCbG9ja051bWJlcicsIFtOdW1iZXIoYmxvY2tOdW1iZXIudmFsKSArIGN1cnJlbnRCbG9ja051bWJlcl0pO1xuICAgICAgcmV0dXJuIHdvcmxkO1xuICAgIH1cbiAgKSxcblxuICBuZXcgVmlldzx7fT4oXG4gICAgYFxuICAgICAgIyMjIyBJbnNwZWN0XG5cbiAgICAgICogXCJJbnNwZWN0XCIgLSBQcmludHMgZGVidWdnaW5nIGluZm9ybWF0aW9uIGFib3V0IHRoZSB3b3JsZFxuICAgIGAsXG4gICAgJ0luc3BlY3QnLFxuICAgIFtdLFxuICAgIGFzeW5jICh3b3JsZCwgeyB9KSA9PiBpbnNwZWN0KHdvcmxkLCBudWxsKVxuICApLFxuXG4gIG5ldyBWaWV3PHsgbWVzc2FnZTogU3RyaW5nViB9PihcbiAgICBgXG4gICAgICAjIyMjIERlYnVnXG5cbiAgICAgICogXCJEZWJ1ZyBtZXNzYWdlOjxTdHJpbmc+XCIgLSBTYW1lIGFzIGluc3BlY3QgYnV0IHByZXBlbmRzIHdpdGggYSBzdHJpbmdcbiAgICBgLFxuICAgICdEZWJ1ZycsXG4gICAgW25ldyBBcmcoJ21lc3NhZ2UnLCBnZXRTdHJpbmdWKV0sXG4gICAgYXN5bmMgKHdvcmxkLCB7IG1lc3NhZ2UgfSkgPT4gaW5zcGVjdCh3b3JsZCwgbWVzc2FnZS52YWwpXG4gICksXG5cbiAgbmV3IFZpZXc8eyBhY2NvdW50OiBBZGRyZXNzVjsgZXZlbnQ6IEV2ZW50ViB9PihcbiAgICBgXG4gICAgICAjIyMjIEZyb21cblxuICAgICAgKiBcIkZyb20gPFVzZXI+IDxFdmVudD5cIiAtIFJ1bnMgZXZlbnQgYXMgdGhlIGdpdmVuIHVzZXJcbiAgICAgICAgKiBFLmcuIFwiRnJvbSBHZW9mZiAoQ1Rva2VuIGNaUlggTWludCA1ZTE4KVwiXG4gICAgYCxcbiAgICAnRnJvbScsXG4gICAgW25ldyBBcmcoJ2FjY291bnQnLCBnZXRBZGRyZXNzViksIG5ldyBBcmcoJ2V2ZW50JywgZ2V0RXZlbnRWKV0sXG4gICAgYXN5bmMgKHdvcmxkLCB7IGFjY291bnQsIGV2ZW50IH0pID0+IHByb2Nlc3NDb3JlRXZlbnQod29ybGQsIGV2ZW50LnZhbCwgYWNjb3VudC52YWwpXG4gICksXG5cbiAgbmV3IENvbW1hbmQ8eyBldmVudDogRXZlbnRWIH0+KFxuICAgIGBcbiAgICAgICMjIyMgVHJ4XG5cbiAgICAgICogXCJUcnggLi4udHJ4RXZlbnRcIiAtIEhhbmRsZXMgZXZlbnQgdG8gc2V0IGRldGFpbHMgb2YgbmV4dCB0cmFuc2FjdGlvblxuICAgICAgICAqIEUuZy4gXCJUcnggVmFsdWUgMS4wZTE4IChDVG9rZW4gY0V0aCBNaW50IDEuMGUxOClcIlxuICAgIGAsXG4gICAgJ1RyeCcsXG4gICAgW25ldyBBcmcoJ2V2ZW50JywgZ2V0RXZlbnRWLCB7IHZhcmlhZGljOiB0cnVlIH0pXSxcbiAgICBhc3luYyAod29ybGQsIGZyb20sIHsgZXZlbnQgfSkgPT4gcHJvY2Vzc1RyeEV2ZW50KHdvcmxkLCBldmVudC52YWwsIGZyb20pLFxuICAgIHsgc3ViRXhwcmVzc2lvbnM6IHRyeENvbW1hbmRzKCkgfVxuICApLFxuXG4gIG5ldyBDb21tYW5kPHsgZXZlbnQ6IEV2ZW50ViB9PihcbiAgICBgXG4gICAgICAjIyMjIEludmFyaWFudFxuXG4gICAgICAqIFwiSW52YXJpYW50IC4uLmludmFyaWFudFwiIC0gQWRkcyBhIG5ldyBpbnZhcmlhbnQgdG8gdGhlIHdvcmxkIHdoaWNoIGlzIGNoZWNrZWQgYWZ0ZXIgZWFjaCB0cmFuc2FjdGlvblxuICAgICAgICAqIEUuZy4gXCJJbnZhcmlhbnQgU3RhdGljIChDVG9rZW4gY1pSWCBUb3RhbFN1cHBseSlcIlxuICAgIGAsXG4gICAgJ0ludmFyaWFudCcsXG4gICAgW25ldyBBcmcoJ2V2ZW50JywgZ2V0RXZlbnRWLCB7IHZhcmlhZGljOiB0cnVlIH0pXSxcbiAgICBhc3luYyAod29ybGQsIGZyb20sIHsgZXZlbnQgfSkgPT4gcHJvY2Vzc0ludmFyaWFudEV2ZW50KHdvcmxkLCBldmVudC52YWwsIGZyb20pLFxuICAgIHsgc3ViRXhwcmVzc2lvbnM6IGludmFyaWFudENvbW1hbmRzKCkgfVxuICApLFxuXG4gIG5ldyBDb21tYW5kPHsgZXZlbnQ6IEV2ZW50ViB9PihcbiAgICBgXG4gICAgICAjIyMjIEV4cGVjdFxuXG4gICAgICAqIFwiRXhwZWN0IC4uLmV4cGVjdGF0aW9uXCIgLSBBZGRzIGFuIGV4cGVjdGF0aW9uIHRvIGhvbGQgYWZ0ZXIgdGhlIG5leHQgdHJhbnNhY3Rpb25cbiAgICAgICAgKiBFLmcuIFwiRXhwZWN0IENoYW5nZXMgKENUb2tlbiBjWlJYIFRvdGFsU3VwcGx5KSArMTAuMGUxOFwiXG4gICAgYCxcbiAgICAnRXhwZWN0JyxcbiAgICBbbmV3IEFyZygnZXZlbnQnLCBnZXRFdmVudFYsIHsgdmFyaWFkaWM6IHRydWUgfSldLFxuICAgIGFzeW5jICh3b3JsZCwgZnJvbSwgeyBldmVudCB9KSA9PiBwcm9jZXNzRXhwZWN0YXRpb25FdmVudCh3b3JsZCwgZXZlbnQudmFsLCBmcm9tKSxcbiAgICB7IHN1YkV4cHJlc3Npb25zOiBleHBlY3RhdGlvbkNvbW1hbmRzKCkgfVxuICApLFxuXG4gIG5ldyBWaWV3PHsgdHlwZTogU3RyaW5nViB9PihcbiAgICBgXG4gICAgICAjIyMjIEhvbGRJbnZhcmlhbnRzXG5cbiAgICAgICogXCJIb2xkSW52YXJpYW50cyB0eXBlOjxTdHJpbmc+XCIgLSBTa2lwcyBjaGVja2luZyBpbnZhcmlhbnRzIG9uIG5leHQgY29tbWFuZC5cbiAgICAgICAgKiBFLmcuIFwiSG9sZEludmFyaWFudHNcIiAtIFNraXBzIGFsbCBpbnZhcmlhbnRzXG4gICAgICAgICogRS5nLiBcIkhvbGRJbnZhcmlhbnRzIEFsbFwiIC0gU2tpcHMgYWxsIGludmFyaWFudHNcbiAgICAgICAgKiBFLmcuIFwiSG9sZEludmFyaWFudHMgU3VjY2Vzc1wiIC0gU2tpcHMgXCJzdWNjZXNzXCIgaW52YXJpYW50c1xuICAgICAgICAqIEUuZy4gXCJIb2xkSW52YXJpYW50cyBSZW1haW5zXCIgLSBTa2lwcyBcInJlbWFpbnNcIiBpbnZhcmlhbnRzXG4gICAgICAgICogRS5nLiBcIkhvbGRJbnZhcmlhbnRzIFN0YXRpY1wiIC0gU2tpcHMgXCJzdGF0aWNcIiBpbnZhcmlhbnRzXG4gICAgYCxcbiAgICAnSG9sZEludmFyaWFudHMnLFxuICAgIFtuZXcgQXJnKCd0eXBlJywgZ2V0U3RyaW5nViwgeyBkZWZhdWx0OiBuZXcgU3RyaW5nVignQWxsJykgfSldLFxuICAgIGFzeW5jICh3b3JsZCwgeyB0eXBlIH0pID0+IGhvbGRJbnZhcmlhbnRzKHdvcmxkLCB0eXBlLnZhbClcbiAgKSxcblxuICBuZXcgVmlldzx7IHR5cGU6IFN0cmluZ1YgfT4oXG4gICAgYFxuICAgICAgIyMjIyBDbGVhckludmFyaWFudHNcblxuICAgICAgKiBcIkNsZWFySW52YXJpYW50cyB0eXBlOjxTdHJpbmc+XCIgLSBSZW1vdmVzIGFsbCBpbnZhcmlhbnRzLlxuICAgICAgICAqIEUuZy4gXCJDbGVhckludmFyaWFudHNcIiAtIFJlbW92ZXMgYWxsIGludmFyaWFudHNcbiAgICAgICAgKiBFLmcuIFwiQ2xlYXJJbnZhcmlhbnRzIEFsbFwiIC0gUmVtb3ZlcyBhbGwgaW52YXJpYW50c1xuICAgICAgICAqIEUuZy4gXCJDbGVhckludmFyaWFudHMgU3VjY2Vzc1wiIC0gUmVtb3ZlcyBcInN1Y2Nlc3NcIiBpbnZhcmlhbnRzXG4gICAgICAgICogRS5nLiBcIkNsZWFySW52YXJpYW50cyBSZW1haW5zXCIgLSBSZW1vdmVzIFwicmVtYWluc1wiIGludmFyaWFudHNcbiAgICAgICAgKiBFLmcuIFwiQ2xlYXJJbnZhcmlhbnRzIFN0YXRpY1wiIC0gUmVtb3ZlcyBcInN0YXRpY1wiIGludmFyaWFudHNcbiAgICBgLFxuICAgICdDbGVhckludmFyaWFudHMnLFxuICAgIFtuZXcgQXJnKCd0eXBlJywgZ2V0U3RyaW5nViwgeyBkZWZhdWx0OiBuZXcgU3RyaW5nVignQWxsJykgfSldLFxuICAgIGFzeW5jICh3b3JsZCwgeyB0eXBlIH0pID0+IGNsZWFySW52YXJpYW50cyh3b3JsZCwgdHlwZS52YWwpXG4gICksXG5cbiAgbmV3IENvbW1hbmQ8eyBldmVudDogRXZlbnRWIH0+KFxuICAgIGBcbiAgICAgICMjIyMgQXNzZXJ0XG5cbiAgICAgICogXCJBc3NlcnQgLi4uZXZlbnRcIiAtIFZhbGlkYXRlcyBnaXZlbiBhc3NlcnRpb24sIHJhaXNpbmcgYW4gZXhjZXB0aW9uIGlmIGFzc2VydGlvbiBmYWlsc1xuICAgICAgICAqIEUuZy4gXCJBc3NlcnQgRXF1YWwgKEVyYzIwIEJBVCBUb2tlbkJhbGFuY2UgR2VvZmYpIChFeGFjdGx5IDUuMClcIlxuICAgIGAsXG4gICAgJ0Fzc2VydCcsXG4gICAgW25ldyBBcmcoJ2V2ZW50JywgZ2V0RXZlbnRWLCB7IHZhcmlhZGljOiB0cnVlIH0pXSxcbiAgICBhc3luYyAod29ybGQsIGZyb20sIHsgZXZlbnQgfSkgPT4gcHJvY2Vzc0Fzc2VydGlvbkV2ZW50KHdvcmxkLCBldmVudC52YWwsIGZyb20pLFxuICAgIHsgc3ViRXhwcmVzc2lvbnM6IGFzc2VydGlvbkNvbW1hbmRzKCkgfVxuICApLFxuXG4gIG5ldyBDb21tYW5kPHsgZ2F0ZTogVmFsdWU7IGV2ZW50OiBFdmVudFYgfT4oXG4gICAgYFxuICAgICAgIyMjIyBHYXRlXG5cbiAgICAgICogXCJHYXRlIHZhbHVlIGV2ZW50XCIgLSBSdW5zIGV2ZW50IG9ubHkgaWYgdmFsdWUgaXMgZmFsc2V5LiBUaHVzLCBnYXRlIGNhbiBiZSB1c2VkIHRvIGJ1aWxkIGlkZW1wb3RlbmN5LlxuICAgICAgICAqIEUuZy4gXCJHYXRlIChFcmMyMCBaUlggQWRkcmVzcykgKEVyYzIwIERlcGxveSBCQVQpXCJcbiAgICBgLFxuICAgICdHYXRlJyxcbiAgICBbbmV3IEFyZygnZ2F0ZScsIGdldENvcmVWYWx1ZSwgeyByZXNjdWU6IG5ldyBOb3RoaW5nVigpIH0pLCBuZXcgQXJnKCdldmVudCcsIGdldEV2ZW50VildLFxuICAgIGFzeW5jICh3b3JsZCwgZnJvbSwgeyBnYXRlLCBldmVudCB9KSA9PiB7XG4gICAgICBpZiAoZ2F0ZS50cnV0aHkoKSkge1xuICAgICAgICByZXR1cm4gd29ybGQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcHJvY2Vzc0NvcmVFdmVudCh3b3JsZCwgZXZlbnQudmFsLCBmcm9tKTtcbiAgICAgIH1cbiAgICB9XG4gICksXG5cbiAgbmV3IENvbW1hbmQ8eyBnaXZlbjogVmFsdWU7IGV2ZW50OiBFdmVudFYgfT4oXG4gICAgYFxuICAgICAgIyMjIyBHaXZlblxuXG4gICAgICAqIFwiR2l2ZW4gdmFsdWUgZXZlbnRcIiAtIFJ1bnMgZXZlbnQgb25seSBpZiB2YWx1ZSBpcyB0cnV0aHkuIFRodXMsIGdpdmVuIGNhbiBiZSB1c2VkIHRvIGJ1aWxkIGV4aXN0ZW5jZSBjaGVja3MuXG4gICAgICAgICogRS5nLiBcIkdpdmVuICgkdmFyKSAoUHJpY2VPcmFjbGUgU2V0UHJpY2UgY0JBVCAkdmFyKVwiXG4gICAgYCxcbiAgICAnR2l2ZW4nLFxuICAgIFtuZXcgQXJnKCdnaXZlbicsIGdldENvcmVWYWx1ZSwgeyByZXNjdWU6IG5ldyBOb3RoaW5nVigpIH0pLCBuZXcgQXJnKCdldmVudCcsIGdldEV2ZW50VildLFxuICAgIGFzeW5jICh3b3JsZCwgZnJvbSwgeyBnaXZlbiwgZXZlbnQgfSkgPT4ge1xuICAgICAgaWYgKGdpdmVuLnRydXRoeSgpKSB7XG4gICAgICAgIHJldHVybiBwcm9jZXNzQ29yZUV2ZW50KHdvcmxkLCBldmVudC52YWwsIGZyb20pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHdvcmxkO1xuICAgICAgfVxuICAgIH1cbiAgKSxcblxuICBuZXcgQ29tbWFuZDx7IGFkZHJlc3M6IEFkZHJlc3NWOyBhbW91bnQ6IE51bWJlclYgfT4oXG4gICAgYFxuICAgICAgIyMjIyBTZW5kXG5cbiAgICAgICogXCJTZW5kIDxBZGRyZXNzPiA8QW1vdW50PlwiIC0gU2VuZHMgYSBnaXZlbiBhbW91bnQgb2YgZXRoIHRvIGdpdmVuIGFkZHJlc3NcbiAgICAgICAgKiBFLmcuIFwiU2VuZCBjRVRIIDAuNWUxOFwiXG4gICAgYCxcbiAgICAnU2VuZCcsXG4gICAgW25ldyBBcmcoJ2FkZHJlc3MnLCBnZXRBZGRyZXNzViksIG5ldyBBcmcoJ2Ftb3VudCcsIGdldE51bWJlclYpXSxcbiAgICAod29ybGQsIGZyb20sIHsgYWRkcmVzcywgYW1vdW50IH0pID0+IHNlbmRFdGhlcih3b3JsZCwgZnJvbSwgYWRkcmVzcy52YWwsIGFtb3VudC5lbmNvZGUoKSlcbiAgKSxcblxuICBuZXcgQ29tbWFuZDx7IGV2ZW50OiBFdmVudFYgfT4oXG4gICAgYFxuICAgICAgIyMjIyBVbml0cm9sbGVyXG5cbiAgICAgICogXCJVbml0cm9sbGVyIC4uLmV2ZW50XCIgLSBSdW5zIGdpdmVuIFVuaXRyb2xsZXIgZXZlbnRcbiAgICAgICAgKiBFLmcuIFwiVW5pdHJvbGxlciBTZXRQZW5kaW5nSW1wbCBNeUNvbXB0cm9sbGVySW1wbFwiXG4gICAgYCxcbiAgICAnVW5pdHJvbGxlcicsXG4gICAgW25ldyBBcmcoJ2V2ZW50JywgZ2V0RXZlbnRWLCB7IHZhcmlhZGljOiB0cnVlIH0pXSxcbiAgICAod29ybGQsIGZyb20sIHsgZXZlbnQgfSkgPT4gcHJvY2Vzc1VuaXRyb2xsZXJFdmVudCh3b3JsZCwgZXZlbnQudmFsLCBmcm9tKSxcbiAgICB7IHN1YkV4cHJlc3Npb25zOiB1bml0cm9sbGVyQ29tbWFuZHMoKSB9XG4gICksXG5cbiAgbmV3IENvbW1hbmQ8eyBldmVudDogRXZlbnRWIH0+KFxuICAgIGBcbiAgICAgICMjIyMgQ29tcHRyb2xsZXJcblxuICAgICAgKiBcIkNvbXB0cm9sbGVyIC4uLmV2ZW50XCIgLSBSdW5zIGdpdmVuIENvbXB0cm9sbGVyIGV2ZW50XG4gICAgICAgICogRS5nLiBcIkNvbXB0cm9sbGVyIF9zZXRSZXNlcnZlRmFjdG9yIDAuNVwiXG4gICAgYCxcbiAgICAnQ29tcHRyb2xsZXInLFxuICAgIFtuZXcgQXJnKCdldmVudCcsIGdldEV2ZW50ViwgeyB2YXJpYWRpYzogdHJ1ZSB9KV0sXG4gICAgKHdvcmxkLCBmcm9tLCB7IGV2ZW50IH0pID0+IHByb2Nlc3NDb21wdHJvbGxlckV2ZW50KHdvcmxkLCBldmVudC52YWwsIGZyb20pLFxuICAgIHsgc3ViRXhwcmVzc2lvbnM6IGNvbXB0cm9sbGVyQ29tbWFuZHMoKSB9XG4gICksXG5cbiAgbmV3IENvbW1hbmQ8eyBldmVudDogRXZlbnRWIH0+KFxuICAgIGBcbiAgICAgICMjIyMgQ29tcHRyb2xsZXJJbXBsXG5cbiAgICAgICogXCJDb21wdHJvbGxlckltcGwgLi4uZXZlbnRcIiAtIFJ1bnMgZ2l2ZW4gQ29tcHRyb2xsZXJJbXBsIGV2ZW50XG4gICAgICAgICogRS5nLiBcIkNvbXB0cm9sbGVySW1wbCBNeUltcGwgQmVjb21lXCJcbiAgICBgLFxuICAgICdDb21wdHJvbGxlckltcGwnLFxuICAgIFtuZXcgQXJnKCdldmVudCcsIGdldEV2ZW50ViwgeyB2YXJpYWRpYzogdHJ1ZSB9KV0sXG4gICAgKHdvcmxkLCBmcm9tLCB7IGV2ZW50IH0pID0+IHByb2Nlc3NDb21wdHJvbGxlckltcGxFdmVudCh3b3JsZCwgZXZlbnQudmFsLCBmcm9tKSxcbiAgICB7IHN1YkV4cHJlc3Npb25zOiBjb21wdHJvbGxlckltcGxDb21tYW5kcygpIH1cbiAgKSxcblxuICBuZXcgQ29tbWFuZDx7IGV2ZW50OiBFdmVudFYgfT4oXG4gICAgYFxuICAgICAgIyMjIyBDVG9rZW5cblxuICAgICAgKiBcIkNUb2tlbiAuLi5ldmVudFwiIC0gUnVucyBnaXZlbiBDVG9rZW4gZXZlbnRcbiAgICAgICAgKiBFLmcuIFwiQ1Rva2VuIGNaUlggTWludCA1ZTE4XCJcbiAgICBgLFxuICAgICdDVG9rZW4nLFxuICAgIFtuZXcgQXJnKCdldmVudCcsIGdldEV2ZW50ViwgeyB2YXJpYWRpYzogdHJ1ZSB9KV0sXG4gICAgKHdvcmxkLCBmcm9tLCB7IGV2ZW50IH0pID0+IHByb2Nlc3NDVG9rZW5FdmVudCh3b3JsZCwgZXZlbnQudmFsLCBmcm9tKSxcbiAgICB7IHN1YkV4cHJlc3Npb25zOiBjVG9rZW5Db21tYW5kcygpIH1cbiAgKSxcblxuICBuZXcgQ29tbWFuZDx7IGV2ZW50OiBFdmVudFYgfT4oXG4gICAgYFxuICAgICAgIyMjIyBDVG9rZW5EZWxlZ2F0ZVxuXG4gICAgICAqIFwiQ1Rva2VuRGVsZWdhdGUgLi4uZXZlbnRcIiAtIFJ1bnMgZ2l2ZW4gQ1Rva2VuRGVsZWdhdGUgZXZlbnRcbiAgICAgICAgKiBFLmcuIFwiQ1Rva2VuRGVsZWdhdGUgRGVwbG95IENEYWlEZWxlZ2F0ZSBjRGFpRGVsZWdhdGVcIlxuICAgIGAsXG4gICAgJ0NUb2tlbkRlbGVnYXRlJyxcbiAgICBbbmV3IEFyZygnZXZlbnQnLCBnZXRFdmVudFYsIHsgdmFyaWFkaWM6IHRydWUgfSldLFxuICAgICh3b3JsZCwgZnJvbSwgeyBldmVudCB9KSA9PiBwcm9jZXNzQ1Rva2VuRGVsZWdhdGVFdmVudCh3b3JsZCwgZXZlbnQudmFsLCBmcm9tKSxcbiAgICB7IHN1YkV4cHJlc3Npb25zOiBjVG9rZW5EZWxlZ2F0ZUNvbW1hbmRzKCkgfVxuICApLFxuXG4gIG5ldyBDb21tYW5kPHsgZXZlbnQ6IEV2ZW50ViB9PihcbiAgICBgXG4gICAgICAjIyMjIEVyYzIwXG5cbiAgICAgICogXCJFcmMyMCAuLi5ldmVudFwiIC0gUnVucyBnaXZlbiBFcmMyMCBldmVudFxuICAgICAgICAqIEUuZy4gXCJFcmMyMCBaUlggRmFjdWV0IEdlb2ZmIDVlMThcIlxuICAgIGAsXG4gICAgJ0VyYzIwJyxcbiAgICBbbmV3IEFyZygnZXZlbnQnLCBnZXRFdmVudFYsIHsgdmFyaWFkaWM6IHRydWUgfSldLFxuICAgICh3b3JsZCwgZnJvbSwgeyBldmVudCB9KSA9PiBwcm9jZXNzRXJjMjBFdmVudCh3b3JsZCwgZXZlbnQudmFsLCBmcm9tKSxcbiAgICB7IHN1YkV4cHJlc3Npb25zOiBlcmMyMENvbW1hbmRzKCkgfVxuICApLFxuXG4gIG5ldyBDb21tYW5kPHsgZXZlbnQ6IEV2ZW50ViB9PihcbiAgICBgXG4gICAgICAjIyMjIEludGVyZXN0UmF0ZU1vZGVsXG5cbiAgICAgICogXCJJbnRlcmVzdFJhdGVNb2RlbCAuLi5ldmVudFwiIC0gUnVucyBnaXZlbiBpbnRlcmVzdCByYXRlIG1vZGVsIGV2ZW50XG4gICAgICAgICogRS5nLiBcIkludGVyZXN0UmF0ZU1vZGVsIERlcGxveSBGaXhlZCBTdGRSYXRlIDAuNVwiXG4gICAgYCxcbiAgICAnSW50ZXJlc3RSYXRlTW9kZWwnLFxuICAgIFtuZXcgQXJnKCdldmVudCcsIGdldEV2ZW50ViwgeyB2YXJpYWRpYzogdHJ1ZSB9KV0sXG4gICAgKHdvcmxkLCBmcm9tLCB7IGV2ZW50IH0pID0+IHByb2Nlc3NJbnRlcmVzdFJhdGVNb2RlbEV2ZW50KHdvcmxkLCBldmVudC52YWwsIGZyb20pLFxuICAgIHsgc3ViRXhwcmVzc2lvbnM6IGludGVyZXN0UmF0ZU1vZGVsQ29tbWFuZHMoKSB9XG4gICksXG5cbiAgbmV3IENvbW1hbmQ8eyBldmVudDogRXZlbnRWIH0+KFxuICAgIGBcbiAgICAgICMjIyMgUHJpY2VPcmFjbGVcblxuICAgICAgKiBcIlByaWNlT3JhY2xlIC4uLmV2ZW50XCIgLSBSdW5zIGdpdmVuIFByaWNlIE9yYWNsZSBldmVudFxuICAgICAgICAqIEUuZy4gXCJQcmljZU9yYWNsZSBTZXRQcmljZSBjWlJYIDEuNVwiXG4gICAgYCxcbiAgICAnUHJpY2VPcmFjbGUnLFxuICAgIFtuZXcgQXJnKCdldmVudCcsIGdldEV2ZW50ViwgeyB2YXJpYWRpYzogdHJ1ZSB9KV0sXG4gICAgKHdvcmxkLCBmcm9tLCB7IGV2ZW50IH0pID0+IHByb2Nlc3NQcmljZU9yYWNsZUV2ZW50KHdvcmxkLCBldmVudC52YWwsIGZyb20pLFxuICAgIHsgc3ViRXhwcmVzc2lvbnM6IHByaWNlT3JhY2xlQ29tbWFuZHMoKSB9XG4gICksXG5cbiAgbmV3IENvbW1hbmQ8eyBldmVudDogRXZlbnRWIH0+KFxuICAgIGBcbiAgICAgICMjIyMgUHJpY2VPcmFjbGVQcm94eVxuXG4gICAgICAqIFwiUHJpY2VPcmFjbGVQcm94eSAuLi5ldmVudFwiIC0gUnVucyBnaXZlbiBQcmljZSBPcmFjbGUgZXZlbnRcbiAgICAgICogRS5nLiBcIlByaWNlT3JhY2xlUHJveHkgRGVwbG95IChVbml0cm9sbGVyIEFkZHJlc3MpIChQcmljZU9yYWNsZSBBZGRyZXNzKSAoQ1Rva2VuIGNFVEggQWRkcmVzcylcIlxuICAgIGAsXG4gICAgJ1ByaWNlT3JhY2xlUHJveHknLFxuICAgIFtuZXcgQXJnKCdldmVudCcsIGdldEV2ZW50ViwgeyB2YXJpYWRpYzogdHJ1ZSB9KV0sXG4gICAgKHdvcmxkLCBmcm9tLCB7IGV2ZW50IH0pID0+IHtcbiAgICAgIHJldHVybiBwcm9jZXNzUHJpY2VPcmFjbGVQcm94eUV2ZW50KHdvcmxkLCBldmVudC52YWwsIGZyb20pO1xuICAgIH0sXG4gICAgeyBzdWJFeHByZXNzaW9uczogcHJpY2VPcmFjbGVQcm94eUNvbW1hbmRzKCkgfVxuICApLFxuXG4gIG5ldyBDb21tYW5kPHsgZXZlbnQ6IEV2ZW50ViB9PihcbiAgICBgXG4gICAgICAjIyMjIENvbXBcblxuICAgICAgKiBcIkNvbXAgLi4uZXZlbnRcIiAtIFJ1bnMgZ2l2ZW4gY29tcCBldmVudFxuICAgICAgKiBFLmcuIFwiQ29tcCBEZXBsb3lcIlxuICAgIGAsXG4gICAgJ0NvbXAnLFxuICAgIFtuZXcgQXJnKCdldmVudCcsIGdldEV2ZW50ViwgeyB2YXJpYWRpYzogdHJ1ZSB9KV0sXG4gICAgKHdvcmxkLCBmcm9tLCB7IGV2ZW50IH0pID0+IHtcbiAgICAgIHJldHVybiBwcm9jZXNzQ29tcEV2ZW50KHdvcmxkLCBldmVudC52YWwsIGZyb20pO1xuICAgIH0sXG4gICAgeyBzdWJFeHByZXNzaW9uczogY29tcENvbW1hbmRzKCkgfVxuICApLFxuXG4gIGJ1aWxkQ29udHJhY3RFdmVudDxDb3VudGVyPihcIkNvdW50ZXJcIiwgZmFsc2UpLFxuICBidWlsZENvbnRyYWN0RXZlbnQ8Q29tcG91bmRMZW5zPihcIkNvbXBvdW5kTGVuc1wiLCBmYWxzZSksXG5cbiAgbmV3IFZpZXc8eyBldmVudDogRXZlbnRWIH0+KFxuICAgIGBcbiAgICAgICMjIyMgSGVscFxuXG4gICAgICAqIFwiSGVscCAuLi5ldmVudFwiIC0gUHJpbnRzIGhlbHAgZm9yIGdpdmVuIGNvbW1hbmRcbiAgICAgICogRS5nLiBcIkhlbHAgRnJvbVwiXG4gICAgYCxcbiAgICAnSGVscCcsXG4gICAgW25ldyBBcmcoJ2V2ZW50JywgZ2V0RXZlbnRWLCB7IHZhcmlhZGljOiB0cnVlIH0pXSxcbiAgICBhc3luYyAod29ybGQsIHsgZXZlbnQgfSkgPT4ge1xuICAgICAgd29ybGQucHJpbnRlci5wcmludExpbmUoJycpO1xuICAgICAgbGV0IHsgY29tbWFuZHMgfSA9IGF3YWl0IGdldENvbW1hbmRzKHdvcmxkKTtcbiAgICAgIHByaW50SGVscCh3b3JsZC5wcmludGVyLCBldmVudC52YWwsIGNvbW1hbmRzKTtcblxuICAgICAgcmV0dXJuIHdvcmxkO1xuICAgIH1cbiAgKVxuXTtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0Q29tbWFuZHMod29ybGQ6IFdvcmxkKSB7XG4gIGlmICh3b3JsZC5jb21tYW5kcykge1xuICAgIHJldHVybiB7IHdvcmxkLCBjb21tYW5kczogd29ybGQuY29tbWFuZHMgfTtcbiAgfVxuXG4gIGxldCBhbGxDb21tYW5kcyA9IGF3YWl0IFByb21pc2UuYWxsKGNvbW1hbmRzLm1hcCgoY29tbWFuZCkgPT4ge1xuICAgIGlmICh0eXBlb2YgKGNvbW1hbmQpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gY29tbWFuZCh3b3JsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoY29tbWFuZCk7XG4gICAgfVxuICB9KSk7XG5cbiAgcmV0dXJuIHsgd29ybGQ6IHdvcmxkLnNldCgnY29tbWFuZHMnLCBhbGxDb21tYW5kcyksIGNvbW1hbmRzOiBhbGxDb21tYW5kcyB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJvY2Vzc0NvcmVFdmVudCh3b3JsZDogV29ybGQsIGV2ZW50OiBFdmVudCwgZnJvbTogc3RyaW5nIHwgbnVsbCk6IFByb21pc2U8V29ybGQ+IHtcbiAgbGV0IHsgd29ybGQ6IG5leHRXb3JsZCwgY29tbWFuZHMgfSA9IGF3YWl0IGdldENvbW1hbmRzKHdvcmxkKTtcbiAgcmV0dXJuIGF3YWl0IHByb2Nlc3NDb21tYW5kRXZlbnQ8YW55PignQ29yZScsIGNvbW1hbmRzLCBuZXh0V29ybGQsIGV2ZW50LCBmcm9tKTtcbn1cbiJdfQ==
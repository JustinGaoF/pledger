"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComptrollerImplValue = exports.comptrollerImplFetchers = exports.getComptrollerImplAddress = void 0;
const Value_1 = require("../Value");
const Command_1 = require("../Command");
const ContractLookup_1 = require("../ContractLookup");
async function getComptrollerImplAddress(world, comptrollerImpl) {
    return new Value_1.AddressV(comptrollerImpl._address);
}
exports.getComptrollerImplAddress = getComptrollerImplAddress;
function comptrollerImplFetchers() {
    return [
        new Command_1.Fetcher(`
        #### Address

        * "ComptrollerImpl Address" - Returns address of comptroller implementation
      `, "Address", [new Command_1.Arg("comptrollerImpl", ContractLookup_1.getComptrollerImpl)], (world, { comptrollerImpl }) => getComptrollerImplAddress(world, comptrollerImpl), { namePos: 1 })
    ];
}
exports.comptrollerImplFetchers = comptrollerImplFetchers;
async function getComptrollerImplValue(world, event) {
    return await Command_1.getFetcherValue("ComptrollerImpl", comptrollerImplFetchers(), world, event);
}
exports.getComptrollerImplValue = getComptrollerImplValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcHRyb2xsZXJJbXBsVmFsdWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvVmFsdWUvQ29tcHRyb2xsZXJJbXBsVmFsdWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBTUEsb0NBR2tCO0FBQ2xCLHdDQUF5RDtBQUN6RCxzREFBcUQ7QUFFOUMsS0FBSyxVQUFVLHlCQUF5QixDQUFDLEtBQVksRUFBRSxlQUFnQztJQUM1RixPQUFPLElBQUksZ0JBQVEsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQUZELDhEQUVDO0FBRUQsU0FBZ0IsdUJBQXVCO0lBQ3JDLE9BQU87UUFDTCxJQUFJLGlCQUFPLENBQStDOzs7O09BSXZELEVBQ0QsU0FBUyxFQUNULENBQUMsSUFBSSxhQUFHLENBQUMsaUJBQWlCLEVBQUUsbUNBQWtCLENBQUMsQ0FBQyxFQUNoRCxDQUFDLEtBQUssRUFBRSxFQUFDLGVBQWUsRUFBQyxFQUFFLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLEVBQUUsZUFBZSxDQUFDLEVBQy9FLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUNiO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFiRCwwREFhQztBQUVNLEtBQUssVUFBVSx1QkFBdUIsQ0FBQyxLQUFZLEVBQUUsS0FBWTtJQUN0RSxPQUFPLE1BQU0seUJBQWUsQ0FBVyxpQkFBaUIsRUFBRSx1QkFBdUIsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNyRyxDQUFDO0FBRkQsMERBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0V2ZW50fSBmcm9tICcuLi9FdmVudCc7XG5pbXBvcnQge1dvcmxkfSBmcm9tICcuLi9Xb3JsZCc7XG5pbXBvcnQge0NvbXB0cm9sbGVySW1wbH0gZnJvbSAnLi4vQ29udHJhY3QvQ29tcHRyb2xsZXJJbXBsJztcbmltcG9ydCB7XG4gIGdldEFkZHJlc3NWXG59IGZyb20gJy4uL0NvcmVWYWx1ZSc7XG5pbXBvcnQge1xuICBBZGRyZXNzVixcbiAgVmFsdWVcbn0gZnJvbSAnLi4vVmFsdWUnO1xuaW1wb3J0IHtBcmcsIEZldGNoZXIsIGdldEZldGNoZXJWYWx1ZX0gZnJvbSAnLi4vQ29tbWFuZCc7XG5pbXBvcnQge2dldENvbXB0cm9sbGVySW1wbH0gZnJvbSAnLi4vQ29udHJhY3RMb29rdXAnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q29tcHRyb2xsZXJJbXBsQWRkcmVzcyh3b3JsZDogV29ybGQsIGNvbXB0cm9sbGVySW1wbDogQ29tcHRyb2xsZXJJbXBsKTogUHJvbWlzZTxBZGRyZXNzVj4ge1xuICByZXR1cm4gbmV3IEFkZHJlc3NWKGNvbXB0cm9sbGVySW1wbC5fYWRkcmVzcyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wdHJvbGxlckltcGxGZXRjaGVycygpIHtcbiAgcmV0dXJuIFtcbiAgICBuZXcgRmV0Y2hlcjx7Y29tcHRyb2xsZXJJbXBsOiBDb21wdHJvbGxlckltcGx9LCBBZGRyZXNzVj4oYFxuICAgICAgICAjIyMjIEFkZHJlc3NcblxuICAgICAgICAqIFwiQ29tcHRyb2xsZXJJbXBsIEFkZHJlc3NcIiAtIFJldHVybnMgYWRkcmVzcyBvZiBjb21wdHJvbGxlciBpbXBsZW1lbnRhdGlvblxuICAgICAgYCxcbiAgICAgIFwiQWRkcmVzc1wiLFxuICAgICAgW25ldyBBcmcoXCJjb21wdHJvbGxlckltcGxcIiwgZ2V0Q29tcHRyb2xsZXJJbXBsKV0sXG4gICAgICAod29ybGQsIHtjb21wdHJvbGxlckltcGx9KSA9PiBnZXRDb21wdHJvbGxlckltcGxBZGRyZXNzKHdvcmxkLCBjb21wdHJvbGxlckltcGwpLFxuICAgICAge25hbWVQb3M6IDF9XG4gICAgKVxuICBdO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q29tcHRyb2xsZXJJbXBsVmFsdWUod29ybGQ6IFdvcmxkLCBldmVudDogRXZlbnQpOiBQcm9taXNlPFZhbHVlPiB7XG4gIHJldHVybiBhd2FpdCBnZXRGZXRjaGVyVmFsdWU8YW55LCBhbnk+KFwiQ29tcHRyb2xsZXJJbXBsXCIsIGNvbXB0cm9sbGVySW1wbEZldGNoZXJzKCksIHdvcmxkLCBldmVudCk7XG59XG4iXX0=
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenErr = exports.ComptrollerErr = void 0;
const ComptrollerErrorReporter = {
    Error: [
        'NO_ERROR',
        'UNAUTHORIZED',
        'COMPTROLLER_MISMATCH',
        'INSUFFICIENT_SHORTFALL',
        'INSUFFICIENT_LIQUIDITY',
        'INVALID_CLOSE_FACTOR',
        'INVALID_COLLATERAL_FACTOR',
        'INVALID_LIQUIDATION_INCENTIVE',
        'MARKET_NOT_ENTERED',
        'MARKET_NOT_LISTED',
        'MARKET_ALREADY_LISTED',
        'MATH_ERROR',
        'NONZERO_BORROW_BALANCE',
        'PRICE_ERROR',
        'REJECTION',
        'SNAPSHOT_ERROR',
        'TOO_MANY_ASSETS',
        'TOO_MUCH_REPAY'
    ],
    FailureInfo: [
        'ACCEPT_ADMIN_PENDING_ADMIN_CHECK',
        'ACCEPT_PENDING_IMPLEMENTATION_ADDRESS_CHECK',
        'EXIT_MARKET_BALANCE_OWED',
        'EXIT_MARKET_REJECTION',
        'SET_CLOSE_FACTOR_OWNER_CHECK',
        'SET_CLOSE_FACTOR_VALIDATION',
        'SET_COLLATERAL_FACTOR_OWNER_CHECK',
        'SET_COLLATERAL_FACTOR_NO_EXISTS',
        'SET_COLLATERAL_FACTOR_VALIDATION',
        'SET_COLLATERAL_FACTOR_WITHOUT_PRICE',
        'SET_IMPLEMENTATION_OWNER_CHECK',
        'SET_LIQUIDATION_INCENTIVE_OWNER_CHECK',
        'SET_LIQUIDATION_INCENTIVE_VALIDATION',
        'SET_MAX_ASSETS_OWNER_CHECK',
        'SET_PENDING_ADMIN_OWNER_CHECK',
        'SET_PENDING_IMPLEMENTATION_OWNER_CHECK',
        'SET_PRICE_ORACLE_OWNER_CHECK',
        'SUPPORT_MARKET_EXISTS',
        'SUPPORT_MARKET_OWNER_CHECK',
        'SET_PAUSE_GUARDIAN_OWNER_CHECK',
    ]
};
const TokenErrorReporter = {
    Error: [
        'NO_ERROR',
        'UNAUTHORIZED',
        'BAD_INPUT',
        'COMPTROLLER_REJECTION',
        'COMPTROLLER_CALCULATION_ERROR',
        'INTEREST_RATE_MODEL_ERROR',
        'INVALID_ACCOUNT_PAIR',
        'INVALID_CLOSE_AMOUNT_REQUESTED',
        'INVALID_COLLATERAL_FACTOR',
        'MATH_ERROR',
        'MARKET_NOT_FRESH',
        'MARKET_NOT_LISTED',
        'TOKEN_INSUFFICIENT_ALLOWANCE',
        'TOKEN_INSUFFICIENT_BALANCE',
        'TOKEN_INSUFFICIENT_CASH',
        'TOKEN_TRANSFER_IN_FAILED',
        'TOKEN_TRANSFER_OUT_FAILED'
    ],
    FailureInfo: [
        'ACCEPT_ADMIN_PENDING_ADMIN_CHECK',
        'ACCRUE_INTEREST_BORROW_RATE_CALCULATION_FAILED',
        'BORROW_ACCRUE_INTEREST_FAILED',
        'BORROW_CASH_NOT_AVAILABLE',
        'BORROW_FRESHNESS_CHECK',
        'BORROW_MARKET_NOT_LISTED',
        'BORROW_COMPTROLLER_REJECTION',
        'LIQUIDATE_ACCRUE_BORROW_INTEREST_FAILED',
        'LIQUIDATE_ACCRUE_COLLATERAL_INTEREST_FAILED',
        'LIQUIDATE_COLLATERAL_FRESHNESS_CHECK',
        'LIQUIDATE_COMPTROLLER_REJECTION',
        'LIQUIDATE_COMPTROLLER_CALCULATE_AMOUNT_SEIZE_FAILED',
        'LIQUIDATE_CLOSE_AMOUNT_IS_UINT_MAX',
        'LIQUIDATE_CLOSE_AMOUNT_IS_ZERO',
        'LIQUIDATE_FRESHNESS_CHECK',
        'LIQUIDATE_LIQUIDATOR_IS_BORROWER',
        'LIQUIDATE_REPAY_BORROW_FRESH_FAILED',
        'LIQUIDATE_SEIZE_COMPTROLLER_REJECTION',
        'LIQUIDATE_SEIZE_LIQUIDATOR_IS_BORROWER',
        'LIQUIDATE_SEIZE_TOO_MUCH',
        'MINT_ACCRUE_INTEREST_FAILED',
        'MINT_COMPTROLLER_REJECTION',
        'MINT_FRESHNESS_CHECK',
        'MINT_TRANSFER_IN_FAILED',
        'MINT_TRANSFER_IN_NOT_POSSIBLE',
        'REDEEM_ACCRUE_INTEREST_FAILED',
        'REDEEM_COMPTROLLER_REJECTION',
        'REDEEM_FRESHNESS_CHECK',
        'REDEEM_TRANSFER_OUT_NOT_POSSIBLE',
        'REDUCE_RESERVES_ACCRUE_INTEREST_FAILED',
        'REDUCE_RESERVES_ADMIN_CHECK',
        'REDUCE_RESERVES_CASH_NOT_AVAILABLE',
        'REDUCE_RESERVES_FRESH_CHECK',
        'REDUCE_RESERVES_VALIDATION',
        'REPAY_BEHALF_ACCRUE_INTEREST_FAILED',
        'REPAY_BORROW_ACCRUE_INTEREST_FAILED',
        'REPAY_BORROW_COMPTROLLER_REJECTION',
        'REPAY_BORROW_FRESHNESS_CHECK',
        'REPAY_BORROW_TRANSFER_IN_NOT_POSSIBLE',
        'SET_COLLATERAL_FACTOR_OWNER_CHECK',
        'SET_COLLATERAL_FACTOR_VALIDATION',
        'SET_COMPTROLLER_OWNER_CHECK',
        'SET_INTEREST_RATE_MODEL_ACCRUE_INTEREST_FAILED',
        'SET_INTEREST_RATE_MODEL_FRESH_CHECK',
        'SET_INTEREST_RATE_MODEL_OWNER_CHECK',
        'SET_MAX_ASSETS_OWNER_CHECK',
        'SET_ORACLE_MARKET_NOT_LISTED',
        'SET_PENDING_ADMIN_OWNER_CHECK',
        'SET_RESERVE_FACTOR_ACCRUE_INTEREST_FAILED',
        'SET_RESERVE_FACTOR_ADMIN_CHECK',
        'SET_RESERVE_FACTOR_FRESH_CHECK',
        'SET_RESERVE_FACTOR_BOUNDS_CHECK',
        'TRANSFER_COMPTROLLER_REJECTION',
        'TRANSFER_NOT_ALLOWED',
        'ADD_RESERVES_ACCRUE_INTEREST_FAILED',
        'ADD_RESERVES_FRESH_CHECK',
        'ADD_RESERVES_TRANSFER_IN_NOT_POSSIBLE'
    ]
};
function parseEnum(reporterEnum) {
    const Error = {};
    const ErrorInv = {};
    const FailureInfo = {};
    const FailureInfoInv = {};
    reporterEnum.Error.forEach((entry, i) => {
        Error[entry] = i;
        ErrorInv[i] = entry;
    });
    reporterEnum.FailureInfo.forEach((entry, i) => {
        FailureInfo[entry] = i;
        FailureInfoInv[i] = entry;
    });
    return { Error, ErrorInv, FailureInfo, FailureInfoInv };
}
exports.ComptrollerErr = parseEnum(ComptrollerErrorReporter);
exports.TokenErr = parseEnum(TokenErrorReporter);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXJyb3JSZXBvcnRlckNvbnN0YW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9FcnJvclJlcG9ydGVyQ29uc3RhbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQWFBLE1BQU0sd0JBQXdCLEdBQUc7SUFDL0IsS0FBSyxFQUFFO1FBQ0wsVUFBVTtRQUNWLGNBQWM7UUFDZCxzQkFBc0I7UUFDdEIsd0JBQXdCO1FBQ3hCLHdCQUF3QjtRQUN4QixzQkFBc0I7UUFDdEIsMkJBQTJCO1FBQzNCLCtCQUErQjtRQUMvQixvQkFBb0I7UUFDcEIsbUJBQW1CO1FBQ25CLHVCQUF1QjtRQUN2QixZQUFZO1FBQ1osd0JBQXdCO1FBQ3hCLGFBQWE7UUFDYixXQUFXO1FBQ1gsZ0JBQWdCO1FBQ2hCLGlCQUFpQjtRQUNqQixnQkFBZ0I7S0FDakI7SUFFRCxXQUFXLEVBQUU7UUFDWCxrQ0FBa0M7UUFDbEMsNkNBQTZDO1FBQzdDLDBCQUEwQjtRQUMxQix1QkFBdUI7UUFDdkIsOEJBQThCO1FBQzlCLDZCQUE2QjtRQUM3QixtQ0FBbUM7UUFDbkMsaUNBQWlDO1FBQ2pDLGtDQUFrQztRQUNsQyxxQ0FBcUM7UUFDckMsZ0NBQWdDO1FBQ2hDLHVDQUF1QztRQUN2QyxzQ0FBc0M7UUFDdEMsNEJBQTRCO1FBQzVCLCtCQUErQjtRQUMvQix3Q0FBd0M7UUFDeEMsOEJBQThCO1FBQzlCLHVCQUF1QjtRQUN2Qiw0QkFBNEI7UUFDNUIsZ0NBQWdDO0tBQ2pDO0NBQ0YsQ0FBQztBQUVGLE1BQU0sa0JBQWtCLEdBQUc7SUFDekIsS0FBSyxFQUFFO1FBQ0wsVUFBVTtRQUNWLGNBQWM7UUFDZCxXQUFXO1FBQ1gsdUJBQXVCO1FBQ3ZCLCtCQUErQjtRQUMvQiwyQkFBMkI7UUFDM0Isc0JBQXNCO1FBQ3RCLGdDQUFnQztRQUNoQywyQkFBMkI7UUFDM0IsWUFBWTtRQUNaLGtCQUFrQjtRQUNsQixtQkFBbUI7UUFDbkIsOEJBQThCO1FBQzlCLDRCQUE0QjtRQUM1Qix5QkFBeUI7UUFDekIsMEJBQTBCO1FBQzFCLDJCQUEyQjtLQUM1QjtJQUVELFdBQVcsRUFBRTtRQUNYLGtDQUFrQztRQUNsQyxnREFBZ0Q7UUFDaEQsK0JBQStCO1FBQy9CLDJCQUEyQjtRQUMzQix3QkFBd0I7UUFDeEIsMEJBQTBCO1FBQzFCLDhCQUE4QjtRQUM5Qix5Q0FBeUM7UUFDekMsNkNBQTZDO1FBQzdDLHNDQUFzQztRQUN0QyxpQ0FBaUM7UUFDakMscURBQXFEO1FBQ3JELG9DQUFvQztRQUNwQyxnQ0FBZ0M7UUFDaEMsMkJBQTJCO1FBQzNCLGtDQUFrQztRQUNsQyxxQ0FBcUM7UUFDckMsdUNBQXVDO1FBQ3ZDLHdDQUF3QztRQUN4QywwQkFBMEI7UUFDMUIsNkJBQTZCO1FBQzdCLDRCQUE0QjtRQUM1QixzQkFBc0I7UUFDdEIseUJBQXlCO1FBQ3pCLCtCQUErQjtRQUMvQiwrQkFBK0I7UUFDL0IsOEJBQThCO1FBQzlCLHdCQUF3QjtRQUN4QixrQ0FBa0M7UUFDbEMsd0NBQXdDO1FBQ3hDLDZCQUE2QjtRQUM3QixvQ0FBb0M7UUFDcEMsNkJBQTZCO1FBQzdCLDRCQUE0QjtRQUM1QixxQ0FBcUM7UUFDckMscUNBQXFDO1FBQ3JDLG9DQUFvQztRQUNwQyw4QkFBOEI7UUFDOUIsdUNBQXVDO1FBQ3ZDLG1DQUFtQztRQUNuQyxrQ0FBa0M7UUFDbEMsNkJBQTZCO1FBQzdCLGdEQUFnRDtRQUNoRCxxQ0FBcUM7UUFDckMscUNBQXFDO1FBQ3JDLDRCQUE0QjtRQUM1Qiw4QkFBOEI7UUFDOUIsK0JBQStCO1FBQy9CLDJDQUEyQztRQUMzQyxnQ0FBZ0M7UUFDaEMsZ0NBQWdDO1FBQ2hDLGlDQUFpQztRQUNqQyxnQ0FBZ0M7UUFDaEMsc0JBQXNCO1FBQ3RCLHFDQUFxQztRQUNyQywwQkFBMEI7UUFDMUIsdUNBQXVDO0tBQ3hDO0NBQ0YsQ0FBQztBQUVGLFNBQVMsU0FBUyxDQUFDLFlBQStCO0lBQ2hELE1BQU0sS0FBSyxHQUE2QixFQUFFLENBQUM7SUFDM0MsTUFBTSxRQUFRLEdBQTZCLEVBQUUsQ0FBQztJQUM5QyxNQUFNLFdBQVcsR0FBNkIsRUFBRSxDQUFDO0lBQ2pELE1BQU0sY0FBYyxHQUE2QixFQUFFLENBQUM7SUFFcEQsWUFBWSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBRUgsWUFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDNUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QixjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQzVCLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBQyxDQUFDO0FBQ3hELENBQUM7QUFFWSxRQUFBLGNBQWMsR0FBRyxTQUFTLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNyRCxRQUFBLFFBQVEsR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW50ZXJmYWNlIEVycm9yUmVwb3J0ZXJFbnVtIHtcbiAgRXJyb3I6IHN0cmluZ1tdXG4gIEZhaWx1cmVJbmZvOiBzdHJpbmdbXVxufVxuXG5pbnRlcmZhY2UgRXJyb3JUeXBlcyB7XG4gIEVycm9yOiB7W25hbWU6IHN0cmluZ106IG51bWJlcn1cbiAgRmFpbHVyZUluZm86IHtbbmFtZTogc3RyaW5nXTogbnVtYmVyfVxuICBFcnJvckludjoge1tjb2RlOiBudW1iZXJdOiBzdHJpbmd9XG4gIEZhaWx1cmVJbmZvSW52OiB7W2NvZGU6IG51bWJlcl06IHN0cmluZ31cbn1cblxuY29uc3QgQ29tcHRyb2xsZXJFcnJvclJlcG9ydGVyID0ge1xuICBFcnJvcjogW1xuICAgICdOT19FUlJPUicsXG4gICAgJ1VOQVVUSE9SSVpFRCcsXG4gICAgJ0NPTVBUUk9MTEVSX01JU01BVENIJyxcbiAgICAnSU5TVUZGSUNJRU5UX1NIT1JURkFMTCcsXG4gICAgJ0lOU1VGRklDSUVOVF9MSVFVSURJVFknLFxuICAgICdJTlZBTElEX0NMT1NFX0ZBQ1RPUicsXG4gICAgJ0lOVkFMSURfQ09MTEFURVJBTF9GQUNUT1InLFxuICAgICdJTlZBTElEX0xJUVVJREFUSU9OX0lOQ0VOVElWRScsXG4gICAgJ01BUktFVF9OT1RfRU5URVJFRCcsXG4gICAgJ01BUktFVF9OT1RfTElTVEVEJyxcbiAgICAnTUFSS0VUX0FMUkVBRFlfTElTVEVEJyxcbiAgICAnTUFUSF9FUlJPUicsXG4gICAgJ05PTlpFUk9fQk9SUk9XX0JBTEFOQ0UnLFxuICAgICdQUklDRV9FUlJPUicsXG4gICAgJ1JFSkVDVElPTicsXG4gICAgJ1NOQVBTSE9UX0VSUk9SJyxcbiAgICAnVE9PX01BTllfQVNTRVRTJyxcbiAgICAnVE9PX01VQ0hfUkVQQVknXG4gIF0sXG5cbiAgRmFpbHVyZUluZm86IFtcbiAgICAnQUNDRVBUX0FETUlOX1BFTkRJTkdfQURNSU5fQ0hFQ0snLFxuICAgICdBQ0NFUFRfUEVORElOR19JTVBMRU1FTlRBVElPTl9BRERSRVNTX0NIRUNLJyxcbiAgICAnRVhJVF9NQVJLRVRfQkFMQU5DRV9PV0VEJyxcbiAgICAnRVhJVF9NQVJLRVRfUkVKRUNUSU9OJyxcbiAgICAnU0VUX0NMT1NFX0ZBQ1RPUl9PV05FUl9DSEVDSycsXG4gICAgJ1NFVF9DTE9TRV9GQUNUT1JfVkFMSURBVElPTicsXG4gICAgJ1NFVF9DT0xMQVRFUkFMX0ZBQ1RPUl9PV05FUl9DSEVDSycsXG4gICAgJ1NFVF9DT0xMQVRFUkFMX0ZBQ1RPUl9OT19FWElTVFMnLFxuICAgICdTRVRfQ09MTEFURVJBTF9GQUNUT1JfVkFMSURBVElPTicsXG4gICAgJ1NFVF9DT0xMQVRFUkFMX0ZBQ1RPUl9XSVRIT1VUX1BSSUNFJyxcbiAgICAnU0VUX0lNUExFTUVOVEFUSU9OX09XTkVSX0NIRUNLJyxcbiAgICAnU0VUX0xJUVVJREFUSU9OX0lOQ0VOVElWRV9PV05FUl9DSEVDSycsXG4gICAgJ1NFVF9MSVFVSURBVElPTl9JTkNFTlRJVkVfVkFMSURBVElPTicsXG4gICAgJ1NFVF9NQVhfQVNTRVRTX09XTkVSX0NIRUNLJyxcbiAgICAnU0VUX1BFTkRJTkdfQURNSU5fT1dORVJfQ0hFQ0snLFxuICAgICdTRVRfUEVORElOR19JTVBMRU1FTlRBVElPTl9PV05FUl9DSEVDSycsXG4gICAgJ1NFVF9QUklDRV9PUkFDTEVfT1dORVJfQ0hFQ0snLFxuICAgICdTVVBQT1JUX01BUktFVF9FWElTVFMnLFxuICAgICdTVVBQT1JUX01BUktFVF9PV05FUl9DSEVDSycsXG4gICAgJ1NFVF9QQVVTRV9HVUFSRElBTl9PV05FUl9DSEVDSycsXG4gIF1cbn07XG5cbmNvbnN0IFRva2VuRXJyb3JSZXBvcnRlciA9IHtcbiAgRXJyb3I6IFtcbiAgICAnTk9fRVJST1InLFxuICAgICdVTkFVVEhPUklaRUQnLFxuICAgICdCQURfSU5QVVQnLFxuICAgICdDT01QVFJPTExFUl9SRUpFQ1RJT04nLFxuICAgICdDT01QVFJPTExFUl9DQUxDVUxBVElPTl9FUlJPUicsXG4gICAgJ0lOVEVSRVNUX1JBVEVfTU9ERUxfRVJST1InLFxuICAgICdJTlZBTElEX0FDQ09VTlRfUEFJUicsXG4gICAgJ0lOVkFMSURfQ0xPU0VfQU1PVU5UX1JFUVVFU1RFRCcsXG4gICAgJ0lOVkFMSURfQ09MTEFURVJBTF9GQUNUT1InLFxuICAgICdNQVRIX0VSUk9SJyxcbiAgICAnTUFSS0VUX05PVF9GUkVTSCcsXG4gICAgJ01BUktFVF9OT1RfTElTVEVEJyxcbiAgICAnVE9LRU5fSU5TVUZGSUNJRU5UX0FMTE9XQU5DRScsXG4gICAgJ1RPS0VOX0lOU1VGRklDSUVOVF9CQUxBTkNFJyxcbiAgICAnVE9LRU5fSU5TVUZGSUNJRU5UX0NBU0gnLFxuICAgICdUT0tFTl9UUkFOU0ZFUl9JTl9GQUlMRUQnLFxuICAgICdUT0tFTl9UUkFOU0ZFUl9PVVRfRkFJTEVEJ1xuICBdLFxuXG4gIEZhaWx1cmVJbmZvOiBbXG4gICAgJ0FDQ0VQVF9BRE1JTl9QRU5ESU5HX0FETUlOX0NIRUNLJyxcbiAgICAnQUNDUlVFX0lOVEVSRVNUX0JPUlJPV19SQVRFX0NBTENVTEFUSU9OX0ZBSUxFRCcsXG4gICAgJ0JPUlJPV19BQ0NSVUVfSU5URVJFU1RfRkFJTEVEJyxcbiAgICAnQk9SUk9XX0NBU0hfTk9UX0FWQUlMQUJMRScsXG4gICAgJ0JPUlJPV19GUkVTSE5FU1NfQ0hFQ0snLFxuICAgICdCT1JST1dfTUFSS0VUX05PVF9MSVNURUQnLFxuICAgICdCT1JST1dfQ09NUFRST0xMRVJfUkVKRUNUSU9OJyxcbiAgICAnTElRVUlEQVRFX0FDQ1JVRV9CT1JST1dfSU5URVJFU1RfRkFJTEVEJyxcbiAgICAnTElRVUlEQVRFX0FDQ1JVRV9DT0xMQVRFUkFMX0lOVEVSRVNUX0ZBSUxFRCcsXG4gICAgJ0xJUVVJREFURV9DT0xMQVRFUkFMX0ZSRVNITkVTU19DSEVDSycsXG4gICAgJ0xJUVVJREFURV9DT01QVFJPTExFUl9SRUpFQ1RJT04nLFxuICAgICdMSVFVSURBVEVfQ09NUFRST0xMRVJfQ0FMQ1VMQVRFX0FNT1VOVF9TRUlaRV9GQUlMRUQnLFxuICAgICdMSVFVSURBVEVfQ0xPU0VfQU1PVU5UX0lTX1VJTlRfTUFYJyxcbiAgICAnTElRVUlEQVRFX0NMT1NFX0FNT1VOVF9JU19aRVJPJyxcbiAgICAnTElRVUlEQVRFX0ZSRVNITkVTU19DSEVDSycsXG4gICAgJ0xJUVVJREFURV9MSVFVSURBVE9SX0lTX0JPUlJPV0VSJyxcbiAgICAnTElRVUlEQVRFX1JFUEFZX0JPUlJPV19GUkVTSF9GQUlMRUQnLFxuICAgICdMSVFVSURBVEVfU0VJWkVfQ09NUFRST0xMRVJfUkVKRUNUSU9OJyxcbiAgICAnTElRVUlEQVRFX1NFSVpFX0xJUVVJREFUT1JfSVNfQk9SUk9XRVInLFxuICAgICdMSVFVSURBVEVfU0VJWkVfVE9PX01VQ0gnLFxuICAgICdNSU5UX0FDQ1JVRV9JTlRFUkVTVF9GQUlMRUQnLFxuICAgICdNSU5UX0NPTVBUUk9MTEVSX1JFSkVDVElPTicsXG4gICAgJ01JTlRfRlJFU0hORVNTX0NIRUNLJyxcbiAgICAnTUlOVF9UUkFOU0ZFUl9JTl9GQUlMRUQnLFxuICAgICdNSU5UX1RSQU5TRkVSX0lOX05PVF9QT1NTSUJMRScsXG4gICAgJ1JFREVFTV9BQ0NSVUVfSU5URVJFU1RfRkFJTEVEJyxcbiAgICAnUkVERUVNX0NPTVBUUk9MTEVSX1JFSkVDVElPTicsXG4gICAgJ1JFREVFTV9GUkVTSE5FU1NfQ0hFQ0snLFxuICAgICdSRURFRU1fVFJBTlNGRVJfT1VUX05PVF9QT1NTSUJMRScsXG4gICAgJ1JFRFVDRV9SRVNFUlZFU19BQ0NSVUVfSU5URVJFU1RfRkFJTEVEJyxcbiAgICAnUkVEVUNFX1JFU0VSVkVTX0FETUlOX0NIRUNLJyxcbiAgICAnUkVEVUNFX1JFU0VSVkVTX0NBU0hfTk9UX0FWQUlMQUJMRScsXG4gICAgJ1JFRFVDRV9SRVNFUlZFU19GUkVTSF9DSEVDSycsXG4gICAgJ1JFRFVDRV9SRVNFUlZFU19WQUxJREFUSU9OJyxcbiAgICAnUkVQQVlfQkVIQUxGX0FDQ1JVRV9JTlRFUkVTVF9GQUlMRUQnLFxuICAgICdSRVBBWV9CT1JST1dfQUNDUlVFX0lOVEVSRVNUX0ZBSUxFRCcsXG4gICAgJ1JFUEFZX0JPUlJPV19DT01QVFJPTExFUl9SRUpFQ1RJT04nLFxuICAgICdSRVBBWV9CT1JST1dfRlJFU0hORVNTX0NIRUNLJyxcbiAgICAnUkVQQVlfQk9SUk9XX1RSQU5TRkVSX0lOX05PVF9QT1NTSUJMRScsXG4gICAgJ1NFVF9DT0xMQVRFUkFMX0ZBQ1RPUl9PV05FUl9DSEVDSycsXG4gICAgJ1NFVF9DT0xMQVRFUkFMX0ZBQ1RPUl9WQUxJREFUSU9OJyxcbiAgICAnU0VUX0NPTVBUUk9MTEVSX09XTkVSX0NIRUNLJyxcbiAgICAnU0VUX0lOVEVSRVNUX1JBVEVfTU9ERUxfQUNDUlVFX0lOVEVSRVNUX0ZBSUxFRCcsXG4gICAgJ1NFVF9JTlRFUkVTVF9SQVRFX01PREVMX0ZSRVNIX0NIRUNLJyxcbiAgICAnU0VUX0lOVEVSRVNUX1JBVEVfTU9ERUxfT1dORVJfQ0hFQ0snLFxuICAgICdTRVRfTUFYX0FTU0VUU19PV05FUl9DSEVDSycsXG4gICAgJ1NFVF9PUkFDTEVfTUFSS0VUX05PVF9MSVNURUQnLFxuICAgICdTRVRfUEVORElOR19BRE1JTl9PV05FUl9DSEVDSycsXG4gICAgJ1NFVF9SRVNFUlZFX0ZBQ1RPUl9BQ0NSVUVfSU5URVJFU1RfRkFJTEVEJyxcbiAgICAnU0VUX1JFU0VSVkVfRkFDVE9SX0FETUlOX0NIRUNLJyxcbiAgICAnU0VUX1JFU0VSVkVfRkFDVE9SX0ZSRVNIX0NIRUNLJyxcbiAgICAnU0VUX1JFU0VSVkVfRkFDVE9SX0JPVU5EU19DSEVDSycsXG4gICAgJ1RSQU5TRkVSX0NPTVBUUk9MTEVSX1JFSkVDVElPTicsXG4gICAgJ1RSQU5TRkVSX05PVF9BTExPV0VEJyxcbiAgICAnQUREX1JFU0VSVkVTX0FDQ1JVRV9JTlRFUkVTVF9GQUlMRUQnLFxuICAgICdBRERfUkVTRVJWRVNfRlJFU0hfQ0hFQ0snLFxuICAgICdBRERfUkVTRVJWRVNfVFJBTlNGRVJfSU5fTk9UX1BPU1NJQkxFJ1xuICBdXG59O1xuXG5mdW5jdGlvbiBwYXJzZUVudW0ocmVwb3J0ZXJFbnVtOiBFcnJvclJlcG9ydGVyRW51bSk6IEVycm9yVHlwZXMge1xuICBjb25zdCBFcnJvcjoge1tuYW1lOiBzdHJpbmddOiBudW1iZXJ9ID0ge307XG4gIGNvbnN0IEVycm9ySW52OiB7W2NvZGU6IG51bWJlcl06IHN0cmluZ30gPSB7fTtcbiAgY29uc3QgRmFpbHVyZUluZm86IHtbbmFtZTogc3RyaW5nXTogbnVtYmVyfSA9IHt9O1xuICBjb25zdCBGYWlsdXJlSW5mb0ludjoge1tjb2RlOiBudW1iZXJdOiBzdHJpbmd9ID0ge307XG5cbiAgcmVwb3J0ZXJFbnVtLkVycm9yLmZvckVhY2goKGVudHJ5LCBpKSA9PiB7XG4gICAgRXJyb3JbZW50cnldID0gaTtcbiAgICBFcnJvckludltpXSA9IGVudHJ5O1xuICB9KTtcblxuICByZXBvcnRlckVudW0uRmFpbHVyZUluZm8uZm9yRWFjaCgoZW50cnksIGkpID0+IHtcbiAgICBGYWlsdXJlSW5mb1tlbnRyeV0gPSBpO1xuICAgIEZhaWx1cmVJbmZvSW52W2ldID0gZW50cnk7XG4gIH0pO1xuXG4gIHJldHVybiB7RXJyb3IsIEVycm9ySW52LCBGYWlsdXJlSW5mbywgRmFpbHVyZUluZm9JbnZ9O1xufVxuXG5leHBvcnQgY29uc3QgQ29tcHRyb2xsZXJFcnIgPSBwYXJzZUVudW0oQ29tcHRyb2xsZXJFcnJvclJlcG9ydGVyKTtcbmV4cG9ydCBjb25zdCBUb2tlbkVyciA9IHBhcnNlRW51bShUb2tlbkVycm9yUmVwb3J0ZXIpO1xuIl19
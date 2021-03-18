"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCTokenDelegate = void 0;
const CoreValue_1 = require("../CoreValue");
const Command_1 = require("../Command");
const Networks_1 = require("../Networks");
const Contract_1 = require("../Contract");
const CErc20DelegateContract = Contract_1.getContract('CErc20Delegate');
const CErc20DelegateScenarioContract = Contract_1.getTestContract('CErc20DelegateScenario');
const CCapableErc20DelegateContract = Contract_1.getContract('CCapableErc20Delegate');
async function buildCTokenDelegate(world, from, params) {
    const fetchers = [
        new Command_1.Fetcher(`
        #### CErc20Delegate

        * "CErc20Delegate name:<String>"
          * E.g. "CTokenDelegate Deploy CErc20Delegate cDAIDelegate"
      `, 'CErc20Delegate', [
            new Command_1.Arg('name', CoreValue_1.getStringV)
        ], async (world, { name }) => {
            return {
                invokation: await CErc20DelegateContract.deploy(world, from, []),
                name: name.val,
                contract: 'CErc20Delegate',
                description: 'Standard CErc20 Delegate'
            };
        }),
        new Command_1.Fetcher(`
        #### CErc20DelegateScenario

        * "CErc20DelegateScenario name:<String>" - A CErc20Delegate Scenario for local testing
          * E.g. "CTokenDelegate Deploy CErc20DelegateScenario cDAIDelegate"
      `, 'CErc20DelegateScenario', [
            new Command_1.Arg('name', CoreValue_1.getStringV),
        ], async (world, { name }) => {
            return {
                invokation: await CErc20DelegateScenarioContract.deploy(world, from, []),
                name: name.val,
                contract: 'CErc20DelegateScenario',
                description: 'Scenario CErc20 Delegate'
            };
        }),
        new Command_1.Fetcher(`
        #### CCapableErc20Delegate
        * "CCapableErc20Delegate name:<String>"
          * E.g. "CTokenDelegate Deploy CCapableErc20Delegate cLinkDelegate"
      `, 'CCapableErc20Delegate', [
            new Command_1.Arg('name', CoreValue_1.getStringV),
        ], async (world, { name }) => {
            return {
                invokation: await CCapableErc20DelegateContract.deploy(world, from, []),
                name: name.val,
                contract: 'CCapableErc20Delegate',
                description: 'Capable CErc20 Delegate'
            };
        })
    ];
    let delegateData = await Command_1.getFetcherValue("DeployCToken", fetchers, world, params);
    let invokation = delegateData.invokation;
    delete delegateData.invokation;
    if (invokation.error) {
        throw invokation.error;
    }
    const cTokenDelegate = invokation.value;
    world = await Networks_1.storeAndSaveContract(world, cTokenDelegate, delegateData.name, invokation, [
        {
            index: ['CTokenDelegate', delegateData.name],
            data: {
                address: cTokenDelegate._address,
                contract: delegateData.contract,
                description: delegateData.description
            }
        }
    ]);
    return { world, cTokenDelegate, delegateData };
}
exports.buildCTokenDelegate = buildCTokenDelegate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ1Rva2VuRGVsZWdhdGVCdWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL0J1aWxkZXIvQ1Rva2VuRGVsZWdhdGVCdWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLDRDQUEwQztBQUUxQyx3Q0FBMkQ7QUFDM0QsMENBQW1EO0FBQ25ELDBDQUEyRDtBQUUzRCxNQUFNLHNCQUFzQixHQUFHLHNCQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM3RCxNQUFNLDhCQUE4QixHQUFHLDBCQUFlLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNqRixNQUFNLDZCQUE2QixHQUFHLHNCQUFXLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQVVwRSxLQUFLLFVBQVUsbUJBQW1CLENBQ3ZDLEtBQVksRUFDWixJQUFZLEVBQ1osTUFBYTtJQUViLE1BQU0sUUFBUSxHQUFHO1FBQ2YsSUFBSSxpQkFBTyxDQUNUOzs7OztPQUtDLEVBQ0QsZ0JBQWdCLEVBQ2hCO1lBQ0UsSUFBSSxhQUFHLENBQUMsTUFBTSxFQUFFLHNCQUFVLENBQUM7U0FDNUIsRUFDRCxLQUFLLEVBQ0gsS0FBSyxFQUNMLEVBQUUsSUFBSSxFQUFFLEVBQ1IsRUFBRTtZQUNGLE9BQU87Z0JBQ0wsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUMsTUFBTSxDQUFpQixLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQztnQkFDaEYsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHO2dCQUNkLFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLFdBQVcsRUFBRSwwQkFBMEI7YUFDeEMsQ0FBQztRQUNKLENBQUMsQ0FDRjtRQUVELElBQUksaUJBQU8sQ0FDVDs7Ozs7T0FLQyxFQUNELHdCQUF3QixFQUN4QjtZQUNFLElBQUksYUFBRyxDQUFDLE1BQU0sRUFBRSxzQkFBVSxDQUFDO1NBQzVCLEVBQ0QsS0FBSyxFQUNILEtBQUssRUFDTCxFQUFFLElBQUksRUFBRSxFQUNSLEVBQUU7WUFDRixPQUFPO2dCQUNMLFVBQVUsRUFBRSxNQUFNLDhCQUE4QixDQUFDLE1BQU0sQ0FBeUIsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUM7Z0JBQ2hHLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRztnQkFDZCxRQUFRLEVBQUUsd0JBQXdCO2dCQUNsQyxXQUFXLEVBQUUsMEJBQTBCO2FBQ3hDLENBQUM7UUFDSixDQUFDLENBQ0Y7UUFFRCxJQUFJLGlCQUFPLENBQ1Q7Ozs7T0FJQyxFQUNELHVCQUF1QixFQUN2QjtZQUNFLElBQUksYUFBRyxDQUFDLE1BQU0sRUFBRSxzQkFBVSxDQUFDO1NBQzVCLEVBQ0QsS0FBSyxFQUNILEtBQUssRUFDTCxFQUFFLElBQUksRUFBRSxFQUNSLEVBQUU7WUFDRixPQUFPO2dCQUNMLFVBQVUsRUFBRSxNQUFNLDZCQUE2QixDQUFDLE1BQU0sQ0FBaUIsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUM7Z0JBQ3ZGLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRztnQkFDZCxRQUFRLEVBQUUsdUJBQXVCO2dCQUNqQyxXQUFXLEVBQUUseUJBQXlCO2FBQ3ZDLENBQUM7UUFDSixDQUFDLENBQ0Y7S0FDRixDQUFDO0lBRUYsSUFBSSxZQUFZLEdBQUcsTUFBTSx5QkFBZSxDQUEwQixjQUFjLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMzRyxJQUFJLFVBQVUsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDO0lBQ3pDLE9BQU8sWUFBWSxDQUFDLFVBQVUsQ0FBQztJQUUvQixJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUU7UUFDcEIsTUFBTSxVQUFVLENBQUMsS0FBSyxDQUFDO0tBQ3hCO0lBRUQsTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLEtBQU0sQ0FBQztJQUV6QyxLQUFLLEdBQUcsTUFBTSwrQkFBb0IsQ0FDaEMsS0FBSyxFQUNMLGNBQWMsRUFDZCxZQUFZLENBQUMsSUFBSSxFQUNqQixVQUFVLEVBQ1Y7UUFDRTtZQUNFLEtBQUssRUFBRSxDQUFDLGdCQUFnQixFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUM7WUFDNUMsSUFBSSxFQUFFO2dCQUNKLE9BQU8sRUFBRSxjQUFjLENBQUMsUUFBUTtnQkFDaEMsUUFBUSxFQUFFLFlBQVksQ0FBQyxRQUFRO2dCQUMvQixXQUFXLEVBQUUsWUFBWSxDQUFDLFdBQVc7YUFDdEM7U0FDRjtLQUNGLENBQ0YsQ0FBQztJQUVGLE9BQU8sRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLFlBQVksRUFBRSxDQUFDO0FBQ2pELENBQUM7QUExR0Qsa0RBMEdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnQgfSBmcm9tICcuLi9FdmVudCc7XG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gJy4uL1dvcmxkJztcbmltcG9ydCB7IENFcmMyMERlbGVnYXRlLCBDRXJjMjBEZWxlZ2F0ZVNjZW5hcmlvIH0gZnJvbSAnLi4vQ29udHJhY3QvQ0VyYzIwRGVsZWdhdGUnO1xuaW1wb3J0IHsgQ1Rva2VuIH0gZnJvbSAnLi4vQ29udHJhY3QvQ1Rva2VuJztcbmltcG9ydCB7IEludm9rYXRpb24gfSBmcm9tICcuLi9JbnZva2F0aW9uJztcbmltcG9ydCB7IGdldFN0cmluZ1YgfSBmcm9tICcuLi9Db3JlVmFsdWUnO1xuaW1wb3J0IHsgQWRkcmVzc1YsIE51bWJlclYsIFN0cmluZ1YgfSBmcm9tICcuLi9WYWx1ZSc7XG5pbXBvcnQgeyBBcmcsIEZldGNoZXIsIGdldEZldGNoZXJWYWx1ZSB9IGZyb20gJy4uL0NvbW1hbmQnO1xuaW1wb3J0IHsgc3RvcmVBbmRTYXZlQ29udHJhY3QgfSBmcm9tICcuLi9OZXR3b3Jrcyc7XG5pbXBvcnQgeyBnZXRDb250cmFjdCwgZ2V0VGVzdENvbnRyYWN0IH0gZnJvbSAnLi4vQ29udHJhY3QnO1xuXG5jb25zdCBDRXJjMjBEZWxlZ2F0ZUNvbnRyYWN0ID0gZ2V0Q29udHJhY3QoJ0NFcmMyMERlbGVnYXRlJyk7XG5jb25zdCBDRXJjMjBEZWxlZ2F0ZVNjZW5hcmlvQ29udHJhY3QgPSBnZXRUZXN0Q29udHJhY3QoJ0NFcmMyMERlbGVnYXRlU2NlbmFyaW8nKTtcbmNvbnN0IENDYXBhYmxlRXJjMjBEZWxlZ2F0ZUNvbnRyYWN0ID0gZ2V0Q29udHJhY3QoJ0NDYXBhYmxlRXJjMjBEZWxlZ2F0ZScpO1xuXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ1Rva2VuRGVsZWdhdGVEYXRhIHtcbiAgaW52b2thdGlvbjogSW52b2thdGlvbjxDRXJjMjBEZWxlZ2F0ZT47XG4gIG5hbWU6IHN0cmluZztcbiAgY29udHJhY3Q6IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWlsZENUb2tlbkRlbGVnYXRlKFxuICB3b3JsZDogV29ybGQsXG4gIGZyb206IHN0cmluZyxcbiAgcGFyYW1zOiBFdmVudFxuKTogUHJvbWlzZTx7IHdvcmxkOiBXb3JsZDsgY1Rva2VuRGVsZWdhdGU6IENFcmMyMERlbGVnYXRlOyBkZWxlZ2F0ZURhdGE6IENUb2tlbkRlbGVnYXRlRGF0YSB9PiB7XG4gIGNvbnN0IGZldGNoZXJzID0gW1xuICAgIG5ldyBGZXRjaGVyPHsgbmFtZTogU3RyaW5nVjsgfSwgQ1Rva2VuRGVsZWdhdGVEYXRhPihcbiAgICAgIGBcbiAgICAgICAgIyMjIyBDRXJjMjBEZWxlZ2F0ZVxuXG4gICAgICAgICogXCJDRXJjMjBEZWxlZ2F0ZSBuYW1lOjxTdHJpbmc+XCJcbiAgICAgICAgICAqIEUuZy4gXCJDVG9rZW5EZWxlZ2F0ZSBEZXBsb3kgQ0VyYzIwRGVsZWdhdGUgY0RBSURlbGVnYXRlXCJcbiAgICAgIGAsXG4gICAgICAnQ0VyYzIwRGVsZWdhdGUnLFxuICAgICAgW1xuICAgICAgICBuZXcgQXJnKCduYW1lJywgZ2V0U3RyaW5nVilcbiAgICAgIF0sXG4gICAgICBhc3luYyAoXG4gICAgICAgIHdvcmxkLFxuICAgICAgICB7IG5hbWUgfVxuICAgICAgKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaW52b2thdGlvbjogYXdhaXQgQ0VyYzIwRGVsZWdhdGVDb250cmFjdC5kZXBsb3k8Q0VyYzIwRGVsZWdhdGU+KHdvcmxkLCBmcm9tLCBbXSksXG4gICAgICAgICAgbmFtZTogbmFtZS52YWwsXG4gICAgICAgICAgY29udHJhY3Q6ICdDRXJjMjBEZWxlZ2F0ZScsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdTdGFuZGFyZCBDRXJjMjAgRGVsZWdhdGUnXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgKSxcblxuICAgIG5ldyBGZXRjaGVyPHsgbmFtZTogU3RyaW5nVjsgfSwgQ1Rva2VuRGVsZWdhdGVEYXRhPihcbiAgICAgIGBcbiAgICAgICAgIyMjIyBDRXJjMjBEZWxlZ2F0ZVNjZW5hcmlvXG5cbiAgICAgICAgKiBcIkNFcmMyMERlbGVnYXRlU2NlbmFyaW8gbmFtZTo8U3RyaW5nPlwiIC0gQSBDRXJjMjBEZWxlZ2F0ZSBTY2VuYXJpbyBmb3IgbG9jYWwgdGVzdGluZ1xuICAgICAgICAgICogRS5nLiBcIkNUb2tlbkRlbGVnYXRlIERlcGxveSBDRXJjMjBEZWxlZ2F0ZVNjZW5hcmlvIGNEQUlEZWxlZ2F0ZVwiXG4gICAgICBgLFxuICAgICAgJ0NFcmMyMERlbGVnYXRlU2NlbmFyaW8nLFxuICAgICAgW1xuICAgICAgICBuZXcgQXJnKCduYW1lJywgZ2V0U3RyaW5nViksXG4gICAgICBdLFxuICAgICAgYXN5bmMgKFxuICAgICAgICB3b3JsZCxcbiAgICAgICAgeyBuYW1lIH1cbiAgICAgICkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGludm9rYXRpb246IGF3YWl0IENFcmMyMERlbGVnYXRlU2NlbmFyaW9Db250cmFjdC5kZXBsb3k8Q0VyYzIwRGVsZWdhdGVTY2VuYXJpbz4od29ybGQsIGZyb20sIFtdKSxcbiAgICAgICAgICBuYW1lOiBuYW1lLnZhbCxcbiAgICAgICAgICBjb250cmFjdDogJ0NFcmMyMERlbGVnYXRlU2NlbmFyaW8nLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU2NlbmFyaW8gQ0VyYzIwIERlbGVnYXRlJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICksXG5cbiAgICBuZXcgRmV0Y2hlcjx7IG5hbWU6IFN0cmluZ1Y7IH0sIENUb2tlbkRlbGVnYXRlRGF0YT4oXG4gICAgICBgXG4gICAgICAgICMjIyMgQ0NhcGFibGVFcmMyMERlbGVnYXRlXG4gICAgICAgICogXCJDQ2FwYWJsZUVyYzIwRGVsZWdhdGUgbmFtZTo8U3RyaW5nPlwiXG4gICAgICAgICAgKiBFLmcuIFwiQ1Rva2VuRGVsZWdhdGUgRGVwbG95IENDYXBhYmxlRXJjMjBEZWxlZ2F0ZSBjTGlua0RlbGVnYXRlXCJcbiAgICAgIGAsXG4gICAgICAnQ0NhcGFibGVFcmMyMERlbGVnYXRlJyxcbiAgICAgIFtcbiAgICAgICAgbmV3IEFyZygnbmFtZScsIGdldFN0cmluZ1YpLFxuICAgICAgXSxcbiAgICAgIGFzeW5jIChcbiAgICAgICAgd29ybGQsXG4gICAgICAgIHsgbmFtZSB9XG4gICAgICApID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpbnZva2F0aW9uOiBhd2FpdCBDQ2FwYWJsZUVyYzIwRGVsZWdhdGVDb250cmFjdC5kZXBsb3k8Q0VyYzIwRGVsZWdhdGU+KHdvcmxkLCBmcm9tLCBbXSksXG4gICAgICAgICAgbmFtZTogbmFtZS52YWwsXG4gICAgICAgICAgY29udHJhY3Q6ICdDQ2FwYWJsZUVyYzIwRGVsZWdhdGUnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ2FwYWJsZSBDRXJjMjAgRGVsZWdhdGUnXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgKVxuICBdO1xuXG4gIGxldCBkZWxlZ2F0ZURhdGEgPSBhd2FpdCBnZXRGZXRjaGVyVmFsdWU8YW55LCBDVG9rZW5EZWxlZ2F0ZURhdGE+KFwiRGVwbG95Q1Rva2VuXCIsIGZldGNoZXJzLCB3b3JsZCwgcGFyYW1zKTtcbiAgbGV0IGludm9rYXRpb24gPSBkZWxlZ2F0ZURhdGEuaW52b2thdGlvbjtcbiAgZGVsZXRlIGRlbGVnYXRlRGF0YS5pbnZva2F0aW9uO1xuXG4gIGlmIChpbnZva2F0aW9uLmVycm9yKSB7XG4gICAgdGhyb3cgaW52b2thdGlvbi5lcnJvcjtcbiAgfVxuXG4gIGNvbnN0IGNUb2tlbkRlbGVnYXRlID0gaW52b2thdGlvbi52YWx1ZSE7XG5cbiAgd29ybGQgPSBhd2FpdCBzdG9yZUFuZFNhdmVDb250cmFjdChcbiAgICB3b3JsZCxcbiAgICBjVG9rZW5EZWxlZ2F0ZSxcbiAgICBkZWxlZ2F0ZURhdGEubmFtZSxcbiAgICBpbnZva2F0aW9uLFxuICAgIFtcbiAgICAgIHtcbiAgICAgICAgaW5kZXg6IFsnQ1Rva2VuRGVsZWdhdGUnLCBkZWxlZ2F0ZURhdGEubmFtZV0sXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBhZGRyZXNzOiBjVG9rZW5EZWxlZ2F0ZS5fYWRkcmVzcyxcbiAgICAgICAgICBjb250cmFjdDogZGVsZWdhdGVEYXRhLmNvbnRyYWN0LFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBkZWxlZ2F0ZURhdGEuZGVzY3JpcHRpb25cbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cbiAgKTtcblxuICByZXR1cm4geyB3b3JsZCwgY1Rva2VuRGVsZWdhdGUsIGRlbGVnYXRlRGF0YSB9O1xufVxuIl19
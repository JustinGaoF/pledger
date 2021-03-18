"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildComptrollerImpl = void 0;
const CoreValue_1 = require("../CoreValue");
const Command_1 = require("../Command");
const Networks_1 = require("../Networks");
const Contract_1 = require("../Contract");
const ComptrollerG1Contract = Contract_1.getContract('ComptrollerG1');
const ComptrollerScenarioG1Contract = Contract_1.getTestContract('ComptrollerScenarioG1');
const ComptrollerG2Contract = Contract_1.getContract('ComptrollerG2');
const ComptrollerScenarioG2Contract = Contract_1.getContract('ComptrollerScenarioG2');
const ComptrollerG3Contract = Contract_1.getContract('ComptrollerG3');
const ComptrollerScenarioG3Contract = Contract_1.getContract('ComptrollerScenarioG3');
const ComptrollerG4Contract = Contract_1.getContract('ComptrollerG4');
const ComptrollerScenarioG4Contract = Contract_1.getContract('ComptrollerScenarioG4');
const ComptrollerScenarioContract = Contract_1.getTestContract('ComptrollerScenario');
const ComptrollerContract = Contract_1.getContract('Comptroller');
const ComptrollerBorkedContract = Contract_1.getTestContract('ComptrollerBorked');
async function buildComptrollerImpl(world, from, event) {
    const fetchers = [
        new Command_1.Fetcher(`
        #### ScenarioG1

        * "ScenarioG1 name:<String>" - The Comptroller Scenario for local testing (G1)
          * E.g. "ComptrollerImpl Deploy ScenarioG1 MyScen"
      `, 'ScenarioG1', [new Command_1.Arg('name', CoreValue_1.getStringV)], async (world, { name }) => ({
            invokation: await ComptrollerScenarioG1Contract.deploy(world, from, []),
            name: name.val,
            contract: 'ComptrollerScenarioG1',
            description: 'ScenarioG1 Comptroller Impl'
        })),
        new Command_1.Fetcher(`
        #### ScenarioG2

        * "ScenarioG2 name:<String>" - The Comptroller Scenario for local testing (G2)
          * E.g. "ComptrollerImpl Deploy ScenarioG2 MyScen"
      `, 'ScenarioG2', [new Command_1.Arg('name', CoreValue_1.getStringV)], async (world, { name }) => ({
            invokation: await ComptrollerScenarioG2Contract.deploy(world, from, []),
            name: name.val,
            contract: 'ComptrollerScenarioG2Contract',
            description: 'ScenarioG2 Comptroller Impl'
        })),
        new Command_1.Fetcher(`
        #### ScenarioG3

        * "ScenarioG3 name:<String>" - The Comptroller Scenario for local testing (G3)
          * E.g. "ComptrollerImpl Deploy ScenarioG3 MyScen"
      `, 'ScenarioG3', [new Command_1.Arg('name', CoreValue_1.getStringV)], async (world, { name }) => ({
            invokation: await ComptrollerScenarioG3Contract.deploy(world, from, []),
            name: name.val,
            contract: 'ComptrollerScenarioG3Contract',
            description: 'ScenarioG3 Comptroller Impl'
        })),
        new Command_1.Fetcher(`
        #### Scenario

        * "Scenario name:<String>" - The Comptroller Scenario for local testing
          * E.g. "ComptrollerImpl Deploy Scenario MyScen"
      `, 'Scenario', [new Command_1.Arg('name', CoreValue_1.getStringV)], async (world, { name }) => ({
            invokation: await ComptrollerScenarioContract.deploy(world, from, []),
            name: name.val,
            contract: 'ComptrollerScenario',
            description: 'Scenario Comptroller Impl'
        })),
        new Command_1.Fetcher(`
        #### StandardG1

        * "StandardG1 name:<String>" - The standard generation 1 Comptroller contract
          * E.g. "Comptroller Deploy StandardG1 MyStandard"
      `, 'StandardG1', [new Command_1.Arg('name', CoreValue_1.getStringV)], async (world, { name }) => {
            return {
                invokation: await ComptrollerG1Contract.deploy(world, from, []),
                name: name.val,
                contract: 'ComptrollerG1',
                description: 'StandardG1 Comptroller Impl'
            };
        }),
        new Command_1.Fetcher(`
        #### StandardG2

        * "StandardG2 name:<String>" - The standard generation 2 Comptroller contract
          * E.g. "Comptroller Deploy StandardG2 MyStandard"
      `, 'StandardG2', [new Command_1.Arg('name', CoreValue_1.getStringV)], async (world, { name }) => {
            return {
                invokation: await ComptrollerG2Contract.deploy(world, from, []),
                name: name.val,
                contract: 'ComptrollerG2',
                description: 'StandardG2 Comptroller Impl'
            };
        }),
        new Command_1.Fetcher(`
        #### StandardG3

        * "StandardG3 name:<String>" - The standard generation 3 Comptroller contract
          * E.g. "Comptroller Deploy StandardG3 MyStandard"
      `, 'StandardG3', [new Command_1.Arg('name', CoreValue_1.getStringV)], async (world, { name }) => {
            return {
                invokation: await ComptrollerG3Contract.deploy(world, from, []),
                name: name.val,
                contract: 'ComptrollerG3',
                description: 'StandardG3 Comptroller Impl'
            };
        }),
        new Command_1.Fetcher(`
        #### StandardG4

        * "StandardG4 name:<String>" - The standard generation 4 Comptroller contract
          * E.g. "Comptroller Deploy StandardG4 MyStandard"
      `, 'StandardG4', [new Command_1.Arg('name', CoreValue_1.getStringV)], async (world, { name }) => {
            return {
                invokation: await ComptrollerG4Contract.deploy(world, from, []),
                name: name.val,
                contract: 'ComptrollerG4',
                description: 'StandardG4 Comptroller Impl'
            };
        }),
        new Command_1.Fetcher(`
        #### Standard

        * "Standard name:<String>" - The standard Comptroller contract
          * E.g. "Comptroller Deploy Standard MyStandard"
      `, 'Standard', [new Command_1.Arg('name', CoreValue_1.getStringV)], async (world, { name }) => {
            return {
                invokation: await ComptrollerContract.deploy(world, from, []),
                name: name.val,
                contract: 'Comptroller',
                description: 'Standard Comptroller Impl'
            };
        }),
        new Command_1.Fetcher(`
        #### Borked

        * "Borked name:<String>" - A Borked Comptroller for testing
          * E.g. "ComptrollerImpl Deploy Borked MyBork"
      `, 'Borked', [new Command_1.Arg('name', CoreValue_1.getStringV)], async (world, { name }) => ({
            invokation: await ComptrollerBorkedContract.deploy(world, from, []),
            name: name.val,
            contract: 'ComptrollerBorked',
            description: 'Borked Comptroller Impl'
        })),
        new Command_1.Fetcher(`
        #### Default

        * "name:<String>" - The standard Comptroller contract
          * E.g. "ComptrollerImpl Deploy MyDefault"
      `, 'Default', [new Command_1.Arg('name', CoreValue_1.getStringV)], async (world, { name }) => {
            if (world.isLocalNetwork()) {
                // Note: we're going to use the scenario contract as the standard deployment on local networks
                return {
                    invokation: await ComptrollerScenarioContract.deploy(world, from, []),
                    name: name.val,
                    contract: 'ComptrollerScenario',
                    description: 'Scenario Comptroller Impl'
                };
            }
            else {
                return {
                    invokation: await ComptrollerContract.deploy(world, from, []),
                    name: name.val,
                    contract: 'Comptroller',
                    description: 'Standard Comptroller Impl'
                };
            }
        }, { catchall: true })
    ];
    let comptrollerImplData = await Command_1.getFetcherValue('DeployComptrollerImpl', fetchers, world, event);
    let invokation = comptrollerImplData.invokation;
    delete comptrollerImplData.invokation;
    if (invokation.error) {
        throw invokation.error;
    }
    const comptrollerImpl = invokation.value;
    world = await Networks_1.storeAndSaveContract(world, comptrollerImpl, comptrollerImplData.name, invokation, [
        {
            index: ['Comptroller', comptrollerImplData.name],
            data: {
                address: comptrollerImpl._address,
                contract: comptrollerImplData.contract,
                description: comptrollerImplData.description
            }
        }
    ]);
    return { world, comptrollerImpl, comptrollerImplData };
}
exports.buildComptrollerImpl = buildComptrollerImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcHRyb2xsZXJJbXBsQnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9CdWlsZGVyL0NvbXB0cm9sbGVySW1wbEJ1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsNENBQWtGO0FBRWxGLHdDQUEyRDtBQUMzRCwwQ0FBbUQ7QUFDbkQsMENBQTJEO0FBRTNELE1BQU0scUJBQXFCLEdBQUcsc0JBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUMzRCxNQUFNLDZCQUE2QixHQUFHLDBCQUFlLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUUvRSxNQUFNLHFCQUFxQixHQUFHLHNCQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDM0QsTUFBTSw2QkFBNkIsR0FBRyxzQkFBVyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFFM0UsTUFBTSxxQkFBcUIsR0FBRyxzQkFBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzNELE1BQU0sNkJBQTZCLEdBQUcsc0JBQVcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBRTNFLE1BQU0scUJBQXFCLEdBQUcsc0JBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUMzRCxNQUFNLDZCQUE2QixHQUFHLHNCQUFXLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUUzRSxNQUFNLDJCQUEyQixHQUFHLDBCQUFlLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUMzRSxNQUFNLG1CQUFtQixHQUFHLHNCQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7QUFFdkQsTUFBTSx5QkFBeUIsR0FBRywwQkFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFTaEUsS0FBSyxVQUFVLG9CQUFvQixDQUN4QyxLQUFZLEVBQ1osSUFBWSxFQUNaLEtBQVk7SUFFWixNQUFNLFFBQVEsR0FBRztRQUNmLElBQUksaUJBQU8sQ0FDVDs7Ozs7T0FLQyxFQUNELFlBQVksRUFDWixDQUFDLElBQUksYUFBRyxDQUFDLE1BQU0sRUFBRSxz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QUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQztvQkFDOUUsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHO29CQUNkLFFBQVEsRUFBRSxhQUFhO29CQUN2QixXQUFXLEVBQUUsMkJBQTJCO2lCQUN6QyxDQUFDO2FBQ0g7UUFDSCxDQUFDLEVBQ0QsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQ25CO0tBQ0YsQ0FBQztJQUVGLElBQUksbUJBQW1CLEdBQUcsTUFBTSx5QkFBZSxDQUM3Qyx1QkFBdUIsRUFDdkIsUUFBUSxFQUNSLEtBQUssRUFDTCxLQUFLLENBQ04sQ0FBQztJQUNGLElBQUksVUFBVSxHQUFHLG1CQUFtQixDQUFDLFVBQVUsQ0FBQztJQUNoRCxPQUFPLG1CQUFtQixDQUFDLFVBQVUsQ0FBQztJQUV0QyxJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUU7UUFDcEIsTUFBTSxVQUFVLENBQUMsS0FBSyxDQUFDO0tBQ3hCO0lBQ0QsTUFBTSxlQUFlLEdBQUcsVUFBVSxDQUFDLEtBQU0sQ0FBQztJQUUxQyxLQUFLLEdBQUcsTUFBTSwrQkFBb0IsQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7UUFDL0Y7WUFDRSxLQUFLLEVBQUUsQ0FBQyxhQUFhLEVBQUUsbUJBQW1CLENBQUMsSUFBSSxDQUFDO1lBQ2hELElBQUksRUFBRTtnQkFDSixPQUFPLEVBQUUsZUFBZSxDQUFDLFFBQVE7Z0JBQ2pDLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxRQUFRO2dCQUN0QyxXQUFXLEVBQUUsbUJBQW1CLENBQUMsV0FBVzthQUM3QztTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsT0FBTyxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQztBQUN6RCxDQUFDO0FBbFBELG9EQWtQQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50IH0gZnJvbSAnLi4vRXZlbnQnO1xuaW1wb3J0IHsgYWRkQWN0aW9uLCBXb3JsZCB9IGZyb20gJy4uL1dvcmxkJztcbmltcG9ydCB7IENvbXB0cm9sbGVySW1wbCB9IGZyb20gJy4uL0NvbnRyYWN0L0NvbXB0cm9sbGVySW1wbCc7XG5pbXBvcnQgeyBJbnZva2F0aW9uLCBpbnZva2UgfSBmcm9tICcuLi9JbnZva2F0aW9uJztcbmltcG9ydCB7IGdldEFkZHJlc3NWLCBnZXRFeHBOdW1iZXJWLCBnZXROdW1iZXJWLCBnZXRTdHJpbmdWIH0gZnJvbSAnLi4vQ29yZVZhbHVlJztcbmltcG9ydCB7IEFkZHJlc3NWLCBOdW1iZXJWLCBTdHJpbmdWIH0gZnJvbSAnLi4vVmFsdWUnO1xuaW1wb3J0IHsgQXJnLCBGZXRjaGVyLCBnZXRGZXRjaGVyVmFsdWUgfSBmcm9tICcuLi9Db21tYW5kJztcbmltcG9ydCB7IHN0b3JlQW5kU2F2ZUNvbnRyYWN0IH0gZnJvbSAnLi4vTmV0d29ya3MnO1xuaW1wb3J0IHsgZ2V0Q29udHJhY3QsIGdldFRlc3RDb250cmFjdCB9IGZyb20gJy4uL0NvbnRyYWN0JztcblxuY29uc3QgQ29tcHRyb2xsZXJHMUNvbnRyYWN0ID0gZ2V0Q29udHJhY3QoJ0NvbXB0cm9sbGVyRzEnKTtcbmNvbnN0IENvbXB0cm9sbGVyU2NlbmFyaW9HMUNvbnRyYWN0ID0gZ2V0VGVzdENvbnRyYWN0KCdDb21wdHJvbGxlclNjZW5hcmlvRzEnKTtcblxuY29uc3QgQ29tcHRyb2xsZXJHMkNvbnRyYWN0ID0gZ2V0Q29udHJhY3QoJ0NvbXB0cm9sbGVyRzInKTtcbmNvbnN0IENvbXB0cm9sbGVyU2NlbmFyaW9HMkNvbnRyYWN0ID0gZ2V0Q29udHJhY3QoJ0NvbXB0cm9sbGVyU2NlbmFyaW9HMicpO1xuXG5jb25zdCBDb21wdHJvbGxlckczQ29udHJhY3QgPSBnZXRDb250cmFjdCgnQ29tcHRyb2xsZXJHMycpO1xuY29uc3QgQ29tcHRyb2xsZXJTY2VuYXJpb0czQ29udHJhY3QgPSBnZXRDb250cmFjdCgnQ29tcHRyb2xsZXJTY2VuYXJpb0czJyk7XG5cbmNvbnN0IENvbXB0cm9sbGVyRzRDb250cmFjdCA9IGdldENvbnRyYWN0KCdDb21wdHJvbGxlckc0Jyk7XG5jb25zdCBDb21wdHJvbGxlclNjZW5hcmlvRzRDb250cmFjdCA9IGdldENvbnRyYWN0KCdDb21wdHJvbGxlclNjZW5hcmlvRzQnKTtcblxuY29uc3QgQ29tcHRyb2xsZXJTY2VuYXJpb0NvbnRyYWN0ID0gZ2V0VGVzdENvbnRyYWN0KCdDb21wdHJvbGxlclNjZW5hcmlvJyk7XG5jb25zdCBDb21wdHJvbGxlckNvbnRyYWN0ID0gZ2V0Q29udHJhY3QoJ0NvbXB0cm9sbGVyJyk7XG5cbmNvbnN0IENvbXB0cm9sbGVyQm9ya2VkQ29udHJhY3QgPSBnZXRUZXN0Q29udHJhY3QoJ0NvbXB0cm9sbGVyQm9ya2VkJyk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcHRyb2xsZXJJbXBsRGF0YSB7XG4gIGludm9rYXRpb246IEludm9rYXRpb248Q29tcHRyb2xsZXJJbXBsPjtcbiAgbmFtZTogc3RyaW5nO1xuICBjb250cmFjdDogc3RyaW5nO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVpbGRDb21wdHJvbGxlckltcGwoXG4gIHdvcmxkOiBXb3JsZCxcbiAgZnJvbTogc3RyaW5nLFxuICBldmVudDogRXZlbnRcbik6IFByb21pc2U8eyB3b3JsZDogV29ybGQ7IGNvbXB0cm9sbGVySW1wbDogQ29tcHRyb2xsZXJJbXBsOyBjb21wdHJvbGxlckltcGxEYXRhOiBDb21wdHJvbGxlckltcGxEYXRhIH0+IHtcbiAgY29uc3QgZmV0Y2hlcnMgPSBbXG4gICAgbmV3IEZldGNoZXI8eyBuYW1lOiBTdHJpbmdWIH0sIENvbXB0cm9sbGVySW1wbERhdGE+KFxuICAgICAgYFxuICAgICAgICAjIyMjIFNjZW5hcmlvRzFcblxuICAgICAgICAqIFwiU2NlbmFyaW9HMSBuYW1lOjxTdHJpbmc+XCIgLSBUaGUgQ29tcHRyb2xsZXIgU2NlbmFyaW8gZm9yIGxvY2FsIHRlc3RpbmcgKEcxKVxuICAgICAgICAgICogRS5nLiBcIkNvbXB0cm9sbGVySW1wbCBEZXBsb3kgU2NlbmFyaW9HMSBNeVNjZW5cIlxuICAgICAgYCxcbiAgICAgICdTY2VuYXJpb0cxJyxcbiAgICAgIFtuZXcgQXJnKCduYW1lJywgZ2V0U3RyaW5nVildLFxuICAgICAgYXN5bmMgKHdvcmxkLCB7IG5hbWUgfSkgPT4gKHtcbiAgICAgICAgaW52b2thdGlvbjogYXdhaXQgQ29tcHRyb2xsZXJTY2VuYXJpb0cxQ29udHJhY3QuZGVwbG95PENvbXB0cm9sbGVySW1wbD4od29ybGQsIGZyb20sIFtdKSxcbiAgICAgICAgbmFtZTogbmFtZS52YWwsXG4gICAgICAgIGNvbnRyYWN0OiAnQ29tcHRyb2xsZXJTY2VuYXJpb0cxJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdTY2VuYXJpb0cxIENvbXB0cm9sbGVyIEltcGwnXG4gICAgICB9KVxuICAgICksXG5cbiAgICBuZXcgRmV0Y2hlcjx7IG5hbWU6IFN0cmluZ1YgfSwgQ29tcHRyb2xsZXJJbXBsRGF0YT4oXG4gICAgICBgXG4gICAgICAgICMjIyMgU2NlbmFyaW9HMlxuXG4gICAgICAgICogXCJTY2VuYXJpb0cyIG5hbWU6PFN0cmluZz5cIiAtIFRoZSBDb21wdHJvbGxlciBTY2VuYXJpbyBmb3IgbG9jYWwgdGVzdGluZyAoRzIpXG4gICAgICAgICAgKiBFLmcuIFwiQ29tcHRyb2xsZXJJbXBsIERlcGxveSBTY2VuYXJpb0cyIE15U2NlblwiXG4gICAgICBgLFxuICAgICAgJ1NjZW5hcmlvRzInLFxuICAgICAgW25ldyBBcmcoJ25hbWUnLCBnZXRTdHJpbmdWKV0sXG4gICAgICBhc3luYyAod29ybGQsIHsgbmFtZSB9KSA9PiAoe1xuICAgICAgICBpbnZva2F0aW9uOiBhd2FpdCBDb21wdHJvbGxlclNjZW5hcmlvRzJDb250cmFjdC5kZXBsb3k8Q29tcHRyb2xsZXJJbXBsPih3b3JsZCwgZnJvbSwgW10pLFxuICAgICAgICBuYW1lOiBuYW1lLnZhbCxcbiAgICAgICAgY29udHJhY3Q6ICdDb21wdHJvbGxlclNjZW5hcmlvRzJDb250cmFjdCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnU2NlbmFyaW9HMiBDb21wdHJvbGxlciBJbXBsJ1xuICAgICAgfSlcbiAgICApLFxuXG4gICAgbmV3IEZldGNoZXI8eyBuYW1lOiBTdHJpbmdWIH0sIENvbXB0cm9sbGVySW1wbERhdGE+KFxuICAgICAgYFxuICAgICAgICAjIyMjIFNjZW5hcmlvRzNcblxuICAgICAgICAqIFwiU2NlbmFyaW9HMyBuYW1lOjxTdHJpbmc+XCIgLSBUaGUgQ29tcHRyb2xsZXIgU2NlbmFyaW8gZm9yIGxvY2FsIHRlc3RpbmcgKEczKVxuICAgICAgICAgICogRS5nLiBcIkNvbXB0cm9sbGVySW1wbCBEZXBsb3kgU2NlbmFyaW9HMyBNeVNjZW5cIlxuICAgICAgYCxcbiAgICAgICdTY2VuYXJpb0czJyxcbiAgICAgIFtuZXcgQXJnKCduYW1lJywgZ2V0U3RyaW5nVildLFxuICAgICAgYXN5bmMgKHdvcmxkLCB7IG5hbWUgfSkgPT4gKHtcbiAgICAgICAgaW52b2thdGlvbjogYXdhaXQgQ29tcHRyb2xsZXJTY2VuYXJpb0czQ29udHJhY3QuZGVwbG95PENvbXB0cm9sbGVySW1wbD4od29ybGQsIGZyb20sIFtdKSxcbiAgICAgICAgbmFtZTogbmFtZS52YWwsXG4gICAgICAgIGNvbnRyYWN0OiAnQ29tcHRyb2xsZXJTY2VuYXJpb0czQ29udHJhY3QnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1NjZW5hcmlvRzMgQ29tcHRyb2xsZXIgSW1wbCdcbiAgICAgIH0pXG4gICAgKSxcblxuICAgIG5ldyBGZXRjaGVyPHsgbmFtZTogU3RyaW5nViB9LCBDb21wdHJvbGxlckltcGxEYXRhPihcbiAgICAgIGBcbiAgICAgICAgIyMjIyBTY2VuYXJpb1xuXG4gICAgICAgICogXCJTY2VuYXJpbyBuYW1lOjxTdHJpbmc+XCIgLSBUaGUgQ29tcHRyb2xsZXIgU2NlbmFyaW8gZm9yIGxvY2FsIHRlc3RpbmdcbiAgICAgICAgICAqIEUuZy4gXCJDb21wdHJvbGxlckltcGwgRGVwbG95IFNjZW5hcmlvIE15U2NlblwiXG4gICAgICBgLFxuICAgICAgJ1NjZW5hcmlvJyxcbiAgICAgIFtuZXcgQXJnKCduYW1lJywgZ2V0U3RyaW5nVildLFxuICAgICAgYXN5bmMgKHdvcmxkLCB7IG5hbWUgfSkgPT4gKHtcbiAgICAgICAgaW52b2thdGlvbjogYXdhaXQgQ29tcHRyb2xsZXJTY2VuYXJpb0NvbnRyYWN0LmRlcGxveTxDb21wdHJvbGxlckltcGw+KHdvcmxkLCBmcm9tLCBbXSksXG4gICAgICAgIG5hbWU6IG5hbWUudmFsLFxuICAgICAgICBjb250cmFjdDogJ0NvbXB0cm9sbGVyU2NlbmFyaW8nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1NjZW5hcmlvIENvbXB0cm9sbGVyIEltcGwnXG4gICAgICB9KVxuICAgICksXG5cbiAgICBuZXcgRmV0Y2hlcjx7IG5hbWU6IFN0cmluZ1YgfSwgQ29tcHRyb2xsZXJJbXBsRGF0YT4oXG4gICAgICBgXG4gICAgICAgICMjIyMgU3RhbmRhcmRHMVxuXG4gICAgICAgICogXCJTdGFuZGFyZEcxIG5hbWU6PFN0cmluZz5cIiAtIFRoZSBzdGFuZGFyZCBnZW5lcmF0aW9uIDEgQ29tcHRyb2xsZXIgY29udHJhY3RcbiAgICAgICAgICAqIEUuZy4gXCJDb21wdHJvbGxlciBEZXBsb3kgU3RhbmRhcmRHMSBNeVN0YW5kYXJkXCJcbiAgICAgIGAsXG4gICAgICAnU3RhbmRhcmRHMScsXG4gICAgICBbbmV3IEFyZygnbmFtZScsIGdldFN0cmluZ1YpXSxcbiAgICAgIGFzeW5jICh3b3JsZCwgeyBuYW1lIH0pID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpbnZva2F0aW9uOiBhd2FpdCBDb21wdHJvbGxlckcxQ29udHJhY3QuZGVwbG95PENvbXB0cm9sbGVySW1wbD4od29ybGQsIGZyb20sIFtdKSxcbiAgICAgICAgICBuYW1lOiBuYW1lLnZhbCxcbiAgICAgICAgICBjb250cmFjdDogJ0NvbXB0cm9sbGVyRzEnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU3RhbmRhcmRHMSBDb21wdHJvbGxlciBJbXBsJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICksXG5cbiAgICBuZXcgRmV0Y2hlcjx7IG5hbWU6IFN0cmluZ1YgfSwgQ29tcHRyb2xsZXJJbXBsRGF0YT4oXG4gICAgICBgXG4gICAgICAgICMjIyMgU3RhbmRhcmRHMlxuXG4gICAgICAgICogXCJTdGFuZGFyZEcyIG5hbWU6PFN0cmluZz5cIiAtIFRoZSBzdGFuZGFyZCBnZW5lcmF0aW9uIDIgQ29tcHRyb2xsZXIgY29udHJhY3RcbiAgICAgICAgICAqIEUuZy4gXCJDb21wdHJvbGxlciBEZXBsb3kgU3RhbmRhcmRHMiBNeVN0YW5kYXJkXCJcbiAgICAgIGAsXG4gICAgICAnU3RhbmRhcmRHMicsXG4gICAgICBbbmV3IEFyZygnbmFtZScsIGdldFN0cmluZ1YpXSxcbiAgICAgIGFzeW5jICh3b3JsZCwgeyBuYW1lIH0pID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpbnZva2F0aW9uOiBhd2FpdCBDb21wdHJvbGxlckcyQ29udHJhY3QuZGVwbG95PENvbXB0cm9sbGVySW1wbD4od29ybGQsIGZyb20sIFtdKSxcbiAgICAgICAgICBuYW1lOiBuYW1lLnZhbCxcbiAgICAgICAgICBjb250cmFjdDogJ0NvbXB0cm9sbGVyRzInLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU3RhbmRhcmRHMiBDb21wdHJvbGxlciBJbXBsJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICksXG5cbiAgICBuZXcgRmV0Y2hlcjx7IG5hbWU6IFN0cmluZ1YgfSwgQ29tcHRyb2xsZXJJbXBsRGF0YT4oXG4gICAgICBgXG4gICAgICAgICMjIyMgU3RhbmRhcmRHM1xuXG4gICAgICAgICogXCJTdGFuZGFyZEczIG5hbWU6PFN0cmluZz5cIiAtIFRoZSBzdGFuZGFyZCBnZW5lcmF0aW9uIDMgQ29tcHRyb2xsZXIgY29udHJhY3RcbiAgICAgICAgICAqIEUuZy4gXCJDb21wdHJvbGxlciBEZXBsb3kgU3RhbmRhcmRHMyBNeVN0YW5kYXJkXCJcbiAgICAgIGAsXG4gICAgICAnU3RhbmRhcmRHMycsXG4gICAgICBbbmV3IEFyZygnbmFtZScsIGdldFN0cmluZ1YpXSxcbiAgICAgIGFzeW5jICh3b3JsZCwgeyBuYW1lIH0pID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpbnZva2F0aW9uOiBhd2FpdCBDb21wdHJvbGxlckczQ29udHJhY3QuZGVwbG95PENvbXB0cm9sbGVySW1wbD4od29ybGQsIGZyb20sIFtdKSxcbiAgICAgICAgICBuYW1lOiBuYW1lLnZhbCxcbiAgICAgICAgICBjb250cmFjdDogJ0NvbXB0cm9sbGVyRzMnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU3RhbmRhcmRHMyBDb21wdHJvbGxlciBJbXBsJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICksXG5cbiAgICBuZXcgRmV0Y2hlcjx7IG5hbWU6IFN0cmluZ1YgfSwgQ29tcHRyb2xsZXJJbXBsRGF0YT4oXG4gICAgICBgXG4gICAgICAgICMjIyMgU3RhbmRhcmRHNFxuXG4gICAgICAgICogXCJTdGFuZGFyZEc0IG5hbWU6PFN0cmluZz5cIiAtIFRoZSBzdGFuZGFyZCBnZW5lcmF0aW9uIDQgQ29tcHRyb2xsZXIgY29udHJhY3RcbiAgICAgICAgICAqIEUuZy4gXCJDb21wdHJvbGxlciBEZXBsb3kgU3RhbmRhcmRHNCBNeVN0YW5kYXJkXCJcbiAgICAgIGAsXG4gICAgICAnU3RhbmRhcmRHNCcsXG4gICAgICBbbmV3IEFyZygnbmFtZScsIGdldFN0cmluZ1YpXSxcbiAgICAgIGFzeW5jICh3b3JsZCwgeyBuYW1lIH0pID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpbnZva2F0aW9uOiBhd2FpdCBDb21wdHJvbGxlckc0Q29udHJhY3QuZGVwbG95PENvbXB0cm9sbGVySW1wbD4od29ybGQsIGZyb20sIFtdKSxcbiAgICAgICAgICBuYW1lOiBuYW1lLnZhbCxcbiAgICAgICAgICBjb250cmFjdDogJ0NvbXB0cm9sbGVyRzQnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU3RhbmRhcmRHNCBDb21wdHJvbGxlciBJbXBsJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICksXG5cbiAgICBuZXcgRmV0Y2hlcjx7IG5hbWU6IFN0cmluZ1YgfSwgQ29tcHRyb2xsZXJJbXBsRGF0YT4oXG4gICAgICBgXG4gICAgICAgICMjIyMgU3RhbmRhcmRcblxuICAgICAgICAqIFwiU3RhbmRhcmQgbmFtZTo8U3RyaW5nPlwiIC0gVGhlIHN0YW5kYXJkIENvbXB0cm9sbGVyIGNvbnRyYWN0XG4gICAgICAgICAgKiBFLmcuIFwiQ29tcHRyb2xsZXIgRGVwbG95IFN0YW5kYXJkIE15U3RhbmRhcmRcIlxuICAgICAgYCxcbiAgICAgICdTdGFuZGFyZCcsXG4gICAgICBbbmV3IEFyZygnbmFtZScsIGdldFN0cmluZ1YpXSxcbiAgICAgIGFzeW5jICh3b3JsZCwgeyBuYW1lIH0pID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpbnZva2F0aW9uOiBhd2FpdCBDb21wdHJvbGxlckNvbnRyYWN0LmRlcGxveTxDb21wdHJvbGxlckltcGw+KHdvcmxkLCBmcm9tLCBbXSksXG4gICAgICAgICAgbmFtZTogbmFtZS52YWwsXG4gICAgICAgICAgY29udHJhY3Q6ICdDb21wdHJvbGxlcicsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdTdGFuZGFyZCBDb21wdHJvbGxlciBJbXBsJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICksXG5cbiAgICBuZXcgRmV0Y2hlcjx7IG5hbWU6IFN0cmluZ1YgfSwgQ29tcHRyb2xsZXJJbXBsRGF0YT4oXG4gICAgICBgXG4gICAgICAgICMjIyMgQm9ya2VkXG5cbiAgICAgICAgKiBcIkJvcmtlZCBuYW1lOjxTdHJpbmc+XCIgLSBBIEJvcmtlZCBDb21wdHJvbGxlciBmb3IgdGVzdGluZ1xuICAgICAgICAgICogRS5nLiBcIkNvbXB0cm9sbGVySW1wbCBEZXBsb3kgQm9ya2VkIE15Qm9ya1wiXG4gICAgICBgLFxuICAgICAgJ0JvcmtlZCcsXG4gICAgICBbbmV3IEFyZygnbmFtZScsIGdldFN0cmluZ1YpXSxcbiAgICAgIGFzeW5jICh3b3JsZCwgeyBuYW1lIH0pID0+ICh7XG4gICAgICAgIGludm9rYXRpb246IGF3YWl0IENvbXB0cm9sbGVyQm9ya2VkQ29udHJhY3QuZGVwbG95PENvbXB0cm9sbGVySW1wbD4od29ybGQsIGZyb20sIFtdKSxcbiAgICAgICAgbmFtZTogbmFtZS52YWwsXG4gICAgICAgIGNvbnRyYWN0OiAnQ29tcHRyb2xsZXJCb3JrZWQnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0JvcmtlZCBDb21wdHJvbGxlciBJbXBsJ1xuICAgICAgfSlcbiAgICApLFxuICAgIG5ldyBGZXRjaGVyPHsgbmFtZTogU3RyaW5nViB9LCBDb21wdHJvbGxlckltcGxEYXRhPihcbiAgICAgIGBcbiAgICAgICAgIyMjIyBEZWZhdWx0XG5cbiAgICAgICAgKiBcIm5hbWU6PFN0cmluZz5cIiAtIFRoZSBzdGFuZGFyZCBDb21wdHJvbGxlciBjb250cmFjdFxuICAgICAgICAgICogRS5nLiBcIkNvbXB0cm9sbGVySW1wbCBEZXBsb3kgTXlEZWZhdWx0XCJcbiAgICAgIGAsXG4gICAgICAnRGVmYXVsdCcsXG4gICAgICBbbmV3IEFyZygnbmFtZScsIGdldFN0cmluZ1YpXSxcbiAgICAgIGFzeW5jICh3b3JsZCwgeyBuYW1lIH0pID0+IHtcbiAgICAgICAgaWYgKHdvcmxkLmlzTG9jYWxOZXR3b3JrKCkpIHtcbiAgICAgICAgICAvLyBOb3RlOiB3ZSdyZSBnb2luZyB0byB1c2UgdGhlIHNjZW5hcmlvIGNvbnRyYWN0IGFzIHRoZSBzdGFuZGFyZCBkZXBsb3ltZW50IG9uIGxvY2FsIG5ldHdvcmtzXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGludm9rYXRpb246IGF3YWl0IENvbXB0cm9sbGVyU2NlbmFyaW9Db250cmFjdC5kZXBsb3k8Q29tcHRyb2xsZXJJbXBsPih3b3JsZCwgZnJvbSwgW10pLFxuICAgICAgICAgICAgbmFtZTogbmFtZS52YWwsXG4gICAgICAgICAgICBjb250cmFjdDogJ0NvbXB0cm9sbGVyU2NlbmFyaW8nLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTY2VuYXJpbyBDb21wdHJvbGxlciBJbXBsJ1xuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGludm9rYXRpb246IGF3YWl0IENvbXB0cm9sbGVyQ29udHJhY3QuZGVwbG95PENvbXB0cm9sbGVySW1wbD4od29ybGQsIGZyb20sIFtdKSxcbiAgICAgICAgICAgIG5hbWU6IG5hbWUudmFsLFxuICAgICAgICAgICAgY29udHJhY3Q6ICdDb21wdHJvbGxlcicsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1N0YW5kYXJkIENvbXB0cm9sbGVyIEltcGwnXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHsgY2F0Y2hhbGw6IHRydWUgfVxuICAgIClcbiAgXTtcblxuICBsZXQgY29tcHRyb2xsZXJJbXBsRGF0YSA9IGF3YWl0IGdldEZldGNoZXJWYWx1ZTxhbnksIENvbXB0cm9sbGVySW1wbERhdGE+KFxuICAgICdEZXBsb3lDb21wdHJvbGxlckltcGwnLFxuICAgIGZldGNoZXJzLFxuICAgIHdvcmxkLFxuICAgIGV2ZW50XG4gICk7XG4gIGxldCBpbnZva2F0aW9uID0gY29tcHRyb2xsZXJJbXBsRGF0YS5pbnZva2F0aW9uO1xuICBkZWxldGUgY29tcHRyb2xsZXJJbXBsRGF0YS5pbnZva2F0aW9uO1xuXG4gIGlmIChpbnZva2F0aW9uLmVycm9yKSB7XG4gICAgdGhyb3cgaW52b2thdGlvbi5lcnJvcjtcbiAgfVxuICBjb25zdCBjb21wdHJvbGxlckltcGwgPSBpbnZva2F0aW9uLnZhbHVlITtcblxuICB3b3JsZCA9IGF3YWl0IHN0b3JlQW5kU2F2ZUNvbnRyYWN0KHdvcmxkLCBjb21wdHJvbGxlckltcGwsIGNvbXB0cm9sbGVySW1wbERhdGEubmFtZSwgaW52b2thdGlvbiwgW1xuICAgIHtcbiAgICAgIGluZGV4OiBbJ0NvbXB0cm9sbGVyJywgY29tcHRyb2xsZXJJbXBsRGF0YS5uYW1lXSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgYWRkcmVzczogY29tcHRyb2xsZXJJbXBsLl9hZGRyZXNzLFxuICAgICAgICBjb250cmFjdDogY29tcHRyb2xsZXJJbXBsRGF0YS5jb250cmFjdCxcbiAgICAgICAgZGVzY3JpcHRpb246IGNvbXB0cm9sbGVySW1wbERhdGEuZGVzY3JpcHRpb25cbiAgICAgIH1cbiAgICB9XG4gIF0pO1xuXG4gIHJldHVybiB7IHdvcmxkLCBjb21wdHJvbGxlckltcGwsIGNvbXB0cm9sbGVySW1wbERhdGEgfTtcbn1cbiJdfQ==
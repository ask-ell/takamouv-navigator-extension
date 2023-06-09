import { CommandRunnerParams, Failable, NavigatorProxy } from "../../types";

export default class ChromeNavigatorProxy implements NavigatorProxy {
    static isAvailable(): boolean {
        return !!chrome.tabs;
    }

    async runCommand<Args extends any[]>({ func, args }: CommandRunnerParams<Args>): Promise<Failable> {
        if (!ChromeNavigatorProxy.isAvailable()) {
            return Promise.resolve(new Error('"tabs" is not available in "chrome" object.'));
        }

        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const currentTab = tabs[0];

        const currentTabId = currentTab.id;
        if (!currentTabId) {
            return Promise.resolve(new Error("Current tab is not available"));
        }
        await chrome.scripting.executeScript({
            target: { tabId: currentTabId },
            func,
            args
        });
    }
}
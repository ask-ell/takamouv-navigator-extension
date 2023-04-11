import { MissingDomElementError } from "../../errors";
import { Handler, HandlerNextCallback, StorageKeys, StorageProxy } from "../../utils";

export default class TrimTriggeHandlerService implements Handler<void, void> {
    constructor(private document: Document, private form: HTMLFormElement, private storageProxy: StorageProxy) { }

    handle(next: HandlerNextCallback<void, void>) {
        const querySelector = "#trim-trigger"
        const trimButton = this.document.querySelector<HTMLButtonElement>(querySelector);

        if (!trimButton) {
            return new MissingDomElementError(querySelector);
        }
        trimButton.addEventListener('click', () => {
            return next();
        });
    }

    resolve() {
        this.form.reset();
        this.storageProxy.delete(StorageKeys.formData);
        return Promise.resolve();
    }
}
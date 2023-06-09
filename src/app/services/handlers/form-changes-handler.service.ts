import { ChangeDetectionQueue, Failable, Handler, HandlerNextCallback, StorageKeys, StorageProxy, translateFormToDancerInformations } from "../../utils";

export default class FormChangesHandlerService implements Handler<void, void> {
    constructor(private form: HTMLFormElement, private storageProxy: StorageProxy) { }

    handle(next: HandlerNextCallback<void, void>): Failable {
        const changeDetectionQueue = new ChangeDetectionQueue<Event>({ debounceTime: 500 });

        this.form.addEventListener('change', event => {
            if (!(event.target instanceof HTMLSelectElement)) {
                return void 0;
            }
            return changeDetectionQueue.registerChangeDetection(event);
        });

        this.form.addEventListener('keydown', (event: KeyboardEvent) => {
            const keyDownCodeBlackList = ['Tab', 'Space', 'ShiftLeft', 'ShiftRight'];
            if (keyDownCodeBlackList.includes(event.code)) {
                return void 0;
            }
            return changeDetectionQueue.registerChangeDetection(event);
        });

        changeDetectionQueue.onChangesDetected(() => {
            next();
        });
    }

    resolve(): Promise<Failable> {
        const value = translateFormToDancerInformations(this.form);
        this.storageProxy.set(StorageKeys.formData, value);
        return Promise.resolve();
    }
}
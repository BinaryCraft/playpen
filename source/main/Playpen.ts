import {existsAsync, mkdirAsync, removeAsync} from "fs-extra-promise";
import Process = NodeJS.Process;

export {Playpen};

class Playpen {
    public readonly path: string;
    public readonly parentDirectoryPath: string;
    public readonly realProcessExit = process.exit;

    private fakeExitListener: () => void;
    private exitListener: () => void;
    private oldProcessOn: any;

    constructor() {
        this.parentDirectoryPath = process.cwd();
        this.path = `${process.cwd()}/.playpen`;
    }

    public async setup(): Promise<void> {
        await this.createEnvironment();
    }

    public async tearDown(): Promise<void> {
        process.exit = this.realProcessExit;
        process.chdir(this.parentDirectoryPath);
        await removeAsync(this.path);
    }

    public mockProcessEventHandler(): void {
        this.oldProcessOn = process.on;

        process.on = (eventName, func: () => void): Process => {
            if (eventName === "exit") {
                this.fakeExitListener = func;
                process.on = this.oldProcessOn;
            }
            return process;
        };
    }

    public emitFakeProcessExitEvent(): void {
        this.removeCleanUpTasks();

        this.fakeExitListener();

        this.registerCleanUpTasks();
    }

    private removeCleanUpTasks(): void {
        process.removeListener("exit", this.exitListener);
    }

    private registerCleanUpTasks(): void {
        this.exitListener = () => {
            existsAsync(this.path).then((exists) => {
                if (exists) {
                    removeAsync(this.path);
                }
            });
        };

        process.on("exit", this.exitListener);
    }

    private async createEnvironment(): Promise<void> {
        await mkdirAsync(this.path);
        process.chdir(this.path);
        this.registerCleanUpTasks();

        this.mockProcess();
    }

    private mockProcess(): void {
        process.exit = (exitCode: number = 0): void => {
            process.exitCode = exitCode;
        };
    }
}

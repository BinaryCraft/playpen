declare namespace NodeJS {
    import ExpectStatic = Chai.ExpectStatic;

    export interface Global {
        expect: ExpectStatic;
    }

    export interface Process extends EventEmitter {
        exit: (exitCode?: number) => void;
        on: (event: string, func: () => void) => this;
    }
}

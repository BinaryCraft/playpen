declare namespace NodeJS {
    import ExpectStatic = Chai.ExpectStatic;
    import {ChildProcess, SpawnOptions} from "child_process";

    export interface Global {
        expect: ExpectStatic;
        spy: Sinon.SinonSpyStatic;
    }

    export interface Spawn {
        (command: string, args?: ReadonlyArray<string>, options?: SpawnOptions): ChildProcess

        firstCall?: SinonSpyCall;
        secondCall?: SinonSpyCall;
    }
}

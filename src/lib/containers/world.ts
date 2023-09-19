import { ZsFile } from "./file";
import { ZsDir } from "./dir";
import {
    ZsModuleDecl,
    ZsModuleDeclarations
} from "../construction/module-declarations/module-fragment";

export const sFiles = Symbol("files");
export class ZsWorld {
    constructor(private readonly _name: string) {}
    readonly [sFiles]: ZsFile<any>[] = [];
    file<Exports extends ZsModuleDecl>(
        name: string,
        init: ZsModuleDeclarations<Exports>
    ) {
        const file = ZsFile.create(name, init);
        this[sFiles].push(file);
        return file.proxy;
    }

    dir(name: string) {
        return new ZsDir(name, this);
    }

    static create(name: string) {
        return new ZsWorld(name);
    }
}

import { ZsExportable } from "../construction/refs";
import { ZsFile } from "./file";
import { ZsDir } from "./dir";
import { ZsDeclarationSpace } from "./declarator";

export const sFiles = Symbol("files");
export class ZsUniverse {
    readonly [sFiles]: ZsFile<any>[] = [];
    file<Exports extends ZsExportable<any>>(
        name: string,
        init: (space: ZsDeclarationSpace) => Generator<Exports>
    ) {
        const file = new ZsFile(name, init);
        this[sFiles].push(file);
        return file.exportsProxy;
    }

    dir(name: string) {
        return new ZsDir(name, this);
    }

    static create() {
        return new ZsUniverse();
    }
}

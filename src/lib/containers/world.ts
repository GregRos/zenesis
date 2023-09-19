import { ZsExportable, ZsNamedDecl } from "../construction/refs";
import { ZsFile } from "./file";
import { ZsDir } from "./dir";
import { ZsDeclarationSpace } from "./declarator";

export const sFiles = Symbol("files");
export class ZsWorld {
    readonly [sFiles]: ZsFile<any>[] = [];
    file<Exports extends ZsNamedDecl>(
        name: string,
        init: (space: ZsDeclarationSpace) => Generator<Exports>
    ) {
        const file = new ZsFile(name, init);
        this[sFiles].push(file);
        return file.proxy;
    }

    dir(name: string) {
        return new ZsDir(name, this);
    }

    static create() {
        return new ZsWorld();
    }
}

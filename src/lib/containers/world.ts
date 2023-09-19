import { ZsFile } from "./file";
import { ExportsRecord, ZsExportsIterable } from "./types";
import { ZsExportable } from "../construction/refs";
import { ZsDir } from "./dir";

export class ZsWorld {
    private _files: ZsFile[] = [];

    file<Exports extends ZsExportable<any>>(
        name: string,
        exports: () => ZsExportsIterable<Exports>
    ): ExportsRecord<Exports> {
        const file = new ZsFile(name, exports());
        this._files.push(file);
        return file.proxy;
    }

    dir<Name extends string>(name: Name) {
        return new ZsDir(name, this);
    }
}

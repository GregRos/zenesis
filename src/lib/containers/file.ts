import { ZsExportsIterable } from "./types";
import { ExportsCollection } from "./collection";
import { ZsExportable } from "../construction/refs";

export class ZsFile {
    private _exports: ExportsCollection<any>;

    constructor(
        readonly name: string,
        declarations: ZsExportsIterable<any>
    ) {
        this._exports = new ExportsCollection(declarations);
    }

    get proxy() {
        return this._exports;
    }
}

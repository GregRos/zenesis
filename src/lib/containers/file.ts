import { ZsExportsIterable } from "./types";
import { NamedDeclCollection } from "./collection";

export class ZsFile {
    private _exports: NamedDeclCollection<any>;

    constructor(
        readonly name: string,
        declarations: ZsExportsIterable<any>
    ) {
        this._exports = new NamedDeclCollection(declarations);
    }

    get proxy() {
        return this._exports;
    }
}

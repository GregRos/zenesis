import { ZsExportable } from "../construction/refs";
import { z } from "zod";
import { zs } from "../construction";
import { ExportsCollection, ZsExports } from "./exports";
import { seq, SeqLike } from "lazies";
import { ZsDeclarationSpace } from "./declarator";

export class ZsFile<Exports extends ZsExportable<any>> {
    private _exportsProxy: ExportsCollection<Exports>;

    constructor(
        readonly name: string,
        exports: (space: ZsDeclarationSpace) => Generator<Exports>
    ) {
        this._exportsProxy = new ExportsCollection(
            seq(exports(new ZsDeclarationSpace()))
        );
    }

    get exportsProxy() {
        return this._exportsProxy.proxy(this);
    }
}

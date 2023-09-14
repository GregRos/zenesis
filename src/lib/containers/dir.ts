import { ZsExportable } from "../construction/refs";
import { ZsDeclarationSpace } from "./declarator";
import { ZsUniverse } from "./universe";

export class ZsDir {
    constructor(
        readonly name: string,
        private readonly _universe: ZsUniverse
    ) {}

    private _getFileName(name: string) {
        return `${this.name}/${name}`;
    }

    file<Exports extends ZsExportable<any>>(
        name: string,
        init: (space: ZsDeclarationSpace) => Generator<Exports>
    ) {
        return this._universe.file(this._getFileName(name), () =>
            init(new ZsDeclarationSpace())
        );
    }
}

import { ZsNamedDecl } from "../construction/refs";
import { ZsModuleDeclarator } from "../construction/module-declarations/declarator";
import {
    ZsModuleDecl,
    ZsModuleDeclarations,
    ZsModuleFragment,
    ZsNamedModuleDecl
} from "../construction/module-declarations/module-fragment";
import { ZsValue } from "../construction/module-declarations/value";

export class ZsFile<Exports extends ZsModuleDecl> {
    constructor(
        readonly name: string,
        private readonly _fragment: ZsModuleFragment<Exports>
    ) {}

    get proxy() {
        return this._fragment.proxy(this);
    }

    static create<Exports extends ZsModuleDecl>(
        name: string,
        exports: ZsModuleDeclarations<Exports>
    ) {
        return new ZsFile(name, ZsModuleFragment.create(exports));
    }
}

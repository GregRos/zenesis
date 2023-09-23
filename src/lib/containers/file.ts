import {
    ZsModuleDecl,
    ZsModuleDeclarations,
    ZsModuleFragment
} from "../construction/module-declarations/module-fragment"

export class ZsFile<Exports extends ZsModuleDecl> {
    constructor(
        readonly name: string,
        private readonly _fragment: ZsModuleFragment<Exports>
    ) {}

    get proxy() {
        return this._fragment.proxy(this)
    }

    static create<Exports extends ZsModuleDecl>(
        name: string,
        exports: ZsModuleDeclarations<Exports>
    ) {
        return new ZsFile(name, ZsModuleFragment.create(exports))
    }
}

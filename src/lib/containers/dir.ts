import { ZsWorld } from "./world";
import { ZsExportable, ZsNamedDecl } from "../construction/refs";
import {
    ExportsRecord,
    ZsModuleDecl,
    ZsModuleDeclarations,
    ZsNamedModuleDecl
} from "../construction/module-declarations/module-fragment";

export class ZsDir {
    constructor(
        readonly name: string,
        private readonly _world: ZsWorld
    ) {}

    file<Exports extends ZsNamedModuleDecl>(
        name: string,
        exports: ZsModuleDeclarations<Exports>
    ): ExportsRecord<Exports> {
        return this._world.file(`${this.name}/${name}`, exports);
    }

    dir<Name extends string>(name: Name) {
        return new ZsDir(`${this.name}/${name}`, this._world);
    }
}

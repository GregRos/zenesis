import { ZsWorld } from "./world";
import { ExportsRecord, ZsExportsIterable } from "./types";
import { ZsExportable } from "../construction/refs";

export class ZsDir {
    constructor(
        readonly name: string,
        private readonly _world: ZsWorld
    ) {}

    file<Exports extends ZsExportable<any>>(
        name: string,
        exports: () => ZsExportsIterable<Exports>
    ): ExportsRecord<Exports> {
        return this._world.file(`${this.name}/${name}`, exports);
    }

    dir<Name extends string>(name: Name) {
        return new ZsDir(`${this.name}/${name}`, this._world);
    }
}

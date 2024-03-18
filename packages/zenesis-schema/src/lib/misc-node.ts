export class ZsStructural<ZDef> {
    constructor(readonly _def: ZDef) {}

    *[Symbol.iterator]() {
        return this
    }
}

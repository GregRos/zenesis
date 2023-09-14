import { ZsNodeKind } from "../kinds";
import { ZsShapedInterfaceRef } from "../refs";

export interface ZsImplementsDef<Interface extends ZsShapedInterfaceRef<any>> {
    declName: ZsNodeKind.ZsImplements;
    interface: Interface;
}

export class ZsImplements<Interface extends ZsShapedInterfaceRef<any>> {
    constructor(readonly _def: ZsImplementsDef<Interface>) {}

    static create<Interface extends ZsShapedInterfaceRef<any>>(
        _def: ZsImplementsDef<Interface>
    ) {
        return new ZsImplements(_def);
    }
}

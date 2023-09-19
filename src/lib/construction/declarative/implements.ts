import { ZsNodeKind } from "../kinds";
import { ZsTypedDecl } from "../refs";
import { ZsInstantiation } from "../expressions/instantiation";
import { ZsInterface } from "./interface";

export type ZsImplementable = ZsInterface | ZsInstantiation<ZsInterface>;

export function isImplementable(x: any): x is ZsImplementable {
    return (
        x instanceof ZsInterface ||
        (x instanceof ZsInstantiation &&
            x._def.instance() instanceof ZsInterface)
    );
}

export interface ZsImplementsDef<Interface extends ZsImplementable> {
    declName: ZsNodeKind.ZsImplements;
    interface: Interface;
}

export class ZsImplements<Interface extends ZsImplementable = ZsImplementable>
    implements ZsTypedDecl<"implements">
{
    readonly declaration = "implements";

    constructor(readonly _def: ZsImplementsDef<Interface>) {}

    get schema() {
        return this._def.interface;
    }

    get shape(): Interface["shape"] {
        return this._def.interface.shape;
    }

    static create<Interface extends ZsImplementable>(iface: Interface) {
        return new ZsImplements({
            declName: ZsNodeKind.ZsImplements,
            interface: iface
        });
    }
}
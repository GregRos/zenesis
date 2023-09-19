import { ZsNodeKind } from "../kinds";
import { ZsFunction } from "../expressions/function";
import { Access } from "../utils";
import { ZsOverloads } from "../expressions/overloads";
import { ZsNamedDecl, ZsTypedDecl } from "../refs";

export interface ZsDeclMethodDef<
    Name extends string,
    Functions extends ZsOverloads<any>
> {
    kind: ZsNodeKind.ZsMethod;
    access: Access;
    name: Name;
    type: Functions;
}

export class ZsClassMethod<
        Name extends string = string,
        Functions extends ZsOverloads<any> = ZsOverloads<any>
    >
    implements ZsTypedDecl<"method">, ZsNamedDecl<Name>
{
    readonly declaration = "method";

    get name() {
        return this._def.name;
    }

    get schema() {
        return this._def.type;
    }

    constructor(readonly _def: ZsDeclMethodDef<Name, Functions>) {}

    static create<
        Name extends string,
        Function extends [ZsFunction<any, any>, ...ZsFunction<any, any>[]]
    >(name: Name, ...overloads: Function) {
        return new ZsClassMethod({
            kind: ZsNodeKind.ZsMethod,
            access: "public",
            name,
            type: ZsOverloads.create(...overloads)
        });
    }
}

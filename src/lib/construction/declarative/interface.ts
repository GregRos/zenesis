import { ZodTypeDef } from "zod";
import { ZsMonoType } from "../mono-type";
import { getCombinedType } from "../utils";
import { ZsTypeKind } from "../kinds";
import { ZsClassFragment } from "../class-declarations/class-fragment";

export interface ZsInterfaceDef<
    Name extends string,
    Fragment extends ZsClassFragment
> extends ZodTypeDef {
    name: Name;
    typeName: ZsTypeKind.ZsInterface;
    fragment: Fragment;
}

export class ZsInterface<
    Name extends string = string,
    Fragment extends ZsClassFragment = ZsClassFragment
> extends ZsMonoType<
    getCombinedType<Fragment["shape"]>,
    ZsInterfaceDef<Name, Fragment>
> {
    readonly declaration = "interface";
    readonly name = this._def.name;

    get actsLike() {
        return this._def.fragment.schema;
    }

    get shape() {
        return this._def.fragment.shape;
    }

    static create<Name extends string, Fragment extends ZsClassFragment>(
        name: Name,
        fragment: Fragment
    ) {
        return new ZsInterface({
            name,
            typeName: ZsTypeKind.ZsInterface,
            fragment
        });
    }
}

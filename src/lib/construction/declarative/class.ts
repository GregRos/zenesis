import { ZodTypeDef } from "zod";
import { ZsMonoType } from "../mono-type";
import { getCombinedType } from "../utils";
import { ZsTypeKind } from "../kinds";
import { ZsClassFragment } from "./class-fragment";

export interface ZsClassDef<
    Name extends string,
    Fragment extends ZsClassFragment
> extends ZodTypeDef {
    name: Name;
    typeName: ZsTypeKind.ZsClass;
    fragment: Fragment;
    abstract: boolean;
}

export class ZsClass<
    Name extends string,
    Fragment extends ZsClassFragment = ZsClassFragment
> extends ZsMonoType<
    getCombinedType<Fragment["shape"]>,
    ZsClassDef<Name, Fragment>
> {
    readonly name = this._def.name;
    readonly declaration = "class";
    readonly actsLike = this._def.fragment.schema;

    get shape() {
        return this._def.fragment.shape;
    }

    abstract(yes = true) {
        return new ZsClass({
            ...this._def,
            abstract: yes
        });
    }

    static create<Name extends string, Fragment extends ZsClassFragment>(
        name: Name,
        fragment: Fragment
    ) {
        return new ZsClass({
            name,
            typeName: ZsTypeKind.ZsClass,
            abstract: false,
            fragment
        });
    }
}

export type ZsEmptyClass<Name extends string> = ZsClass<Name, {}, {}, {}, {}>;

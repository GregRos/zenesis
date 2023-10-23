import { ZodTypeDef } from "zod"
import { ZsMonoType } from "../mono-type"
import { getCombinedType } from "../utils"
import { ZsTypeKind } from "../kinds"
import { ZsClassFragment } from "../class-declarations/class-fragment"
import { ZsInstantiation } from "../expressions/instantiation"
import { ZsShapedRef } from "../refs"

export interface ZsClassDef<
    Name extends string,
    Parent extends ZsShapedRef | null,
    Fragment extends ZsClassFragment
> extends ZodTypeDef {
    name: Name
    typeName: ZsTypeKind.ZsClass
    fragment: Fragment
    parent: Parent
    abstract: boolean
}

export class ZsClass<
    Name extends string = string,
    Parent extends ZsShapedRef | null = ZsShapedRef | null,
    Fragment extends ZsClassFragment = ZsClassFragment
> extends ZsMonoType<
    getCombinedType<
        Fragment["shape"],
        Parent extends { shape: any } ? Parent["shape"] : {}
    >,
    ZsClassDef<Name, Parent, Fragment>
> {
    readonly name = this._def.name
    readonly declaration = "class"
    readonly actsLike = this._def.fragment.schema

    get shape() {
        return this._def.fragment.shape
    }

    abstract(yes = true) {
        return new ZsClass({
            ...this._def,
            abstract: yes
        })
    }

    static create<
        Name extends string,
        Parent extends ZsShapedRef | null,
        Fragment extends ZsClassFragment
    >(name: Name, parent: Parent, fragment: Fragment) {
        return new ZsClass({
            name,
            typeName: ZsTypeKind.ZsClass,
            abstract: false,
            fragment,
            parent
        })
    }
}

import { ZodOptional, ZodTypeAny } from "zod"
import { ZsMemberKind } from "../core/member-kind"
import { ZsStructural } from "../core/misc-node"
import { Access } from "./common"
export interface ZsClassMemberDef<
    Name extends string,
    Type extends ZodTypeAny
> {
    memberName: ZsMemberKind.ZsProperty
    access?: Access
    name: Name
    innerType: Type
}

export class ZsProperty<
    Name extends string = string,
    Type extends ZodTypeAny = ZodTypeAny
> extends ZsStructural<ZsClassMemberDef<Name, Type>> {
    readonly scope = "class"

    get name() {
        return this._def.name
    }

    get valueType() {
        return this._def.innerType
    }

    static create<Name extends string, Type extends ZodTypeAny>(
        name: Name,
        type: Type
    ) {
        return new ZsProperty({
            memberName: ZsMemberKind.ZsProperty,
            access: "public",
            name,
            innerType: type
        })
    }

    optional(): ZsProperty<Name, ZodOptional<Type>> {
        return new ZsProperty({
            ...this._def,
            innerType: this._def.innerType.optional()
        })
    }

    access<V extends Access>(access: V) {
        return new ZsProperty({
            ...this._def,
            access: access
        })
    }

    readonly() {
        return new ZsProperty({
            ...this._def,
            innerType: this._def.innerType.readonly()
        })
    }
}

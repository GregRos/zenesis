import { ZodOptional, ZodTypeAny } from "zod"
import { ZsStructural } from "../../../misc-node"
import { ZsMemberKind } from "./kind"

export interface ZsClassMemberDef<
    Name extends string,
    Type extends ZodTypeAny
> {
    memberName: ZsMemberKind.ZsField
    access?: Access
    name: Name
    innerType: Type
}

export class ZsMember<
    Name extends string = string,
    Type extends ZodTypeAny = ZodTypeAny
> extends ZsStructural<ZsClassMemberDef<Name, Type>> {
    readonly scope = "class"

    get name() {
        return this._def.name
    }

    get schema() {
        return this._def.innerType
    }

    static create<Name extends string, Type extends ZodTypeAny>(
        name: Name,
        type: Type
    ) {
        return new ZsMember({
            memberName: ZsMemberKind.ZsField,
            access: "public",
            name,
            innerType: type
        })
    }

    optional(): ZsMember<Name, ZodOptional<Type>> {
        return new ZsMember({
            ...this._def,
            innerType: this._def.innerType.optional()
        })
    }

    access<V extends Access>(access: V) {
        return new ZsMember({
            ...this._def,
            access: access
        })
    }

    readonly() {
        return new ZsMember({
            ...this._def,
            innerType: this._def.innerType.readonly()
        })
    }
}
export type Access = "public" | "protected" | "private"

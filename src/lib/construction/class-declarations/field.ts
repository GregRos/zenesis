import { ZsClassDeclKind } from "../kinds"
import { Access } from "../utils"
import { ZodOptional, ZodTypeAny } from "zod"

export interface ZsClassMemberDef<
    Name extends string,
    Type extends ZodTypeAny
> {
    access?: Access
    name: Name
    innerType: Type
}

export class ZsClassMember<
    Name extends string = string,
    Type extends ZodTypeAny = ZodTypeAny
> {
    readonly scope = "class"
    constructor(readonly _def: ZsClassMemberDef<Name, Type>) {}

    get name() {
        return this._def.name
    }

    get schema() {
        return this._def.innerType
    }

    readonly declaration = "field"

    static create<Name extends string, Type extends ZodTypeAny>(
        name: Name,
        type: Type
    ) {
        return new ZsClassMember({
            access: "public",
            name,
            innerType: type
        })
    }

    optional(): ZsClassMember<Name, ZodOptional<Type>> {
        return new ZsClassMember({
            ...this._def,
            innerType: this._def.innerType.optional()
        })
    }

    access<V extends Access>(access: V) {
        return new ZsClassMember({
            ...this._def,
            access: access
        })
    }

    readonly() {
        return new ZsClassMember({
            ...this._def,
            innerType: this._def.innerType.readonly()
        })
    }
}

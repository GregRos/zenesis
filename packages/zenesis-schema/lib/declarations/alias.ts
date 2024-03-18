import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsMonoType } from "../core/mono-type"
import { ZsTypeKind } from "../kinds"
import { ZsDeclKind } from "./kind"

export interface ZsTypeAliasDef<Name extends string, Type extends ZodTypeAny>
    extends ZodTypeDef {
    name: Name
    declName: ZsDeclKind.ZsTypeAlias
    typeName: ZsTypeKind.ZsTypeAlias
    definition: Type
}

export class ZsTypeAlias<
    Name extends string = string,
    Instance extends ZodTypeAny = ZodTypeAny
> extends ZsMonoType<TypeOf<Instance>, ZsTypeAliasDef<Name, Instance>> {
    readonly name = this._def.name
    readonly actsLike = this._def.definition
    readonly declaration = "alias"
    static create<Name extends string, T extends ZodTypeAny>(
        name: Name,
        definition: T
    ) {
        return new ZsTypeAlias({
            declName: ZsDeclKind.ZsTypeAlias,
            typeName: ZsTypeKind.ZsTypeAlias,
            name,
            definition
        })
    }

    *[Symbol.iterator]() {
        yield this
    }
}

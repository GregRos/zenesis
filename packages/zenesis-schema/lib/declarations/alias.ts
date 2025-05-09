import { memoize } from "doddle"
import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsModuleDeclKind } from "../core/declaration-kind"
import { ZsMonoType } from "../core/mono-type"
import { ZsTypeKind } from "../core/type-kind"

export interface ZsTypeAliasDef<Name extends string, Type extends ZodTypeAny>
    extends ZodTypeDef {
    name: Name
    declName: ZsModuleDeclKind.ZsTypeAlias
    typeName: ZsTypeKind.ZsTypeAlias
    definition: () => Type
}

export class ZsTypeAlias<
    Name extends string = string,
    Instance extends ZodTypeAny = ZodTypeAny
> extends ZsMonoType<TypeOf<Instance>, ZsTypeAliasDef<Name, Instance>> {
    readonly name = this._def.name
    get actsLike() {
        return this._def.definition()
    }

    readonly declaration = "alias"
    static create<Name extends string, T extends ZodTypeAny>(
        name: Name,
        definition: () => T
    ) {
        return new ZsTypeAlias({
            declName: ZsModuleDeclKind.ZsTypeAlias,
            typeName: ZsTypeKind.ZsTypeAlias,
            name,
            definition: memoize(definition) as () => T
        })
    }
}

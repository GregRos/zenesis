import { AnyZodTuple, ZodOptional, ZodTypeAny } from "zod"
import { ZsMonoLike } from "../../core/mono-type"
import { ZodKindedAny } from "../../core/types"
import { ZsFunction } from "../../expressions/function"
import { ZsConstructor } from "./members/constructor"
import { ZsImplementable, ZsImplements } from "./members/implements"
import { ZsIndexer } from "./members/indexer"
import { ZsMember } from "./members/member"
import { ZsOverloads } from "./members/overloads"

export type UnionFields<Types extends Record<keyof Types, ZodKindedAny>> = {
    [K in keyof Types & string]: [ZsMember<K, Types[K]>]
}[keyof Types & string][0]


export class ClassDeclarator {
    Fields<
        Types extends Record<keyof Types, ZodKindedAny>
    >(stuffs: Types): Iterable<UnionFields<Types>> {
        return Object.entries(stuffs).map(([name, type]) =>
            ZsMember.create(name, type as any)
        ) as any
    }

    Field<Name extends string, Type extends ZodTypeAny>(
        name: Name,
        type: Type
    ): ZsMember<Name, Type> {
        return ZsMember.create(name, type)
    }

    Method<Name extends string, Types extends [ZsFunction, ...ZsFunction[]]>(
        name: Name,
        overloads: Types
    ): ZsMember<Name, ZsOverloads<Types>> {
        return ZsMember.create(name, ZsOverloads.create(...overloads))
    }

    Implements<Type extends ZsImplementable>(
        type: Type
    ): ZsImplements<Type["shape"]> {
        return ZsImplements.create(type)
    }

    Indexer<
        Key extends
            | ZsMonoLike<PropertyKey>
            | ZodOptional<ZsMonoLike<PropertyKey>>,
        Value extends ZodTypeAny
    >(keyType: Key, valueType: Value): ZsIndexer<Key, Value> {
        return ZsIndexer.create(keyType, valueType)
    }

    Constructor<ZTuple extends AnyZodTuple>(params: ZTuple) {
        return ZsConstructor.create(params)
    }
}

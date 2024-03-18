import { AnyZodTuple, ZodOptional, ZodTypeAny } from "zod"
import { ZsMonoLike } from "../../core/mono-type"
import { ZodKindedAny } from "../../core/types"
import { ZsFunction } from "../../expressions/function"
import { ZsConstructor } from "./members/constructor"
import { ZsImplementable, ZsImplements } from "./members/implements"
import { ZsIndexer } from "./members/indexer"
import { ZsMember } from "./members/member"
import { ZsOverloads } from "./members/overloads"
import { MethodDeclarator, MethodsDeclaration } from "./method-builder"

export type UnionFields<Types extends Record<keyof Types, ZodKindedAny>> = {
    [K in keyof Types & string]: [ZsMember<K, Types[K]>]
}[keyof Types & string][0]

export class ClassBuilder {
    Fields<Types extends Record<keyof Types, ZodKindedAny>>(
        stuffs: Types
    ): Iterable<UnionFields<Types>> {
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

    Method<Name extends string, Methods extends ZsFunction>(
        name: Name,
        declarator: MethodsDeclaration<Methods> | [Methods, ...Methods[]]
    ): Methods extends never
        ? never
        : ZsMember<Name, ZsOverloads<[Methods, ...Methods[]]>> {
        const overloads = [
            ...(typeof declarator === "function"
                ? declarator(new MethodDeclarator())
                : declarator)
        ] as [Methods, ...Methods[]]

        return ZsMember.create(name, ZsOverloads.create(...overloads)) as any
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

import { Lazy } from "lazies"
import { AnyZodTuple, ZodOptional, ZodTypeAny } from "zod"
import { ZsMonoLike } from "../../core/mono-type"
import { ZodKindedAny } from "../../core/types"
import { ZsClassLike, ZsFunctionLike } from "../../utils/unions"
import { ZsTypeSelf } from "../zenesis-self"
import { ZsClassItems } from "./body"
import { ZsClass } from "./class"
import { ZsConstructor } from "./members/constructor"
import { ZsImplementable, ZsImplements } from "./members/implements"
import { ZsIndexer } from "./members/indexer"
import { ZsProperty } from "./members/member"
import { ZsOverloads } from "./members/overloads"
import { MethodDeclarator, MethodScope } from "./method-builder"
import { ZsThis } from "./this"

export type UnionFields<Types extends Record<keyof Types, ZodKindedAny>> = {
    [K in keyof Types & string]: [ZsProperty<K, Types[K]>]
}[keyof Types & string][0]

export class ClassScopedFactory<Self extends ZsClassLike = ZsClass> {
    constructor(private _self: Lazy<Self>) {}
    get thisType() {
        return ZsThis.create()
    }
    get selfRef() {
        return ZsTypeSelf.create(this._self)
    }
    Property<Name extends string, Type extends ZodTypeAny>(
        name: Name,
        type: Type
    ): ZsProperty<Name, Type> {
        return ZsProperty.create(name, type)
    }

    Overloads<Name extends string, Methods extends ZsFunctionLike>(
        name: Name,
        declarator: MethodScope<Methods> | [Methods, ...Methods[]] | Methods
    ): Methods extends never
        ? never
        : ZsProperty<Name, ZsOverloads<[Methods, ...Methods[]]>> {
        let overloads: [Methods, ...Methods[]]
        if (typeof declarator === "function") {
            const result = declarator(new MethodDeclarator())
            if (Symbol.iterator in result) {
                overloads = [...result] as any
            } else {
                overloads = [result]
            }
        } else if (Symbol.iterator in declarator) {
            overloads = [...declarator]
        } else {
            overloads = [declarator]
        }
        if (overloads.length === 0) {
            throw new Error("Overloads must have at least one overload")
        }

        return ZsProperty.create(name, ZsOverloads.create(...overloads)) as any
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

export type ClassScope<Self extends ZsClassLike, Decl extends ZsClassItems> = (
    this: ClassScopedFactory<Self>
) => Generator<Decl>

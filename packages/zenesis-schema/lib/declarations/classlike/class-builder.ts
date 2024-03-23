import { AnyZodTuple, ZodOptional, ZodTypeAny } from "zod"
import { ZsMonoLike } from "../../core/mono-type"
import { ZsShapedRef } from "../../core/types"
import { ZsFunction } from "../../expressions/function"
import { ZsGenericSelfref, ZsTypeSelfref } from "../zenesis-self"
import { ZsClassItems } from "./body"
import { ZsConstructor } from "./members/constructor"
import { ZsImplements } from "./members/implements"
import { ZsIndexer } from "./members/indexer"
import { ZsProperty } from "./members/member"
import { ZsOverloads } from "./members/overloads"
import { ZsThis } from "./this"

export class ClassScopedFactory<Self extends ZsGenericSelfref | ZsTypeSelfref> {
    constructor(readonly self: Self) {}
    get thisType() {
        return ZsThis.create()
    }

    Property<Name extends string, Type extends ZodTypeAny>(
        name: Name,
        type: Type
    ): ZsProperty<Name, Type> {
        return ZsProperty.create(name, type)
    }

    Method<Name extends string, Func extends ZsFunction>(
        name: Name,
        func: Func | Func[]
    ) {
        if (Array.isArray(func)) {
            var overloads = ZsOverloads.create(() => func)
        } else {
            overloads = ZsOverloads.create(() => [func])
        }
        return ZsProperty.create(name, overloads)
    }

    Implements<ZShaped extends ZsShapedRef>(
        type: ZShaped,
        auto = true
    ): ZsImplements<ZShaped["shape"]> {
        return ZsImplements.create(type, auto)
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

export type ClassScope<Decl extends ZsClassItems> = () => Iterable<Decl>

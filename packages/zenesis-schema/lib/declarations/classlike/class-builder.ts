import { AnyZodTuple, ZodOptional, ZodTypeAny } from "zod"
import { ZsMonoLike } from "../../core/mono-type"
import { ZsShapedRef } from "../../core/types"
import { ZsFunction } from "../../expressions/function"
import { ZsOverloads } from "../../expressions/overloads"
import { ZsThis } from "../../expressions/this"
import { ZsConstructor } from "../../members/constructor"
import { ZsImplements } from "../../members/implements"
import { ZsIndexer } from "../../members/indexer"
import { ZsProperty } from "../../members/property"
import { ZsClassTypeLike } from "../../utils/unions"

export class ClasslikeContext<Self extends ZsClassTypeLike> {
    constructor(readonly self: Self) {}
    get this() {
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

    Indexer<
        Key extends
            | ZsMonoLike<PropertyKey>
            | ZodOptional<ZsMonoLike<PropertyKey>>,
        Value extends ZodTypeAny
    >(keyType: Key, valueType: Value): ZsIndexer<Key, Value> {
        return ZsIndexer.create(keyType, valueType)
    }
}

export class ClassContext<
    Self extends ZsClassTypeLike
> extends ClasslikeContext<Self> {
    AutoImplements<ZShaped extends ZsShapedRef>(
        type: ZShaped
    ): ZsImplements<ZShaped["shape"]> {
        return ZsImplements.create(type, "auto implement")
    }

    Constructor<ZTuple extends AnyZodTuple>(params: ZTuple) {
        return ZsConstructor.create(params)
    }
}

export class InterfaceContext<
    Self extends ZsClassTypeLike
> extends ClasslikeContext<Self> {
    Extends<ZShaped extends ZsShapedRef>(
        type: ZShaped
    ): ZsImplements<ZShaped["shape"]> {
        return ZsImplements.create(type, "extend")
    }
}

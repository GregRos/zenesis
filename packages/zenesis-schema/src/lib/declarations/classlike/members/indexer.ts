import { ZodOptional, ZodTypeAny } from "zod"
import { ZsMonoLike } from "../../../core/mono-type"
import { ZsStructural } from "../../../misc-node"
import { ZsMemberKind } from "./kind"

export interface ZsIndexerDef<
    Key extends ZsMonoLike<PropertyKey> | ZodOptional<ZsMonoLike<PropertyKey>>,
    Value extends ZodTypeAny,
    Optional extends boolean
> {
    memberName: ZsMemberKind.ZsIndexer
    keyType: Key
    valueType: Value
}

export class ZsIndexer<
    Key extends
        | ZsMonoLike<PropertyKey>
        | ZodOptional<ZsMonoLike<PropertyKey>> =
        | ZsMonoLike<PropertyKey>
        | ZodOptional<ZsMonoLike<PropertyKey>>,
    Value extends ZodTypeAny = ZodTypeAny,
    Optional extends boolean = false
> extends ZsStructural<ZsIndexerDef<Key, Value, Optional>> {
    static create<
        Key extends
            | ZsMonoLike<PropertyKey>
            | ZodOptional<ZsMonoLike<PropertyKey>>,
        Value extends ZodTypeAny
    >(keyType: Key, valueType: Value) {
        return new ZsIndexer({
            memberName: ZsMemberKind.ZsIndexer,
            keyType,
            valueType
        })
    }
}

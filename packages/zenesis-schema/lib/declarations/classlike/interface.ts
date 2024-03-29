import { ZodTypeDef } from "zod"
import { ZsDeclKind } from "../../core/declaration-kind"
import { ZsMonoType } from "../../core/mono-type"
import { getCombinedType } from "../../core/operators"
import { ZsTypeKind } from "../../core/type-kind"
import { eraseInterface } from "../../utils/erasure"
import { createSelfref } from "../selfref"
import { ZsClassBody, ZsClassItems } from "./class-body"

export interface ZsInterfaceDef<Name extends string, Body extends ZsClassBody>
    extends ZodTypeDef {
    name: Name
    declName: ZsDeclKind.ZsInterface
    typeName: ZsTypeKind.ZsInterface
    body: Body
}

export class ZsInterface<
    Name extends string = string,
    Body extends ZsClassBody = ZsClassBody
> extends ZsMonoType<
    getCombinedType<Body["shape"]>,
    ZsInterfaceDef<Name, Body>
> {
    readonly declaration = "interface"
    readonly name = this._def.name
    readonly refAs = this
    readonly body = this._def.body
    get actsLike() {
        return this._def.body.schema
    }

    get shape() {
        return this._def.body.shape
    }

    static create<Name extends string, Memberable extends ZsClassItems>(
        name: Name,
        body: () => Iterable<Memberable>
    ) {
        const selfref = createSelfref({
            deref: () => erased,
            name,
            text: name
        })
        const result = new ZsInterface({
            name,
            declName: ZsDeclKind.ZsInterface,
            typeName: ZsTypeKind.ZsInterface,
            body: ZsClassBody.create(body, selfref)
        })
        const erased = eraseInterface(result)
        return result
    }
}

import { ZodTypeDef } from "zod"
import { ZsMonoType } from "../../core/mono-type"
import { getCombinedType } from "../../core/operators"
import { ZsTypeKind } from "../../kinds"
import { ZsDeclKind } from "../kind"
import { ClassDeclaration, ZsClassBody, ZsMemberable } from "./body"

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

    get actsLike() {
        return this._def.body.schema
    }

    get shape() {
        return this._def.body.shape
    }

    static create<Name extends string, Memberable extends ZsMemberable>(
        name: Name,
        body: ClassDeclaration<Memberable>
    ) {
        return new ZsInterface({
            name,
            declName: ZsDeclKind.ZsInterface,
            typeName: ZsTypeKind.ZsInterface,
            body: ZsClassBody.create(body)
        })
    }
}

let a: 1[]

import { Lazy, lazy } from "lazies"
import { ZodTypeDef } from "zod"
import { ZsTypeKind } from "../../core/kinds"
import { ZsMonoType } from "../../core/mono-type"
import { getCombinedType } from "../../core/operators"
import { ZsDeclKind } from "../kind"
import { ZsClassBody, ZsClassItems } from "./body"
import { ClassScope, ClassScopedFactory } from "./class-builder"

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
        body: ClassScope<ZsInterface, Memberable>
    ) {
        const delayed = lazy(() => result) as Lazy<ZsInterface>
        const decls = body.bind(new ClassScopedFactory(delayed))
        const result = new ZsInterface({
            name,
            declName: ZsDeclKind.ZsInterface,
            typeName: ZsTypeKind.ZsInterface,
            body: ZsClassBody.create(decls)
        })
    }
}

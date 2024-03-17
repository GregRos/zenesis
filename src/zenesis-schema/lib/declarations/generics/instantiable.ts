import { SchemaSubtypeOf } from "../../core/operators"
import { ZsInstantiation } from "../../expressions/instantiation"
import { ZsInstantiable } from "../unions"
import { ZsTypeVar, ZsTypeVarsRecord } from "./type-var"

export interface Instantiable<
    Vars extends ZsTypeVarsRecord,
    Instance extends ZsInstantiable
> {
    readonly name: string
    instantiate<
        TypeArgs extends {
            [Name in keyof Vars as Vars[Name] extends ZsTypeVar<any, null>
                ? Name
                : never]: SchemaSubtypeOf<Vars[Name]["_def"]["extends"]>
        } & {
            [Name in keyof Vars]?: SchemaSubtypeOf<
                Vars[Name]["_def"]["extends"]
            >
        }
    >(
        args: TypeArgs
    ): ZsInstantiation<Instance>
}

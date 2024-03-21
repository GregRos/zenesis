import { ZodTypeAny } from "zod"
import { ZsTypeAlias } from "../declarations/alias"
import { ZsClassItems } from "../declarations/classlike/body"
import { ZsClass } from "../declarations/classlike/class"
import { ClassScope } from "../declarations/classlike/class-builder"
import { ZsInterface } from "../declarations/classlike/interface"
import { ZsValue, ZsValueKind } from "../declarations/value"

export class ModuleScopedFactory {
    Interface<Name extends string, Decl extends ZsClassItems>(
        name: Name,
        declarations: ClassScope<ZsInterface, Decl>
    ) {
        return ZsInterface.create(name, declarations)
    }

    Class<Name extends string, Decl extends ZsClassItems>(
        name: Name,
        declarations: ClassScope<ZsClass, Decl>
    ) {
        return ZsClass.create(name, declarations)
    }

    TypeAlias<Name extends string, T extends ZodTypeAny>(name: Name, type: T) {
        return ZsTypeAlias.create(name, type)
    }

    Const(name: string, type: ZodTypeAny) {
        return ZsValue.create(name, ZsValueKind.const, type)
    }

    Function(name: string, type: ZodTypeAny) {
        return ZsValue.create(name, ZsValueKind.function, type)
    }

    Let(name: string, type: ZodTypeAny) {
        return ZsValue.create(name, ZsValueKind.let, type)
    }

    Var(name: string, type: ZodTypeAny) {
        return ZsValue.create(name, ZsValueKind.var, type)
    }
}

import { ZodTypeAny } from "zod"
import { ZsTypeAlias } from "../declarations/alias"
import { ClassDeclaration, ZsMemberable } from "../declarations/classlike/body"
import { ZsClass } from "../declarations/classlike/class"
import { ZsInterface } from "../declarations/classlike/interface"
import { ZsValue, ZsValueKind } from "../declarations/value"

export class ModuleDeclarator {
    Interface<Name extends string, Decl extends ZsMemberable>(
        name: Name,
        declarations: ClassDeclaration<Decl>
    ) {
        return ZsInterface.create(name, declarations)
    }

    Class<Name extends string, Decl extends ZsMemberable>(
        name: Name,
        declarations: ClassDeclaration<Decl>
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

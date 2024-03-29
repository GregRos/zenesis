import { ZsTypeAlias } from "../declarations/alias"
import { ZsClass } from "../declarations/classlike/class"
import { ZsInterface } from "../declarations/classlike/interface"

export function eraseClass(cls: ZsClass): ZsClass {
    return cls
}
export function eraseInterface(cls: ZsInterface): ZsInterface {
    return cls
}
export function eraseTypeAlias(cls: ZsTypeAlias): ZsTypeAlias {
    return cls
}

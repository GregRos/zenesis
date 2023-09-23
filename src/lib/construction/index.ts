import { ZsGenericType } from "./generic/generic-type"
import { ZsFunction } from "./expressions/function"
import { ZsConditional } from "./expressions/conditional"
import { ZsKeyof } from "./expressions/keyof"
import { ZsMapped } from "./expressions/mapped"
import { ZsWorld } from "../containers/world"
import { z } from "zod"
import {
    ZsModuleDecl,
    ZsModuleDeclarations,
    ZsModuleFragment
} from "./module-declarations/module-fragment"
import { ZsClassFragment } from "./class-declarations/class-fragment"

const fullZs = {
    generic: ZsGenericType.create,
    fun: ZsFunction.create,
    when: ZsConditional.create,
    keyof: ZsKeyof.create,
    mapped: ZsMapped.create,
    world: ZsWorld.create,
    module: <Exports extends ZsModuleDecl>(
        exports: ZsModuleDeclarations<Exports>
    ) => {
        return ZsModuleFragment.create(exports)
    },
    class: ZsClassFragment.create,
    ...z
}

export const zs = fullZs as Omit<typeof fullZs, "function">
export { ZsTypeAlias } from "./module-declarations/alias"
export { ZsInterface } from "./module-declarations/interface"
export { ZsClass } from "./module-declarations/class"
export { ZsImport } from "./external/import"
export { ZsInstantiation } from "./expressions/instantiation"
export { ZsTypeVar } from "./generic/type-var"
export { ZsMapVar } from "./expressions/map-var"
export { ZsLookup } from "./expressions/lookup"
export { ZsOverloads } from "./expressions/overloads"
export { ZsAccess } from "./class-declarations/public"
export { ZsTypeKind } from "./kinds"
export { ZsMonoType } from "./mono-type"
export { ZsTypeCtors } from "./expressions/instantiation"
export {
    ZsConditional,
    ZsFunction,
    ZsGenericType,
    ZsKeyof,
    ZsMapped,
    ZsWorld,
    ZsClassFragment
}

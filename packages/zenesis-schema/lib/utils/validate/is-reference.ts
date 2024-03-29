import { ZsImported } from "../../containers/zenesis-import"
import { ZsRefKind } from "../../core/ref-kind"
import { ZsBaseReference, symVia } from "../../core/reference"
import { ZsGenericSelfref } from "../../declarations/generic-selfref"
import { ZsTypeSelfref } from "../../declarations/selfref"
import { ZsGeneric } from "../../generics/generic"
import {
    ZsDeclarableTypeLike,
    ZsExportableTypeLike,
    ZsModuleDeclarableType
} from "../unions"

export function isReference<T extends ZsDeclarableTypeLike>(
    obj: any,
    isRefTarget?: (x: ZsDeclarableTypeLike) => x is T
): obj is ZsBaseReference<T> {
    return !!obj?.[symVia] && (!isRefTarget || isRefTarget(obj))
}

export function isImport<Target extends ZsExportableTypeLike>(
    obj: any,
    isRefTarget?: (x: ZsExportableTypeLike) => x is Target
): obj is ZsImported<Target> {
    return obj[symVia] === ZsRefKind.ZsImport
}

export function isSelfref<Target extends ZsModuleDeclarableType>(
    obj: any,
    isRefTarget?: (x: ZsModuleDeclarableType) => x is Target
): obj is ZsTypeSelfref {
    return (
        obj[symVia] === ZsRefKind.ZsSelfref &&
        (!isRefTarget || isRefTarget(obj))
    )
}

export function isGenericSelfref<Generic extends ZsGeneric>(
    obj: any,
    isRefTarget?: (x: ZsGeneric) => x is ZsGeneric
): obj is ZsGenericSelfref {
    return (
        obj[symVia] === ZsRefKind.ZsGenericSelfref &&
        (!isRefTarget || isRefTarget(obj))
    )
}

export function isInstantiation<Imported extends ZsExportableTypeLike>(
    obj: any,
    isRefTarget?: (x: ZsExportableTypeLike) => x is Imported
): obj is ZsImported {
    return obj[symVia] === ZsRefKind.ZsInstantiation
}

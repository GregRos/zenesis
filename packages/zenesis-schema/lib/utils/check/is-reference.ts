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
    obj: any
): obj is ZsBaseReference<T> {
    return !!obj?.[symVia] && (!isRefTarget  || isRefTarget(obj))
}

export function isImport<Target extends ZsExportableTypeLike>(
    obj: any,
    isRefTarget?: (x: ZsExportableTypeLike) => x is Target
): obj is ZsImported<Target> {
    return obj[symVia] === ZsRefKind.ZsImport
}

export function isSelfref<Target extends ZsModuleDeclarableType>(
    obj: any
): obj is ZsTypeSelfref {
    return (
        obj[symVia] === ZsRefKind.ZsSelfref
    )
}

export function isGenericSelfref<Generic extends ZsGeneric>(
    obj: any,
    isRefTarget?: (x: ZsGeneric) => x is ZsGeneric
): obj is ZsGenericSelfref {
    return (
        obj[symVia] === ZsRefKind.ZsGenericSelfref
    )
}

export function isInstantiation<Imported extends ZsExportableTypeLike>(
    obj: any,
    isRefTarget?: (x: ZsExportableTypeLike) => x is Imported
): obj is ZsImported {
    return obj[symVia] === ZsRefKind.ZsInstantiation
}

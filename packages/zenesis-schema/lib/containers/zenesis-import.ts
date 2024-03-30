import { ZsRefKind } from "../core/ref-kind"
import {
    ZsReferenceDef,
    ZsReferenceInput,
    createReference
} from "../core/reference"
import { ZsExportableTypeLike } from "../utils/unions"
import { ZsZenesisModule } from "./zenesis-module"

export interface ZsImportDef<ZType extends ZsExportableTypeLike>
    extends ZsReferenceDef<ZType> {
    readonly via: ZsRefKind.ZsImport
    readonly origin: ZsZenesisModule
}

export type ZsImported<
    ZType extends ZsExportableTypeLike = ZsExportableTypeLike
> = ZType & ZsImportDef<ZType>

export function createImportReference<ZType extends ZsExportableTypeLike>(
    importInfo: ZsReferenceInput<ZsImportDef<ZType>>
): ZsImported<ZType> {
    return createReference(ZsRefKind.ZsImport, importInfo)
}

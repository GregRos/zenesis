import { ZsMemberKind } from "@zenesis/schema"
import {
    CallSignatureDeclaration,
    ConstructSignatureDeclaration,
    ConstructorDeclaration,
    HeritageClause,
    IndexSignatureDeclaration,
    MethodSignature,
    PropertySignature
} from "typescript"
export abstract class ZsToTsMemberTable {
    [ZsMemberKind.ZsCallSignature]!: CallSignatureDeclaration[];
    [ZsMemberKind.ZsProperty]!: (PropertySignature | MethodSignature)[];
    [ZsMemberKind.ZsIndexer]!: IndexSignatureDeclaration;
    [ZsMemberKind.ZsConstructor]!: ConstructorDeclaration;
    [ZsMemberKind.ZsConstruct]!: ConstructSignatureDeclaration[];
    [ZsMemberKind.ZsImplements]!: HeritageClause
}

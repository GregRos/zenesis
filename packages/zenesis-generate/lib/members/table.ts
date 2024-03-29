import { ZsMemberKind } from "@zenesis/schema"
import {
    CallSignatureDeclaration,
    ConstructorDeclaration,
    IndexSignatureDeclaration,
    MethodDeclaration,
    PropertyDeclaration
} from "typescript"
export abstract class ZsToTsMemberTable {
    [ZsMemberKind.ZsCallSignature]!: CallSignatureDeclaration;
    [ZsMemberKind.ZsProperty]!: PropertyDeclaration | MethodDeclaration;
    [ZsMemberKind.ZsIndexer]!: IndexSignatureDeclaration;
    [ZsMemberKind.ZsConstructor]!: ConstructorDeclaration;
    [ZsMemberKind.ZsConstruct]!: ConstructorDeclaration
}

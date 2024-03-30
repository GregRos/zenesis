import { ZsMemberKind } from "../core/member-kind"
import { ZsCallSignature } from "./call-signature"
import { ZsConstruct } from "./construct-signature"
import { ZsConstructor } from "./constructor"
import { ZsImplements } from "./implements"
import { ZsIndexer } from "./indexer"
import { ZsProperty } from "./property"

export abstract class ZsMemberNodeTable {
    [ZsMemberKind.ZsConstructor]!: ZsConstructor;
    [ZsMemberKind.ZsProperty]!: ZsProperty;
    [ZsMemberKind.ZsIndexer]!: ZsIndexer;
    [ZsMemberKind.ZsImplements]!: ZsImplements;
    [ZsMemberKind.ZsCallSignature]!: ZsCallSignature;
    [ZsMemberKind.ZsConstruct]!: ZsConstruct
}

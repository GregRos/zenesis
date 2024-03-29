import { ZsMemberKind } from "../core/member-kind"
import { ZsCallSignature } from "../members/call-signature"
import { ZsConstruct } from "../members/construct-signature"
import { ZsConstructor } from "../members/constructor"
import { ZsImplements } from "../members/implements"
import { ZsIndexer } from "../members/indexer"
import { ZsProperty } from "../members/property"

export abstract class ZsMemberTable {
    [ZsMemberKind.ZsConstructor]!: ZsConstructor;
    [ZsMemberKind.ZsProperty]!: ZsProperty;
    [ZsMemberKind.ZsIndexer]!: ZsIndexer;
    [ZsMemberKind.ZsImplements]!: ZsImplements;
    [ZsMemberKind.ZsCallSignature]!: ZsCallSignature;
    [ZsMemberKind.ZsConstruct]!: ZsConstruct
}

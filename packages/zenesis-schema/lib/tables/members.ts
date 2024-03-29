import { ZsMemberKind } from "../core/member-kind"
import { ZsCallSignature } from "../declarations/classlike/members/call-signature"
import { ZsConstructor } from "../declarations/classlike/members/constructor"
import { ZsImplements } from "../declarations/classlike/members/implements"
import { ZsIndexer } from "../declarations/classlike/members/indexer"
import { ZsNewSignature } from "../declarations/classlike/members/new-signature"
import { ZsProperty } from "../declarations/classlike/members/property"

export abstract class ZsMemberTable {
    [ZsMemberKind.ZsConstructor]!: ZsConstructor;
    [ZsMemberKind.ZsProperty]!: ZsProperty;
    [ZsMemberKind.ZsIndexer]!: ZsIndexer;
    [ZsMemberKind.ZsImplements]!: ZsImplements;
    [ZsMemberKind.ZsCallSignature]!: ZsCallSignature;
    [ZsMemberKind.ZsConstruct]!: ZsNewSignature
}

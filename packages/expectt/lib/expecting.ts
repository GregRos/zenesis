import {
    Assert_Equal,
    Assert_Subtype,
    Assert_Supertype
} from "./type-relations"

export interface Type<Expected> {
    equals<Target>(truth: Assert_Equal<Expected, Target>): Type<Expected>
    assigns_to<Target>(truth: Assert_Subtype<Expected, Target>): Type<Expected>
    assigns_from<Target>(
        truth: Assert_Supertype<Expected, Target>
    ): Type<Expected>
}

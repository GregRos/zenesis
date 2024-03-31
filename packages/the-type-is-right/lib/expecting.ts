import {
    Assert_AssignsFrom,
    Assert_AssignsTo,
    Assert_Equal
} from "./type-relations"

export interface TheType<Expected> {
    equals<Target>(truth: Assert_Equal<Expected, Target>): TheType<Expected>
    assigns_to<Target>(
        truth: Assert_AssignsTo<Expected, Target>
    ): TheType<Expected>
    assigns_from<Target>(
        truth: Assert_AssignsFrom<Expected, Target>
    ): TheType<Expected>
}

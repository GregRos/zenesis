import { Was } from "./expecting"
import {
    Txt_AnyMismatch,
    Txt_AreEqual,
    Txt_Expected,
    Txt_IsAssignable,
    Txt_NotExact,
    Txt_Target,
    _NotAssignable
} from "./texts"
type Not_Assignable_To<A extends string, B extends string> = _NotAssignable<
    A,
    B
>
export type NA_ToTarget<Target> = Not_Assignable_To<Txt_Expected, Txt_Target> &
    Target
export type NA_ToExpected<Expected> = Not_Assignable_To<
    Txt_Target,
    Txt_Expected
>

export type IsEqual<Expected, Target> = IsSubtype<
    Expected,
    Target,
    IsSupertype<
        Expected,
        Target,
        Any extends TestExact<Expected, Target>
            ? Was<Expected, Txt_IsAssignable<Txt_Expected, Txt_Target>, Target>
            :
                  | Was<
                        Expected,
                        Txt_NotExact<Txt_Expected, Txt_Target>,
                        Target
                    >
                  | false,
        false
    >,
    false
>

export type IsSupertype<Expected, Target> =
    IsAny<Target> extends 1
        ? IsAny<Expected> extends 1
            ?
                  | true
                  | Was<
                        Expected,
                        Txt_AreEqual<Txt_Expected, Txt_Target>,
                        Target
                    >
            : Txt_AnyMismatch<Txt_Target, Txt_Expected> | false
        : IsAny<Expected> extends 1
          ? Was<Expected, Txt_AnyMismatch<Txt_Expected, Txt_Target>, Target>
          : [Expected] extends [Target]
            ? Was<Expected, Txt_IsAssignable<Txt_Expected, Txt_Target>, Target>
            :
                  | Was<
                        Target,
                        Txt_IsAssignable<Txt_Expected, Txt_Target>,
                        Target
                    >
                  | false
export type IsSubtype<Expected, Target, True, False> =
    IsAny<Expected> extends 1
        ? IsAny<Target> extends 1
            ? True
            : Txt_AnyMismatch<Txt_Expected, Txt_Target> | False
        : IsAny<Target> extends 1
          ? Txt_AnyMismatch<Txt_Target, Txt_Expected> | False
          : [Target] extends [Expected]
            ? True
            : _NotAssignable<Txt_Expected, Txt_Target> | False
export type IsAny<T> = Any extends T ? ([T] extends [Any] ? 1 : 0) : 0
export type TestExact<Left, Right> =
    (<U>() => U extends Left ? 1 : 0) extends <U>() => U extends Right ? 1 : 0
        ? Any
        : never
// Give "any" its own class

export class Any {
    private _!: true
}

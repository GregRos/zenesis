import {
    Txt_AnyMismatch,
    Txt_Expected,
    Txt_NotExact,
    Txt_Target,
    _NotAssignable
} from "./texts"
type Not_Assignable_To<A extends string, B extends string> = _NotAssignable<
    A,
    B
>
export type NA_ToTarget<Target> = Not_Assignable_To<Txt_Expected, Txt_Target>
export type NA_ToExpected<Expected> = Not_Assignable_To<
    Txt_Target,
    Txt_Expected
>
export type IsEqual<Expected, Target, True> =
    IsAny<Expected> extends 1
        ? IsAny<Target> extends 1
            ? True
            : Txt_AnyMismatch<Txt_Expected, Txt_Target>
        : IsAny<Target> extends 1
          ? Txt_AnyMismatch<Txt_Target, Txt_Expected>
          : [Expected] extends [Target]
            ? [Target] extends [Expected]
                ? Any extends TestExact<Expected, Target>
                    ? True
                    : Txt_NotExact<Txt_Expected, Txt_Target>
                : NA_ToTarget<Target>
            : NA_ToExpected<Expected>
export type IsSuper<Expected, Target, True> =
    IsAny<Target> extends 1
        ? IsAny<Expected> extends 1
            ? True
            : Txt_AnyMismatch<Txt_Target, Txt_Expected>
        : IsAny<Expected> extends 1
          ? Txt_AnyMismatch<Txt_Expected, Txt_Target>
          : [Expected] extends [Target]
            ? True
            : _NotAssignable<Txt_Target, Txt_Expected>
export type IsSubtype<Expected, Target, True> =
    IsAny<Expected> extends 1
        ? IsAny<Target> extends 1
            ? True
            : Txt_AnyMismatch<Txt_Expected, Txt_Target>
        : IsAny<Target> extends 1
          ? Txt_AnyMismatch<Txt_Target, Txt_Expected>
          : [Target] extends [Expected]
            ? True
            : _NotAssignable<Txt_Expected, Txt_Target>
export type IsAny<T> = Any extends T ? ([T] extends [Any] ? 1 : 0) : 0
export type TestExact<Left, Right> =
    (<U>() => U extends Left ? 1 : 0) extends <U>() => U extends Right ? 1 : 0
        ? Any
        : never
// Give "any" its own class

export class Any {
    private _!: true
}

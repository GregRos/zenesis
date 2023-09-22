export type ZsModifierState = "+" | "-" | "normal" | null;

export interface ZsMappedTypeModifiers {
    readonly: ZsModifierState;
    optional: ZsModifierState;
}

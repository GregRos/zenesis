import { ZsModifierState } from "../construction/modifier-states"
import { tf } from "./tf"
import {
    MinusToken,
    PlusToken,
    QuestionToken,
    ReadonlyKeyword,
    SyntaxKind
} from "typescript"

export type ReadonlyStates<S extends ZsModifierState> = S extends "-"
    ? MinusToken
    : S extends "+"
    ? PlusToken
    : S extends "normal"
    ? ReadonlyKeyword
    : undefined
export function getReadonly<S extends ZsModifierState>(
    state: S
): ReadonlyStates<S> {
    switch (state) {
        case "-":
            return tf.createToken(SyntaxKind.MinusToken) as ReadonlyStates<S>
        case "+":
            return tf.createToken(SyntaxKind.PlusToken) as ReadonlyStates<S>
        case "normal":
            return tf.createToken(
                SyntaxKind.ReadonlyKeyword
            ) as ReadonlyStates<S>
        case undefined:
        case null:
            return undefined as ReadonlyStates<S>
    }
    throw new Error(`Unknown readonly state: ${state}`)
}

export type OptStates<S extends ZsModifierState> = S extends "-"
    ? MinusToken
    : S extends "+"
    ? PlusToken
    : S extends "normal"
    ? QuestionToken
    : undefined

export function getOptional<S extends ZsModifierState>(state: S): OptStates<S> {
    switch (state) {
        case "-":
            return tf.createToken(SyntaxKind.MinusToken) as OptStates<S>
        case "+":
            return tf.createToken(SyntaxKind.PlusToken) as OptStates<S>
        case "normal":
            return tf.createToken(SyntaxKind.QuestionToken) as OptStates<S>
        case undefined:
        case null:
            return undefined as OptStates<S>
    }
    throw new Error(`Unknown optional state: ${state}`)
}

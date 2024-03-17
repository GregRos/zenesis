import { Access, ZsModifierState, ZsTypeVarVariance } from "zenesis-schema"
import { tf } from "./tf"
import {
    MinusToken,
    PlusToken,
    QuestionToken,
    ReadonlyKeyword,
    SyntaxKind
} from "typescript"

export function getAccess(access: Access) {
    switch (access) {
        case "public":
            return tf.createToken(SyntaxKind.PublicKeyword)
        case "protected":
            return tf.createToken(SyntaxKind.ProtectedKeyword)
        case "private":
            return tf.createToken(SyntaxKind.PrivateKeyword)
        default:
            throw new Error(`Unknown access ${access}`)
    }
}

export function toVarianceToken(variance: ZsTypeVarVariance) {
    switch (variance) {
        case "":
            return []
        case "in":
            return [tf.createToken(SyntaxKind.InKeyword)]
        case "out":
            return [tf.createToken(SyntaxKind.OutKeyword)]
        case "inout":
            return [
                tf.createToken(SyntaxKind.InKeyword),
                tf.createToken(SyntaxKind.OutKeyword)
            ]
        default:
            throw new Error(`Unknown variance ${variance}`)
    }
}

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

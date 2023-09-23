import { QuestionToken, ReadonlyKeyword } from "typescript"

export type TypeModifierToken = QuestionToken | ReadonlyKeyword

export class Box<T> {
    constructor(private value: T | undefined) {}

    clone() {
        return new Box(this.value)
    }

    set(value: T) {
        this.value = value
    }

    pull() {
        const { value } = this
        this.value = undefined
        return value
    }

    barrier() {
        const self = this.clone()
        return {}
    }
}

export class Modifier<Result> {
    constructor(
        readonly name: string,
        private _state: boolean,
        private readonly _result: Result
    ) {}

    clone() {
        return new Modifier(this.name, this._state, this._result)
    }

    set() {
        this._state = true
        return this
    }

    pull() {
        const { _state } = this
        this._state = false
        return _state ? this._result : undefined
    }

    barrier() {
        const oldSelf = this.clone()
        this._state = false
        return {
            restore: () => {
                this._state = oldSelf._state
            }
        }
    }

    static create<Result>(name: string, result: Result) {
        return new Modifier(name, false, result)
    }
}

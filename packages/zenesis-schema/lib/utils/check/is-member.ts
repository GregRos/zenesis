import { ZsValue } from "../../declarations/value"
import { ZsOverloads } from "../../expressions/overloads"
import { ZsConstructor } from "../../members/constructor"
import { ZsImplements } from "../../members/implements"
import { ZsIndexer } from "../../members/indexer"
import { ZsProperty } from "../../members/property"

export function isProperty(input: any): input is ZsProperty {
    return input instanceof ZsProperty
}

export function isMethod(input: any): input is ZsProperty<string, ZsOverloads> {
    return input instanceof ZsProperty && input.valueType instanceof ZsOverloads
}

export function isImplements(input: any): input is ZsImplements {
    return input instanceof ZsImplements
}

export function isConstructor(input: any): input is ZsConstructor {
    return input instanceof ZsConstructor
}

export function isIndexer(input: any): input is ZsIndexer {
    return input.valueType instanceof ZsIndexer
}

export function isInterfaceMember(
    input: any
): input is ZsProperty | ZsIndexer | ZsImplements {
    return isProperty(input) || isIndexer(input) || isImplements(input)
}

export function isClassMember(
    input: any
): input is ZsProperty | ZsIndexer | ZsImplements | ZsConstructor {
    return isInterfaceMember(input) || isConstructor(input)
}

export function isValue(input: any): input is ZsValue {
    return input instanceof ZsProperty && !input.valueType
}

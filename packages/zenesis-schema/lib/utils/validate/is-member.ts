import { ZsConstructor } from "../../declarations/classlike/members/constructor"
import { ZsImplements } from "../../declarations/classlike/members/implements"
import { ZsIndexer } from "../../declarations/classlike/members/indexer"
import { ZsProperty } from "../../declarations/classlike/members/member"
import { ZsOverloads } from "../../declarations/classlike/members/overloads"
import { ZsValue } from "../../declarations/value"

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

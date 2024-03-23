export function describeSomething(thing: any) {
    if (typeof thing === "object" && thing) {
        return thing.constructor.name
    }
    if (thing === null) {
        return "null"
    }
    switch (typeof thing) {
        case "string":
            return "string"
        case "number":
            return "number"
        case "boolean":
            return "boolean"
        case "undefined":
            return "undefined"
        case "function":
            return "function"
    }
}

export function describeZenesisNode(node: any) {
    return describeSomething(node)
}

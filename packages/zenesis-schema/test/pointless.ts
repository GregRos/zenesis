import {
    Class,
    File,
    Interface,
    Member,
    World,
    string
} from "@lib/pointless-style"

const w = World("example")
const f1 = File("hello", function* () {
    const cl1 = Class("Hello", function* () {
        yield Member("value", string())
    })

    const if1 = Interface("Iface1", function* () {
        yield Member("value", string())
    })
    yield cl1
})

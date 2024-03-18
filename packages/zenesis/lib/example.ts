import { generateWorld, zs } from "@zenesis/generate/lib"
import { mkdir, writeFileSync } from "fs"
import { createPrinter } from "typescript"
const W = zs.World("example")

const f1 = W.File("hello", function* (hello) {
    const cl1 = hello.Class("Hello", function* (c) {
        yield c.Field("value", zs.string())
        yield c.Field("value2", zs.number())
    })
    yield cl1
})

const f2 = W.File("hello2", function* (hello2) {
    const cl1 = hello2.Class("Goodbye", function* (c) {
        yield c.Constructor(zs.tuple([zs.string(), zs.number()]))
        const m = c.Method("hello", [
            zs.function(zs.string()).returns(zs.string())
        ])
        yield c.Indexer(zs.string().optional(), zs.number())
        yield m
    })

    yield cl1
    yield hello2.Interface("Iface1", function* (i) {
        yield i.Field("value", zs.string())
        yield i.Field("value2", f1.Hello)
    })
})

const outs = generateWorld(W)
const printer = createPrinter()
mkdir("./out", () => {})
for (const [fileName, sourceFile] of outs) {
    console.log(`// ${fileName}`)
    writeFileSync("./out/" + fileName + ".ts", printer.printFile(sourceFile))
}

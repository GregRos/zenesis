import { generateWorld, zs } from "@zenesis/generate"
import { mkdir, writeFileSync } from "fs"
import { createPrinter } from "typescript"
const W = zs.World("example")

const f1 = W.File("hello", function* () {
    const iface1 = this.Interface("Iface1", function* () {
        yield this.Property("value", zs.string())
        yield this.Property("value2", zs.string())
    })

    const cl1 = this.Class("Hello", function* (this) {
        yield this.Property("a", zs.string())
        const a = yield this.Property("b", zs.number())

        yield this.Method("hello", zs.fun(zs.string()).returns(zs.string()))

        yield this.Implements(iface1)
    })

    yield this.forall("A", "B")
        .where("A", A => A.extends(zs.string()))
        .where("B", (B, args) => B.extends(args.A))
        .Class("Hello2", function* (typeArgs) {
            yield this.Property("a", typeArgs.A)
        })

    yield cl1
})

const f2 = W.File("hello2", function* () {
    const cl1 = this.Class("Goodbye", function* () {
        yield this.Constructor(zs.tuple([zs.string(), zs.number()]))
        yield this.Method("hello", [
            zs.function(zs.string()).returns(zs.string())
        ])
        yield this.Indexer(zs.string().optional(), zs.number())
    })
    yield cl1

    yield this.Interface("Iface1", function* () {
        yield this.Property("value", zs.string())
        yield this.Property("value2", f1.Hello)
    })
})

const outs = generateWorld(W)
const printer = createPrinter()
mkdir("./out", () => {})
for (const [fileName, sourceFile] of outs) {
    console.log(`// ${fileName}`)
    writeFileSync("./out/" + fileName + ".ts", printer.printFile(sourceFile))
}

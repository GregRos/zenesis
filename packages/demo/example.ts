import { generateWorld, zs } from "@zenesis/generate"
import { mkdir, writeFileSync } from "fs"
import { createPrinter } from "typescript"
const W = zs.World("example")

const f1 = W.File("hello", function* (_) {
    const iface1 = _.Interface("Iface1", function* (_) {
        yield _.Field("value", zs.string())
        yield _.Field("value2", zs.string())
    })
    
    const cl1 = _.Class("Hello", function* (_) {
        yield _.Field("a", zs.string())
        const a = yield _.Field("b", zs.number())

        yield _.Overloads("test", function* (_) {
            yield _.args(zs.string(), zs.number()).returns(zs.string())
            yield _.args(zs.string(), zs.date()).returns(zs.boolean())
        })
        
        yield _.Implements(iface1)
    })

    const typeVars = zs.forall("A", "B").where("A", A => A.extends(zs.string()))
    const cl = this.Class("As").body(function* (_) {
        yield _.Field("a", typeVars.A)
        yield _.Field("b", typeVars.B)
    }
    const a = yield* zs
        .forall("A", "B")
        .where("A", A => A.extends(zs.string()))
        .where("B", (B, args) => B.extends(args.A))
        .Class("fsfdf", function* (X, Y) {})
        .define(function* s(A, B) {
            yield _.Class("GenericHello", function* (_) {
                yield this.Fields({
                    a: A,
                    b: B
                })
                yield this.Overloads({
                    *first() {
                        yield this.args()
                    }
                })
                yield this.Field("b", B)
            })
            yield _.Class("GenericHello2", function* (_) {
                yield _.Field("a", A)
                yield _.Field("b", B)
            })
        })

    yield cl1
})

const f2 = W.File("hello2", function* (hello2) {
    const cl1 = hello2.Class("Goodbye", function* (c) {
        yield c.Constructor(zs.tuple([zs.string(), zs.number()]))
        const m = c.Overloads("hello", [
            zs.function(zs.string()).returns(zs.string())
        ])
        yield c.Indexer(zs.string().optional(), zs.number())
        yield m
    })

    const a = yield cl1
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

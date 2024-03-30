import { zs } from "@zenesis/generate"
const W = zs.World("hello-world")

const f1 = W.File("hello", function* () {
    const iface1 = this.Interface("Iface1", function* () {
        yield this.Property("value", zs.string())
        yield this.Property("value2", zs.string())
    })

    const cl1 = this.Class("Hello", function* (this) {
        yield this.Property("a", zs.string())
        yield this.Property("self", this.self)
        yield this.Property("thisType", this.this)
        yield this.Method("hello", zs.fun(zs.string()).returns(zs.string()))

        yield this.AutoImplements(iface1)
    })

    yield this.forall("A", "B")
        .where("A", A => A.extends(zs.string()))
        .where("B", (B, args) => B.extends(args.A))
        .Class("Hello2", function* ({ A, B }) {
            yield this.Property(
                "x",
                this.self.make(
                    zs.literal("a").or(zs.literal("b")),
                    zs.literal("a")
                )
            )
            yield this.Property("a", A)
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

W.emitSync({
    outDir: "out"
})

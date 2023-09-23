import { zs } from "@lib"

const w = zs.world("hello")
const f1 = zs.module(function* (m) {
    yield m.alias("a", zs.string())
    yield f1.ref("a")
})

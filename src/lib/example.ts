import { zs } from "./construction";

const w = zs.world("hello");
const f1 = zs.module(function* (m) {
    const a = m.alias("A", zs.string());
    yield m.alias("B", a.array());
});

const f2 = zs.module(function* (m) {
    yield m.alias("A", f1.ref("B"));
    const x = f1.ref("B");
});

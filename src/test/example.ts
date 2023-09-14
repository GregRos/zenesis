import { zs } from "@lib";

const u = zs.universe();

const file = u.file("hello", function* (space) {
    yield space.class("TestClass").body({
        field: zs.field(zs.number()),
        method: zs.method(zs.fun(zs.string()).returns(zs.number()))
    });
});
const file2 = u.file("hello2", function* (space) {
    yield space.class("TestClass2").body({
        field: zs.field(file.TestClass)
    });
});

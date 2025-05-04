`zodiverse` builds on `zod` to create **a framework for generating type definitions**.

* Generate carefully designed, fully documented type definitions using all modern TypeScript constructs:
    * Type parameters!
    * Mapped types!
    * Conditional types!
    * Everything is on the table!
* Back them with `zod` validation schemas!

`zodiverse` is ***extremely powerful*** and might be *overwhelming* for novices. Which is why you can use it to build your own code generation tools!

**PROTIP:** `zodiverse` will validate your type definitions, but not your data! You’ve got `zod` for that!
# Install
```bash
npm install zod zodiverse
```
# How it works
`zodiverse` extends `zod` in a few ways, while trying to be as unobtrusive as possible.

1. **superstructure:** `zodiverse` introduces several objects that contain `zod` schemas, such as *universes* and *files*.
2. **refined nodes:** `zodiverse` provides its own versions of some `zod` schema nodes to support *representational data*, such as functions with type parameters, generic types that can be instantiated, and more.
3. 







Examples include:
1. Generic types
2. 
# The Universe
A universe is a set of interacting type declarations. Universes contain types spread over different organizational structures, such as:

1. Files
2. Namespace declarations
3. Module declarations
4. Dependencies

Here is how you can define a universe:

```typescript
import {zs} from "zod-scribe"
const u = zs.universe()
```

Universes are mutable.
# Adding module files
Adding module files to your universe uses the `file` function. You need to set the name of the file. You don't need to specify an  extension.
 
```typescript
const file = u.file("my-favorite-file")
```

Files understand directory structure. One way of making use of it is to use file paths:
```ts
const file = u.file("dir/file")
```

Another way is to create a `dir` object, and use that to create contained files.
```ts
const dir = u.dir("dir")
const file = dir.file("file")
```

Both files and dirs are mutable.
## Other declaration spaces
A `file` is a **declaration space** – an organizational unit that can contain *referenceable declarations*. Other possible declaration spaces are the `namespace` and the `module`.

Currently only files are supported.

## Referencing types by name


# Declaring things
TypeScript files can contain lots of different types of declarations:

1. Value bindings
2. Functions
3. Classes
4. Interfaces
5. Type aliases
6. And more

`zod-scribe` lets you declare all these things using code, even leveraging complex features like generics and mapped types.
### Class
Declaring a class involves

```ts
const u = zs.universe()
const file = u.file("abc")

const clazz = file.class("className", {
    name: c.field(z.string()).describe("description").readonly(),
    overloaded: [
        u.function([
            u.string().describe("bzzt", "asdsad"),
            u.number().describe("name", "boo"),
        ]).returns(,

    ]
})
```

Other declaration spaces are the `namespace` and the `module`.

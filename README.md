`zenesis` lets you generate type definitions dynamically.

```typescript
import {zs} from "zenesis"
const u = zs.universe()
const file = universe.file("my-store", () => {

	yield supervisor
	const blah = zs.typeAliases({
		Employee: {
			name: zs.string(),
			hire: zs.method(z.lazy(blah.Employee))
		}
	})

	const employee = zs.typeAlias("Employee", zs.lazy(() => zs.object({
		name: zs.string(),
		age: zs.number(),
		supervisor: employee.or(zs.null())
	})))
	const otherThing =
})
```


f



`zenesis` 

a library for generating type definitions *combinatorically*, resembling actual TypeScript code instead of some strange API, and providing as-you-type. You also get a **partial validation schema** in the process.

`zenesis` builds on `zod`, extending its schema system with entities represneting:

* Classes, class fields, overloads
* Interfaces, type aliases
* Conditional types
* Operators like `keyof` and `typeof`
* Type parameters, generic types
* Generic functions
* Modules, files
* Folders
* Imports and exports



The purpose of `zenesis` is to al

Some of these entities exist in three 

You can see these entities as existing in three dimensions at once:

1. The Zod dimension involving self-validating runtime schemas.
2. The TypeScript dimension, where we try to associate these schemas with types via `zod` operators such as `TypeOf`.
3. The generated code dimension, 





5. The Zod dimension, where schemas perform 


`zenesis` builds on `zod` by adding par

`zenesis` uses `zod` schemas primarily for type generation, rather than validating anything, though you still

`zenesis` is built on `zod`,


`zenesis` builds on `zod`, allowing you to generate carefully designed, fully documented type definitions using all modern TypeScript constructs.


  * Type parameters!
  * Mapped types!
  * Conditional types!
  * ***Everything is on the table**.*
* Back them with matching `zod` schemas.

`zodiverse` is extremely powerful and might be overwhelming for novices. Which is why you can use it to build your own code generation tools!

**PROTIP:** `zodiverse` doesn’t do any new runtime validation.

## Install

```bash
npm install zod zodiverse
```

# How it works

```typescript
const tv = dz.generic("A", "B").where({
	A: it => it.extends(it.B).defaults(it.B),
	B: it => it.extends(it.A)
})
```




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

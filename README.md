# Zenesis
Zenesis is a new way of generating TypeScript type declarations. `zenesis` is built on `zod` and wouldn’t be possible without it. 

![[Zenesis Schema.svg]]

✏️ Generate type declarations by describing **structure**, not **syntax**!

😌 You don’t have to look at a syntax tree ever again!

🧠 The types you’re generating **are validated as you type!**

🛠️ Supports almost every single type system construct!

📘 Document every single one!

🛡️ Get a `zod`-compatible schema to validate the generated type!

## Install
```bash
npm install zenesis
```
## Making a world
First, we need a **World**. A **World** contains all generated files, modules, and other entities. You can create one using the `zs` namespace. `zs` contains all schema nodes, including the basic ones from `zod`, which it just re-exports.

```typescript
import {zs} from "zenesis"
const World = zs.World("my-world")
```

Worlds are mutable. They’re actually one of the few mutable objects `zenesis` uses. Each World is divided into Files. A file is a module and a container for declarations. In `zenesis`, all such containers are built using *iterators*. Here is an empty file, for example:

```typescript
World.addFile("immutables", function*(_) {})
// Note this creates a File object and also adds it to the World.
```

Files are Modules, which can contain declarations. These can be either type or value declarations, but right now only type declarations are implemented. 

The declarations that can be added to files are available on the context object which we bound to the parameter `_`. We have the following options:

1. `_.Class`
2. `_.Interface`
3. `_.TypeAlias`
5. ~~`_.Enum`~~ — Not implemented!
6. ~~`_.Const`~~ – Not implemented!
7. ~~`_.Let`~~ — Not implemented!
8. ~~`_.Function`~~ — Not implemented!
9. ~~`_.Namespace`~~ — Not implemented!

 We can *create* an interface declarations using `F.Interface`, but this won’t add it to our file automatically. Remember, while Worlds are mutable, other objects aren’t. We need to export the interface using the `yield` keyword!
  
```typescript
World.addFile("immutables", function*(_) {
	yield _.Interface("Stack", function*(_) {
		// Note that we shadow the File's `_`
		// Which is good because it doesn't make sense
		// in this context
	})
})
```

The interface is also a container, and so it too is defined using an iterator. We can yield things from the iterator to declare them on the interface. Here we have the following options:

1. `_.Field`
2. `_.Method`
3. `_.Overloads`
4. `_.Indexer`
5. `_.Implements`

Let’s use this API to add a `length` property to our interface:
```typescript
World.addFile("immutables", function*(_) {
	yield _.Interface("Stack", function*(_) {
		yield* _.Fields({
			length: zs.number().readonly(),
			name: zs.string()
		})

		
	})
})
```

Now, let’s add a method. Methods involve a bit more configuration. 

```typescript
World.addFile("immutables", function*(_) {
	yield _.Interface("Stack", function*(_) {
		yield _.Field(
			"length",
			zs.number()
		).readonly()
		
		yield _.Method("get", {
			args: [zs.number()],
			returns: zs.any()
		})
		
	})
})
```

But wait! What about documentation? How will users know how to use the advanced API we’re building if it’s undocumented?

Well, here is where `zod`’s `describe` method comes into play. When you `describe` something, it will cause documentation, complete with relevant JSDoc tags, to be emitted.

```typescript
World.addFile("immutables", function*(_) {
	yield _.Interface("Stack", function*(_) {
		yield _.Field(
			"length",
			zs.number()
		).readonly().describe("The length of the stack")
		
		yield _.Method("get", {
			args: [
				zs.number().describe("index: The index of the item")
			],
			returns: zs.any().describe("Returns an item"),
			describe: "Gets an item by index."
		})
		
	}).describe("Purely functional data structure implementing...")
})
```

There is one case where the description is used from more than JSDoc documentation. If you use the syntax `${identifier}:${description}` when documenting an argument type, the first part will be used for the emitted name of the argument!

# Multiple files
What if you want to have multiple files, and imports between them?

### Generic method
To add a generic method, we need to use the `zs.typeVars` *declaration builder*. This isn’t a declaration itself – you can tell because it’s not in `PascalCase`. Instead, it's an object that we can use to build declarations.

In this case, it’s an object describing a set of type parameters, together with their constraints. We first call it with the name and order of the generic arguments. After that, we can use the `where` method to specify constraints!

You can define the declaration builder anywhere. It’s created through `zs` itself, which means it’s not restricted to a specific context.

```typescript
const typeArgs = zs.typeVars("X", "Y").where({
	// This is an extends constraint:
	X: zs.number()
})
```

We can use this declaration builder to generate multiple declarations using the type variables. This allows us to avoid repeating their names, order, and constraints for each signature.

Note that we still generate the actual declarations using the `_` of the enclosing scope. The builder just gives us symbols to use for type variables and makes sure the variables don’t leave the scope in which they are defined.

```typescript
const typeArgs = zs.generic("X", "Y").where("X", zs.number())
World.addFile("immutables", function*(_) {
	yield _.Interface("Stack", function*(_) {
		yield _.Field(
			"length",
			zs.number()
		).readonly()
		
		yield _.Method("get", {
			args: [zs.number()],
			returns: zs.any()
		})
		// This will create a generic method of the form:
		// someGeneric<X, Y>(x: X, y: Y): X[]
		yield typeArgs.scope((X, Y) => {
			return _.Method("someGeneric", {
				args: [X.describe("x:"), Y.describe("y:")],
				returns: X.array()
			})
		})
		
	})
})
```

```typescript
World.addFile("immutables", function*(_) {
	yield _.Interface("Stack", function*(_) {
		yield _.Field(
			"length",
			zs.number()
		).readonly().describe("The length of the stack")
		
		yield _.Method("get", {
			args: [
				zs.number().describe("index: The index of the item")
			],
			returns: zs.any().describe("Returns an item"),
			describe: "Gets an item by index."
		})


		const typeArgs = zs.generic("X", "Y").where("X", zs.number())
		
		yield typeArgs.Use((X, Y) => _.Method("genericExample", {
			args: [X, Y],
			returns: [X.array()]
		}))
		
	}).describe("Purely functional data structure implementing...")
})
```

```typescript
typeArgs.Method((X, Y) => )
```

# A generic Interface
To create a generic interface, we need to use the 
To create a generic method, we need to use the `_.Generic` schema builder. Let’s take a look at how it works.

We need to invoke the builder with the names of the type parameters in order, like this:

```typescript
const builder = _.generic("X", "Y")
```

Now we can use the builder to create generic methods. 

\You might be noticing a theme. `zenesis` deliberately breaks naming convention in some ways in order to convey more information about its members. Anything that generates a declaration is going to be in `PascalCase`.



## Design
`zenesis` wouldn't be possible without `zod`, and it builds on it by expanding schemas to include almost all type system constructs, with very few exceptions. 

Every `zenesis` schema that describes a type behaves at runtime like a `zod` schema with an equivalent structure, and the generated type is going to be behaviorally equivalent to the inferred type (that is, the result of `z.infer<ZenesisType>`). This means that you can test out how the generated types will work by doing something like:

```typescript
const x: z.infer<typeof ZenesisSchema> = null!

x.expectedMethod()
x.callSomething(42, "should be legal")
```

The trick is that the type of `x` will be an ungodly monstrosity completely illegible to humans, whereas the generated code is going to be cleaner than what most developers write.

This close correspondence means you can just test out how your generated code will work by using `z.infer`. Of course if you want to use the full power of the library, you would do entirely dynamic seat-of-your-pants code generation. 





`zenesis` is incredibly similar to `zod` in many ways
## Example
`zenesis`
```typescript
// import { z } from "zod"
// ↑ not needed, all relevant zod schemas are-exported by zenesis.
//   mixing the two is totally fine, however.
import {zs} from "zenesis"

// A container for files. One of the few mutable objects.
const world = zs.world()

// This both creates a file object and embeds it in the `world`.
// Takes the name of the file (excluding extensions) and a 
// builder function.
const personFile = world.file("person", function*(file) {
	// Construct declarations, which are also validation schemas.
	// Declaration schemas are statically validated.
	const person = file.interface("Person", {
		// Declare a field:
		name: zs.field(
			// The type of the field
			zs.string()
		).describe(
			// This will be inserted into the generated code via JSDoc
			"The person's name"
		// Supports modifiers like readonly:
		).readonly(),
		
		// Another field declaration:
		age: zs.field(
			zs.number()
		).describe("The person's age").readonly(),
		
		// A method declaration, complete with documentation:
		greet: zs.method(
			// These are arguments.
			zs.lazy(() => person).describe(
				// The parameter's name is extracted from the documentation.
				"person: The person to greet"
			)
		).returns(
			zs.boolean().describe(
				// Documenting the return value is also supported.
				"Whether the person was greeted."
			)
		).describe(
			// The method's documentation.
			"Greets a person."
		)
		
	}).describe(
		// The interface's documentation:
		"Represents a person"
	)
	// Using yield will export a declaration.
	// If we didn't do this, and referenced the declaration from somewhere else,
	// it would be written to the file without being exported.
	yield person
})

// Exported declarations are available on the file object.
// Yes, this is still statically typed. You can even use zod's
// infer.
const person: zs.infer<typeof personFile.Person> = personFile.Person.parse({
	name: "greg",
	age: 34,
	greet(person) {
		console.log(`Hi ${person.name}!`)
		return true
	}
})

// We can write the whole set of generated files to a specific path.
// For multiple files with interdependent types, import statements
// will be generated automatically.
// Formatted using Prettier.
world.writeSync("../generated")
```

The above code generates the file:
```typescript
// FILE: person.d.ts

/**
 * Represents a person
 */
export declare interface Person {  
	/** The person's name */
    readonly name: string;  
  
	/** The person's age */
    readonly age: number;  
	
	/**
	 * Greets a person.
	 * @param person The person to greet.
	 * @returns Wether the person was greeted.
	 */
	greet(person: Person): boolean
}
```
## How it works
`zenesis` builds on `zod`'s validation schemas, adding schema nodes representing things such as:

* Classes, interfaces, and type aliases
* Fields and methods, including overloads
* Static members
* Conditional types, generic types, mapped types 
* Generic function types
* Type-level operators such as `keyof` and `typeof`
* Modules, exports and imports

Schemas are statically validated to the maximum possible extent, making sure the code you're generating will be free of syntax and semantic errors. 

That said, some kinds of schemas can't be validated statically due to various **limitations** (see below), and in some cases you might have to discard type annotations in favor of dynamically constructing schemas.

## Limitations
`zenesis` has a number of limitations.

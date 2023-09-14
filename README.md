# Zenesis
`zenesis` is a game-changing library for **generating type definitions** using `zod`-compatible schemas.

![[Zenesis Schema.svg]]

✏️ Write type generation code that kind of looks like the code being generated!

😌 No messing around with syntax trees or strange compiler APIs!

🧠 Your type schemas are statically validated as you type!

🛠️ Supports almost every single type system construct, including advanced generic types!

📘 Document every single one!

🛡️ Automatically get a `zod` schema to validate the types you're generating!

`zenesis` is extremely powerful and *might be overwhelming for novices*. Which is why you can use it to build your own code generation tools!
## Install
```bash
npm install zod zenesis
```

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

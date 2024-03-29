A type expression is a syntax element such as `{a: 1}` that may appear as a type annotation. They usually describe the structure of a type or construct a type using operators.

Almost all type expressions are provided by `zod`. `zenesis` adds a few type expressions that `zod` doesn’t cover.

## Conditional Types

`extends` and `then` accept functions for forward compatibility. Inferred types will be supported in the future using a context object that will be passed in.

In `zenesis` you can build a conditional type using the `{typescript}zs.if` factory like this:
```typescript
// Specify the subject as an input to `zs.if`
z.if(zs.number()).extends(s => s.infer("T")).then(s => )
```

Conditional type nodes can’t be validated by the TypeScript compiler. It will instead see them as nodes with the supertype `TrueType | FalseType`. 

⛔ **Inferred conditional types are currently not supported.** ⛔
They will most likely be added at a later date when I figure out what to do with them.

## Keyof

## this type



## Lookup type



## Generic function
`

```typescript

```

Generic function types can be used anywhere other function types can be used. If they are used within a method definition they will generate generic methods.

```typescript
// Producing the declaration:
//
//   interface GenericExample {
//     example<T>(arg0: T): number
//   }
//
file.Interface("GenericExample", function*() {
	const genericFunction = zs.forall("T").define(T => {
		return zs.fun(T).returns(zs.number())
	})
	yield this.Method("example", genericFunction)
})
```
## Mapped types
To produce a mapped type, use `zs.map`. Since mapped types have multiple components, it’s a bit complicated.
```typescript
// Producing the type:
//   { [X in Subject as X["name"]]: X[] }

// First, the name of the mapping variable.
zs.map("X")

	// Then the container type
	.in(Subject)
	
	// The `as` part that transforms the key.
	// We have a reference to the mapping variable.
	// This can be optional, depending on the type of `Subject`.
	.as(X => {
		// This is result type of the key.
		// Let's map it to X["name"]
		return zs.lookup(X, "name")
	})
	
	// And finally the value.
	.to(X => {
		return X.array()
	})

```
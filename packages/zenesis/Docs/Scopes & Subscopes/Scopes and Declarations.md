 Many declarations in TypeScript have their own *declarative scope* – parts of the code where specific kinds of declarations can appear. Examples include classes and modules.

Zenesis emulates declarative scopes using generators. Every declaration is an object, and yielding that object from the generator will cause that declaration to be emitted. Every scope receives a bound `this` context object, which can construct every declaration legal in that scope.

The `this` context object bound to a scope also allows access to types and symbols that only make sense in that immediate scope. Saving it to a variable and using it from a different scope will result in undefined behavior.

Scopes will also receive parameters that represent symbols that are valid within them. For example, the scope of a generic type will receive references to the type variables as parameters. These references are valid anywhere within the scope, as well as inside the nested scopes.

Zenesis carefully manages the natural scope of symbols and identifiers to match their syntactic scope. You shouldn’t use them outside of this natural scope.
# Scopelet
A scopelet is a scope that’s a function, but not a generator. Scopelets may not have a `this` object and often aren’t declarative, instead only allowing a single expression. 
# Scope exports
Module scopes export any yielded declarations. Exported declarations will be avaiable on the module 
# Scope evaluation
Since Zenesis scopes are generators, they need to be evaluated in order to produce a result. Zenesis will always do so lazily and on demand. This allows recursive and mutually recursive references, since the object representing a declaration can be referenced without evaluating its scope.

Specifically, scopes will be evaluated when:

1. The scoped declaration is being written to file.
2. The declaration is referenced by another declaration which is being written to file.


Zenesis will always evaluate scopes lazily, on demand, and only up to a point. Scopes will never be evaluated 
Scopes are always evaluated lazily and on demand. This happens either when the scope needs to be written to file, or 


# Scope exports
Module scopes export any yielded declarations. This means that these declarations are available on the module object as properties, allowing them to be referenced.

```typescript title:file-scope.zen.ts
import {zs} from "zenesis"
const file1 = zs.File(function*() {
	yield this.Class("ClassName", function*() {
		yield this.Property("value", zs.number())
	})
})

const importedCLass = file1.ClassName
```

This process is more complicated than it appears. 
# Lazy evaluation
A scope must be evaluated in order to construct the declaration it’s describing. Zenesis guarantees that scopes are evaluated lazily, and on-demand. 
# File scope
You can create a new file scope using `{ts}zs.File`. A file scope can have the following declarations:

| Code         | Description                                |
| ------------ | ------------------------------------------ |
| `this.Class` | Opens a class scope, resulting in a class  |
 
1. `this.Class` – Opens a nested class
2. `this.Interface`
3. `this.TypeAlias`
5. `this.Enum`
6. ~~`_.Const`~~ – Not implemented!
7. ~~`_.Let`~~ — Not implemented!
8. ~~`_.Function`~~ — Not implemented!
9. ~~`_.Namespace`~~ — Not implemented!

Two overloads are available:
## Explicit file name
This version takes a filename as the first parameter. The extension isn’t required.

```typescript
import {zs} from "zenesis"
const file1 = zs.File("file", function*() {
	// This file will be called `file.ts`
	yield this.TypeAlias("Example", () => zs.number())
})
```

## Implicit file name
This version takes only one parameter, the scope. In this case, Zenesis will 

The file scope can include all type declarations that can be found in a TypeScript `.d.ts` file:

1. Interfaces
2. Classes
3. Type aliases
4. Functions

Dec
## Recursive references
TypeScript allows for a type to reference itself and for two types to reference each other, even if they are defined in different files.

Here is how that looks like in Zenesis:

```typescript
const file1 = zs.File("file1", function*() {
	yield zs.Class("Class1", function*() {})
})
const file2 = 
```


These generators also receive:
1. A special `this` context object that serves as a declaration factory.
2. Sometimes, one or more arguments. These will usually be references to type variables.

These inputs should only be used within their natural scopes. 

> [!tip]
> Don’t save the `this` context object. It can only be used within the scope to which it’s given.

Scopes will often be nested. What hap
The `this` context object is different for each scope and shouldn’t be used from inner scopes. 



Sometimes other declarations will also be emitted, such as if they are referenced by an emitted declaration. What exactly happens when a declaration is yielded is specific to each scope. 



Zenesis uses this fact to make sure that some kinds of symbols – like type variables – can’t easily escape their scope.

```typescript
export default zs.File(function*() {

	yield this.forall("T").Type("IsNumber", T => {
		return zs.if(T)
			     .extends(() => zs.number())
			     .then(() => zs.true()) 
			     .else(zs.false())
	})
})
```


# dasfdsf
I want to write a compile-time assertion that a type `A`, is equal to another type `B`. It’s for testing purposes. The actual error doesn’t matter and could be something to improve upon.

Now, **I know there is a [feature request](https://github.com/microsoft/TypeScript/issues/12936) for exact types.** I am not looking for a type system extension, just something that will error with it’s supposed to. 

For the purpose of the question, let me define equality between types as:

For every type $X$:
1. $X$ is assignable to $A$ if and only if it’s assignable to $B$
2. $A$ is assignable to $X$ if and only if $B$ is assignable to $X$

Basically, the types are indistinguishable from each other. Note that this includes `unknown` and `any`. (1) is not enough because it passes for `any` and `unknown`, but (2) doesn’t. 

> However, maybe that’s the exception and it works for everything else?

Here is a sketch of the API I’m looking for:
```typescript
// Should type check if SomeType is equal to OtherType
// The boolean parameter lets us invert the assertion
expectt<SomeType>().toEqual<OtherType>(true) 

// And if that succeeds, this should always fail to type check:
expectt<SomeType>().toEqual<OtherType>(false)
```

Here are statements that should pass type checking. For each one the inverse should fail to type check.
```typescript
expectt<5>().toEqual<number>(false)
expectt<5>().toEqual<never>(false)
expectt<5>().toEqual<5>(true)
expectt<5>().toEqual<any>(false)
expectt<5>().toEqual<unknown>(false)
expectt<5>().toEqual<5 | 6>(false)

// It should also work for any, unknown, and never:
expectt<any>().toEqual<unknown>(false)
expectt<never>.toEqual<any>(false)
expectt<unknown>().toEqual<unknown>(true)
expectt<any>().toEqual<any>(true)
```
So far, what I have is this:
```typescript
export interface Expected<T> {
    toEqual<Exact>(
        truth: (
            T extends Exact ? (Exact extends T ? true : false) : false
        ) extends true
            ? true
            : false
    ): Expected<T>
}
```

Which checks that the two types are subtypes of each other. However, it fails to distinguish between `any` and `unknown`.

The final `extends true` conditional is for cases when either `T` or `Exact` are `any`, which can result in the conditional being `true | false`.


So far, I have this:





1. Yes, I know there is a feature request. I’m not talking about a generally useful feature.
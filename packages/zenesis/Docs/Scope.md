Programming languages almost always have some notion of a *scope* — a part of the code in which certain kinds of syntax elements can appear and special identifiers are available.

I’m not talking about the runtime scoping of variables, but rather the syntactic scope of something like a class.

```typescript
class Class {
	// ← a class scope!
}

interface Interface {
	// ← interface scope!
}
```

1. A file, containing:
2. A class, containing:
3. A method, containing:
4. An overload

Each of these levels is a syntactic scope in which only some declarations are allowed.

The goal of `zenesis` is to write type generation code that resembles the types being generated. This means `zenesis` needs to reproduce the same structure.

It does so using closures and iterators. Declarations that come with their own *scopes* will always start with a capital letter, e.g. `Interface`, `Class`, and so on. The scope itself is always an *iterator*. 

That’s a function written like this:

```typescript
function* scope(symbols) {
	yield this.Class()
	yield this.Interface()
}
```

It does this using closures and iterators. Declarations that come with their own [[Scope]]s 


TypeScript involves lots of nested syntax elements. 
Most major declarations in `zenesis` involve *scopes*. Scopes serve several purposes:

1. They help make sure invalid symbols don’t escape the part of syntax where they’re legal.
2. They let you describe the structure of class declarations 

Most  in `zenesis` involve *scopes*. Scopes serve several purposes:

1.
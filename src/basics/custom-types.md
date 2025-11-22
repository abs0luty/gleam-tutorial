## Custom types

Custom types let you model "this or that" choices with named constructors. A value of a custom type is one of its constructors, and you handle each case with `case`. This is a sum type, also called an algebraic data type.

```gleam
pub type Shape {
  Circle(radius: Float)
  Rectangle(width: Float, height: Float)
}

fn area(s: Shape) -> Float {
  case s {
    Circle(radius:) -> 3.14159 *. radius *. radius
    Rectangle(width:, height:) -> width *. height
  }
}
````

You define the type with `type`, give each variant a constructor, then pattern match by constructor.

A constructor that carries fields is called a record. You can read fields with dot syntax and update immutably with record update. This keeps data immutable and clear to read.

```gleam
pub type User {
  User(name: String, age: Int)
}

pub fn main() {
  let u1 = User("Bea", 28)
  let u2 = User(..u1, age: 29)
  let name = u2.name
  
  io.println(name) // Bea
}
```

You can match on records to pull out fields or add guards. This keeps branching logic tight and local. The `let` form can destructure single-variant types, and `case` works for any variant set.

```gleam
fn can_vote(u: User) -> Bool {
  case u {
    User(age: a) if a >= 18 -> True
    _ -> False
  }
}
```

Custom types can be generic. Write type variables in lowercase. This gives you reuse without losing static checks. Gleam's own `Option(a)` and `Result(a, e)` follow this shape.

```gleam
pub type Box(value) { 
  Box(value) 
}

fn map_box(x: Box(a), f: fn(a) -> b) -> Box(b) {
  case x { 
    Box(v) -> Box(f(v))
  }
}
```

When you need invariants, make the type opaque. Export the type, keep its constructors private, and expose smart constructors and getters. Callers can use the type but cannot forge or deconstruct it:

```gleam
pub opaque type Id { 
  Id(value: String) 
}

pub fn from_string(s: String) -> Id {
  Id(s)
}

pub fn to_string(id: Id) -> String {
  id.value
}
```

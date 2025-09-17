## Assignments

In Gleam you bind values with `let`. Names use `snake_case`, bindings are **immutable**, and you can **re-bind** a name later to a new value (the old value doesn’t change; you just shadow the name).

```gleam
import gleam/io

pub fn main() {
  let x = "Original"
  io.println(x)

  // Copy the value
  let y = x
  io.println(y)

  // Shadow x with a new value
  let x = "New"
  io.println(x)

  // y still points to the original value
  io.println(y)
}
```

If you create a variable and never use it, the compiler warns you. Prefix it with an underscore to show that’s intentional.

```gleam
pub fn main() {
  // Intentional: silence the unused warning
  let _score = 1000
}
```

You can add type annotations to `let` bindings. They help readers but don’t change how type checking works (other than catching mismatches).

```gleam
pub fn main() {
  let _name: String = "Gleam"
  let _is_cool: Bool = True
  let _version: Int = 1
}
```

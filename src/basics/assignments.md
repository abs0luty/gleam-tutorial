## Assignments

Use `let` to bind values. Names use `snake_case`. Bindings are immutable, but you can bind the same name again later and shadow the previous value. This does not change the original value, it only replaces which value the name refers to.

```gleam
import gleam/io

pub fn main() {
  let title = "Morning"
  io.println(title) // Morning

  let copy = title
  io.println(copy)  // Morning

  let title = "Evening"
  io.println(title) // Evening

  io.println(copy)  // Morning
}
````

If a binding is never used, the compiler warns you. Prefix the name with an underscore when this is intentional.

```gleam
pub fn main() {
  let _unused_score = 500
}
```

You can add type annotations to bindings. These help with clarity and catch mismatches during type checking.

```gleam
pub fn main() {
  let _label: String = "Gleam"
  let _active: Bool = True
  let _count: Int = 3
}
```

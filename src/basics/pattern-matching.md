## Pattern matching

Gleam lets you **pattern match** both when assigning and in `case` expressions.

### Let clause

With plain `let`, your pattern has to be **total** for the value’s shape - i.e., it must always match.

```gleam
pub fn main() {
  // Tuple destructuring: always matches a 2-tuple
  let point = #(3, 4)
  let #(x, y) = point

  io.println(int.to_string(x + y))
}
```

### Case expression

`case` lets you handle multiple shapes safely. You can match strings using concatenation syntax:
```gleam
import gleam/io

pub fn main() {
  io.println(get_name("Hello, Joe"))
  io.println(get_name("Hello, Mike"))
  io.println(get_name("System still working?"))
}

fn get_name(x: String) -> String {
  case x {
    "Hello, " <> name -> name
    _ -> "Unknown"
  }
}
```

When working with lists you can match on length and contents. Use `..` to capture "the rest" of the elements.
  ```gleam
  import gleam/int
  import gleam/list
  import gleam/io

  pub fn main() {
    let xs = list.repeat(int.random(5), times: int.random(3))
    io.println(list.to_string(xs, int.to_string))

    let result = case xs {
      [] -> "Empty list"
      [1] -> "List of just 1"
      [4, ..] -> "List starting with 4"
      [_, _] -> "List of 2 elements"
      _ -> "Some other list"
    }

    io.println(result)
  }
  ```

### `let assert`

Sometimes you *know* a value has a certain shape and want to crash immediately if it doesn’t. `let assert` is like `let`, but it allows **partial** patterns. If the pattern doesn’t match, the program panics. You can attach a custom message with `as`.

```gleam
pub fn main() {
  let a = unsafely_get_first_element([123])
  io.println(int.to_string(a))

  // This will panic at runtime with our custom message:
  let b = unsafely_get_first_element([])
  io.println(int.to_string(b))
}

pub fn unsafely_get_first_element(items: List(a)) -> a {
  // Partial pattern: will panic on []
  let assert [first, ..] = items as "List should not be empty"
  first
}
```

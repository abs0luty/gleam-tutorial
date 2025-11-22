## Handling absence and failure

Gleam uses two types to handle missing values and fallible operations: `Option(a)` and `Result(a, e)`. These types make uncertainty explicit and force you to handle it clearly.

### Option Type

Use `Option(a)` for values that might be missing. For example, an optional parameter or a field that may be absent:

```gleam
import gleam/option.{type Option, Some, None}

pub type User {
  User(name: String, nickname: Option(String))
}

let user1 = User("Eva", Some("E"))
let user2 = User("Tom", None)
````

#### `option.map`

Transforms the inner value if it's present:

```gleam
option.map(Some(2), fn(x) { x * 3 }) // Some(6)
option.map(None, fn(x) { x * 3 })    // None
```

#### `option.then`

Chains computations that return `Option`:

```gleam
option.then(Some(2), fn(x) { Some(x + 1) }) // Some(3)
option.then(Some(2), fn(_) { None })        // None
option.then(None, fn(x) { Some(x + 1) })    // None
```

#### `option.or` and `option.lazy_or`

Use fallback options:

```gleam
option.or(Some(1), Some(2))               // Some(1)
option.or(None, Some(2))                  // Some(2)
option.lazy_or(Some(1), fn() { Some(3) }) // Some(1)
option.lazy_or(None, fn() { Some(3) })    // Some(3)
```

#### `option.unwrap`

Extract the value or use a default:

```gleam
option.unwrap(Some(5), 0) // 5
option.unwrap(None, 0)    // 0
```

#### `option.flatten`

Removes one layer of nesting:

```gleam
option.flatten(Some(Some(1))) // Some(1)
option.flatten(Some(None))    // None
option.flatten(None)          // None
```

#### `option.to_result`

Converts an `Option` into a `Result`:

```gleam
option.to_result(Some(5), "missing") // Ok(5)
option.to_result(None, "missing")    // Error("missing")
```

### Result Types

Use `Result(a, e)` when a function can fail. This forces the caller to handle both the success and error cases.

```gleam
fn parse_number(s: String) -> Result(Int, String) {
  case int.parse(s) {
    Ok(n) -> Ok(n)
    Error(_) -> Error("invalid input")
  }
}
```

#### `result.map`

Transforms the success value:

```gleam
result.map(Ok(2), fn(x) { x * 2 })     // Ok(4)
result.map(Error("bad"), fn(x) { x })  // Error("bad")
```

#### `result.try`

Chains fallible functions:

```gleam
fn safe_parse(s: String) -> Result(Int, String) {
  case int.parse(s) {
    Ok(n) -> Ok(n)
    Error(_) -> Error("not a number")
  }
}

result.try(Ok("42"), safe_parse)   // Ok(42)
result.try(Ok("foo"), safe_parse)  // Error("not a number")
result.try(Error("fail"), safe_parse) // Error("fail")
```

#### `result.unwrap`

Returns the success value or a fallback:

```gleam
result.unwrap(Ok("done"), "default")    // "done"
result.unwrap(Error("fail"), "default") // "default"
```

#### `result.is_ok` and `result.is_error`

Check what variant you're working with:

```gleam
result.is_ok(Ok(1))       // True
result.is_error(Ok(1))    // False
result.is_error(Error(1)) // True
```

#### `result.all`

Collects a list of `Result`s into one `Result` with a list:

```gleam
result.all([Ok(1), Ok(2)])        // Ok([1, 2])
result.all([Ok(1), Error("x")])   // Error("x")
```

#### `result.lazy_or`

Provides a fallback result lazily:

```gleam
result.lazy_or(Ok(1), fn() { Ok(2) })          // Ok(1)
result.lazy_or(Error("e"), fn() { Ok(2) })     // Ok(2)
result.lazy_or(Error("e"), fn() { Error("x") }) // Error("x")
```

### When to Use Each

In other languages fallible functions may return either `Result` or `Option` depending on whether there is more information to be given about the failure. In Gleam all fallible functions return `Result`, and `Nil` is used as the error if there is no extra detail to give. 

This consistency removes the boilerplate that would otherwise be needed to convert between `Option` and `Result` types, and makes APIs more predictable:

```gleam
import gleam/option
import gleam/result
import gleam/int
import gleam/io

fn apply_multiplier(value: Int, maybe: Option(Int)) -> Int {
  case maybe {
    Some(m) -> value * m
    None -> value
  }
}

fn parse_positive(s: String) -> Result(Int, Nil) {
  case int.parse(s) {
    Ok(n) if n > 0 -> Ok(n)
    _ -> Error(Nil)
  }
}

pub fn main() {
  let maybe_multiplier = Some(2)

  case parse_positive("10") {
    Ok(n) ->
      let result = apply_multiplier(n, maybe_multiplier)
      io.println(int.to_string(result))
    Error(_) ->
      io.println("Invalid input")
  }
}
```

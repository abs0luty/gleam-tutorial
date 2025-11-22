## Assertions and panic 

You already saw `let assert` earlier. It binds with a partial pattern and crashes if the value does not match. We use it for invariants we consider impossible to violate, and prefer returning a `Result` in library code so the caller can decide what to do. 

`panic` crashes immediately. It is for code paths that must never run, such as unreachable branches or unimplemented cases. Add a message with `as "..."` so failures are clear:

```gleam
import gleam/io
import gleam/int

pub fn describe(score: Int) {
  case score {
    s if s > 1000 -> io.println("High score!")
    s if s > 0 -> io.println("Still working on it")
    _ -> panic as "Scores should never be negative!"
  }
}
````

`assert` is another way to cause a panic. It checks that a boolean expression evaluates to `True`. Like the others, you can add a custom message with `as`. This replaces the generic message when the assertion fails. Do not use `assert` in applications or libraries. Keep it in tests:

```gleam
pub fn add_test() {
  assert add(1, 2) == 3
  assert add(1, 2) < add(1, 3)
  assert add(6, 2) == add(2, 6) as "Addition should be commutative"
  assert add(2, 2) == 5
}

fn add(a: Int, b: Int) -> Int {
  a + b
}

```

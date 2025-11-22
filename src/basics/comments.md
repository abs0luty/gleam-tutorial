## Comments

You can add comments to your Gleam code with `//`. They help explain intent and improve readability.

Here’s a simple example that adds a comment above a print call:

```gleam
import gleam/io

pub fn main() {
  // Show a message
  io.println("Hello world!")
}
````

For longer explanations, use `//` at the start of each line:

```gleam
// This is a longer comment.
// Each line starts with //
// so the compiler treats it as a comment.
```

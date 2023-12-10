# Comments

Let us now modify our previous hello world program:

```gleam
import gleam/io

pub fn main() {
  // Print hello world
  io.println("Hello world!")
}
```

Gleam allows you to write comments in your code. In Gleam, comments must start with two slashes and continue until the end of the line. For comments that extend beyond a single line, you’ll need to include `//` on each line, like this:

```gleam
// Hello, world! I have a lot to say, so much that it will take multiple
// lines of text. Therefore, I will start each line with // to denote it
// as part of a multi-line comment.
```

Comments don't have any semantic meaning and don't affect the way the program behaves. Instead, they are used for clarity and for documenting your code.

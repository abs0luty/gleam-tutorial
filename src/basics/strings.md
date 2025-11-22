## Strings

In Gleam, strings are UTF-8 binaries. They're immutable and store any Unicode text. Operations like length, slicing, and reversing work on **graphemes** (what users think of as characters), so they won't split composed characters.

On the **BEAM** backend, Gleam uses Erlang's Unicode-aware functions. On **JavaScript**, it uses UTF-16 under the hood, but the standard library ensures grapheme-level correctness.

Use double quotes with standard escapes (`\"`, `\\`, `\n`, `\t`, `\u{...}`). Concatenate with `<>`:

```gleam
"Hello, Gleam!\n" <> "\u{1F44B}"  // "Hello, Gleam! 👋"
````

### Emptiness and Length

`string.is_empty` checks for an empty string without allocating.
`string.length` returns the grapheme count.
`string.byte_size` gives the UTF-8 byte length.

```gleam
string.is_empty("")        // True
string.length("ß↑e̊")       // 3 graphemes
string.byte_size("ß↑e̊")    // 8 bytes
```

### Reverse

`string.reverse` works on graphemes:

```gleam
string.reverse("stressed")  // "desserts"
```

### Replace

`string.replace` replaces all non-overlapping **literal** substrings:

```gleam
string.replace(in: "www.example.com", each: ".", with: "-")
// "www-example-com"
```

### Case Conversion

`lowercase` and `uppercase` are Unicode-aware but not locale-sensitive:

```gleam
string.lowercase("X-FILES")  // "x-files"
string.uppercase("skinner")  // "SKINNER"
```

### Comparison

Lexicographic comparison using graphemes:

```gleam
string.compare("A", "B")  // order.Lt
```

### Slicing

`slice` uses grapheme indices and returns `""` for out-of-bounds:

```gleam
string.slice(from: "gleam", at_index: 1, length: 2)  // "le"
```

### Cropping and Dropping

Remove prefixes or graphemes:

```gleam
string.crop(from: "The Lone Gunmen", before: "Lone") // "Lone Gunmen"
string.drop_start(from: "  hats", up_to: 2)          // "hats"
```

### Contains, Prefix, Suffix

All are case-sensitive literal checks:

```gleam
string.contains(does: "theory", contain: "ory") // True
```

### Splitting

`split` returns all parts, including trailing empty strings.
`split_once` stops after the first match:

```gleam
string.split("a/b/c/", on: "/")          // ["a", "b", "c", ""]
string.split_once("a/b/c/", on: "/")     // Ok(#("a", "b/c/"))
```

### Joining

`append`, `concat`, and `join` copy strings:

```gleam
string.join(["home", "evan"], with: "/")  // "home/evan"
```

### Repeat and Pad

Work on graphemes:

```gleam
string.repeat("ha", times: 3)           // "hahaha"
string.pad_start("121", to: 5, with: ".") // "..121"
```

### Trimming

Removes Unicode whitespace:

```gleam
string.trim("  hats  \n")  // "hats"
```

### Grapheme-Level Access

`pop_grapheme` and `to_graphemes` let you iterate safely:

```gleam
string.pop_grapheme("gleam")  // Ok(#("g", "leam"))
```

### Code Points

Work at the Unicode scalar level:

```gleam
let cps = string.to_utf_codepoints("🏳️‍🌈")
string.from_utf_codepoints(cps)  // "🏳️‍🌈"
```

### Other Helpers

```gleam
string.first("icecream")        // Ok("i")
string.capitalise("mamouna")    // "Mamouna"
string.to_option("")            // None
```

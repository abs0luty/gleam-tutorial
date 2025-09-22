## Strings

In Gleam, **strings are UTF-8 binaries**. They're immutable and can hold any Unicode text. Gleam aims for **grapheme-aware** behavior by default (the "user-visible characters" you expect), so things like length, reversing, and slicing won't split a character in half even when it's composed of multiple code points. 

- On the **BEAM** target, strings are UTF-8 binaries and Erlang's Unicode-aware functions back a lot of the heavy lifting. ([Erlang.org][1])
- On the **JavaScript** target, the host uses UTF-16 code units under the hood, but Gleam's stdlib gives you grapheme-aware APIs so you don't have to reason in code units. ([MDN Web Docs][2])

Strings use double quotes and typical escapes (`\"`, `\\`, `\n`, `\t`, `\u{...}`). Concatenate with `<>`:

```gleam
"Hello, Gleam!\n" <> "\u{1F44B}"  // "Hello, Gleam! 👋"
```

### Check emptiness & length

`string.is_empty` is a fast, zero-allocation check. 

`string.length` counts **graphemes** (linear time because it must walk boundaries).

`string.byte_size` reports the **UTF-8 byte length** (constant time on BEAM; linear on JS because it has to encode). 

```gleam
import gleam/string

pub fn main() {
  echo string.is_empty("")       // True
  echo string.length("Gleam")    // 5
  echo string.length("ß↑e̊")      // 3 (graphemes)
  echo string.byte_size("Gleam") // 5
  echo string.byte_size("ß↑e̊")   // 8 (bytes)
}
```

### Reverse

`string.reverse` flips by **graphemes**, not bytes or code points, so diacritics, emoji sequences, and composed characters stay intact:

```gleam
string.reverse("stressed") // "desserts"
```

### Replace (all occurrences)

`string.replace` swaps **all** non-overlapping matches of a substring. It's grapheme-safe and doesn't interpret patterns - just literal substring replacement - so you don't have to worry about regex semantics here. Use it for path munging, simple templating, or normalizing separators:

```gleam
string.replace(in: "www.example.com", each: ".", with: "-")
// "www-example-com"
```

### Case conversion

`lowercase` and `uppercase` are Unicode-aware and rely on target primitives under the hood (BEAM/JS). That means locale-agnostic rules (e.g., Turkish dotted/dotless "i" special cases are not locale-sensitive). Use these for case-folding before comparisons or when normalizing tags.

```gleam
string.lowercase("X-FILES") // "x-files"
string.uppercase("skinner") // "SKINNER"
```

### Ordering & comparison

`string.compare(a, b)` is **lexicographic over graphemes**, returning `order.Lt`, `Eq`, or `Gt`: 

```gleam
string.compare("Anthony", "Anthony") // order.Eq
string.compare("A", "B")             // order.Lt
```

### Substrings & slicing

`slice` takes a starting grapheme index and a length (also in graphemes). Negative `at_index` counts from the end. Out-of-range indices are safe and yield `""`, which is great for defensive string handling:

```gleam
string.slice(from: "gleam", at_index: 1, length: 2)  // "le"
string.slice(from: "gleam", at_index: -2, length: 2) // "am"
```

### Cropping & dropping

`crop(from, before)` finds the first occurrence of `before` and returns the remainder, useful for stripping prefixes without worrying about indices. 

`drop_start`/`drop_end` remove a fixed **grapheme** count from the start/end, which makes them predictable with multicodepoint characters:

```gleam
string.crop(from: "The Lone Gunmen", before: "Lone") // "Lone Gunmen"
string.drop_start(from: "  hats", up_to: 2)          // "hats"
string.drop_end(from: "hats  ", up_to: 2)            // "hats"
```

### Contains / prefix / suffix

`contains`, `starts_with`, and `ends_with` check literal substrings. They're case-sensitive and don't handle locale collation, so normalize with `lowercase` if you want case-insensitive logic:

```gleam
string.contains(does: "theory", contain: "ory") // True
string.starts_with("theory", "the")             // True
string.ends_with("theory", "ory")               // True
```

### Splitting

`split` returns **all** pieces, including a trailing empty string if the input ends with the separator - handy for filesystem-like paths where the trailing slash is meaningful. 

`split_once` stops after the first separator and returns `Ok(#(left, right))`, or `Error(Nil)` if missing - perfect for "key\:value" style parsing:

```gleam
string.split("home/gleam/desktop/", on: "/")
// ["home","gleam","desktop",""]

string.split_once("home/gleam/desktop/", on: "/")
// Ok(#("home", "gleam/desktop/"))
```

### Joining & building

`append`, `concat`, and `join` **copy** data and are linear in the total output size - great for one-off joins:

```gleam
string.append(to: "butter", suffix: "fly")  // "butterfly"
string.concat(["never", "the", "less"])       // "nevertheless"
string.join(["home", "evan", "Desktop"], with: "/") // "home/evan/Desktop"
```

### Repeating & padding

`repeat` is linear in the final size and won't split graphemes.

`pad_start`/`pad_end` pad in **graphemes**, so a multi-codepoint pad string counts as one grapheme per repeat, matching user expectations for alignment:

```gleam
string.repeat("ha", times: 3)        // "hahaha"
string.pad_start("121", to: 5, with: ".") // "..121"
string.pad_end("123", to: 5, with: ".")   // "123.."
```

### Trimming

`trim`, `trim_start`, and `trim_end` remove Unicode whitespace per the standard definition (not just ASCII spaces):

```gleam
string.trim("  hats  \n")       // "hats"
string.trim_start("  hats  \n") // "hats  \n"
string.trim_end("  hats  \n")   // "  hats"
```

## Working at grapheme / code point level

### Pop & iterate graphemes

`pop_grapheme` returns the first grapheme and the rest - a clean, Unicode-safe way to peel characters from the front.

`to_graphemes` gives you a list of grapheme clusters for iteration, cursor logic, or UI navigation. 

```gleam
string.pop_grapheme("gleam") // Ok(#("g", "leam"))
string.to_graphemes("abc")   // ["a", "b", "c"]
```

### Code points (Unicode scalars)

These APIs expose raw **Unicode scalar values** (code points), which is useful for serialization, custom parsing, or implementing algorithms that work below the grapheme layer (e.g., normalization, filters):
```gleam
let cps = string.to_utf_codepoints("🏳️‍🌈")
// [UtfCodepoint(127987), 65039, 8205, 127752]

string.from_utf_codepoints(cps) // "🏳️‍🌈"
```

Creating/inspecting scalars:

```gleam
let assert Ok(cp) = string.utf_codepoint(97)         // 'a'
string.utf_codepoint_to_int(cp)                      // 97
```

### First/last, capitalisation, options

`first`/`last` return the first/last **grapheme** as an `Ok(...)` or an `Error(Nil)` for empty strings. 

`capitalise` uppercases the first grapheme and lowercases the rest - handy for display names, but note it's not locale-aware title-casing. 

`to_option` converts `""` to `None` and non-empty strings to `Some`, which models "maybe present text" more cleanly than sentinel empty strings.

```gleam
string.first("icecream")     // Ok("i")
string.last("icecream")      // Ok("m")
string.capitalise("mamouna") // "Mamouna"
string.to_option("")         // None
string.to_option("hats")     // Some("hats")
```

### Further reading

* **Erlang Unicode usage / `unicode` module**  -  background for BEAM target and UTF-8 binaries. ([Erlang.org][1])
* **Unicode UAX #29**  -  grapheme/word/sentence boundaries (what "grapheme-aware" means). ([Unicode][2])
* **MDN: JavaScript Strings**  -  UTF-16 code units and `.length` behavior on the JS target. ([MDN Web Docs][3])

[1]: https://www.erlang.org/doc/apps/stdlib/unicode_usage.html "Using Unicode in Erlang  -  stdlib v7.0.2"
[2]: https://unicode.org/reports/tr29/ "UAX #29: Unicode Text Segmentation"
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length "String: length - JavaScript | MDN - Mozilla"

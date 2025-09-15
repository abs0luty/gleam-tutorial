# Strings

In Gleam, **strings are UTF-8 binaries** written with double quotes. They are immutable and may contain any Unicode text. 

## Encoding model 

Gleam treats user-visible characters as **grapheme clusters** (for example, "é" may be one code point or a letter plus a combining accent). Under the hood:

* On the **Erlang** target, strings are UTF-8 binaries; Erlang provides Unicode-aware stdlib functions for them. ([Erlang.org][3])
* On the **JavaScript** target, the host runtime represents strings as sequences of **UTF-16 code units**; Gleam’s stdlib layers APIs so you still get grapheme-aware behavior. ([MDN Web Docs][4])

## Literals and concatenation

Strings are written with double quotes and support common escapes (e.g., `\"`, `\\`, `\n`, `\t`, `\u{...}`). Concatenate with `<>`:

```gleam
"Hello, Gleam!\n" <> "\u{1F44B}"  // "Hello, Gleam! 👋"
```

## Core operations (grapheme-aware unless noted)

### Emptiness & length

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

`length` runs in linear time because it walks graphemes. `byte_size` returns UTF-8 bytes (constant time on BEAM, linear on JS).

### Reverse

```gleam
string.reverse("stressed") // "desserts"
```

Linear time, operates on graphemes. 

### Replace (all occurrences)

```gleam
string.replace(in: "www.example.com", each: ".", with: "-")
// "www-example-com"
```

### Case conversion

```gleam
string.lowercase("X-FILES") // "x-files"
string.uppercase("skinner") // "SKINNER"
```

Useful for case-insensitive work; implemented via target-specific primitives. 

### Ordering & comparison

```gleam
string.compare("Anthony", "Anthony") // order.Eq
string.compare("A", "B")             // order.Lt
```

Comparison is lexicographic over graphemes.

### Substrings & slicing

```gleam
string.slice(from: "gleam", at_index: 1, length: 2)  // "le"
string.slice(from: "gleam", at_index: -2, length: 2) // "am"
```

Negative `at_index` counts from the end; out-of-range is safe and returns `""`.

### Cropping & dropping

```gleam
string.crop(from: "The Lone Gunmen", before: "Lone") // "Lone Gunmen"
string.drop_start(from: "  hats", up_to: 2)          // "hats"
string.drop_end(from: "hats  ", up_to: 2)            // "hats"
```

### Contains / prefix / suffix

```gleam
string.contains(does: "theory", contain: "ory") // True
string.starts_with("theory", "the")             // True
string.ends_with("theory", "ory")               // True
```

### Splitting

```gleam
string.split("home/gleam/desktop/", on: "/")
// ["home","gleam","desktop",""]

string.split_once("home/gleam/desktop/", on: "/")
// Ok(#("home", "gleam/desktop/"))
```

`split_once` returns `Error(Nil)` if the separator is missing.

### Joining & building

```gleam
string.append(to: "butter", suffix: "fly")  // "butterfly"
string.concat(["never","the","less"])       // "nevertheless"
string.join(["home","evan","Desktop"], with: "/") // "home/evan/Desktop"
```

### Repeating & padding

```gleam
string.repeat("ha", times: 3)        // "hahaha"
string.pad_start("121", to: 5, with: ".") // "..121"
string.pad_end("123", to: 5, with: ".")   // "123.."
```

### Trimming

```gleam
string.trim("  hats  \n")       // "hats"
string.trim_start("  hats  \n") // "hats  \n"
string.trim_end("  hats  \n")   // "  hats"
```

Whitespace is defined per Unicode "Pattern\_White\_Space" (UAX #31). ([hexdocs.pm][1])

## Working at grapheme / code point level

### Pop & iterate graphemes

```gleam
string.pop_grapheme("gleam") // Ok(#("g", "leam"))
string.to_graphemes("abc")   // ["a","b","c"]
```

### Code points (Unicode scalars)

Convert a `String` to a list of Unicode **code points** and back:

```gleam
let cps = string.to_utf_codepoints("🏳️‍🌈")
// [UtfCodepoint(127987), 65039, 8205, 127752]

string.from_utf_codepoints(cps) // "🏳️‍🌈"
```

Construct / inspect code points:

```gleam
let assert Ok(cp) = string.utf_codepoint(97)         // 'a'
string.utf_codepoint_to_int(cp)                      // 97
```

These functions expose the scalar values; grapheme boundaries still follow UAX #29. ([Unicode][2])

## First/last, capitalisation, options

```gleam
string.first("icecream")   // Ok("i")
string.last("icecream")    // Ok("m")
string.capitalise("mamouna") // "Mamouna"
string.to_option("")       // None
string.to_option("hats")   // Some("hats")
```

## Performance & target notes

* Most operations here are **linear in graphemes** (e.g., `length`, `reverse`, `replace`, `split`, `join`, `repeat`). `byte_size` is constant time on BEAM, linear on JS. ([hexdocs.pm][1])
* BEAM recommends keeping Unicode text as **UTF-8 binaries**; this aligns with Gleam’s `String`. ([Erlang.org][7])
* On JS, remember that built-in host APIs (outside Gleam) can expose **UTF-16 code-unit** semantics (e.g., `.length` in raw JS). Gleam’s own functions provide Unicode-aware behavior. ([MDN Web Docs][4])

## Why grapheme-aware APIs matter

Counting graphemes (user-perceived characters) rather than bytes or code units yields correct behavior for combined marks, emoji, and complex scripts. This follows the Unicode Text Segmentation standard (UAX #29). ([Unicode][2])

### Further reading

* **`gleam/string` module docs (HexDocs)** — authoritative API reference. ([hexdocs.pm][1])
* **Gleam Tour: Strings** — literals, escapes, concatenation. ([tour.gleam.run][6])
* **Unicode UAX #29** — grapheme/word/sentence boundaries. ([Unicode][8])
* **Erlang Unicode usage** — background for BEAM target. ([Erlang.org][3])
* **MDN: JavaScript Strings** — UTF-16 code-unit representation. ([MDN Web Docs][4])

[1]: https://hexdocs.pm/gleam_stdlib/gleam/string.html?utm_source=chatgpt.com "gleam/string · gleam_stdlib · v0.63.0"
[2]: https://unicode.org/reports/tr29/?utm_source=chatgpt.com "UAX #29: Unicode Text Segmentation"
[3]: https://www.erlang.org/doc/apps/stdlib/unicode_usage.html?utm_source=chatgpt.com "Using Unicode in Erlang — stdlib v7.0.2"
[4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String?utm_source=chatgpt.com "String - JavaScript"
[5]: https://hexdocs.pm/gleam_stdlib/0.11.0/gleam/bit_string/?utm_source=chatgpt.com "gleam/bit_string - gleam_stdlib"
[6]: https://tour.gleam.run/basics/strings/?utm_source=chatgpt.com "Strings"
[7]: https://www.erlang.org/doc/apps/stdlib/unicode.html?utm_source=chatgpt.com "unicode — stdlib v7.0.3"
[8]: https://www.unicode.org/reports/tr29/tr29-32.html?utm_source=chatgpt.com "UAX #29: Unicode Text Segmentation"

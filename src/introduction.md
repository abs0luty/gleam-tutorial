## What is Gleam?

**Gleam** is a modern, friendly programming language for building type-safe and scalable systems. It compiles to [Erlang](http://www.erlang.org/) and JavaScript, and integrates seamlessly with other BEAM languages like Erlang, Elixir, and LFE.

A simple Gleam program looks like this:

```gleam
import gleam/io

pub fn main() {
  io.println("hello, world!")
}
```

Gleam combines the guarantees of a strong type system, the expressiveness of functional programming, and the reliability of the highly concurrent Erlang runtime.

## Reliability and scalability

Running on the Erlang virtual machine - the same platform behind large-scale systems such as WhatsApp - Gleam is built for production workloads of any size.

The BEAM runtime enables:

- Multi-core, actor-based concurrency with millions of lightweight processes.
- Immutable data structures for safe parallelism.
- A concurrent garbage collector that never pauses the entire system.

```gleam
fn spawn_task(i) {
  task.async(fn() {
    let n = int.to_string(i)
    io.println("Hello from " <> n)
  })
}

pub fn main() {
  list.range(0, 200_000)
  |> list.map(spawn_task)
  |> list.each(task.await_forever)
}
```

## Use syntax

Gleam's `use` syntax lets you write callback-based APIs in a flat, top-to-bottom style, killing the "pyramid of doom". 

It's pure syntax sugar that rewrites the rest of the block into an anonymous function passed to the callee, so you keep the same semantics (no new runtime magic) but lose the nesting - making control flow and error cases much easier to read and maintain:

```gleam
pub fn with_use() -> Result(String, Nil) {
  use username <- result.try(get_username())
  use password <- result.try(get_password())
  use greeting <- result.map(log_in(username, password))
  greeting <> ", " <> username
}
```

Without `use`, the same logic requires nested anonymous functions:
```gleam
pub fn without_use() -> Result(String, Nil) {
  result.try(get_username(), fn(username) {
    result.try(get_password(), fn(password) {
      result.map(log_in(username, password), fn(greeting) {
        greeting <> ", " <> username
      })
    })
  })
}
```

## Built-in tools

Gleam ships with everything you need: a compiler, build tool, formatter, package manager, and editor integrations. Starting a new project is as simple as:

```
gleam new my_project
```

The ecosystem includes thousands of packages from Gleam, Erlang, and Elixir. For example:

```
➜ gleam add gleam_json
      Added gleam_json v0.5.0
➜ gleam test
   Running app_test.main
.
1 tests, 0 failures
```

## Developer-friendly

Gleam avoids common pitfalls like null values and exceptions. Its type system and error messages are designed to be practical and approachable:

```
error: Unknown record field

  ┌─ ./src/app.gleam:8:16
  │
8 │ user.alias
  │     ^^^^^^ Did you mean `name`?

The value being accessed has this type:
    User

It has these fields:
    .name
```

## Interoperability

Gleam works smoothly with other BEAM languages, giving you access to a vast ecosystem of libraries. It can also compile to JavaScript, complete with TypeScript definitions for safe interoperability.

```gleam
@external(erlang, "Elixir.HPAX", "new")
pub fn new(size: Int) -> Table

pub fn register_event_handler() {
  let el = document.query_selector("a")
  element.add_event_listener(el, fn() {
    io.println("Clicked!")
  })
}
```

## Learn more

- [Language tour](https://gleam.run/book/tour/)
- [Official website](https://gleam.run)
- [Discord server](https://discord.com/invite/Fm8Pwmy)
- [Github](https://github.com/gleam-lang)
- [Cheat sheets for:](https://gleam.run/documentation#cheatsheets)
  * [Elixir users](https://gleam.run/cheatsheets/gleam-for-elixir-users/), [Elm users](https://gleam.run/cheatsheets/gleam-for-elm-users), [Erlang users](https://gleam.run/cheatsheets/gleam-for-erlang-users)
  * [PHP users](https://gleam.run/cheatsheets/gleam-for-php-users), [Python users](https://gleam.run/cheatsheets/gleam-for-python-users), [Rust users](https://gleam.run/cheatsheets/gleam-for-rust-users)
- [Awesome Gleam resource list](https://github.com/gleam-lang/awesome-gleam)
- [Standard library documentation](https://hexdocs.pm/gleam_stdlib/)
- [Gleam package index](https://packages.gleam.run/)
- [`gleam.toml` file reference](https://gleam.run/writing-gleam/gleam-toml/)
- [Command line reference (for `gleam` command)](https://gleam.run/writing-gleam/command-line-reference/)
- [Gleam's threads on the Erlang Forums](https://erlangforums.com/c/beam-language-forums/gleam-forum/36)
- [Gleam discussions on Github](https://github.com/gleam-lang/gleam/discussions)

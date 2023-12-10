# What is Gleam?

Gleam is a friendly language for building type-safe, scalable systems!

It compiles to [Erlang](http://www.erlang.org/) (or JavaScript) and has straightforward interop
with other BEAM languages such as Erlang, Elixir, and LFE.

For more information see the Gleam website: [https://gleam.run](https://gleam.run).

Hello world written in Gleam:

```gleam
import gleam/io

pub fn main() {
  io.println("hello, world!")
}
```

The power of a type system, the expressiveness of functional programming, and the reliability of the highly concurrent, fault tolerant Erlang runtime, with a familiar and modern syntax.

# Reliable and scalable

Running on the battle-tested Erlang virtual machine that powers planet-scale systems such as WhatsApp and Ericsson, Gleam is ready for workloads of any size.

Thanks to a multi-core actor based concurrency system that can run millions of concurrent tasks, fast immutable data structures, and a concurrent garbage collector that never stops the world, your service can scale and stay lightning fast with ease.

```gleam
fn spawn_task(i) {
  task.async(fn() {
    let n = int.to_string(i)
    io.println("Hello from " <> n)
  })
}

pub fn main() {
  // Run loads of threads, no problem
  list.range(0, 200_000)
  |> list.map(spawn_task)
  |> list.each(task.await_forever)
}
```

# Ready when you are

Gleam comes with compiler, build tool, formatter, editor integrations, and package manager all built in, so creating a Gleam project is just running gleam new.

As part of the wider BEAM ecosystem, Gleam programs can use thousands of published packages, whether they are written in Gleam, Erlang, or Elixir.

```
➜ (main) gleam add gleam_json
  Resolving versions
Downloading packages
 Downloaded 2 packages in 0.01s
      Added gleam_json v0.5.0
➜ (main) gleam test
 Compiling thoas
 Compiling gleam_json
 Compiling app
  Compiled in 1.67s
   Running app_test.main
.
1 tests, 0 failures
```

# Here to help

No null values, no exceptions, clear error messages, and a practical type system. Whether you're writing new code or maintaining old code, Gleam is designed to make your job as fun and stress-free as possible.

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

# Multilingual

Gleam makes it easy to use code written in other BEAM languages such as Erlang and Elixir, so there's a rich ecosystem of thousands of open source libraries for Gleam users to make use of.

Gleam can additionally compile to JavaScript, enabling you to use your code in the browser, or anywhere else JavaScript can run. It also generates TypeScript definitions, so you can interact with your Gleam code confidently, even from the outside.

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

# Links

- [Cheat sheets](https://gleam.run/documentation#cheatsheets)
- [Language tour](https://gleam.run/book/tour/)
- [Discord server](https://discord.com/invite/Fm8Pwmy)
- [Github](https://github.com/gleam-lang)

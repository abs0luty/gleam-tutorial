# Installation

## Erlang

As Gleam compiler transpiles mainly to erlang and additionally javascript, it requires erlang to work. So if you are on Linux or MacOS, you can use one of:

- For Homebrew on macOS: `brew install erlang`.
- For MacPorts on macOS: `port install erlang`.
- For Ubuntu and Debian: `apt-get install erlang`.
- For Fedora: `yum install erlang`.
- For ArchLinux and Manjaro: `pacman -S erlang`.
- For FreeBSD: `pkg install erlang`.

If you are on Windows, use [64-bit](https://github.com/erlang/otp/releases/download/OTP-26.1.2/otp_win64_26.1.2.exe) or [32-bit](https://github.com/erlang/otp/releases/download/OTP-26.1.2/otp_win32_26.1.2.exe) installers.

## Releases

To install Gleam, go to [releases tab](https://github.com/gleam-lang/gleam/releases) on the github repo. Find the last release and install the corresponding version.

## Building from source

In some cases, you want to build Gleam compiler from source. For example, when you need to use it in web using webassembly or you want to contribute. First clone the Gleam git repo:

```
git clone https://github.com/gleam-lang/gleam
cd gleam
```

Gleam compiler is written in Rust, so you need to have Rust installed on your system.

If you are on Linux/Mac, you can install `rustup` using this shell command:

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

`rustup` installs Rust programming language from the official release channels. To install latest stable of Rust, use `rustup toolchain install`.

If you are on Windows, go to the [Rust official website](https://www.rust-lang.org/learn/get-started) and click to the _download rustup-init.exe_ button. Then run the downloaded exe file and run shell command: `rustup toolchain install`.

After installing Rust, run:

```
cargo install --path compiler-cli
```

In the Gleam repo folder, and you will get Gleam compiler installed on your system.

In case, you need version of the Gleam compiler for WebAssembly, you need to first install `wasm-pack`:

```
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

If you are on Windows, you can alternatively install it from source:
```
cargo install wasm-pack
```

Then run:

```
cd compiler-wasm
wasm-pack build --target web
```

---
title: "Build a C++ Discord Bot with DPP"
seoTitle: "Build a C++ Discord Bot with DPP and CMake"
description: "Create a modern C++ Discord bot with DPP, CMake, slash commands, safe token handling, and a practical path from local testing to deployment."
image: "/images/writing/cpp-discord-bot-dpp.webp"
imageAlt: "A hand-drawn mechanical messenger carrying blank command bubbles between a terminal and a network of community members."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-15
category: "C++"
tags: ["C++", "Discord", "DPP", "CMake", "Bots"]
---

Discord bots are often introduced with JavaScript or Python, but the underlying model does not depend on either language. A bot opens a connection to Discord, listens for events, calls the HTTP API, and sends responses. [D++—usually called DPP](https://dpp.dev/) wraps those responsibilities in a modern C++ library.

This guide builds a small `/ping` slash-command bot. The program is deliberately narrow, but it includes the parts that matter in a real starting point: a CMake target, an environment-provided token, logging, command registration, and a clean interaction handler.

## What we are building

The finished bot has one command:

```text
/ping → Pong!
```

The command is registered to one development server, or *guild*. Guild commands normally become available faster than global commands, which makes them a better fit while developing. Once the behavior is stable, the same command can be registered globally.

You need:

- a C++20 compiler;
- CMake 3.20 or newer;
- the DPP library and its dependencies;
- a Discord account and a server where you can install applications;
- a bot token stored outside the source code.

The example uses DPP's default, non-privileged intents. A slash command does not require reading the content of every message.

## Create the Discord application

Open the [Discord Developer Portal](https://discord.com/developers/applications), create an application, and add a bot from its **Bot** page. Treat the token shown there like a password: anyone holding it can operate the bot.

When you create an installation URL, include the `bot` and `applications.commands` scopes. Grant only the permissions the bot actually needs. This `/ping` example does not need administrator access.

Add the bot to a test server, enable Discord's developer mode, and copy the server ID. The program will read both values from environment variables:

```text
DISCORD_BOT_TOKEN
DISCORD_GUILD_ID
```

Do not paste the token into `main.cpp`, a CMake file, a shell script committed to Git, a screenshot, or an error report. If it is exposed, reset it in the Developer Portal.

## Project layout

The project contains two files:

```text
dpp-ping-bot/
├── CMakeLists.txt
└── src/
    └── main.cpp
```

Create `CMakeLists.txt` at the project root:

```cmake
cmake_minimum_required(VERSION 3.20)

project(dpp_ping_bot VERSION 1.0.0 LANGUAGES CXX)

find_package(dpp CONFIG REQUIRED)

add_executable(dpp_ping_bot
  src/main.cpp
)

target_compile_features(dpp_ping_bot PRIVATE cxx_std_20)
target_link_libraries(dpp_ping_bot PRIVATE dpp::dpp)
```

`find_package` asks an installed DPP package for its CMake configuration. The imported target `dpp::dpp` carries the include paths and link requirements that the executable needs. That is safer than copying library paths into the project by hand.

## Read configuration without embedding secrets

Now add `src/main.cpp`:

```cpp
#include <dpp/dpp.h>

#include <cstdlib>
#include <exception>
#include <iostream>
#include <stdexcept>
#include <string>

namespace {

std::string require_environment(const char* name) {
  const char* value = std::getenv(name);

  if (value == nullptr || value[0] == '\0') {
    throw std::runtime_error(std::string("Missing environment variable: ") + name);
  }

  return value;
}

}  // namespace

int main() {
  try {
    const std::string token = require_environment("DISCORD_BOT_TOKEN");
    const std::string guild_text = require_environment("DISCORD_GUILD_ID");
    const dpp::snowflake guild_id = std::stoull(guild_text);

    dpp::cluster bot(token, dpp::i_default_intents);

    bot.on_log(dpp::utility::cout_logger());

    bot.on_slashcommand([](const dpp::slashcommand_t& event) {
      if (event.command.get_command_name() == "ping") {
        event.reply("Pong!");
      }
    });

    bot.on_ready([&bot, guild_id](const dpp::ready_t&) {
      if (dpp::run_once<struct register_commands>()) {
        dpp::slashcommand ping(
          "ping",
          "Check whether the bot is responding",
          bot.me.id
        );

        bot.guild_command_create(ping, guild_id);
      }
    });

    bot.start(dpp::st_wait);
  } catch (const std::exception& error) {
    std::cerr << "Startup failed: " << error.what() << '\n';
    return 1;
  }
}
```

The `dpp::cluster` owns the connection to Discord and dispatches events to the registered handlers. `on_ready` runs after a session becomes ready. `on_slashcommand` runs when Discord delivers an application-command interaction. `event.reply` sends the interaction response.

`dpp::run_once` prevents the registration body from running repeatedly during reconnects within this process. It is useful for a small tutorial, but it is not a complete deployment strategy: multiple bot processes can still register the same command, and repeated command writes can be rate-limited. Larger bots should move registration into an explicit deployment command or other single-owner step. DPP makes the same caution in its [slash-command guide](https://dpp.dev/slashcommands.html).

## Install DPP and configure the build

Installation differs by platform. Follow the current [DPP installation documentation](https://dpp.dev/md_docpages_01_installing.html) for supported packages.

On Windows, DPP documents a vcpkg package:

```powershell
vcpkg install dpp:x64-windows
```

Point CMake at the vcpkg toolchain when configuring:

```powershell
cmake -S . -B build `
  -DCMAKE_TOOLCHAIN_FILE=C:/path/to/vcpkg/scripts/buildsystems/vcpkg.cmake

cmake --build build --config Debug
```

On a Unix-like system where DPP is installed in a standard prefix, the usual flow is:

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
cmake --build build
```

If DPP was installed to a custom prefix, add it to `CMAKE_PREFIX_PATH` rather than hard-coding its include and library directories into `CMakeLists.txt`.

## Set the environment and run

In PowerShell, set variables only for the current terminal session:

```powershell
$env:DISCORD_BOT_TOKEN = "replace-with-your-token"
$env:DISCORD_GUILD_ID = "replace-with-your-server-id"
./build/Debug/dpp_ping_bot.exe
```

In Bash:

```bash
export DISCORD_BOT_TOKEN='replace-with-your-token'
export DISCORD_GUILD_ID='replace-with-your-server-id'
./build/dpp_ping_bot
```

Use a local secret manager, service configuration, or deployment platform's secret store outside this tutorial. Shell history and process environments have their own exposure risks, so choose a method appropriate to the machine and threat model.

When the log shows that the bot is ready, open the test server and run `/ping`. Discord should display `Pong!` as the interaction response.

## Why slash commands are the modern baseline

A traditional bot watches for a message such as `!ping`, parses the message body, and sends another message. That can be appropriate, but receiving arbitrary message content can require Discord's privileged Message Content intent depending on the bot and context.

Slash commands give Discord a declared command name and description. The client can show available commands, validate options, and deliver a structured interaction. This example therefore needs no `on_message_create` handler and does not request a privileged intent it does not use.

## Global commands and command updates

Replace the guild registration call with this when a command should be available everywhere the application is installed:

```cpp
bot.global_command_create(ping);
```

Global availability and updates may not feel as immediate as guild-scoped development commands. Keep guild registration during iteration, then promote a reviewed command definition.

For several commands, DPP provides bulk registration APIs. Bulk replacement is convenient, but it defines the complete desired set: commands missing from that set can be removed. Treat the registered command list as deployment state, not as a harmless action on every reconnect.

## Common failures

### CMake cannot find DPP

The package was not installed for the selected architecture, or CMake was not given the package prefix or vcpkg toolchain. Confirm the package exists and configure into a fresh build directory after changing toolchains.

### The bot starts but `/ping` is missing

Confirm the application was installed with the `applications.commands` scope, the guild ID is correct, and registration completed without an API error. Also check that you are testing the same Discord application represented by the token.

### Discord rejects the token

Remove surrounding whitespace and verify that the value is the bot token, not the application ID, public key, client secret, or guild ID. Reset the token if there is any chance it was exposed.

### The command is registered many times

Do not treat the ready event as a general migration system. Register only once during development, and use a dedicated registration path when multiple processes or deployments are involved.

### The process exits immediately

The example uses `dpp::st_wait`, so it should block while DPP runs. Read the log above the exit. Missing environment variables, an invalid numeric guild ID, TLS problems, or a rejected connection should be handled as startup failures rather than hidden.

## Where to go next

The next useful step is not adding dozens of commands. Add one option, validate it, and make the response ephemeral when its contents should only be visible to the caller. Then separate command definitions from command handlers and introduce structured logging around failures.

For operations that may take longer than Discord's initial interaction window, acknowledge or defer the interaction first and complete it asynchronously. DPP's [interactions and components documentation](https://dpp.dev/interactions-and-components.html) covers richer responses, buttons, selections, and follow-up behavior.

A small bot becomes a dependable one when permissions stay narrow, secrets remain outside the binary and repository, command registration is deliberate, and every external failure is visible in the logs.

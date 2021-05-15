<p align="center">
    <img src="https://raw.githubusercontent.com/TulioAbreu/shazow-bot/master/assets/ShazowBot.svg" alt="ShazowBot">
</p>
<p align="center">
    <a href="https://gitmoji.dev">
        <img src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square" alt="Gitmoji">
    </a>
    <a href="https://github.com/TulioAbreu/shazow-bot/actions/workflows/main.yml">
        <img src="https://github.com/TulioAbreu/shazow-bot/actions/workflows/main.yml/badge.svg" alt="Tests">
    </a>
</p>

ShazowBot is my personal chat bot for general and useless stuff. The main focus here is making the bot
flexible enough to support any environment (discord, twitch, etc.) by simply implementing the message listener, message parser and action execution.

## Package Structure

| Codebase | Description |
| -------- | ----------- |
| [Chat](https://github.com/TulioAbreu/shazow-bot/tree/master/packages/chat)     | Normalizes multiple environments input/output |
| [Server](https://github.com/TulioAbreu/shazow-bot/tree/master/packages/server)   | Bot implementation |

## Settings

For `.env` settings, the following properties are needed:

- **MONGODB_CONNECTION_URL**: MongoDb connection URL for storing/retrieving [models](https://github.com/TulioAbreu/shazow-bot/tree/master/packages/server/src/models).

- **DISCORD_TOKEN**: Discord Bot Token.

- **TWITCH_USERNAME**: Your bot twitch username.

- **TWITCH_TOKEN**: Your `TWITCH_USERNAME` generated oauth token

For general (and not sensitive data), we use `config.json`:

- **prefix**: Prefix used for commands

- **trollCommandThreshold**: Troll commands are ignored since they generally dont mean anything besides trying to find problems inside the bot implementation. The threshold is the minimum message size for classifying it as troll

- **twitchChannels**: List of twitch channels to connect with

## Repository Commands

- **build**: Build all packages
- **start**: Start the bot
- **lint**: Run linter
- **new command**: Creates new command boilerplate

To see bot available commands, check out [this folder](https://github.com/TulioAbreu/shazow-bot/tree/master/docs).

# UXBot

![Bot Logo](https://cdn.discordapp.com/avatars/1294906343421120532/2310ab26f36b9c85f56c574ab53016b7?size=256) <!-- Optional: Add a logo or image -->

## Description

A discord bot to help manage the [UXS] UX Design + Engineering ‘24-’25 Discord Server

## Features

- Feature 1: Github username collection
- Feature 2: Give users write roles to specified UXSociety Repositories
- Feature 3: Verify pull requests to grant users the "git good" role

## Getting Started

### Prerequisites

- Node.js
- A Discord bot token
- A github personal access token with neccessary permissions

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/UXSoc/uxsoc-discord-bot.git
2. Navigate to the project directory:
   ```bash
   cd uxsoc-discord-bot
3. Install the required packages:
   ```bash
   npm install
4. Create a `.env` file in the root directory and add your environment variables:
    ```bash
    DISCORD_TOKEN=your_discord_bot_token
    GITHUB_TOKEN=your_github_token
    ENVIRONMENT=PROD
5. Start the bot:
    ```bash
    node .
## Configuration
The `config.json` file is essential for configuring various settings and options for UXbot. Below is an explanation of the different fields and their purposes.

### Structure

Here’s an example of how the `config.json` file may look:

```json
{
    "prefix": ".",
    "dev_prefix": "~",
    "embedColor": "#3b2662",
    "repo_owner": "UXSoc",
    "allowedRepos": [
        "uxsoc-engineering-pool-2425"
    ],
    "announcement_reactions": {
        "hearts": ["🩵","💜"],
        "normal": ["🔥","💖"]
    },
    "activity": {
        "type": "WATCHING",
        "name": "you."
    },
    "channels": {
        "hype": ["1284744692721913860"],
        "dev": ["1295726646049112085", "1284755815135445082"],
        "rules": "1284749780752400446"
    },
    "min_hype": 3,
    "max_hype": 4
}
```

## Fields

### `dev_prefix`
- **Type**: `string`
- **Description**: The command prefix used in development mode.

### `prefix`
- **Type**: `string`
- **Description**: The default command prefix for the bot in production.

### `embedColor`
- **Type**: `string`
- **Description**: The color used for embeds sent by the bot. Should be in hex format (e.g., `#7289DA`).

### `repo_owner`
- **Type**: `string`
- **Description**: The owner of the GitHub repository associated with the bot.

### `allowedRepos`
- **Type**: `array`
- **Description**: An array of repository names that are allowed for collaboration.

### `announcement_reactions`
- **Type**: `object`
- **Description**: Configurations for reactions to announcements.
  - **`hearts`**: An array of heart emoji strings for special reactions.
  - **`normal`**: An array of normal emoji strings for general reactions.

### `activity`
- **Type**: `object`
- **Description**: An object that defines the bot's activity status.
  - **`name`**: The activity text (e.g., "Idol - Yoasobi").
  - **`type`**: The type of discord activity (`LISTENING`, `WATCHING`, `PLAYING`, `COMPETING`,`STREAMING`,`CUSTOM`).

### `channels`
- **Type**: `object`
- **Description**: An object defining channel IDs for various purposes.
  - **`dev`**: An array of channel IDs for development-related commands.
  - **`hype`**: An array of channel IDs where hype messages are sent.
  - **`rules`**: The channel ID where server rules are posted.

### `min_hype`
- **Type**: `number`
- **Description**: The minimum number of hype reactions to send in hype channels.

### `max_hype`
- **Type**: `number`
- **Description**: The maximum number of hype reactions to send in hype channels.

## Usage

The `config.json` file is loaded at the start of the bot and provides all necessary configurations. Make sure to modify the values according to your needs before running the bot. This allows for easy adjustments without modifying the codebase directly.

## Example

To change the command prefix, simply update the `prefix` field:

```json
"prefix": "!"

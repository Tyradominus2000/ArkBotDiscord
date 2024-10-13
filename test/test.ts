import fs from "node:fs";
import path from "node:path";
import * as Config from "../config.json";
import { ServerArk } from "../class/Server";
import * as Discord from "discord.js";
import MyClient from "../class/MyClient";

const client = new MyClient({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMessageReactions,
  ], // Setting Discord bot intents
});

// Create server instance
const server = new ServerArk(
  {
    host: Config.ip,
    port: Config.port,
    password: Config.password,
    options: {
      tcp: true,
      challenge: false,
    },
  },
  client,
  Config.pathLog,
  "1035193472195514434"
);
// Authentificate the client
client.login(Config.token);

// When client as started
client.once(Discord.Events.ClientReady, async (c) => {
  const time = ServerArk.getTime();
  console.log(`${time} Discord: Ready! Logged in as ${c.user.tag}`);
});

/* HANDELING OF COMMAND FOR DISCORDBOT */
client.commands = new Discord.Collection(); // Creating a collection for bot commands

const commandsPath = "E:/Zone1/Ark/ArkBot/commands";

const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js")); // Reading and filtering command files

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.on(Discord.Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = (interaction.client as MyClient).commands.get(
    interaction.commandName
  );

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction, server);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

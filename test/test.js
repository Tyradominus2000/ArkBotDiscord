const fs = require("node:fs");
const path = require("node:path");
const { ip, password, port, token } = require("../config.json");
const { ServerArk } = require("../class/Server");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ], // Setting Discord bot intents
});

// Create server instance
const server = new ServerArk(
  {
    host: ip,
    port: port,
    password: password,
    options: {
      tcp: true,
      challenge: false,
    },
  },
  client,
  "E:/Zone1/Ark/ArkBot/server/log/",
  "bots"
);
// Authentificate the client
client.login(token);

// When client as started
client.once(Events.ClientReady, async (c) => {
  const time = ServerArk.getTime();
  console.log(`${time} Discord: Ready! Logged in as ${c.user.tag}`);
});

/* HANDELING OF COMMAND FOR DISCORDBOT */
client.commands = new Collection(); // Creating a collection for bot commands

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

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

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

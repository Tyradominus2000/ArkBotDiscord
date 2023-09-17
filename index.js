const fs = require("node:fs"); // File system module
const path = require("node:path"); // Path module
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js"); // Discord.js library
const { token } = require("./config.json");
const Function = require("./function/function"); // Importing custom function module

let ServerStatus = false; //Server State
let RconAuth = false; //Rcon Auth State
let ServerStarting = false; //Server Starting state
function ChangeServerStatus(NewState) {
  ServerStatus = NewState;
}
function ChangeServerStarting(NewState) {
  ServerStarting = NewState;
}
function ChangeRconAuth(NewState) {
  RconAuth = NewState;
}

global.client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ], // Setting Discord bot intents
});

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  try {
    RconAuth = await Function.server_status();
    ServerStatus = RconAuth;
    console.log("Server Status " + ServerStatus);
  } catch (error) {
    throw error;
  }
});

/* HANDELING OF COMMAND FOR DISCORDBOT */
client.commands = new Collection(); // Creating a collection for bot commands

const commandsPath = path.join(__dirname, "commands");
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
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(token); // Logging in with the bot's token
module.exports = {
  ChangeRconAuth,
  ChangeServerStarting,
  ChangeServerStatus,
  ServerStarting,
  ServerStatus,
  RconAuth,
};

import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CacheType,
} from "discord.js";
import { ServerArk } from "../class/Server";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("saveserver")
    .setDescription("Save the server"),

  async execute(
    interaction: ChatInputCommandInteraction<CacheType>,
    server: ServerArk
  ) {
    const result = await server.rconSaveWorld();
    if (result) {
      interaction.reply("Saving world");
    } else {
      interaction.reply("Fail to save world");
    }
  },
};

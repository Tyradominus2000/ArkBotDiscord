import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import { ServerArk } from "../class/Server";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("authentificate")
    .setDescription("Authentificate to the RCON"),

  async execute(interaction: ChatInputCommandInteraction<CacheType>, server: ServerArk) {
    const result = server.rconAuthentificate();
    if (result) {
      interaction.reply("Authentification au rcon");
    } else {
      interaction.reply("Echec de l'authentification au rcon");
    }
  },
};

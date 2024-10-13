import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import { ServerArk } from "../class/Server";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("showplayer")
    .setDescription("Show all the information about player"),

  async execute(interaction: ChatInputCommandInteraction<CacheType>, server: ServerArk) {
    await interaction.deferReply();

    const player = await server.rconGetPlayer();

    if (player) {
      if (player[0] === "No") {
        interaction.editReply(String(player));
      } else {
        interaction.editReply("Pas de Joueur");
      }
    } else {
      interaction.editReply("Echec lors de la récupération des joueurs");
    }
  },
};

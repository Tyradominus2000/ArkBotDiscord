const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const { ServerArk } = require("../class/Server");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("showplayer")
    .setDescription("Show all the information about player"),
  /**
   * @param {ChatInputCommandInteraction<CacheType>} interaction
   * @param {ServerArk} server
   */
  async execute(interaction, server) {
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

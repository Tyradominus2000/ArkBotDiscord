const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const { ServerArk } = require("../class/Server");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverstop")
    .setDescription("stop the ArkServer"),
  /**
   * @param {ChatInputCommandInteraction<CacheType>} interaction
   * @param {ServerArk} server
   */
  async execute(interaction, server) {
    await interaction.deferReply();
    const state = server.getStatus();

    switch (state) {
      case "START":
      case "STARTING":
        const player = server.rconGetPlayer();
        if (player[0] == "No") {
          await server.rconSaveWorld();

          const result = server.stopServer();
          if (result) {
            interaction.editReply("Arrêt du Server");
          } else {
            interaction.editReply("Echec arrêt du Server");
          }
        } else {
          interaction.editReply("Il reste des Joueurs !");
        }
        break;
      case "STOP":
      default:
        interaction.editReply("Serveur déjâ arreté ou en court d'arrêt");
        break;
    }
  },
};

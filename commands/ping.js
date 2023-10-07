const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("ping the bot"),
    async execute(interaction) {
        if (interaction.member.user.username == `Kwadz'`) {
            interaction.reply("PONG mon bro");
        } else if (interaction.member.user.username == `ThePig'`) {
            interaction.reply("PONG PONG");
        } else {
            interaction.reply("pong");
        }
    },
};

const { SlashCommandBuilder } = require("discord.js")

module.exports =  {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("You bot life proof"),

    async execute(interaction) {
        await interaction.reply("Pong!")
    }
}
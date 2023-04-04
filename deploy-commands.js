const { REST, Routes } = require("discord.js")

// Dotenv
const dotenv = require('dotenv');
dotenv.config();
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

// Import Commands
const fs = require("node:fs");
const path = require("node:path");
const commandsPath = path.join(__dirname, "src/commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

const commands = []
for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`)
    commands.push(command.data.toJSON())
}

// REST
const rest = new REST({ version: "10" }).setToken(TOKEN);

// Deploy
(async () => {
    try {
        console.log(`Restarting ${commands.length} commands`)
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        )
        console.log("Commands registration was successufuly")
    } catch (error) {
        console.error(error)
    }
})()
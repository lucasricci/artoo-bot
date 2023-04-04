// Require the necessary discord.js classes and dotenv
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const dotenv = require('dotenv');

// Dotenv Import
dotenv.config();
const { TOKEN } = process.env

// Import Commands
const fs = require("node:fs")
const path = require("node:path")

const commandsPath = path.join(__dirname, "src/commands")
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"))

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection()

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command)
    }
    else {
        console.log(`This command in ${filePath} are with "data" or "execute" missing`)
    }
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(TOKEN);

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return
    const command = interaction.client.commands.get(interaction.commandName)
    if (!command) {
        console.error("Hmmm? I do not find that command")
        return
    }
    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        await interaction.reply("There was an error running this command")
    }
});
require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = '1249664047478210601';
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

//defining the purge command

const commands = [
    new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purge messages")
    .addIntegerOption(option => option
    .setName("amount")
    .setDescription("Amount of messages to purge")
    .setRequired(true)
    ),
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

//global commands
(async () => {
    try {
        console.log('Started refreshing global (/) commands.');

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands.map(command => command.toJSON()) },
        );

        console.log('Successfully reloaded global (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

//Bot Ready Event
client.on('ready', () => {
    console.log(`logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    
//main command thingie

    const amount = interaction.options.getInteger('amount');
    
if(interaction.commandName === 'purge') {
    if (!amount) {
        return interaction.reply({
            content: 'You must provide a valid number of messages to delete!',
            ephemeral: true,
        });
    }
    if (amount < 1 || amount > 100) {
        await interaction.reply('Please provide a number between 1 and 100.')
    }
}

if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
    return interaction.reply({
        content: "You don't have permission to use this command!",
        ephemeral: true,
    });
}

if (!interaction.guild.members.me.permissions.has('MANAGE_MESSAGES')) {
    return interaction.reply({
        content: "I don't have permission to purge messages!",
        ephemeral: true,
    });
}
try {
    const deletedMessages = await interaction.channel.bulkDelete(amount, true);
        await interaction.reply({
            content: `Successfully deleted ${deletedMessages.size} messages.`,
            ephemeral: true,
        });
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: 'There was an error trying to delete messages in this channel.',
                ephemeral: true,
            });
        }
    }
);

//login yipeeee
client.login(TOKEN);

import { CommandInteraction, Permissions } from "discord.js"
import { SlashCommandBuilder } from "@discordjs/builders"

export class CooldownDate {
    public timeInMs: number

    constructor(options: { seconds?: number, minutes?: number, hours?: number, days?: number, months?: number, years?: number }) {
        if (options.seconds) this.timeInMs += options.seconds * 1000
        if (options.minutes) this.timeInMs += options.minutes * 60000
        if (options.hours) this.timeInMs += options.hours * 3600000
        if (options.days) this.timeInMs += options.days * 86400000
        if (options.months) this.timeInMs += options.months * 2678400000
        if (options.years) this.timeInMs += options.years * 31536000000
    }
}

export class PreprocessorOptions {
    public serverOnly?: boolean
    public cooldownDate?: CooldownDate
    public userPermissions?: bigint[]
    public botPermissions?: bigint[]

    constructor(options: { serverOnly?: boolean, cooldownDate?: CooldownDate, userPermissions?: bigint[], botPermissions?: bigint[] }) {
        // checks
        if (this.userPermissions && !options.serverOnly) {
            if (this.userPermissions.length > 0) throw new Error("Command must be confined to servers in order to require user permissions.")
        }

        if (this.botPermissions && !options.serverOnly) {
            if (this.botPermissions.length > 0) throw new Error("Command must be confined to servers in order to require bot permissions.")
        }
        this.serverOnly = options.serverOnly
        this.cooldownDate = options.cooldownDate
        this.userPermissions = options.userPermissions
        this.botPermissions = options.botPermissions
    }
}

export class SlashCommand {
    public slashCommand: SlashCommandBuilder
    public commandHandler: (i: CommandInteraction) => {}
    public preprocessorOptions: PreprocessorOptions

    constructor(options: { slashCommand: SlashCommandBuilder, commandHandler: (i: CommandInteraction) => {}, preprocessorOptions?: PreprocessorOptions }) {
        this.slashCommand = options.slashCommand
        this.commandHandler = options.commandHandler
        this.preprocessorOptions = options.preprocessorOptions
    }
}

// Example of slash command objects
// Class instances must be exported under the name "BotSlashCommand" in order to be registered.

// A barebones example of a SlashCommand object.
new SlashCommand({
    slashCommand: new SlashCommandBuilder().setName("Testing command").setDescription("A testing command."),
    commandHandler: async i => await i.reply({ content: "There's nothing to see here in this example test command!", ephemeral: true })
})

// A SlashCommand object featuring the use of the preprocessor.
new SlashCommand({
    slashCommand: new SlashCommandBuilder().setName("Testing command").setDescription("A testing command, but it uses the preprocessor."),
    commandHandler: async i => await i.reply({ content: "It looks like you have administrator permissions, very cool!", ephemeral: true }),
    preprocessorOptions: new PreprocessorOptions({
        serverOnly: true,
        cooldownDate: new CooldownDate({ seconds: 10 }),
        userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
    })
})
import { CommandInteraction, Permissions } from "discord.js"

export class CooldownDate {
    public timeInMs: number

    constructor(options: { seconds: number, minutes: number, hours?: number, days?: number, months?: number, years?: number }) {
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
    public userPermissions?: Permissions[]
    public botPermissions?: Permissions[]

    constructor(options: { serverOnly?: boolean, cooldownDate?: CooldownDate, userPermissions?: Permissions[], botPermissions?: Permissions[] }) {
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
    public slashCommand: SlashCommand
    public commandHandler: (i: CommandInteraction) => {}
}
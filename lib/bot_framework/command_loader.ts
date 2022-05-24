import { readdir } from "fs/promises";
import { SlashCommand, PreprocessorOptions } from "./command_classes.js"
import { Logger } from "./logger.js"

const logger = new Logger("CommandLoader")

export async function searchForCommands(dir: string): Promise<string[]> {
    const files = await readdir(dir);
    const commands = files.filter(file => file.endsWith(".ts") || file.endsWith(".js"));
    return commands;
}

export async function loadCommands(cmds: string[]): Promise<SlashCommand[]> {
    const ret = []
    for (const cmd of cmds) {
        let slashCommand 

        try {
            slashCommand = await import(`./${cmd}`);
        } catch (err) {
          logger.error(`Failed to load command file! Error: \n${err.stack}`)
        }

        if (slashCommand.slashCommand) {
          if (slashCommand !instanceof slashCommand) {
            logger.debug(`File ${cmd} is not a valid command file, skipping...`)
          } else {
            let existingSlashCommand = undefined
            for (const cmd in ret) { if (slashCommand.name.toLowerCase() == slashCommand.slashCommand.slashCommand.name.toLowerCase()) existingSlashCommand = true; }
            
            if (existingSlashCommand) {
              throw new Error(`Failed to load slash command "${slashCommand.slashCommand.slashCommand.name}": There already exists a command under that name.`)
            } else {
              ret.push(slashCommand.slashCommand)
              logger.debug(`Loaded command ${slashCommand.slashCommand.slashCommand.name}.`)

              // init
            }
          }
        }
    }

  return ret
}
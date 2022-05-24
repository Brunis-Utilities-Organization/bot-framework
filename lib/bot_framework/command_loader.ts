import { readdir } from "node:fs/promises";
import { SlashCommand } from "./command_classes.js"

const logger = new Logger

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

        }
    }
}
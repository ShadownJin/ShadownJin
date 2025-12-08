import { Client } from "discord.js";
import { IEvent } from "../structs/types/client.js";

const readyEvent: IEvent = {
    name: "clientReady",
    once: true,

    execute: (client: Client) => {
        console.log(`Bot online como ${client.user?.tag}`);
    }
};

export default readyEvent;

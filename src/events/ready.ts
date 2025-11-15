import { Client } from "discord.js";
import { IEvent } from "../structs/types/client.js";

const clientReadyEvent: IEvent = {
    name: 'clientReady',
    once: true,

    /**
     * @param client
     */
    execute: (client: Client) => {
        if (client.user) {
            console.log(`ShadownJin pronto como ${client.user.tag} - ${new Date().toLocaleString()}`);
        } else {
            console.error('O cliente está pronto, mas as informações do usuário não foram encontradas.');
        }
    }
};

export default clientReadyEvent;
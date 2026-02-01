import { Events } from 'discord.js';
import { CustomClient, Event } from '../structs/types/client.js';

const ready: Event = {
    name: 'clientReady',
    execute: (client) => {
        console.log(`Ready! Logado como ${client.user?.username}`);
    }
};

export default ready;
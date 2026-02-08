import { Event } from "../structs/types/client.js";

const ready: Event = {
  name: "clientReady",
  execute: (client) => {
    console.log(`\nReady! 
Logado como: ${client.user?.username}
Tag: ${client.user?.tag}
Id: ${client.user?.id}
Link Convite: ${process.env.INSTALL_LINK}
`);
  },
};

export default ready;

const ready = {
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

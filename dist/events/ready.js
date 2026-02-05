const ready = {
    name: 'clientReady',
    execute: (client) => {
        console.log(`Ready! Logado como ${client.user?.username}`);
    }
};
export default ready;

declare namespace NodeJS {
    interface ProcessEnv {
        DISCORD_TOKEN: string;
        APPLICATION_ID: string;
        DISCORD_PUBLIC_KEY: string;
        GUILD_ID: string;
        FIREBASE_PROJECT_ID: string;
        FIREBASE_CLIENT_EMAIL: string;
        FIREBASE_PRIVATE_KEY: string;
    }
}
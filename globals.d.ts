declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string;
            CLIENT_ID: string;
            URL: string;
            PORT: string;
        }
    }
}

export { }
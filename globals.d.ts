declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string | undefined;
            CLIENT_ID: string | undefined;
            URL: string | undefined;
            PORT: string | undefined;
            AUTH_KEY: string | undefined;
        }
    }
}

export { }
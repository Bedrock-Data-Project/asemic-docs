import { defineConfig, HeadConfig } from "vitepress";
import { generateConfig } from "./rewrites";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const config = generateConfig();

const umamiScript: HeadConfig = [
    "script",
    {
        defer: "true",
        src: process.env.UMAMI_SRC as string,
        "data-website-id": process.env.UMAMI_WEBSITE_ID as string,
    },
];

const baseHeaders: HeadConfig[] = [];

const headers =
    process.env.ENVIRONMENT === "production"
        ? [...baseHeaders, umamiScript]
        : baseHeaders;

export default defineConfig({
    title: "Asemic",
    head: headers,
    description: "Advanced product analytics platform",
    srcDir: "docs",
    rewrites: config.rewrites,
    ignoreDeadLinks: true,
    themeConfig: {
        search: {
            provider: "local",
        },
        nav: [
            { text: "Home", link: "/" },
            { text: "Docs", link: "/get-started/introduction" },
            { text: "App", link: "http://35.244.200.118/" },
        ],
        sidebar: config.sidebar,
    },
});

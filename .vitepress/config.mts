import { defineConfig, HeadConfig } from "vitepress";
import { generateConfig } from "./rewrites";
import { transformHead } from "./head";
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

const baseHeaders: HeadConfig[] = [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
];

const headers =
    process.env.ENVIRONMENT === "production"
        ? [...baseHeaders, umamiScript]
        : baseHeaders;

export default defineConfig({
    title: "Asemic Documentation - DWH-Native Product Analytics Platform",
    head: headers,
    description: "Complete documentation for Asemic product analytics. Learn about dashboards, time travel, data integration, semantic layers, and key concepts for DWH-native analytics.",
    srcDir: "docs",
    transformHead: ({ pageData }) => transformHead(pageData),
    rewrites: config.rewrites,
    ignoreDeadLinks: true,
    sitemap: {
        hostname: "https://docs.asemicanalytics.com",
    },
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

import { defineConfig } from "vitepress";
import fs from "fs";
import path from "path";

// const rewrites = {
//     "1.get-started/1.introduction.md": "get-started/introduction.md",
//     "1.get-started/2.key-concepts.md": "get-started/key-concepts.md",
//     "1.get-started/3.get-started.md": "get-started/get-started.md",
//     "2.capabilities/1.dashboard-creation.md":
//         "capabilities/dashboard-creation.md",
//     "2.capabilities/2.chart-types.md": "capabilities/chart-types.md",
//     "2.capabilities/3.date-filter.md": "capabilities/date-filter.md",
//     "2.capabilities/4.time-travel.md": "capabilities/time-travel.md",
//     "2.capabilities/5.user-action-as-filter.md":
//         "capabilities/user-action-as-filter.md",
//     "2.capabilities/6.annotations.md": "capabilities/annotations.md",
//     "2.capabilities/7.auto-generation.md": "capabilities/auto-generation.md",

//     "4.advanced-topics/1.connecting-data-sources.md":
//         "advanced-topics/connecting-data-sources.md",
//     "4.advanced-topics/3.setting-up-semantic-layer.md":
//         "advanced-topics/setting-up-semantic-layer.md",
// };

// const sidebar = [
//     {
//         text: "Get Started",
//         collapsed: false,
//         items: [
//             {
//                 text: "Introduction",
//                 link: "/get-started/introduction",
//             },
//             {
//                 text: "Key Concepts",
//                 link: "/get-started/key-concepts",
//             },
//             {
//                 text: "Get Started",
//                 link: "/get-started/get-started",
//             },
//         ],
//     },
//     {
//         text: "Capabilities",
//         collapsed: false,
//         items: [
//             {
//                 text: "Dashboard Creation",
//                 link: "/capabilities/dashboard-creation",
//             },
//             {
//                 text: "Chat Types",
//                 link: "/capabilities/chart-types",
//             },
//             {
//                 text: "Date Filter",
//                 link: "/capabilities/date-filter",
//             },
//             {
//                 text: "Time Travel",
//                 link: "/capabilities/time-travel",
//             },
//             {
//                 text: "User Action as Filter",
//                 link: "/capabilities/user-action-as-filter",
//             },
//             {
//                 text: "Annotations",
//                 link: "/capabilities/annotations",
//             },
//             {
//                 text: "Auto Generation",
//                 link: "/capabilities/auto-generation",
//             },
//         ],
//     },
//     {
//         text: "Advanced Topics",
//         collapsed: false,
//         items: [
//             {
//                 text: "Connecting Data Sources",
//                 link: "/advanced-topics/connecting-data-sources",
//             },
//             {
//                 text: "Setting Up Semantic Layer",
//                 link: "/advanced-topics/setting-up-semantic-layer",
//             },
//         ],
//     },
// ];

interface SidebarItem {
    text: string;
    link: string;
}

interface SidebarGroup {
    text: string;
    collapsed: boolean;
    items: SidebarItem[];
}

interface GenerateConfigResult {
    rewrites: Record<string, string>;
    sidebar: SidebarGroup[];
}

const docsDir = path.resolve(__dirname, "..", "docs");

function generateConfig(): GenerateConfigResult {
    const rewrites: Record<string, string> = {};
    const sidebar: SidebarGroup[] = [];

    const folders = fs.readdirSync(docsDir).filter((f) => {
        return (
            fs.statSync(path.join(docsDir, f)).isDirectory() && /^\d+\./.test(f) // Only include folders that start with a number and a dot
        );
    });

    // Sort folders by their number prefixes
    folders.sort((a, b) => {
        const aNum = parseInt(a.split(".")[0]);
        const bNum = parseInt(b.split(".")[0]);
        return aNum - bNum;
    });

    for (const folder of folders) {
        const folderPath = path.join(docsDir, folder);

        // Extract folder name without number
        const folderName = folder.replace(/^\d+\./, "");

        const section: SidebarGroup = {
            text: capitalizeWords(folderName.replace(/-/g, " ")),
            collapsed: false,
            items: [],
        };

        const files = fs
            .readdirSync(folderPath)
            .filter((f) => f.endsWith(".md"));

        // Sort files by their number prefixes
        files.sort((a, b) => {
            const aNum = parseInt(a.split(".")[0]);
            const bNum = parseInt(b.split(".")[0]);
            return aNum - bNum;
        });

        for (const file of files) {
            const filePath = path.join(folderPath, file);

            // Extract file name without number and extension
            const fileName = file.replace(/^\d+\./, "").replace(/\.md$/, "");

            // Build the paths
            const numberedPath = `${folder}/${file}`;
            const cleanPath = `${folderName}/${fileName}.md`;

            // Add to rewrites
            rewrites[numberedPath] = cleanPath;

            // Add to sidebar
            section.items.push({
                text: capitalizeWords(fileName.replace(/-/g, " ")),
                link: `/${folderName}/${fileName}`,
            });
        }

        sidebar.push(section);
    }

    return { rewrites, sidebar };
}

function capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, (l) => l.toUpperCase());
}

const { rewrites, sidebar } = generateConfig();

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Asemic",
    description: "Advanced product analytics platform",
    srcDir: "docs",
    rewrites: rewrites,
    themeConfig: {
        search: {
            provider: "local",
        },
        nav: [
            { text: "Home", link: "/" },
            { text: "Docs", link: "/get-started/introduction" },
            { text: "App", link: "http://35.244.200.118/" },
        ],
        sidebar: sidebar,

        // socialLinks: [
        //     { icon: "github", link: "https://github.com/vuejs/vitepress" },
        // ],
    },
});

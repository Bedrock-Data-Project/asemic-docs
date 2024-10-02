import fs from "fs";
import path from "path";

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

export function generateConfig(): GenerateConfigResult {
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

import { HeadConfig, PageData } from "vitepress";

export function transformHead(pageData: PageData) {
    const head: HeadConfig[] = [];

    const title = pageData.frontmatter.title || pageData.title;
    const description = pageData.frontmatter.description || pageData.description;
    const pageUrl = getPageUrl(pageData.relativePath);
    const imageUrl = getImageUrl(pageData.frontmatter.image);

    // Add canonical URL
    if (pageUrl) {
        head.push(["link", { rel: "canonical", href: pageUrl }]);
    }

    // Open Graph tags
    head.push(["meta", { property: "og:type", content: "website" }]);

    if (title) {
        head.push(["meta", { property: "og:title", content: title }]);
        head.push(["meta", { property: "twitter:title", content: title }]);
    }

    if (description) {
        head.push([
            "meta",
            {
                property: "og:description",
                content: description,
            },
        ]);
        head.push([
            "meta",
            {
                property: "twitter:description",
                content: description,
            },
        ]);
    }

    if (pageUrl) {
        head.push(["meta", { property: "og:url", content: pageUrl }]);
        head.push(["meta", { property: "twitter:url", content: pageUrl }]);
    }

    head.push(["meta", { property: "og:image", content: imageUrl }]);
    head.push(["meta", { property: "twitter:image", content: imageUrl }]);
    head.push([
        "meta",
        { property: "twitter:card", content: "summary_large_image" },
    ]);

    // Add site name
    head.push(["meta", { property: "og:site_name", content: "Asemic Documentation" }]);

    return head;
}

function getPageUrl(path: string) {
    const relativePath = path.replace(".md", "");
    const baseUrl = "https://docs.asemicanalytics.com";

    if (relativePath === "index") {
        return baseUrl;
    } else {
        return `${baseUrl}/${relativePath}`;
    }
}

function getImageUrl(image: string): string {
    if (image) {
        return image;
    } else {
        return "https://docs.asemicanalytics.com/img/hero.png";
    }
}

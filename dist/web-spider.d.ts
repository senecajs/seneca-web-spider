type WebSpiderOptions = {
    debug?: boolean;
    canon: {
        meta: string;
        body: string;
    };
    url: string;
    crawlerOptions?: {
        fullCrawl?: boolean;
    };
};
declare function WebSpider(this: any, options: WebSpiderOptions): void;
export default WebSpider;

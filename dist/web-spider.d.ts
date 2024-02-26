type WebSpiderOptions = {
    debug: boolean;
    canon: any;
};
declare function WebSpider(this: any, options: WebSpiderOptions): {
    ok: boolean;
    name: string;
    data: {
        startCrawlMsg: (this: any, msg: any) => Promise<any>;
    };
};
export default WebSpider;

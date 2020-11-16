interface Window {
    we: any,
}
declare var mw: MediaWiki;
interface MediaWiki {
    Api: {
        new(): {
            abort(),
            postWithEditToken(params: any, additionalParams: any),
            getEditToken(),
            create(title: string, params: any, content: any),
            edit(title: string, transform: any),
            newSection(title: string, header: any, message: any, additionalParams: any),
            postWithToken(s: string, params: any, additionalParams: any),
            getToken(s: string),
            watch(pages: string),
            unwatch(pages: string)
        }
    },
    config: {
        get(selection: string, fallback?: any),
        set(selection: string, value: string),
        exists(selection: string),
        values: any
    },
    html: any,
    loader: any
}

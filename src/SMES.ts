'use strict';
// Author: Salt_lovely
// License: LGPL
// 使用了ES6的新特性，所以别想加进common.js了，mw的js压缩器不认识ES6的新特性 <- 同理也别想在IE上运行
// 确实可以编译成ES5，但是代码会很难看
(function () {
    let myNote = `
复制粘贴到浏览器的控制台（或油猴脚本）
    Ctrl+A 全选 Ctrl+C 复制 Ctrl+V 粘贴
    如果是油猴脚本，则需要设置只在使用了MediaWiki的网站启用

使用如下代码实例化：
    如果是油猴脚本同时没报错的话，那就已经实例化了一个 we 
    // let we = new SaltWikiEditHelper()

常用方法：
    we.wikiReplace(pages, before, after, timeInterval, debug)
        pages 一个长字符串，页面名集合，用特殊标记（; ）（一个半角分号+一个空格）隔开，默认为空
        before 被替换的内容，可以用正则表达式，默认为添加到行尾
        after 要替换的内容，默认为空
        timeInterval 每次替换的时间间隔，单位毫秒，推荐 200-300，超过15个 500，超过35个 750，超过50个 1000，超过100个 1500，默认为 500
        debug 是否进入debug模式，默认为是
    we.wikiAppend(pages, content, timeInterval, debug)
        pages 一个长字符串，页面名集合，用特殊标记（; ）（一个半角分号+一个空格）隔开，默认为空
        content 要添加到页尾的内容
        timeInterval 替换的时间间隔，单位毫秒，推荐 200-300，超过15个时建议 500，超过35个时建议 750，超过50个时建议 1000，超过100个时建议 1500，默认为 500
        debug 是否进入debug模式，默认为是
    we.wikiPrepend(pages, content, timeInterval, debug)
        pages 一个长字符串，页面名集合，用特殊标记（; ）（一个半角分号+一个空格）隔开，默认为空
        content 要添加到页首的内容
        timeInterval 替换的时间间隔，单位毫秒，推荐 200-300，超过15个时建议 500，超过35个时建议 750，超过50个时建议 1000，超过100个时建议 1500，默认为 500
        debug 是否进入debug模式，默认为是

    we.pageReplace(before, after)
        before 被替换的内容，可以用正则表达式，默认为添加到行尾
        after 要替换的内容，默认为空
    we.pageReplaceAll(content)
        content 将页面整个替换
    we.pageAppend(content)
        content 要添加到页尾的内容
    we.pagePrepend(content)
        content 要添加到页首的内容


    we.searchMain(搜索内容)
        搜索主名字空间
    we.searchUserpage(搜索内容)
        搜索用户名字空间
    we.searchProject(搜索内容)
        搜索项目名字空间
    we.searchFile(搜索内容)
        搜索文件名字空间
    we.searchMediaWiki(搜索内容)
        搜索MediaWiki名字空间
    we.searchTemplate(搜索内容)
        搜索模板名字空间
    we.searchHelp(搜索内容)
        搜索帮助名字空间
    we.searchCategory(搜索内容)
        搜索分类名字空间
    we.searchWidget(搜索内容)
        搜索Widget名字空间
    we.searchGadget(搜索内容)
        搜索Gadget名字空间

    we.me()
        输出自己的用户名、UID、用户组
    we.note()
        详细教程`
    let vers = '0.1.3', pref = '[SaltWikiEditHelper]'
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // 最基础的类
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    class SaltOroginalClass {
        prefix: string
        ver: string
        Note: string
        constructor(prefix?: string, ver?: string, note?: string) {
            this.prefix = prefix || ''
            this.ver = ver || ''
            this.Note = note || ''
        }
        // assert: 断言
        // condition: 判断状况; msg?: 报错语句
        assert(condition: any, msg?: string): void {
            if (!condition) throw new Error(this.prefix + ': ' + (msg || '发生错误'))
        }
        // log: 打印
        log(msg: any) {
            let t = typeof msg
            let p = this.prefix + ': '
            if (t == 'boolean' || t == 'number' || t == 'string') {
                console.log(p + msg)
            } else if (t == 'undefined') {
                console.log(p + 'undefined')
            } else if (msg instanceof Array) {
                console.log(p + '[' + msg.join(', ') + ']')
            } else {
                console.log(p)
                console.log(msg)
            }
        }
        // version 打印版本
        version() {
            this.log('\n Version: ' + this.ver + '\n Author: Salt_lovely\n License: CC BY-NC-SA 4.0')
        }
        useAge() {
            this.log(this.Note)
        }
        howToUse() { this.useAge() }
        note() { this.useAge() }
        help() { this.useAge() }
        // sleep 返回一个延迟一定ms的promise
        sleep(time: number) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // 添加基础的删改，打印参数功能
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    class SaltWikiEditOroginalClass extends SaltOroginalClass {
        mwApi: mwApi | undefined // 啊啊啊啊这个检查好烦啊（虽然帮忙找错很管用）
        titleList: string = ''
        constructor() {
            super(pref, vers, myNote)
            // 参数
            this.getMwApi()
        }
        pageEdit(before: string | RegExp = /$/, after = '', sum = '') {
            let page: string = mw.config.get("wgPageName")
            if (!this.pagenameCheck(page) || !this.mwApi) { return } // mwApi 属性是mw.Api的实例，异步取得
            this.mwApi.edit(
                page, function (revision: any) { return { text: revision.content.replace(before, after), summary: sum, minor: true }; }
            ).then(() => { console.log('编辑已保存: ' + page); });
        }
        wikiEdit(pages: string, before: string | RegExp, after: string, timeInterval: number, debug = true, sum?: string) {
            //格式化：
            //\s-[^\n]*\n?\s*
            //; 
            /*
            pages 页面名集合，用特殊标记（; ）（一个半角分号+一个空格）隔开
            before 被替换的内容，可以用正则表达式
            after 要替换的内容
            timeInterval 替换的时间间隔，推荐 200-300，超过15个时建议 500，超过35个时建议 750，超过50个时建议 1000，超过100个时建议1500
            debug 是否进入debug模式
            */
            let obj = this
            let pagelist = pages.split('; '); if (pagelist.length < 1) { return } // 不替换就不替换
            sum = sum || ''
            if (debug) { this.log(pagelist); this.log(sum) }
            for (let i = 0; i < pagelist.length; i++) {
                let page = pagelist[i]; if (!this.pagenameCheck(page)) { continue } // 页面名怎么会少于 2个 字符呢
                let summ = sum
                setTimeout(() => {
                    if (!this.mwApi) { return } // mwApi 属性是mw.Api的实例，异步取得
                    obj.log(page);
                    summ += ' 第 ' + (i + 1) + '/' + pagelist.length + ' 个'
                    this.mwApi.edit(
                        page, function (revision: any) { return { text: revision.content.replace(before, after), summary: summ, minor: true }; }
                    ).then(() => { obj.log('第 ' + (i + 1) + '/' + pagelist.length + ' 个编辑已保存: ' + page); });
                }, i * timeInterval)
            }
        }
        listEdit(before: string | RegExp, after: string, timeInterval: number, debug = true) {
            this.wikiEdit(this.titleList, before, after, timeInterval, debug, '列表替换：替换 “' + before + '” 为 “' + after + '”')
        }
        newSection(header: string, text: string) {
            let page: string = mw.config.get("wgPageName"), obj = this
            if (!this.pagenameCheck(page) || !this.mwApi) { return } // mwApi 属性是mw.Api的实例，异步取得
            this.mwApi.newSection(page, header, text, { summary: '添加“' + header + '”', minor: true })
                .then(() => { obj.log('新章节' + header + '已保存: ' + page); });
        }

        wikiSearch(str: string, namespace: string | number = '0', limit: string | number = 'max') {
            this.wikiSearchAndReplace(str, '', '', namespace, limit, 1, 0, 'text')
        }
        wikiSearchTitle(str: string, namespace: string | number = '0', limit: string | number = 'max') {
            this.wikiSearchAndReplace(str, '', '', namespace, limit, 1, 0, 'title')
        }

        wikiSearchAndReplace(str: string, before: string | RegExp, after: string, namespace: string | number | Array<number> | Array<string> = '0',
            limit: string | number = 'max', timeInterval: number = 500, handle?: number, srwhat = 'text') {
            let obj = this
            if (!this.mwApi) { return }
            if (namespace instanceof Array) {
                namespace = namespace.join('|')
            }
            this.log('搜索中...')
            this.mwApi.get({
                action: 'query',
                format: 'json',
                list: 'search',
                srsearch: str,
                srlimit: limit + '',
                srnamespace: namespace + '',
                srwhat: srwhat,
            }).done(function (data: any) {
                obj.log('正在处理返回信息...')
                if (typeof data.query != 'undefined' && typeof data.query.search != 'undefined') {
                    let res: querySearchArray[] = data.query.search, titleList: string[] = []
                    for (let x of res) {
                        titleList.push(x.title)
                    }
                    obj.log(titleList)
                    obj.titleList = titleList.join('; ')
                    if (typeof handle == 'undefined' || handle != 0) {
                        obj.log('成功获取信息，开始执行替换工作')
                        obj.wikiEdit(obj.titleList, before, after, timeInterval, true, '搜索替换：搜索“' + before + '” 替换为 “' + after + '”')
                    }
                } else {
                    obj.log('没有成功获取到信息')
                }
            });
        }

        pagenameCheck(pagename: string): boolean {
            if (!pagename) {
                return false
            } else if (pagename.length < 2) {
                this.log('页面名太短: ' + pagename)
                return false
            } else if (pagename.indexOf('特殊:') == 0 || pagename.indexOf('Special:') == 0 || pagename.indexOf('special:') == 0) {
                this.log('特殊页面不能编辑: ' + pagename)
                return false
            } else if (pagename.indexOf('媒体:') == 0 || pagename.indexOf('Media:') == 0 || pagename.indexOf('media:') == 0) {
                this.log('媒体页面不能编辑: ' + pagename)
                return false
            }
            return true
        }

        me() {
            console.log(mw.config.get('wgUserName') + '; ' + (mw.config.get('wgUserId') || '未知UID') + '; ' + (mw.config.get('wgUserGroups') || ['未知用户组']).join(', '))
        }

        // async getMwConfig(s: string) {
        //     await this.waitMw()// 等待mw加载完毕
        //     return mw.config.get(s)
        // }

        async getMwApi() {
            await this.waitMwApi()// 等待mw和mw.Api加载完毕
            this.mwApi = new mw.Api()
            this.log('已获取mw.Api实例，可以开始工作...')
        }

        // 等待mw加载完毕，使用await关键字
        async waitMw() {
            let safe = 0
            while (typeof mw == 'undefined') {
                await this.sleep(500);
                this.assert(safe++ < 30, '未检测到 mw ！')
            }
        }
        // 等待mw和mw.Api加载完毕，使用await关键字
        async waitMwApi() {
            await this.waitMw()
            let safe = 0
            while (typeof mw.Api == 'undefined') {
                await this.sleep(500);
                this.assert(safe++ < 30, '未检测到 mw ！')
            }
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // 封装删改功能，给mw.Api的原型添加方法
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    class SaltWikiEditHelper extends SaltWikiEditOroginalClass {
        constructor() {
            super()
            // 检查mw.Api原型的方法
            this.addPlugin();
            // 完成构造
            this.log('构造完成...')
        }

        pageReplace(before: any = /$/, after = '', sum?: string) {
            this.pageEdit(before, after, sum || '替换 “' + before + '” 为 “' + after + '”')
        }
        pageReplaceAll(content = '', sum?: string) {
            this.pageEdit(/[\S\s]*/g, content, sum || '整页替换为“' + content + '”')
        }
        pageAppend(content = '', sum?: string) {
            this.pageEdit(/$/, content, sum || '添加“' + content + '”到页尾')
        }
        pagePrepend(content = '', sum?: string) {
            this.pageEdit(/^/, content, sum || '添加“' + content + '”到页首')
        }

        wikiReplace(pages = '', before: any = /$/, after = '', timeInterval = 500, debug = true) {
            this.wikiEdit(pages, before, after, timeInterval, debug, '批量替换：替换 “' + before + '” 为 “' + after + '”')
        }
        wikiAppend(pages = '', content = '', timeInterval = 500, debug = true) {
            this.wikiEdit(pages, /$/, content, timeInterval, debug, '批量添加：添加“' + content + '”到页尾')
        }
        wikiPrepend(pages = '', content = '', timeInterval = 500, debug = true) {
            this.wikiEdit(pages, /^/, content, timeInterval, debug, '批量添加：添加“' + content + '”到页首')
        }

        searchMain(str: string, limit: string = 'max') { this.wikiSearch(str, '0', limit) }
        searchUserpage(str: string, limit: string = 'max') { this.wikiSearch(str, '2', limit) }
        searchProject(str: string, limit: string = 'max') { this.wikiSearch(str, '4', limit) }
        searchFile(str: string, limit: string = 'max') { this.wikiSearch(str, '6', limit) }
        searchMediaWiki(str: string, limit: string = 'max') { this.wikiSearch(str, '8', limit) }
        searchTemplate(str: string, limit: string = 'max') { this.wikiSearch(str, '10', limit) }
        searchHelp(str: string, limit: string = 'max') { this.wikiSearch(str, '12', limit) }
        searchCategory(str: string, limit: string = 'max') { this.wikiSearch(str, '14', limit) }
        searchWidget(str: string, limit: string = 'max') { this.wikiSearch(str, '274', limit) }
        searchGadget(str: string, limit: string = 'max') { this.wikiSearch(str, '2300', limit) }

        searchMainTitle(str: string, limit: string = 'max') { this.wikiSearchTitle(str, '0', limit) }
        searchUserpageTitle(str: string, limit: string = 'max') { this.wikiSearchTitle(str, '2', limit) }
        searchProjectTitle(str: string, limit: string = 'max') { this.wikiSearchTitle(str, '4', limit) }
        searchFileTitle(str: string, limit: string = 'max') { this.wikiSearchTitle(str, '6', limit) }
        searchMediaWikiTitle(str: string, limit: string = 'max') { this.wikiSearchTitle(str, '8', limit) }
        searchTemplateTitle(str: string, limit: string = 'max') { this.wikiSearchTitle(str, '10', limit) }
        searchHelpTitle(str: string, limit: string = 'max') { this.wikiSearchTitle(str, '12', limit) }
        searchCategoryTitle(str: string, limit: string = 'max') { this.wikiSearchTitle(str, '14', limit) }
        searchWidgetTitle(str: string, limit: string = 'max') { this.wikiSearchTitle(str, '274', limit) }
        searchGadgetTitle(str: string, limit: string = 'max') { this.wikiSearchTitle(str, '2300', limit) }
        // addPlugin: 给mw.Api的原型添加方法
        async addPlugin() {
            await this.waitMwApi()// 等待mw和mw.Api加载完毕
            if (typeof (new mw.Api().postWithEditToken) == 'undefined') {
                this.log('mw.Api原型没有postWithEditToken方法，自动加载...');
                mw.Api.prototype.postWithEditToken = function (p: any, a: any): any { return this.postWithToken('csrf', p, a) }
            }
            if (typeof (new mw.Api().getEditToken) == 'undefined') {
                this.log('mw.Api原型没有getEditToken方法，自动加载...');
                mw.Api.prototype.getEditToken = function (): any { return this.getToken('csrf') }
            }
            if (typeof (new mw.Api().create) == 'undefined') {
                this.log('mw.Api原型没有create方法，自动加载...');
                mw.Api.prototype.create = function (title: string, params: any, content: any): any { return this.postWithEditToken($.extend(this.assertCurrentUser({ action: 'edit', title: String(title), text: content, formatversion: '2', createonly: true }), params)).then(function (data: any) { return data.edit }) }
            }
            if (typeof (new mw.Api().edit) == 'undefined') {
                this.log('mw.Api原型没有edit方法，自动加载...');
                mw.Api.prototype.edit = function (title: string, transform: any): any { var basetimestamp: any, curtimestamp: any, api = this; title = String(title); return api.get({ action: 'query', prop: 'revisions', rvprop: ['content', 'timestamp'], titles: [title], formatversion: '2', curtimestamp: true }).then(function (data: any) { var page, revision; if (!data.query || !data.query.pages) { return $.Deferred().reject('unknown') } page = data.query.pages[0]; if (!page || page.invalid) { return $.Deferred().reject('invalidtitle') } if (page.missing) { return $.Deferred().reject('nocreate-missing') } revision = page.revisions[0]; basetimestamp = revision.timestamp; curtimestamp = data.curtimestamp; return transform({ timestamp: revision.timestamp, content: revision.content }) }).then(function (params: any) { var editParams = typeof params === 'object' ? params : { text: String(params) }; return api.postWithEditToken($.extend({ action: 'edit', title: title, formatversion: '2', assert: mw.config.get('wgUserName') ? 'user' : undefined, basetimestamp: basetimestamp, starttimestamp: curtimestamp, nocreate: true }, editParams)) }).then(function (data: any) { return data.edit }) }
            }
            if (typeof (new mw.Api().newSection) == 'undefined') {
                this.log('mw.Api原型没有newSection方法，自动加载...');
                mw.Api.prototype.newSection = function (title: string, header: any, message: any, additionalParams: any): any { return this.postWithEditToken($.extend({ action: 'edit', section: 'new', title: String(title), summary: header, text: message }, additionalParams)) }
            }
        }
    }
    // ==UserScript==
    // @name         Wiki编辑工具
    // @namespace    http://salt.is.lovely/
    // @version      0.1.3
    // @description  Wiki编辑工具
    // @author       Salt
    // @match        https://mcbbs-wiki.cn/index.php?*
    // @match        https://mcbbs-wiki.cn/wiki/*
    // @match        https://wiki.biligame.com/mcplayer/*
    // @grant        none
    // ==/UserScript==
    setTimeout(() => {
        let we = new SaltWikiEditHelper()
        try {
            window.we = we
            console.log('可用实例: we')
        }
        catch (e: any) {
            console.warn(e)
            console.log('实例 we 不可用')
        }
        finally {
            window.saltWikiEditor = we
            window.saltWikiEditorClass = SaltWikiEditHelper
            console.log('可用实例: saltWikiEditor\n可用class: saltWikiEditorClass')
        }
    }, 500)
})();

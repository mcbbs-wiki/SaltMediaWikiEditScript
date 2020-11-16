// Author: Salt_lovely
// License: LGPL
// 使用了ES6的新特性，所以别想加进common.js了，mw的js压缩器不认识ES6的新特性 <- 同理也别想在IE上运行
// 确实可以编译成ES5，但是代码会很难看
(function () {
    var myNote = `
复制粘贴到浏览器的控制台（或油猴脚本）
    Ctrl+A 全选 Ctrl+C 复制 Ctrl+V 粘贴
    如果是油猴脚本，则需要设置只在使用了MediaWiki的网站启用
使用如下代码实例化：
    如果是油猴脚本同时没报错的话，那就已经实例化了一个 we // let we = new SaltWikiEditHelper()
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
    we.me()
        输出自己的用户名、UID、用户组
    we.note()
        详细教程`
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
    }
    class SaltWikiEditHelper extends SaltOroginalClass {
        private op: string
        constructor() {
            super('[SaltWikiEditHelper]', '0.1.0', myNote)
            // 参数
            this.op = mw.config.get('wgUserName') || '未知用户'
            // 检查mw.Api原型的方法
            this.addPlugin();
            // 完成构造
            this.log('构造完成...')
        }

        pageReplace(before: any = /$/, after = '', sum?: string) {
            this.pageEdit(before, after, sum || '替换 “' + before + '” 为 “' + after + '”')
        }
        pageReplaceAll(content = '', sum?: string) {
            this.pageEdit(/.*/, content, sum || '整页替换为“' + content + '”')
        }
        pageAppend(content = '', sum?: string) {
            this.pageEdit(/$/, content, sum || '添加“' + content + '”到页尾')
        }
        pagePrepend(content = '', sum?: string) {
            this.pageEdit(/^/, content, sum || '添加“' + content + '”到页首')
        }
        pageEdit(before: any = /$/, after = '', sum = '') {
            let page: string = mw.config.get("wgPageName")
            if (!this.pagenameCheck(page)) { return }
            new mw.Api().edit(
                page, function (revision: any) { return { text: revision.content.replace(before, after), summary: sum, minor: true }; }
            ).then(() => { console.log('编辑已保存: ' + page); });
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
        /*
        pages 页面名集合，用特殊标记（; ）（一个半角分号+一个空格）隔开
        before 被替换的内容，可以用正则表达式
        after 要替换的内容
        timeInterval 替换的时间间隔，推荐 200-300，超过15个时建议 500，超过35个时建议 750，超过50个时建议 1000，超过100个时建议1500
        debug 是否进入debug模式
        */
        wikiEdit(pages: string, before: any, after: string, timeInterval: number, debug = true, sum?: string) {
            //格式化：
            //\s-[^\n]*\n?\s*
            //; 
            var pagelist = pages.split('; '); if (pagelist.length < 1) { return } // 不替换就不替换
            sum = sum || ''
            if (debug) { this.log(pagelist); this.log(sum) }
            for (let i = 0; i < pagelist.length; i++) {
                let page = pagelist[i]; if (!this.pagenameCheck(page)) { continue } // 页面名怎么会少于 2个 字符呢
                let summ = sum
                setTimeout(() => {
                    console.log(page); summ += ' 第 ' + (i + 1) + '/' + pagelist.length + ' 个'
                    new mw.Api().edit(
                        page, function (revision: any) { return { text: revision.content.replace(before, after), summary: summ, minor: true }; }
                    ).then(() => { console.log('第 ' + (i + 1) + '/' + pagelist.length + ' 个编辑已保存: ' + page); });
                }, i * timeInterval)
            }
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
            this.log(this.op + '; ' + (mw.config.get('wgUserId') || '未知UID') + '; ' + (mw.config.get('wgUserGroups') || ['未知用户组']).join(', '))
        }

        // addPlugin: 给mw.Api的原型添加方法
        addPlugin() {
            if (typeof (new mw.Api().postWithEditToken) == 'undefined') {
                this.log('mw.Api原型没有postWithEditToken方法，自动加载...');
                $.extend(mw.Api.prototype, {
                    postWithEditToken: function (p: any, a: any): any { return this.postWithToken('csrf', p, a) },
                })
            }
            if (typeof (new mw.Api().getEditToken) == 'undefined') {
                this.log('mw.Api原型没有getEditToken方法，自动加载...');
                $.extend(mw.Api.prototype, {
                    getEditToken: function (): any { return this.getToken('csrf') },
                })
            }
            if (typeof (new mw.Api().create) == 'undefined') {
                this.log('mw.Api原型没有create方法，自动加载...');
                $.extend(mw.Api.prototype, {
                    create: function (title: any, params: any, content: any): any { return this.postWithEditToken($.extend(this.assertCurrentUser({ action: 'edit', title: String(title), text: content, formatversion: '2', createonly: true }), params)).then(function (data: any) { return data.edit }) },
                })
            }
            if (typeof (new mw.Api().edit) == 'undefined') {
                this.log('mw.Api原型没有edit方法，自动加载...');
                $.extend(mw.Api.prototype, {
                    edit: function (title: any, transform: any): any { var basetimestamp: any, curtimestamp: any, api = this; title = String(title); return api.get({ action: 'query', prop: 'revisions', rvprop: ['content', 'timestamp'], titles: [title], formatversion: '2', curtimestamp: true }).then(function (data: any) { var page, revision; if (!data.query || !data.query.pages) { return $.Deferred().reject('unknown') } page = data.query.pages[0]; if (!page || page.invalid) { return $.Deferred().reject('invalidtitle') } if (page.missing) { return $.Deferred().reject('nocreate-missing') } revision = page.revisions[0]; basetimestamp = revision.timestamp; curtimestamp = data.curtimestamp; return transform({ timestamp: revision.timestamp, content: revision.content }) }).then(function (params: any) { var editParams = typeof params === 'object' ? params : { text: String(params) }; return api.postWithEditToken($.extend({ action: 'edit', title: title, formatversion: '2', assert: mw.config.get('wgUserName') ? 'user' : undefined, basetimestamp: basetimestamp, starttimestamp: curtimestamp, nocreate: true }, editParams)) }).then(function (data: any) { return data.edit }) },
                })
            }
            if (typeof (new mw.Api().newSection) == 'undefined') {
                this.log('mw.Api原型没有newSection方法，自动加载...');
                $.extend(mw.Api.prototype, {
                    newSection: function (title: any, header: any, message: any, additionalParams: any): any { return this.postWithEditToken($.extend({ action: 'edit', section: 'new', title: String(title), summary: header, text: message }, additionalParams)) }
                })
            }
        }
    }
    window.addEventListener('load', () => {
        setTimeout(() => {
            let we = new SaltWikiEditHelper(); console.log('可用实例: we')
            if (typeof window.we == 'undefined') {
                window.we = we
            }
        }, 1500)
    })
})();
// ==UserScript==
// @name         Wiki编辑工具
// @namespace    http://salt.is.lovely/
// @version      0.1.1
// @description  Wiki编辑工具
// @author       Salt
// @match        https://mcbbs-wiki.cn/index.php?*
// @match        https://mcbbs-wiki.cn/wiki/*
// @grant        none
// ==/UserScript==

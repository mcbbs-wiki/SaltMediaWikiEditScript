# Salt-MediaWiki-Edit-Script
## 安装
编译之后（保留注释地编译）放入油猴扩展。
## 行为
1. 有一个自执行函数，里面有3个类，C继承于B，B继承于A，实例化的是C。
1. 会在网页的“window”对象下面创建一个实例“we”。
1. 会给 mw.Api 的原型添加 postWithEditToken、getEditToken、create、edit和newSection 共计5个方法。
## 方法
* 只要启用的页面是MediaWiki的页面，就能使用如下方法。
-----
* we.pageReplace(要替换的内容(可以是正则表达式), 替换后的内容)
* we.pageReplaceAll(将页面整个替换)
* we.pageAppend(要添加到页尾的内容)
* we.pagePrepend(要添加到页首的内容)

`page`打头的方法作用于当前页面（特殊页面无效）。

-----
* we.wikiReplace(页面, 要替换的内容(可以是正则表达式), 替换后的内容, 时间间隔(可选))
* we.wikiAppend(页面, 要添加到页尾的内容, 时间间隔(可选))
* we.wikiPrepend(页面, 要添加到页首的内容, 时间间隔(可选))

`页面`参数是一个字符串，页面名之间用“; ”(一个分号一个空格)隔开。

-----
* we.me()//打印用户名、用户ID、用户组
* we.note(); we.help()//显示帮助信息
-----
除了上面提到的方法外尽量不要去碰那些尚未封装的方法。

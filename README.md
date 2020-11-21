# Salt-MediaWiki-Edit-Script
## 安装
编译之后（保留注释地编译）放入油猴扩展。
## 行为
1. 有一个自执行函数，里面有3个类，C继承于B，B继承于A，实例化的是C。
1. 会在网页的“window”对象下面创建一个实例“we”（和一个别名“saltWikiEditor”）。
1. 会在网页的“window”对象下面创建一个类“saltWikiEditorClass”，你可以用这个类自行实例化或做更多事情。
1. 会给 mw.Api 的原型添加 postWithEditToken、getEditToken、create、edit和newSection 共计5个方法。
## 方法
* 只要启用的页面是MediaWiki的页面，就能使用如下方法。

### 操作当前页面
* we.pageReplace(要替换的内容(可以是正则表达式), 替换后的内容) // 替换内容
* we.pageReplaceAll(将页面整个替换) // 整个替换页面
* we.pageAppend(要添加到页尾的内容) // 添加到页尾
* we.pagePrepend(要添加到页首的内容) // 添加到页首

`page`打头的方法作用于当前页面（特殊页面无效）。

### 批量操作
* we.wikiReplace(页面, 要替换的内容(可以是正则表达式), 替换后的内容, 时间间隔(可选)) // 批量替换
* we.wikiAppend(页面, 要添加到页尾的内容, 时间间隔(可选)) // 批量添加到页尾
* we.wikiPrepend(页面, 要添加到页首的内容, 时间间隔(可选)) // 批量添加到页首

`页面`参数是一个字符串，页面名之间用“; ”(一个分号一个空格)隔开。

### 搜索功能
* searchMain(搜索内容) // 搜索主名字空间
* searchUserpage(搜索内容) // 搜索用户名字空间
* searchProject(搜索内容) // 搜索项目名字空间
* searchFile(搜索内容) // 搜索文件名字空间
* searchMediaWiki(搜索内容) // 搜索MediaWiki名字空间
* searchTemplate(搜索内容) // 搜索模板名字空间
* searchHelp(搜索内容) // 搜索帮助名字空间
* searchCategory(搜索内容) // 搜索分类名字空间
* searchWidget(搜索内容) // 搜索Widget名字空间
* searchGadget(搜索内容) // 搜索Gadget名字空间

这些搜索方法都有搜索页面标题的变种，如`searchMainTitle`、`searchTemplateTitle`。

### 信息交互
* we.me() // 打印用户名、用户ID、用户组
* we.note(); we.help() // 显示帮助信息

## 其他
除了上面提到的方法外尽量不要去碰那些尚未封装的方法。

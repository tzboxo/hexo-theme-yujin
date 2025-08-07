# 隅烬主题 (Yujin Theme)

隅烬主题是一个简洁美观的Hexo主题，专为个人博客和内容展示而设计。

## 预览

![Preview](https://github.com/tzboxo/xiaoo-img/blob/master/img/blog-img2.jpg?raw=true)

## 安装

1. 进入Hexo根目录
2. 克隆或下载主题到themes/yujin目录
3. 在Hexo配置文件`_config.yml`中设置主题：

```yaml
theme: yujin
```

4. 运行以下命令重新生成站点：

```bash
hexo clean && hexo generate
```

## 配置

主题配置文件位于`themes/yujin/_config.yml`，您可以根据需要进行自定义。

### 站点信息配置

```yaml
site:
  title: 隅烬主题
  subtitle: 在荒寂处黯燃
  description: 简洁美观的Hexo主题
  keywords: Hexo,主题,隅烬
  author: TZ-XIAOO
  language: zh-CN
  timezone: Asia/Shanghai
```

### 导航栏配置

```yaml
navbar:
  logo:
    enabled: true
    width: 40
    height: 40
    
  title:
    main: 隅烬
    sub: 在荒寂处黯燃
    
  menu:
    - name: OvO
      url: /
    - name: 木林森
      url: /mulinsen/
    - name: 逼逼叨
      url: /bbd/
    - name: 那远方
      url: /nayuanfang/
    - name: 碎碎念
      url: /about/
      
  search:
    enabled: true
```

## 文章可配置信息

在Hexo中，您可以在文章的Front-matter中配置各种属性来控制文章的显示效果。以下是一些常用的配置项：

### 密码保护

您可以为文章设置密码保护，只有输入正确密码才能查看文章内容。

```yaml
---
title: 这是一篇加密文章
password: your_password
---
```

### 文章置顶

通过设置`sticky`属性，您可以将文章置顶显示在首页。

```yaml
---
title: 置顶文章示例
sticky: true
---
```

您也可以设置置顶权重，数值越大置顶位置越靠前：

```yaml
---
title: 置顶文章示例
sticky: 100
---
```

### 文章封面图片

您可以为文章设置封面图片，显示在首页的文章列表中。

```yaml
---
title: 文章标题
cover: /path/to/cover/image.jpg
---
```

### 文章摘要

您可以自定义文章摘要，摘要将显示在首页的文章卡片中。

```yaml
---
title: 文章标题
excerpt: 这是文章的自定义摘要...
---
```

如果没有设置`excerpt`，系统会默认截取文章开头的一部分作为摘要。

### 文章标签和分类

您可以为文章设置标签和分类，方便用户浏览相关内容。

```yaml
---
title: 文章标题
tags:
  - 标签1
  - 标签2
categories:
  - 分类1
  - 分类2
---
```

### 发布时间和更新时间

您可以自定义文章的发布时间和更新时间。

```yaml
---
title: 文章标题
date: 2023-01-01 12:00:00
updated: 2023-01-02 12:00:00
---
```

### 其他配置项

- `comments`: 是否开启文章评论功能
- `toc`: 是否显示文章目录
- `mathjax`: 是否启用数学公式渲染

```yaml
---
title: 文章标题
comments: false
toc: true
mathjax: true
---
```

## 特性

- 响应式设计，适配各种设备
- 瀑布流图片展示
- 时间轴内容展示
- 自定义导航菜单
- SEO友好

## 页面模板

- `layout.ejs` - 主布局模板
- `index.ejs` - 首页模板
- `post.ejs` - 文章页模板
- `category.ejs` - 分类页模板
- `tag.ejs` - 标签页模板
- `bbd.ejs` - 逼逼叨页面模板
- `mulinsen.ejs` - 木林森页面模板
- `nayuanfang.ejs` - 那远方主页面模板
- `nayuanfang_detail.ejs` - 那远方详情页模板

## 自定义内容

主题支持以下自定义内容页面：

1. **逼逼叨** - 时间轴形式的碎碎念
2. **那远方** - 图片相册展示
3. **木林森** - 个人笔记页面

## 浏览器兼容性

- IE10+
- Firefox
- Chrome
- Safari
- Edge

## 许可证

MIT
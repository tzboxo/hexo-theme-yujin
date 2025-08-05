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
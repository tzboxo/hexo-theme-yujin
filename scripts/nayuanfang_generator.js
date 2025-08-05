const fs = require('fs');
const path = require('path');

// 生成那远方详情页
hexo.extend.generator.register('nayuanfang_detail', function(locals) {
  const config = this.config;
  const nayuanfangContent = this.extend.helper.get('get_nayuanfang_data').bind({theme: {context: this}})();
  
  const routes = [];
  
  // 为主页面添加路由
  routes.push({
    path: 'nayuanfang/',
    layout: ['nayuanfang'],
    data: {
      title: '那远方'
    }
  });
  
  // 为每个相册详情页添加路由
  if (nayuanfangContent.albums && nayuanfangContent.albums.length > 0) {
    nayuanfangContent.albums.forEach(function(album) {
      routes.push({
        path: 'nayuanfang/' + album.id + '/',
        layout: ['nayuanfang_detail'],
        data: {
          title: album.title,
          album_id: album.id
        }
      });
    });
  }
  
  return routes;
});
const fs = require('fs');
const path = require('path');

/**
 * 获取那远方数据文件路径
 * @param {Object} hexo - Hexo实例
 * @returns {string} 数据文件路径
 */
function getContentPath(hexo) {
  return path.join(hexo.source_dir, 'nayuanfang/content.json');
}

/**
 * 保存那远方数据
 * @param {Object} hexo - Hexo实例
 * @param {Object} nayuanfangData - 那远方数据
 */
function saveNayuanfangData(hexo, nayuanfangData) {
  const contentPath = getContentPath(hexo);
  // 保存数据
  fs.writeFileSync(contentPath, JSON.stringify(nayuanfangData, null, 2));
}

/**
 * 重新排列相册ID，确保连续性，按时间倒序排列（新→旧）
 * @param {Array} albums - 相册数组
 */
function reassignAlbumIds(albums) {
  if (albums && albums.length > 0) {
    // 按照日期倒序排列相册（新的在前）
    albums.sort((a, b) => {
      // 按日期倒序排序
      if (a.date !== b.date) {
        return b.date.localeCompare(a.date);
      }
      // 日期相同时按标题排序
      return a.title.localeCompare(b.title);
    });
    
    // 重新分配ID
    albums.forEach((album, index) => {
      album.id = index + 1;
    });
  }
}

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
    // 在生成路由前重新排列ID
    reassignAlbumIds(nayuanfangContent.albums);
    
    // 同时更新content.json文件中的ID
    saveNayuanfangData(this, nayuanfangContent);
    
    nayuanfangContent.albums.forEach(function(album, index) {
      routes.push({
        path: 'nayuanfang/' + album.id + '/',
        layout: ['nayuanfang_detail'],
        data: {
          title: album.title,
          album_id: album.id,
          album_index: index
        }
      });
    });
  }
  
  return routes;
});
// 为那远方页面提供数据处理功能
const fs = require('fs');
const path = require('path');

hexo.extend.helper.register('get_nayuanfang_data', function() {
  try {
    const contentPath = path.join(hexo.source_dir, 'nayuanfang/content.json');
    if (fs.existsSync(contentPath)) {
      const content = fs.readFileSync(contentPath, 'utf8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading nayuanfang content:', e);
  }
  
  return { albums: [] };
});
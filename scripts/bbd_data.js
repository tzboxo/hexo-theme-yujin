// 为逼逼叨页面提供数据处理功能
const fs = require('fs');
const path = require('path');

hexo.extend.helper.register('get_bbd_data', function() {
  try {
    const contentPath = path.join(hexo.source_dir, 'bbd/content.json');
    if (fs.existsSync(contentPath)) {
      const content = fs.readFileSync(contentPath, 'utf8');
      const data = JSON.parse(content);
      
      // 处理创建时间，确保显示时间和创建时间一致
      if (data.posts) {
        data.posts.forEach(post => {
          // 如果没有created_at字段，则使用date和time字段生成
          if (!post.created_at) {
            post.created_at = post.date + ' ' + post.time;
          }
          // 确保显示时间与创建时间一致（以创建时间为准）
          const [datePart, timePart] = post.created_at.split(' ');
          post.date = datePart;
          post.time = timePart;
        });
      }
      
      return data;
    }
  } catch (e) {
    console.error('Error reading bbd content:', e);
  }
  
  return { posts: [] };
});
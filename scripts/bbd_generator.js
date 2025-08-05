// 逼逼叨内容管理脚本
const fs = require('fs');
const path = require('path');

// 添加新内容的辅助函数
hexo.extend.helper.register('add_bbd_post', function(content, photos = []) {
  try {
    const contentPath = path.join(hexo.source_dir, 'bbd/content.json');
    
    // 获取当前日期和时间
    const now = new Date();
    const date = now.getFullYear() + '-' + 
                String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                String(now.getDate()).padStart(2, '0');
    const time = String(now.getHours()).padStart(2, '0') + ':' + 
                String(now.getMinutes()).padStart(2, '0');
    const datetime = date + ' ' + time;
    
    let bbdData = { posts: [] };
    
    // 读取现有数据
    if (fs.existsSync(contentPath)) {
      const contentStr = fs.readFileSync(contentPath, 'utf8');
      bbdData = JSON.parse(contentStr);
    }
    
    // 生成新的ID
    const newId = bbdData.posts.length > 0 
      ? Math.max(...bbdData.posts.map(p => p.id)) + 1 
      : 1;
    
    // 创建新内容，时间和创建时间保持一致
    const newPost = {
      id: newId,
      date: date,
      time: time,
      created_at: datetime,
      content: content,
      photos: photos
    };
    
    // 添加到数据中
    bbdData.posts.unshift(newPost); // 添加到开头
    
    // 保存数据
    fs.writeFileSync(contentPath, JSON.stringify(bbdData, null, 2));
    
    return newPost;
  } catch (e) {
    console.error('Error adding bbd post:', e);
    return null;
  }
});

// 删除内容的辅助函数
hexo.extend.helper.register('remove_bbd_post', function(postId) {
  try {
    const contentPath = path.join(hexo.source_dir, 'bbd/content.json');
    
    if (fs.existsSync(contentPath)) {
      const contentStr = fs.readFileSync(contentPath, 'utf8');
      const bbdData = JSON.parse(contentStr);
      
      // 过滤掉要删除的内容
      bbdData.posts = bbdData.posts.filter(p => p.id !== postId);
      
      // 保存数据
      fs.writeFileSync(contentPath, JSON.stringify(bbdData, null, 2));
      return true;
    }
  } catch (e) {
    console.error('Error removing bbd post:', e);
  }
  
  return false;
});
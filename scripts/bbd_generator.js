// 逼逼叨内容管理脚本
const fs = require('fs');
const path = require('path');

/**
 * 获取逼逼叨数据文件路径
 * @param {Object} hexo - Hexo实例
 * @returns {string} 数据文件路径
 */
function getContentPath(hexo) {
  return path.join(hexo.source_dir, 'bbd/content.json');
}

/**
 * 确保逼逼叨目录存在
 * @param {Object} hexo - Hexo实例
 */
function ensureBbdDirectory(hexo) {
  const contentPath = getContentPath(hexo);
  const bbdDir = path.dirname(contentPath);
  if (!fs.existsSync(bbdDir)) {
    fs.mkdirSync(bbdDir, { recursive: true });
  }
}

/**
 * 读取逼逼叨数据
 * @param {Object} hexo - Hexo实例
 * @returns {Object} 逼逼叨数据
 */
function readBbdData(hexo) {
  const contentPath = getContentPath(hexo);
  
  // 确保目录存在
  ensureBbdDirectory(hexo);
  
  let bbdData = { posts: [] };
  
  // 读取现有数据
  if (fs.existsSync(contentPath)) {
    try {
      const contentStr = fs.readFileSync(contentPath, 'utf8');
      bbdData = JSON.parse(contentStr);
    } catch (parseError) {
      hexo.log.warn('Failed to parse existing content.json, using empty data');
      bbdData = { posts: [] };
    }
  }
  
  return bbdData;
}

/**
 * 保存逼逼叨数据
 * @param {Object} hexo - Hexo实例
 * @param {Object} bbdData - 逼逼叨数据
 */
function saveBbdData(hexo, bbdData) {
  const contentPath = getContentPath(hexo);
  
  // 确保目录存在
  ensureBbdDirectory(hexo);
  
  // 保存数据
  fs.writeFileSync(contentPath, JSON.stringify(bbdData, null, 2));
}

/**
 * 生成新的逼逼叨ID
 * @param {Array} posts - 现有文章列表
 * @returns {number} 新ID
 */
function generateNewId(posts) {
  let newId = 1;
  if (posts && posts.length > 0) {
    // 确保所有post都有id字段并找到最大ID
    const ids = posts
      .filter(post => post.id !== undefined && post.id !== null)
      .map(post => parseInt(post.id, 10))
      .filter(id => !isNaN(id));
    
    if (ids.length > 0) {
      newId = Math.max(...ids) + 1;
    } else {
      newId = posts.length + 1;
    }
  }
  return newId;
}

/**
 * 创建新的逼逼叨内容对象
 * @param {string} content - 内容文本
 * @param {Array} photos - 图片数组
 * @param {number} id - ID（可选）
 * @returns {Object} 新的逼逼叨内容对象
 */
function createBbdPost(content, photos = [], id = null) {
  // 获取当前日期和时间
  const now = new Date();
  const date = now.getFullYear() + '-' + 
              String(now.getMonth() + 1).padStart(2, '0') + '-' + 
              String(now.getDate()).padStart(2, '0');
  const time = String(now.getHours()).padStart(2, '0') + ':' + 
              String(now.getMinutes()).padStart(2, '0');
  const datetime = date + ' ' + time;
  
  return {
    id: id || null,
    date: date,
    time: time,
    created_at: datetime,
    content: content,
    photos: photos
  };
}

/**
 * 处理逼逼叨数据，确保格式正确
 * @param {Object} data - 原始数据
 * @returns {Object} 处理后的数据
 */
function processBbdData(data) {
  if (!data || !data.posts) {
    return { posts: [] };
  }
  
  // 先过滤掉无效数据
  data.posts = data.posts.filter(post => post && (typeof post === 'object'));
  
  data.posts.forEach(post => {
    // 确保必要字段存在
    if (post.created_at === undefined || post.created_at === null) {
      // 如果没有created_at字段，则使用date和time字段生成
      if (post.date && post.time) {
        post.created_at = post.date + ' ' + post.time;
      } else {
        // 如果连date和time都没有，使用当前时间
        const now = new Date();
        const date = now.getFullYear() + '-' + 
                    String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(now.getDate()).padStart(2, '0');
        const time = String(now.getHours()).padStart(2, '0') + ':' + 
                    String(now.getMinutes()).padStart(2, '0');
        post.created_at = date + ' ' + time;
      }
    }
    
    // 如果没有date或time字段，则从created_at中提取
    if (!post.date || !post.time) {
      if (post.created_at) {
        const [datePart, timePart] = post.created_at.split(' ');
        post.date = post.date || datePart || '';
        post.time = post.time || timePart || '';
      } else {
        // 设置默认值
        post.date = post.date || '';
        post.time = post.time || '';
      }
    }
    
    // 确保显示时间与创建时间一致（以创建时间为准）
    if (post.created_at) {
      const [datePart, timePart] = post.created_at.split(' ');
      post.date = datePart || post.date;
      post.time = timePart || post.time;
    }
    
    // 确保ID存在且为数字
    if (post.id === undefined || post.id === null) {
      post.id = Date.now() + Math.floor(Math.random() * 1000); // 生成一个唯一ID
    }
  });
  
  return data;
}

// 添加新内容的辅助函数
hexo.extend.helper.register('add_bbd_post', function(content, photos = []) {
  try {
    // 读取现有数据
    let bbdData = readBbdData(hexo);
    
    // 生成新的ID
    const newId = generateNewId(bbdData.posts);
    
    // 创建新内容
    const newPost = createBbdPost(content, photos, newId);
    
    // 确保posts数组存在
    if (!bbdData.posts) {
      bbdData.posts = [];
    }
    
    // 添加到数据中
    bbdData.posts.unshift(newPost); // 添加到开头
    
    // 保存数据
    saveBbdData(hexo, bbdData);
    
    return newPost;
  } catch (e) {
    console.error('Error adding bbd post:', e);
    return null;
  }
});

// 删除内容的辅助函数
hexo.extend.helper.register('remove_bbd_post', function(postId) {
  try {
    // 读取现有数据
    let bbdData = readBbdData(hexo);
    
    if (bbdData.posts) {
      // 过滤掉要删除的内容
      bbdData.posts = bbdData.posts.filter(p => p.id !== postId);
      
      // 保存数据
      saveBbdData(hexo, bbdData);
      return true;
    }
  } catch (e) {
    console.error('Error removing bbd post:', e);
  }
  
  return false;
});

// 为逼逼叨页面提供数据处理功能
hexo.extend.helper.register('get_bbd_data', function() {
  try {
    // 读取数据
    const data = readBbdData(hexo);
    
    // 处理数据确保格式正确
    const processedData = processBbdData(data);
    
    return processedData;
  } catch (e) {
    console.error('Error reading bbd content:', e);
  }
  
  return { posts: [] };
});

// 注册一个控制台命令用于添加逼逼叨内容
hexo.extend.console.register('bbd', 'Add a new bbd post', {
  usage: 'bbd <content> [photo1] [photo2] ...',
  description: 'Add a new bbd post with content and optional photos',
  arguments: [
    {name: 'content', desc: 'The content of the bbd post'},
    {name: 'photos', desc: 'Optional photo URLs or paths'}
  ]
}, function(args) {
  // Hexo命令行参数是一个对象，我们需要从中提取参数
  let content, photos;
  
  if (Array.isArray(args._)) {
    // 适配 Hexo CLI 参数格式
    if (args._.length === 0) {
      hexo.log.error('Content is required');
      hexo.log.info('Usage: hexo bbd "your content" [photo1] [photo2] ...');
      return;
    }
    
    content = args._[0];
    photos = args._.slice(1) || [];
  } else if (Array.isArray(args)) {
    // 适配普通数组参数格式
    if (args.length === 0) {
      hexo.log.error('Content is required');
      hexo.log.info('Usage: hexo bbd "your content" [photo1] [photo2] ...');
      return;
    }
    
    content = args[0];
    photos = args.slice(1) || [];
  } else {
    hexo.log.error('Invalid arguments format');
    return;
  }
  
  try {
    // 读取现有数据
    let bbdData = readBbdData(hexo);
    
    // 生成新的ID
    const newId = generateNewId(bbdData.posts);
    
    // 创建新内容
    const newPost = createBbdPost(content, photos, newId);
    
    // 确保posts数组存在
    if (!bbdData.posts) {
      bbdData.posts = [];
    }
    
    // 添加到数据中
    bbdData.posts.unshift(newPost); // 添加到开头
    
    // 保存数据
    saveBbdData(hexo, bbdData);
    
    hexo.log.info('Successfully added new bbd post with ID: ' + newId);
    hexo.log.info('Content: ' + content);
    if (photos.length > 0) {
      hexo.log.info('Photos: ' + photos.join(', '));
    }
  } catch (e) {
    hexo.log.error('Error adding bbd post:', e.message);
    hexo.log.error('Stack trace:', e.stack);
  }
});
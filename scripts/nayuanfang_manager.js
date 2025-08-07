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
 * 确保那远方目录存在
 * @param {Object} hexo - Hexo实例
 */
function ensureNayuanfangDirectory(hexo) {
  const contentPath = getContentPath(hexo);
  const nayuanfangDir = path.dirname(contentPath);
  if (!fs.existsSync(nayuanfangDir)) {
    fs.mkdirSync(nayuanfangDir, { recursive: true });
  }
}

/**
 * 读取那远方数据
 * @param {Object} hexo - Hexo实例
 * @returns {Object} 那远方数据
 */
function readNayuanfangData(hexo) {
  const contentPath = getContentPath(hexo);
  
  // 确保目录存在
  ensureNayuanfangDirectory(hexo);
  
  let nayuanfangData = { albums: [] };
  
  // 读取现有数据
  if (fs.existsSync(contentPath)) {
    try {
      const contentStr = fs.readFileSync(contentPath, 'utf8');
      nayuanfangData = JSON.parse(contentStr);
    } catch (parseError) {
      hexo.log.warn('Failed to parse existing content.json, using empty data');
      nayuanfangData = { albums: [] };
    }
  }
  
  return nayuanfangData;
}

/**
 * 保存那远方数据
 * @param {Object} hexo - Hexo实例
 * @param {Object} nayuanfangData - 那远方数据
 */
function saveNayuanfangData(hexo, nayuanfangData) {
  const contentPath = getContentPath(hexo);
  
  // 确保目录存在
  ensureNayuanfangDirectory(hexo);
  
  // 保存数据
  fs.writeFileSync(contentPath, JSON.stringify(nayuanfangData, null, 2));
}

/**
 * 重新排列相册ID，确保连续性
 * @param {Array} albums - 相册数组
 */
function reassignAlbumIds(albums) {
  if (albums && albums.length > 0) {
    // 按照某种顺序排列相册（这里按照日期排序）
    albums.sort((a, b) => {
      // 先按日期排序
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
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

/**
 * 添加新相册
 * @param {Object} hexo - Hexo实例
 * @param {Object} albumData - 相册数据
 */
function addAlbum(hexo, albumData) {
  try {
    // 读取现有数据
    let nayuanfangData = readNayuanfangData(hexo);
    
    // 确保albums数组存在
    if (!nayuanfangData.albums) {
      nayuanfangData.albums = [];
    }
    
    // 添加新相册
    nayuanfangData.albums.push(albumData);
    
    // 重新排列ID
    reassignAlbumIds(nayuanfangData.albums);
    
    // 保存数据
    saveNayuanfangData(hexo, nayuanfangData);
    
    hexo.log.info('Successfully added new album and reassigned IDs');
    return true;
  } catch (e) {
    hexo.log.error('Error adding album:', e);
    return false;
  }
}

/**
 * 删除相册
 * @param {Object} hexo - Hexo实例
 * @param {number} albumId - 相册ID
 */
function removeAlbum(hexo, albumId) {
  try {
    // 读取现有数据
    let nayuanfangData = readNayuanfangData(hexo);
    
    if (nayuanfangData.albums) {
      // 过滤掉要删除的相册
      nayuanfangData.albums = nayuanfangData.albums.filter(album => album.id !== albumId);
      
      // 重新排列ID
      reassignAlbumIds(nayuanfangData.albums);
      
      // 保存数据
      saveNayuanfangData(hexo, nayuanfangData);
      
      hexo.log.info('Successfully removed album and reassigned IDs');
      return true;
    }
  } catch (e) {
    hexo.log.error('Error removing album:', e);
  }
  
  return false;
}

// 注册添加相册的控制台命令
hexo.extend.console.register('album_add', 'Add a new album', {
  usage: 'album_add <title> <date> <description> <cover>',
  description: 'Add a new album with title, date, description and cover',
  arguments: [
    {name: 'title', desc: 'The title of the album'},
    {name: 'date', desc: 'The date of the album (YYYY-MM-DD)'},
    {name: 'description', desc: 'The description of the album'},
    {name: 'cover', desc: 'The cover image path of the album'}
  ]
}, function(args) {
  if (args._.length < 4) {
    hexo.log.error('Insufficient arguments');
    hexo.log.info('Usage: hexo album_add "title" "date" "description" "cover"');
    return;
  }
  
  const [title, date, description, cover] = args._;
  
  const albumData = {
    title: title,
    date: date,
    description: description,
    cover: cover,
    photos: []
  };
  
  addAlbum(hexo, albumData);
});

// 注册删除相册的控制台命令
hexo.extend.console.register('album_remove', 'Remove an album by ID', {
  usage: 'album_remove <id>',
  description: 'Remove an album by its ID',
  arguments: [
    {name: 'id', desc: 'The ID of the album to remove'}
  ]
}, function(args) {
  if (args._.length < 1) {
    hexo.log.error('Album ID is required');
    hexo.log.info('Usage: hexo album_remove <id>');
    return;
  }
  
  const albumId = parseInt(args._[0]);
  if (isNaN(albumId)) {
    hexo.log.error('Invalid album ID');
    return;
  }
  
  removeAlbum(hexo, albumId);
});

// 注册重新排列ID的控制台命令
hexo.extend.console.register('album_rearrange', 'Rearrange album IDs', {
  usage: 'album_rearrange',
  description: 'Rearrange all album IDs to ensure continuity',
}, function(args) {
  try {
    // 读取现有数据
    let nayuanfangData = readNayuanfangData(hexo);
    
    if (nayuanfangData.albums) {
      // 重新排列ID
      reassignAlbumIds(nayuanfangData.albums);
      
      // 保存数据
      saveNayuanfangData(hexo, nayuanfangData);
      
      hexo.log.info('Successfully reassigned all album IDs');
    }
  } catch (e) {
    hexo.log.error('Error rearranging album IDs:', e);
  }
});
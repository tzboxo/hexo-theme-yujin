// 主题配置加载器
const fs = require('fs');
const path = require('path');

// 注册辅助函数，用于获取主题配置
hexo.extend.helper.register('get_theme_config', function() {
  try {
    // 优先加载根目录下的 _config.yujin.yml
    const rootConfigPath = path.join(hexo.base_dir, '_config.yujin.yml');
    const themeConfigPath = path.join(hexo.theme_dir, '_config.yml');
    
    let config = {};
    
    // 如果根目录下有配置文件，优先加载
    if (fs.existsSync(rootConfigPath)) {
      const rootConfig = fs.readFileSync(rootConfigPath, 'utf8');
      config = Object.assign(config, hexo.render.renderSync({text: rootConfig, engine: 'yaml'}));
    } 
    // 否则加载主题目录内的配置文件
    else if (fs.existsSync(themeConfigPath)) {
      const themeConfig = fs.readFileSync(themeConfigPath, 'utf8');
      config = Object.assign(config, hexo.render.renderSync({text: themeConfig, engine: 'yaml'}));
    }
    
    // 将配置存储在全局变量中，方便调试
    hexo.theme.config = config;
    
    return config;
  } catch (e) {
    console.error('Error loading theme config:', e);
  }
  
  return {};
});
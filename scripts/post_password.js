// 文章密码保护插件
const crypto = require('crypto');

// 注册中间件处理密码保护文章
hexo.extend.filter.register('before_post_render', function(data) {
  // 检查文章是否设置了密码
  if (data.password) {
    // 获取请求中的密码参数
    const requestPassword = this.ctx && this.ctx.req && this.ctx.req.body && this.ctx.req.body.password;
    
    if (requestPassword) {
      // 验证密码
      if (requestPassword === data.password) {
        // 密码正确，标记文章已验证
        data.password_verified = true;
      } else {
        // 密码错误，设置错误标记
        data.post_password_error = true;
      }
    } else {
      // 没有提供密码，保持保护状态
      data.password_verified = false;
    }
  }
  
  return data;
});

// 注册辅助函数用于模板中检查密码状态
hexo.extend.helper.register('is_post_protected', function(post) {
  return post.password ? true : false;
});

hexo.extend.helper.register('is_post_authenticated', function(post) {
  return post.password_verified || false;
});
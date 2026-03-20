const http = require('../../utils/http.js');

Page({
  data: {
    username: '',
    password: '',
    isRegister: false,
    role: 'MEMBER'
  },

  onLoad(options) {
    // 检查是否已登录
    const token = wx.getStorageSync('token');
    if (token) {
      wx.switchTab({ url: '/pages/index/index' });
    }
  },

  // 切换登录/注册
  toggleMode() {
    this.setData({ isRegister: !this.data.isRegister });
  },

  // 输入用户名
  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },

  // 输入密码
  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  // 提交
  async onSubmit() {
    const { username, password, isRegister, role } = this.data;
    
    if (!username || !password) {
      wx.showToast({ title: '请填写完整', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '加载中...' });

    try {
      let res;
      if (isRegister) {
        res = await http.post('/auth/register', { username, password, role });
      } else {
        res = await http.post('/auth/login', { username, password });
      }

      wx.setStorageSync('token', res.token);
      wx.setStorageSync('userInfo', res);
      
      wx.showToast({ title: '成功', icon: 'success' });
      
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' });
      }, 1500);
      
    } catch (err) {
      wx.showToast({ title: err.message || '操作失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  }
});
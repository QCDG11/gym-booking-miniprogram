const http = require('../../utils/http.js');

Page({
  data: {
    userInfo: null
  },

  onShow() {
    this.loadUserInfo();
  },

  async loadUserInfo() {
    try {
      const userInfo = await http.get('/auth/me');
      this.setData({ userInfo });
    } catch (err) {
      console.log(err);
    }
  },

  onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.reLaunch({ url: '/pages/login/login' });
        }
      }
    });
  }
});
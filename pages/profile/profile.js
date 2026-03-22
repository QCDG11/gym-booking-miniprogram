const http = require('../../utils/http.js');

Page({
  data: {
    userInfo: null,
    menuItems: [
      { id: 1, name: '我的预约', icon: '📋', url: '/pages/booking/booking' },
      { id: 2, name: '我的私教', icon: '💪', url: '/pages/private/private' },
      { id: 3, name: '课程预约', icon: '📅', url: '/pages/courses/courses' },
      { id: 4, name: '私教预约', icon: '👨‍🏫', url: '/pages/coaches/coaches' }
    ]
  },

  onShow() {
    this.loadUserInfo();
  },

  async loadUserInfo() {
    try {
      const userInfo = await http.get('/auth/me');
      this.setData({ userInfo });
    } catch (err) {
      console.error('加载失败', err);
    }
  },

  onMenuTap(e) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({ url });
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
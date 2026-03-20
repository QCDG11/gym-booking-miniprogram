const http = require('../../utils/http.js');

Page({
  data: {
    banners: [
      { id: 1, image: '/images/banner1.jpg', url: '' },
      { id: 2, image: '/images/banner2.jpg', url: '' }
    ],
    quickActions: [
      { id: 1, name: '课程预约', icon: 'course', url: '/pages/courses/courses' },
      { id: 2, name: '私教预约', icon: 'coach', url: '/pages/coaches/coaches' },
      { id: 3, name: '我的预约', icon: 'booking', url: '/pages/booking/booking' },
      { id: 4, name: '我的私教', icon: 'private', url: '/pages/private/private' }
    ]
  },

  onShow() {
    // 检查登录状态
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
    }
  },

  onQuickAction(e) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({ url });
  }
});
const http = require('../../utils/http.js');

Page({
  data: {
    userInfo: null,
    stats: { courseBookings: 0, privateSessions: 0 },
    quickActions: [
      { id: 1, name: '课程预约', icon: '📅', url: '/pages/courses/courses', color: '#FF6B6B' },
      { id: 2, name: '私教预约', icon: '👨‍🏫', url: '/pages/coaches/coaches', color: '#4ECDC4' },
      { id: 3, name: '我的预约', icon: '📋', url: '/pages/booking/booking', color: '#45B7D1' },
      { id: 4, name: '我的私教', icon: '💪', url: '/pages/private/private', color: '#96CEB4' }
    ],
    recommendedCourses: []
  },

  onLoad() {
    this.checkLogin();
  },

  onShow() {
    if (wx.getStorageSync('token')) {
      this.loadUserData();
    }
  },

  checkLogin() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
    }
  },

  async loadUserData() {
    try {
      const userInfo = await http.get('/auth/me');
      const courseBookings = await http.get('/member/my-course-bookings');
      const privateTrainings = await http.get('/member/my-private-trainings');
      this.setData({
        userInfo,
        stats: {
          courseBookings: courseBookings.length,
          privateSessions: privateTrainings.reduce((sum, t) => sum + t.remainingSessions, 0)
        }
      });
    } catch (err) {
      console.error('加载失败', err);
    }
  },

  onQuickAction(e) {
    const { url } = e.currentTarget.dataset;
    console.log('点击跳转:', url);
    wx.navigateTo({ url });
  }
});
const http = require('../../utils/http.js');

Page({
  data: {
    activeTab: 'course',
    courseBookings: [],
    privateTrainings: []
  },

  onShow() {
    this.checkLoginAndLoad();
  },

  checkLoginAndLoad() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        success: () => {
          wx.navigateTo({ url: '/pages/login/login' });
        }
      });
      return;
    }
    this.loadData();
  },

  async loadData() {
    wx.showLoading({ title: '加载中...' });
    try {
      const [courseBookings, privateTrainings] = await Promise.all([
        http.get('/member/my-course-bookings'),
        http.get('/member/my-private-trainings')
      ]);
      console.log('课程预约:', courseBookings);
      console.log('私教课程:', privateTrainings);
      this.setData({ courseBookings, privateTrainings });
    } catch (err) {
      console.error('加载失败', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  onTabChange(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
  },

  async onCancel(e) {
    const { id, type } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认取消',
      content: '确定要取消此预约吗？',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '取消中...' });
          try {
            await http.delete(`/member/book/course/${id}`);
            wx.showToast({ title: '已取消', icon: 'success' });
            this.loadData();
          } catch (err) {
            wx.showToast({ title: err.message || '取消失败', icon: 'none' });
          } finally {
            wx.hideLoading();
          }
        }
      }
    });
  },

  goToCourses() {
    wx.switchTab({ url: '/pages/courses/courses' });
  },

  goToCoaches() {
    wx.navigateTo({ url: '/pages/coaches/coaches' });
  }
});
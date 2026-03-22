const http = require('../../utils/http.js');

Page({
  data: {
    activeTab: 'course',
    courseBookings: [],
    privateBookings: []
  },

  onShow() {
    this.loadData();
  },

  async loadData() {
    wx.showLoading({ title: '加载中...' });
    try {
      const [courseBookings, privateBookings] = await Promise.all([
        http.get('/member/my-course-bookings'),
        http.get('/member/my-private-bookings')
      ]);
      this.setData({ courseBookings, privateBookings });
    } catch (err) {
      console.error('加载失败', err);
      wx.showToast({ title: '请先登录', icon: 'none' });
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
            if (type === 'course') {
              await http.delete(`/member/book/course/${id}`);
            } else {
              await http.delete(`/member/book/private/booking/${id}`);
            }
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
    wx.navigateTo({ url: '/pages/courses/courses' });
  },

  goToCoaches() {
    wx.navigateTo({ url: '/pages/coaches/coaches' });
  }
});
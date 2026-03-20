const http = require('../../utils/http.js');

Page({
  data: {
    courseBookings: [],
    privateBookings: []
  },

  onShow() {
    this.loadBookings();
  },

  async loadBookings() {
    wx.showLoading({ title: '加载中...' });
    try {
      const courseBookings = await http.get('/member/my-course-bookings');
      const privateBookings = await http.get('/member/my-private-bookings');
      this.setData({ courseBookings, privateBookings });
    } catch (err) {
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  async onCancel(e) {
    const { id, type } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认取消',
      content: '确定要取消此预约吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            if (type === 'course') {
              await http.delete(`/member/book/course/${id}`);
            } else {
              await http.delete(`/member/book/private/booking/${id}`);
            }
            wx.showToast({ title: '已取消', icon: 'success' });
            this.loadBookings();
          } catch (err) {
            wx.showToast({ title: '取消失败', icon: 'none' });
          }
        }
      }
    });
  }
});
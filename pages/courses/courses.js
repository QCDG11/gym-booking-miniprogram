const http = require('../../utils/http.js');

Page({
  data: {
    courses: [],
    schedules: []
  },

  onLoad() {
    this.loadCourses();
  },

  async loadCourses() {
    wx.showLoading({ title: '加载中...' });
    try {
      const courses = await http.get('/member/courses');
      const schedules = await http.get('/member/schedules');
      this.setData({ courses, schedules });
    } catch (err) {
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  async onBookCourse(e) {
    const scheduleId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认预约',
      content: '确定要预约此课程吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await http.post(`/member/book/course/${scheduleId}`);
            wx.showToast({ title: '预约成功', icon: 'success' });
            this.loadCourses();
          } catch (err) {
            wx.showToast({ title: err.message || '预约失败', icon: 'none' });
          }
        }
      }
    });
  }
});
const http = require('../../utils/http.js');

Page({
  data: {
    courses: [],
    schedules: [],
    activeTab: 'schedule',
    categories: ['全部', '瑜伽', '动感单车', '普拉提', '力量训练', '拳击'],
    activeCategory: 0
  },

  onLoad() {
    this.loadData();
  },

  async loadData() {
    wx.showLoading({ title: '加载中...' });
    try {
      const [courses, schedules] = await Promise.all([
        http.get('/member/courses'),
        http.get('/member/schedules')
      ]);
      this.setData({ courses, schedules });
    } catch (err) {
      wx.showToast({ title: '加载失败，请先登录', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  onTabChange(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
  },

  onCategoryChange(e) {
    this.setData({ activeCategory: e.currentTarget.dataset.index });
  },

  async onBookCourse(e) {
    const scheduleId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认预约',
      content: '确定要预约此课程吗？',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '预约中...' });
          try {
            await http.post(`/member/book/course/${scheduleId}`);
            wx.showToast({ title: '预约成功！', icon: 'success' });
            this.loadData();
          } catch (err) {
            wx.showToast({ title: err.message || '预约失败', icon: 'none' });
          } finally {
            wx.hideLoading();
          }
        }
      }
    });
  }
});
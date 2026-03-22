const http = require('../../utils/http.js');

Page({
  data: {
    coaches: [],
    showModal: false,
    selectedCoach: null,
    form: {
      type: '增肌',
      duration: 60,
      totalSessions: 10,
      price: 3000
    }
  },

  onLoad() {
    this.loadCoaches();
  },

  async loadCoaches() {
    wx.showLoading({ title: '加载中...' });
    try {
      const coaches = await http.get('/member/coaches');
      this.setData({ coaches: coaches.filter(c => c.enabled) });
    } catch (err) {
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  onSelectCoach(e) {
    const coach = e.currentTarget.dataset.coach;
    this.setData({ selectedCoach: coach, showModal: true });
  },

  onCloseModal() {
    this.setData({ showModal: false, selectedCoach: null });
  },

  onInputChange(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    const form = this.data.form;
    form[field] = ['duration', 'totalSessions'].includes(field) ? parseInt(value) : value;
    this.setData({ form });
  },

  async onConfirm() {
    const { selectedCoach, form } = this.data;
    wx.showModal({
      title: '确认购买',
      content: `购买 ${selectedCoach.name} 的私教课程\n${form.totalSessions}节，共 ¥${form.price}`,
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '购买中...' });
          try {
            await http.post('/member/book/private', {
              coachId: selectedCoach.id,
              ...form
            });
            wx.showToast({ title: '购买成功', icon: 'success' });
            this.onCloseModal();
          } catch (err) {
            wx.showToast({ title: err.message || '购买失败', icon: 'none' });
          } finally {
            wx.hideLoading();
          }
        }
      }
    });
  }
});
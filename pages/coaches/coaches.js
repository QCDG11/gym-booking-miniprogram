const http = require('../../utils/http.js');

Page({
  data: {
    coaches: [],
    selectedCoach: null,
    showBookingModal: false,
    bookingForm: {
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
    this.setData({
      selectedCoach: coach,
      showBookingModal: true
    });
  },

  onCloseModal() {
    this.setData({
      showBookingModal: false,
      selectedCoach: null
    });
  },

  onInputChange(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    const bookingForm = this.data.bookingForm;
    bookingForm[field] = field === 'totalSessions' || field === 'duration' ? parseInt(value) : value;
    this.setData({ bookingForm });
  },

  async onConfirmBooking() {
    const { selectedCoach, bookingForm } = this.data;
    
    wx.showModal({
      title: '确认购买',
      content: `确定要购买 ${selectedCoach.name} 的私教课程吗？\n${bookingForm.totalSessions}节课，共 ¥${bookingForm.price}`,
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '提交中...' });
          try {
            await http.post('/member/book/private', {
              coachId: selectedCoach.id,
              ...bookingForm
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
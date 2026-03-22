const http = require('../../utils/http.js');

Page({
  data: {
    activeTab: 'trainings',
    privateTrainings: [],
    privateBookings: [],
    showModal: false,
    selectedTraining: null,
    form: { bookedTime: '', location: '', note: '' }
  },

  onShow() { this.loadData(); },

  async loadData() {
    wx.showLoading({ title: '加载中...' });
    try {
      const [trainings, bookings] = await Promise.all([
        http.get('/member/my-private-trainings'),
        http.get('/member/my-private-bookings')
      ]);
      this.setData({ privateTrainings: trainings, privateBookings: bookings });
    } catch (err) {
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  onTabChange(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
  },

  onBookSession(e) {
    const training = e.currentTarget.dataset.training;
    if (training.remainingSessions <= 0) {
      wx.showToast({ title: '剩余次数不足', icon: 'none' });
      return;
    }
    this.setData({
      selectedTraining: training,
      showModal: true,
      form: { bookedTime: '', location: training.coach?.name + '工作室', note: '' }
    });
  },

  onCloseModal() {
    this.setData({ showModal: false, selectedTraining: null });
  },

  onInputChange(e) {
    const field = e.currentTarget.dataset.field;
    const form = this.data.form;
    form[field] = e.detail.value;
    this.setData({ form });
  },

  onDateChange(e) {
    const form = this.data.form;
    form.bookedTime = e.detail.value;
    this.setData({ form });
  },

  async onConfirm() {
    const { selectedTraining, form } = this.data;
    if (!form.bookedTime) {
      wx.showToast({ title: '请选择预约时间', icon: 'none' });
      return;
    }
    wx.showModal({
      title: '确认预约',
      content: '确定要预约私教课程吗？',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '预约中...' });
          try {
            const bookedTime = new Date(form.bookedTime).toISOString();
            await http.post(`/member/book/private/${selectedTraining.id}`, { bookedTime, location: form.location, note: form.note });
            wx.showToast({ title: '预约成功', icon: 'success' });
            this.onCloseModal();
            this.loadData();
          } catch (err) {
            wx.showToast({ title: err.message || '预约失败', icon: 'none' });
          } finally {
            wx.hideLoading();
          }
        }
      }
    });
  },

  async onCancel(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认取消',
      content: '确定要取消此预约吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await http.delete(`/member/book/private/booking/${id}`);
            wx.showToast({ title: '已取消', icon: 'success' });
            this.loadData();
          } catch (err) {
            wx.showToast({ title: '取消失败', icon: 'none' });
          }
        }
      }
    });
  },

  goToCoaches() {
    wx.navigateTo({ url: '/pages/coaches/coaches' });
  }
});
// pages/exp1/exp1.js
const db = wx.cloud.database()
const _ = db.command
const app=getApp()
var formater=require("../../utils/formatTime")

Page({
  data: {
    id: null,
    name: '',
    gender: '',
    date: '',
    time: '',
    duration: '',
    location: '',
    money: '',
    contact: '',
    others: '',
    examineeContact: "",
    examineeOthers: ''
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    db.collection('experiment').where({
        _id: this.data.id
      })
      .get({
        success: res => {
          console.log
          this.setData({
            name: res.data[0].name,
            gender: res.data[0].sex,
            date: formater.formatTime(res.data[0].date,"Y-M-D"),
            time: formater.formatTime(res.data[0].date,"h:m"),
            duration: res.data[0].time+"分钟",
            location: res.data[0].location,
            money: res.data[0].money + "元",
            contact: res.data[0].contact,
            others: res.data[0].others,
          })
        }
      })
  },
  onShow: function () {

  },
  examineeContactInput: function(e){
    this.setData({
      examineeContact: e.detail.value
    })
  },
  examineeOthersInput: function(e){
    this.setData({
      examineeOthers: e.detail.value
    })
  },
  submitTap: function(){
    if(this.data.examineeContact==''){
      wx.showToast({
        title: '请输入联系方式',
        icon: 'none',
        duration: 2000,
        mask: true
      });
    }
    else{
      var submitData={
        openid: app.globalData.openid,
        isAccepted: 0,
        contact: this.data.examineeContact,
        others: this.data.examineeOthers
      }
      db.collection('experiment').where({
        _id: this.data.id
      })
      .update({
        data:{
          examineeInfo: _.push(submitData),
          examineeId: _.push(app.globalData.openid)
        }
      })
      db.collection('user').where({
        _openid: app.globalData.openid
      })
      .update({
        data:{
          joinedExp: _.push(this.data.id)
        },
        success: res=>{
          wx.showModal({ //弹出提示框
            title: '提示',
            content: '申请提交成功',
            showCancel: false,
            confirmText: '返回',
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          });
        },
        fail: res=>{
          wx.showModal({
            title: '注意',
            content: '提交失败，请重试',
            showCancel: false,
            confirmText: '重试'
          })
        }
      })
    }
  },
  return: function () {
    wx.navigateBack({
      delta: 1
    });
  }
})
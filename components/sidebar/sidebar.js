Component({
  properties: {
    showDialog:{
      type:Boolean,
      value:false,
    },
    direction:{
      type:String,
      value:'',
    },
  },
  data: {
    
  },
  ready: function () {
    
  },
  methods: {
    hideDrawer:function(){
      this.setData({
        showDialog:false,
      })
    }
  },
})
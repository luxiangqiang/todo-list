import Vue from 'vue'
import App from './App'
import { 
  Button, 
  Radio,
  Checkbox, 
  Row, 
  Col, 
  Card, 
  Empty,
  Dialog,
  Input
} from 'element-ui';
import 'element-ui/lib/theme-chalk/button.css'
import 'element-ui/lib/theme-chalk/radio.css'
import 'element-ui/lib/theme-chalk/checkbox.css'
import 'element-ui/lib/theme-chalk/row.css'
import 'element-ui/lib/theme-chalk/col.css'
import 'element-ui/lib/theme-chalk/card.css'
import 'element-ui/lib/theme-chalk/icon.css'
import 'element-ui/lib/theme-chalk/empty.css'
import 'element-ui/lib/theme-chalk/dialog.css'
import 'element-ui/lib/theme-chalk/input.css'
import '../fonts/iconfont.css'

Vue.use(Button)
.use(Radio)
.use(Checkbox)
.use(Row)
.use(Col)
.use(Card)
.use(Empty)
.use(Dialog)
.use(Input)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

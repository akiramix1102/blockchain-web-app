import i18n from '@/utils/language'
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// @ts-ignore
// import locale from 'element-ui/lib/locale/lang/vi'

const customElSelect = {
  install(Vue) {
    Vue.prototype.closePopper = () => {
      const virtualTarget = document.createElement('div')
      document.body.appendChild(virtualTarget)
      virtualTarget.click()
      document.body.removeChild(virtualTarget)
    }
  }
}

Vue.use(customElSelect)

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

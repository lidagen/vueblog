import comp from "/home/wangs/Documents/fontrepo/vueblog/docs/.vuepress/.temp/pages/juc/juc.html.vue"
const data = JSON.parse("{\"path\":\"/juc/juc.html\",\"title\":\"\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[{\"level\":3,\"title\":\"JUC总览\",\"slug\":\"juc总览\",\"link\":\"#juc总览\",\"children\":[]}],\"git\":{\"updatedTime\":1628486895000,\"contributors\":[{\"name\":\"wal365@126.com\",\"username\":\"wal365@126.com\",\"email\":\"github73256897\",\"commits\":1,\"url\":\"https://github.com/wal365@126.com\"}],\"changelog\":[{\"hash\":\"c0f932a8872bd76365c1862edd5fa9a3e13a9146\",\"time\":1628486895000,\"email\":\"github73256897\",\"author\":\"wal365@126.com\",\"message\":\"commit vueblog\"}]},\"filePathRelative\":\"juc/juc.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}

import comp from "/home/wangs/Documents/fontrepo/vueblog/docs/.vuepress/.temp/pages/jvm/jvm3.html.vue"
const data = JSON.parse("{\"path\":\"/jvm/jvm3.html\",\"title\":\"\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"GC 分代收集算法\",\"slug\":\"gc-分代收集算法\",\"link\":\"#gc-分代收集算法\",\"children\":[{\"level\":3,\"title\":\"Minor GC 和 Full GC区别\",\"slug\":\"minor-gc-和-full-gc区别\",\"link\":\"#minor-gc-和-full-gc区别\",\"children\":[]},{\"level\":3,\"title\":\"引用计数法\",\"slug\":\"引用计数法\",\"link\":\"#引用计数法\",\"children\":[]},{\"level\":3,\"title\":\"复制算法 Copying\",\"slug\":\"复制算法-copying\",\"link\":\"#复制算法-copying\",\"children\":[]},{\"level\":3,\"title\":\"标记清除 Mark-Sweep\",\"slug\":\"标记清除-mark-sweep\",\"link\":\"#标记清除-mark-sweep\",\"children\":[]},{\"level\":3,\"title\":\"标记压缩 Mark-Compact\",\"slug\":\"标记压缩-mark-compact\",\"link\":\"#标记压缩-mark-compact\",\"children\":[]},{\"level\":3,\"title\":\"算法总结\",\"slug\":\"算法总结\",\"link\":\"#算法总结\",\"children\":[]}]}],\"git\":{\"updatedTime\":1629099631000,\"contributors\":[{\"name\":\"gendali\",\"username\":\"gendali\",\"email\":\"wal365@126.com\",\"commits\":1,\"url\":\"https://github.com/gendali\"},{\"name\":\"wal365@126.com\",\"username\":\"wal365@126.com\",\"email\":\"github73256897\",\"commits\":2,\"url\":\"https://github.com/wal365@126.com\"}],\"changelog\":[{\"hash\":\"4c198b044d16cbee1f248c311de9a429460dc5c4\",\"time\":1629099631000,\"email\":\"github73256897\",\"author\":\"wal365@126.com\",\"message\":\"commit vueblog\"},{\"hash\":\"fe02200ddc3af36c8a33f1778822ab49b264ceae\",\"time\":1629026808000,\"email\":\"github73256897\",\"author\":\"wal365@126.com\",\"message\":\"commit vueblog\"},{\"hash\":\"2b8f1d20b0e638eaf7bde6d951e658db1862f159\",\"time\":1587282374000,\"email\":\"wal365@126.com\",\"author\":\"gendali\",\"message\":\"cimmit jvm\"}]},\"filePathRelative\":\"jvm/jvm3.md\"}")
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

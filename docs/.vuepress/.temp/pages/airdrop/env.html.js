import comp from "/home/wangs/Documents/fontrepo/vueblog/docs/.vuepress/.temp/pages/airdrop/env.html.vue"
const data = JSON.parse("{\"path\":\"/airdrop/env.html\",\"title\":\"\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"环境配置\",\"slug\":\"环境配置\",\"link\":\"#环境配置\",\"children\":[]}],\"git\":{\"updatedTime\":1741680813000,\"contributors\":[{\"name\":\"wangs\",\"username\":\"wangs\",\"email\":\"wal365@126.com\",\"commits\":1,\"url\":\"https://github.com/wangs\"}],\"changelog\":[{\"hash\":\"49f1545febd8d3ddc4da9ee28dc2abf0ac743ae2\",\"time\":1741680813000,\"email\":\"wal365@126.com\",\"author\":\"wangs\",\"message\":\"commit vueblog\"}]},\"filePathRelative\":\"airdrop/env.md\"}")
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

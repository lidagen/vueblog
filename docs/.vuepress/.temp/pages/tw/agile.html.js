import comp from "/home/wangs/Documents/fontrepo/vueblog/docs/.vuepress/.temp/pages/tw/agile.html.vue"
const data = JSON.parse("{\"path\":\"/tw/agile.html\",\"title\":\"\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"敏捷工程实践\",\"slug\":\"敏捷工程实践\",\"link\":\"#敏捷工程实践\",\"children\":[]}],\"git\":{\"updatedTime\":1646035081000,\"contributors\":[{\"name\":\"song wang\",\"username\":\"song wang\",\"email\":\"song.wang1@thoughtworks.com\",\"commits\":1,\"url\":\"https://github.com/song wang\"}],\"changelog\":[{\"hash\":\"9c5c8a9cee7f910ffec8c6942799bceaeb728a8c\",\"time\":1646035081000,\"email\":\"song.wang1@thoughtworks.com\",\"author\":\"song wang\",\"message\":\"k8s 基础\"}]},\"filePathRelative\":\"tw/agile.md\"}")
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

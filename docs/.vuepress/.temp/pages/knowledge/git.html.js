import comp from "/home/wangs/Documents/fontrepo/vueblog/docs/.vuepress/.temp/pages/knowledge/git.html.vue"
const data = JSON.parse("{\"path\":\"/knowledge/git.html\",\"title\":\"\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[{\"level\":3,\"title\":\"廖雪峰 GIT教程\",\"slug\":\"廖雪峰-git教程\",\"link\":\"#廖雪峰-git教程\",\"children\":[]}],\"git\":{\"updatedTime\":1573032003000,\"contributors\":[{\"name\":\"88395515\",\"username\":\"88395515\",\"email\":\"88395515@cnsuning.com\",\"commits\":2,\"url\":\"https://github.com/88395515\"}],\"changelog\":[{\"hash\":\"b7e0a8dd8e4257957b4d904f908364b6521c57c1\",\"time\":1573032003000,\"email\":\"88395515@cnsuning.com\",\"author\":\"88395515\",\"message\":\"commit vueblog\"},{\"hash\":\"8bf328e38497143565d9b8e5dfd8cbae5dee511d\",\"time\":1559097988000,\"email\":\"88395515@cnsuning.com\",\"author\":\"88395515\",\"message\":\"增加文文字\"}]},\"filePathRelative\":\"knowledge/git.md\"}")
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

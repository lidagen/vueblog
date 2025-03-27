import comp from "/home/wangs/Documents/fontrepo/vueblog/docs/.vuepress/.temp/pages/knowledge/aboutMe.html.vue"
const data = JSON.parse("{\"path\":\"/knowledge/aboutMe.html\",\"title\":\"\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[],\"git\":{\"updatedTime\":1559652116000,\"contributors\":[{\"name\":\"88395515\",\"username\":\"88395515\",\"email\":\"88395515@cnsuning.com\",\"commits\":1,\"url\":\"https://github.com/88395515\"}],\"changelog\":[{\"hash\":\"fc2c483071ce3e26cebfcd9665239b2abe810aeb\",\"time\":1559652116000,\"email\":\"88395515@cnsuning.com\",\"author\":\"88395515\",\"message\":\"about me\"}]},\"filePathRelative\":\"knowledge/aboutMe.md\"}")
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

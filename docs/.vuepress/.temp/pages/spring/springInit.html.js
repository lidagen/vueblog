import comp from "/home/wangs/Documents/fontrepo/vueblog/docs/.vuepress/.temp/pages/spring/springInit.html.vue"
const data = JSON.parse("{\"path\":\"/spring/springInit.html\",\"title\":\"\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"Spring启动初始化数据\",\"slug\":\"spring启动初始化数据\",\"link\":\"#spring启动初始化数据\",\"children\":[{\"level\":3,\"title\":\"ApplicationRunner与 CommandLineRunner\",\"slug\":\"applicationrunner与-commandlinerunner\",\"link\":\"#applicationrunner与-commandlinerunner\",\"children\":[]},{\"level\":3,\"title\":\"InitializingBean\",\"slug\":\"initializingbean\",\"link\":\"#initializingbean\",\"children\":[]},{\"level\":3,\"title\":\"@PostConstruct\",\"slug\":\"postconstruct\",\"link\":\"#postconstruct\",\"children\":[]}]}],\"git\":{\"updatedTime\":1607589419000,\"contributors\":[{\"name\":\"wangsong\",\"username\":\"wangsong\",\"email\":\"song1.wang@symbio.com\",\"commits\":1,\"url\":\"https://github.com/wangsong\"}],\"changelog\":[{\"hash\":\"d8444e500a2d2279cdc0a5d94e255c80fd05e517\",\"time\":1607589419000,\"email\":\"song1.wang@symbio.com\",\"author\":\"wangsong\",\"message\":\"commit vueblog\"}]},\"filePathRelative\":\"spring/springInit.md\"}")
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

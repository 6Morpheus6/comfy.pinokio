window.$pinokio.inject({
  mount(ctx) {
    const DIALOG_KEY = "global-missing-models-warning"
    const DIALOG_SELECTOR = `[role="dialog"][aria-labelledby="${DIALOG_KEY}"]`

    const normalizeText = (text) => (text || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim()

    const getDialogDownloadItems = () => {
      const app = document.getElementById("vue-app")?.__vue_app__
      if (!app) return []

      let pinia = app.config?.globalProperties?.$pinia || null
      if (!pinia) {
        const provides = app._context?.provides
        if (!provides) return []

        for (const key of Reflect.ownKeys(provides)) {
          const value = provides[key]
          if (value && typeof value === "object" && value._s instanceof Map) {
            pinia = value
            break
          }
        }
      }

      if (!pinia || !(pinia._s instanceof Map)) {
        return []
      }

      const dialogStore = pinia._s.get("dialog")
      const dialogStack = Array.isArray(dialogStore?.dialogStack) ? dialogStore.dialogStack : []
      const dialog = dialogStack.find((item) => item && item.key === DIALOG_KEY)
      if (!dialog) return []

      const payload = dialog.contentProps || dialog.footerProps
      if (!Array.isArray(payload?.missingModels) || !payload?.paths || typeof payload.paths !== "object") {
        return []
      }

      const items = []
      const seen = new Set()

      for (const model of payload.missingModels) {
        if (!model || typeof model !== "object") continue

        const url = normalizeText(model.url)
        const filename = normalizeText(model.name)
        const directory = normalizeText(model.directory)
        if (!/^https?:\/\//i.test(url) || !filename || !directory) continue

        const modelPaths = payload.paths[directory]
        const savePath = Array.isArray(modelPaths) && typeof modelPaths[0] === "string"
          ? modelPaths[0].trim()
          : ""
        if (!savePath) continue

        const key = `${url}\n${filename}\n${savePath}`
        if (seen.has(key)) continue
        seen.add(key)

        items.push({
          url: model.url,
          filename: model.name,
          savePath,
        })
      }

      return items
    }

    const onClick = (event) => {
      const target = event.target && typeof event.target.closest === "function"
        ? event.target
        : null
      if (!target) return

      const footer = target.closest(`${DIALOG_SELECTOR} [data-pc-section="footer"]`)
      if (!footer) return

      const button = target.closest("button")
      if (!button || button !== footer.querySelector("button:last-of-type")) {
        return
      }

      const items = getDialogDownloadItems()
      if (!items.length) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()

      ctx.trigger("trigger-download", { items }, { source: "extension.js" })
    }

    document.addEventListener("click", onClick, true)

    return () => {
      document.removeEventListener("click", onClick, true)
    }
  }
})

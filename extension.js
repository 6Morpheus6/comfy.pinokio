window.$pinokio.inject({
  mount(ctx) {
    const parseLabel = (text) => {
      const label = (text || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim()
      if (!label) return null

      const splitAt = label.lastIndexOf(" / ")
      if (splitAt <= 0 || splitAt >= label.length - 3) return null

      const savePath = label.slice(0, splitAt).trim()
      const filename = label.slice(splitAt + 3).trim()
      if (!savePath || !filename) return null

      return { savePath, filename, label }
    }

    const parseDownloadContext = (target) => {
      const button = target.closest('li[data-pc-section="option"] button[title], li[role="option"] button[title], .p-listbox-option button[title]')
      if (!button) return null

      const text = `${button.textContent || ""} ${button.getAttribute("aria-label") || ""}`.toLowerCase()
      if (!text.includes("download") || text.includes("copy")) {
        return null
      }

      const row = button.closest('li[data-pc-section="option"], li[role="option"], .p-listbox-option')
      if (!row) return null

      const url = (button.getAttribute("title") || "").trim()
      if (!/^https?:\/\//i.test(url)) return null

      const labelNode = row.querySelector('span[title^="http://"], span[title^="https://"]')
      const label = parseLabel((labelNode || row).textContent || "")
      if (!label) return null

      return { url, ...label }
    }

    const onClick = (event) => {
      const target = event.target && typeof event.target.closest === "function"
        ? event.target
        : null
      if (!target) return

      const payload = parseDownloadContext(target)
      if (!payload) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()

      ctx.trigger("trigger-download", payload, { source: "extension.js" })
    }

    document.addEventListener("click", onClick, true)

    return () => {
      document.removeEventListener("click", onClick, true)
    }
  }
})

module.exports = {
  run: [
    {
      method: async (req) => {
        const normalizeItem = (item) => {
          if (!item || typeof item !== "object") return null

          const url = typeof item.url === "string" ? item.url.trim() : ""
          const filename = typeof item.filename === "string" ? item.filename.trim() : ""
          const savePath = typeof item.savePath === "string" ? item.savePath.trim() : ""

          if (!url || !filename || !savePath) return null

          return { url, filename, savePath }
        }

        const rawItems = Array.isArray(req.input && req.input.items)
          ? req.input.items
          : [req.input]
        const items = rawItems.map(normalizeItem).filter(Boolean)

        return { items }
      }
    },
    {
      method: "local.set",
      params: {
        items: "{{input.items}}",
        index: 0
      }
    },
    {
      method: "jump",
      params: {
        id: "{{local.items && local.items.length ? 'download' : 'end'}}"
      }
    },
    {
      id: "download",
      method: "fs.download",
      params: {
        url: "{{local.items[local.index].url}}",
        dir: "{{path.isAbsolute(local.items[local.index].savePath) ? local.items[local.index].savePath : path.join('app/models', local.items[local.index].savePath)}}"
      }
    },
    {
      method: "local.set",
      params: {
        index: "{{local.index + 1}}"
      }
    },
    {
      method: "jump",
      params: {
        id: "{{local.index < local.items.length ? 'download' : 'end'}}"
      }
    },
    {
      id: "end",
      method: "log",
      params: {
        raw: "Done"
      }
    }
  ]
}

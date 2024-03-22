module.exports = class Form {
  constructor(form) {
    if (typeof form == 'string') form = q(form)

    form.addEventListener('submit', this.handleSubmit)

    this.options = {
      scroll: [null, 'true'].includes(form.getAttribute('data-scroll')),
      redirect: form.getAttribute('data-redirect') || 'back',
      message: form.getAttribute('data-message') || '',
      flash: {
        el: form.getAttribute('data-flash') || '#flash',
        time: form.getAttribute('data-time') || 5000,
        name: form.getAttribute('data-cookie') || 'flash'
      }
    }

    this.form = form

    form.querySelectorAll('[name]').forEach((field) => {
      field.addEventListener('input', this.handleClearErrors)
    })

    form.querySelectorAll('[type="file"]').forEach((input) => {
      input.addEventListener('click', this.handleClearErrors)
      input.addEventListener('change', this.handleUpload)
    })
  }

  getQuery = (action) => {
    if (action[0] == '/') {
      action = 'thismessage:' + action
    }
    var url = new URL(action)
    var searchParams = new URLSearchParams(url.search)
    return Object.fromEntries(searchParams)
  }

  getPayload = (query, values) => {
    var payload = {}
    if (Object.keys(query).length) {
      payload.query = query
    }
    if (Object.keys(values).length) {
      payload.values = values
    }
    return payload
  }

  handleUpload = async (event) => {
    event.preventDefault()

    var input = event.target
    var parent = input.parentNode

    var action = input.getAttribute('data-action')
    var size = input.getAttribute('data-size')
    var progress = q('.progress', parent)
    var preview = q('.preview', parent)
    var hidden = q('[type="hidden"]', parent)

    var options = {
      files: input.files
    }

    if (progress) {
      options.progress = (event) => {
        this.handleUploadProgress({ event, progress, input })
      }
    }

    var result = await api(action, {}, options)

    if (!this.handleShowErrors(result)) {
      var file = result[0]
      hidden.value = file.url
      if (preview) {
        html(preview, this.renderUploadImage(file, { size }))
      }
    }
    this.handleUploadReset({ input })
  }

  handleUploadProgress = ({ event, progress }) => {
    var { loaded, total, percent } = event
    loaded = `${(loaded / 1024).toFixed(2)} kB`
    total = `${(total / 1024).toFixed(2)} kB`
    text(progress, `${loaded}/${total}, ${percent}%`)
  }

  renderUploadImage = (file, opt = {}) => {
    var { size = 100 } = opt
    return `<img
      src="${file.url}"
      style="height:${size}px"
      height="${size}"
      alt="${file.name || ''}"
    />`
  }

  handleUploadReset = ({ input }) => {
    input.value = ''
    var parent = input.parentNode
    var em = q('em', parent)
    if (em) text(em, '')
    var progress = q('.progress', parent)
    if (progress) text(progress, '')
  }

  handleSubmit = async (event) => {
    event.preventDefault()

    var button = event.submitter
    button.disabled = true

    var action = this.form.getAttribute('action')

    var query = this.getQuery(action)
    var values = serialize(this.form)

    var payload = this.getPayload(query, values)
    var result = await api(action, payload)

    button.disabled = false

    if (!this.handleShowErrors(result)) {
      this.handleRedirect()
    }
  }

  handleClearErrors = (event) => {
    var field = event.target

    var el = q(`.${field.name}-errors`, field.parentNode)
    if (el) text(el, '')
  }

  handleShowErrors = (result) => {
    if (!result.error) return

    qa('em', this.form, (el) => text(el, ''))

    flash(result.error.message, this.options.flash)

    for (var key in result) {
      if (key == 'error') continue
      for (var field in result[key]) {
        var em = q(`.${field}-errors`, this.form)
        var val = result[key][field][0]
        if (em && val) text(em, val)
      }
    }
    return true
  }

  handleRedirect = () => {
    var { message, redirect } = this.options
    if (redirect == 'none') {
      if (message) {
        flash(message, this.options.flash)
      }
    } else {
      if (!/https?:/.test(redirect)) {
        cookie('flash', message)
      }
      if (redirect == 'back') {
        if (typeof window.back == 'function') {
          window.back()
        }
      } else if (redirect == 'reload') {
        window.location = window.location.href
      } else {
        window.location = redirect
      }
    }
  }
}

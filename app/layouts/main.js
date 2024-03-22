var Form = require(process.cwd() + '/index.js')

module.exports = async function ($) {
  return /* HTML */ `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${$.page.title || 'Components'}</title>
        ${$.script('/bundle.js')} ${$.style('/bundle.css')}
        ${process.env.NODE_ENV == 'development' ? $.script('/js/dev.js') : ''}
        <script>
          var api = waveorb('${$.app.config.env.api}')
        </script>
      </head>
      <body>
        <script>
          window.Form = ${Form}
        </script>
        <div class="notify"><div class="flash" id="flash"></div></div>
        <main>${$.page.content}</main>
        <script>
          flash()
        </script>
        <script>
          ${Object.keys($.app.components)
            .map(function (name) {
              return `customElements.define('${name}', ${$.app.components[name]})`
            })
            .join('\n\n')}
        </script>
      </body>
    </html>`
}

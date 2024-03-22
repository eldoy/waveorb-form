module.exports = async function ($) {
  return /* HTML */ `<h1>Uploads</h1>
    <form>
      <div>
        <div class="preview"></div>
        <label for="file">File</label>
        <input id="file" type="file" data-action="/upload/create" />
        <input type="hidden" name="file" />
        <em class="file-errors"></em>
        <span class="progress"></span>
      </div>
    </form>
    <script>
      window.form = new Form('form')
    </script> `
}

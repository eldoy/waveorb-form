module.exports = async function ($) {
  return /* HTML */ `<h1>Forms</h1>
    <h3>Normal form</h3>
    <form
      action="/project/create?id=5"
      data-redirect="reload"
      data-message="You're good."
    >
      <p>
        <label for="name">Name</label>
        <input id="name" type="text" name="name" />
        <em class="name-errors"></em>
      </p>
      <p>
        <button>Save</button>
      </p>
    </form>
    <script>
      window.form = new Form('form')
    </script> `
}

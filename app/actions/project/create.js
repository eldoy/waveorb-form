module.exports = async function ($) {
  await $.validate({
    values: {
      name: {
        required: true
      }
    }
  })

  return { ok: 1 }
}

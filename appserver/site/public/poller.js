setInterval(async () => {
  const resp = await fetch("/wait/123")
  const json = await resp.json()
  if(json.status=="running"){
    $('#process').html(`<b> ${json.process}%</b>`)
  }else{
    $('#running').hide()
    $('#finished').show()
  }
}, 3000)


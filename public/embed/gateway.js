(function () {
  function qs(sel) { return document.querySelector(sel) }
  function attr(el, name) { return (el && el.getAttribute(name)) || '' }

  var script = document.currentScript || qs('script[data-xyz-gateway],script[data-gateway]')
  if (!script) return

  var tenant = (script.dataset.tenant || attr(script, 'data-tenant') || 'default').toLowerCase()
  tenant = tenant.replace(/[^a-z0-9_-]/g, '') || 'default'

  var brand = script.dataset.brand || attr(script, 'data-brand') || 'Gateway'
  var buttonText = script.dataset.buttonText || attr(script, 'data-button-text') || 'Enter Members'
  var baseUrl = script.dataset.baseUrl || attr(script, 'data-base-url') || 'https://gateway.xyz'
  var mountId = script.dataset.mountId || attr(script, 'data-mount-id') || 'xyz-gateway-button'
  var redirectPath = script.dataset.redirect || attr(script, 'data-redirect') || '/members'

  var mount = document.getElementById(mountId)
  if (!mount) {
    mount = document.createElement('div')
    mount.id = mountId
    script.parentNode && script.parentNode.insertBefore(mount, script)
  }

  var btn = document.createElement('button')
  btn.type = 'button'
  btn.textContent = buttonText
  btn.style.cssText = 'padding:10px 14px;border-radius:12px;border:1px solid rgba(0,255,102,.6);background:rgba(0,0,0,.55);color:#a8ffce;font-weight:700;cursor:pointer;'
  mount.appendChild(btn)

  function toast(msg) {
    try { console.log('[Gateway]', msg) } catch (e) {}
  }

  async function getChainIdHex() {
    if (!window.ethereum) return '0x1'
    try { return await window.ethereum.request({ method: 'eth_chainId' }) } catch (e) { return '0x1' }
  }

  btn.addEventListener('click', async function () {
    if (!window.ethereum) {
      toast('No injected wallet found')
      window.open('https://metamask.io/download/', '_blank')
      return
    }

    btn.disabled = true
    var prev = btn.textContent
    btn.textContent = 'Connecting…'

    try {
      var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      var address = (accounts && accounts[0]) || ''
      if (!address) throw new Error('No wallet address returned')

      btn.textContent = 'Sign to Enter…'
      var chainHex = await getChainIdHex()
      var chainId = parseInt(chainHex, 16) || 1

      // Fetch nonce/message from Gateway domain (CORS-enabled)
      var nonceUrl = baseUrl.replace(/\/$/, '') + '/api/nonce?tenant=' + encodeURIComponent(tenant) + '&address=' + encodeURIComponent(address) + '&chainId=' + encodeURIComponent(chainId)
      var nonceRes = await fetch(nonceUrl, { method: 'GET', mode: 'cors' })
      var nonceJson = await nonceRes.json()
      var msg = nonceJson && nonceJson.message
      if (!msg) throw new Error('Nonce response missing message')

      var signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [msg, address]
      })

      // Redirect to first-party Enter flow (sets cookie, then sends to members)
      var enterUrl = baseUrl.replace(/\/$/, '') + '/' + tenant + '/enter' +
        '#address=' + encodeURIComponent(address) +
        '&signature=' + encodeURIComponent(signature) +
        '&chainId=' + encodeURIComponent(chainId) +
        '&redirect=' + encodeURIComponent(redirectPath)

      window.location.href = enterUrl
    } catch (e) {
      toast(e && e.message ? e.message : 'Failed')
      btn.disabled = false
      btn.textContent = prev
    }
  })
})()

export function httpRequest (method, url, headers, data) {
  return new Promise((resolve) => {

    const reqUrl = url.indexOf('http') > -1 ? url : process.env.REACT_APP_API_URL + url

    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
      try {
        if (!xhr.responseText || xhr.responseText.length < 1) {
          // console.log('not response')
          resolve({success: false})
          return
        }
        resolve(JSON.parse(xhr.responseText))
      } catch (e) {
        // json parse error
        // console.log(e)
        resolve({success: false})
      }
    }

    xhr.onerror = function(e) {
      // console.log(e)
      alert('서버 통신 에러')
      resolve({success: false})
    }

    xhr.open(method, reqUrl)
    if (headers !== null) {
      for(const [k,v] of Object.entries(headers)) {
        xhr.setRequestHeader(k, v)
      }
    }
    xhr.send(data)
  })
}

export function imageUpload(url, headers, f) {
  return new Promise((resolve) => {
    if (!f || typeof f === 'undefined') {
      resolve({success: false, message: 'empty file'})
      return
    }

    if (f.constructor.name !== 'File') {
      resolve({success: false, message: 'not allowed type'})
      return
    }

    const reqUrl = url.indexOf('http') > -1 ? url : process.env.REACT_APP_API_URL + url

    const fd = new FormData()
    fd.append('file', f)
    const xhr = new XMLHttpRequest()

    xhr.onload = function() {
      try {
        if (!xhr.responseText || xhr.responseText.length < 1) {
          // console.log('not response')
          resolve({success: false})
          return
        }
        resolve(JSON.parse(xhr.responseText))
      } catch (e) {
        // json parse error
        // console.log(e)
        resolve({success: false})
      }
    }

    xhr.onerror = function(e) {
      // console.log(e)
      alert('서버 통신 에러')
      resolve({success: false})
    }

    xhr.open('POST', reqUrl)
    if (headers !== null) {
      for(const [k,v] of Object.entries(headers)) {
        xhr.setRequestHeader(k, v)
      }
    }
    xhr.send(fd)
  })
}
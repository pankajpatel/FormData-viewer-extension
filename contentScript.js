var objFromFormData = function(formData){
  const values = {};
  for (let [key, value] of formData.entries()) {
    if (values[key]) {
      if ( ! (values[key] instanceof Array) ) {
        values[key] = new Array(values[key]);
      }
      values[key].push(value);
    } else {
      values[key] = value;
    }
  }
  return values;
}
var getData = function() {
  var forms = [].slice.call(document.querySelectorAll('form'));
  
  return forms.map(function(form, index) {
    const f = new FormData(form);
    return {
      index: index,
      form: form.id,
      name: form.getAttribute('name'),
      data: objFromFormData(f),
    }
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(sender.tab
    ? 'from a content script:' + sender.tab.url
    : 'from the extension'
  );
  if (request.type == 'getData')
    sendResponse({ data: getData() });
});

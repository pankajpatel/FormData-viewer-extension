var formatValue = function(value) {
  switch(typeof value) {
    case 'object':
      if (value instanceof File) {
        return value.size
          ? value.name + '\n' + value.type
          : 'No File selected!';
      }
      if (value instanceof Date) {
        return value.toDateString();
      }
      return value;
    default:
      return value;
  }
}

var objFromFormData = function(formData){
  const values = {};
  for (let [key, value] of formData.entries()) {
    var val = formatValue(value)
    if (values[key]) {
      if ( ! (values[key] instanceof Array) ) {
        values[key] = new Array(values[key]);
      }
      values[key].push(val);
    } else {
      values[key] = val;
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
  if (request.type == 'getData')
    sendResponse({ data: getData() });
});

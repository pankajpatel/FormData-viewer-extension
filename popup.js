var generateObjectPreview = function (obj) {
  var tbody = document.createElement('tbody');

  Object.keys(obj).forEach(function (key, i) {
    var field = obj[key];
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');

    td1.appendChild(nodeGenerator(key))
    td2.appendChild(nodeGenerator(field))
    td2.classList.add('value');
    tr.appendChild(td1)
    tr.appendChild(td2);
    tbody.appendChild(tr);
  });
  return tbody;
}

var generateTable = function (formData) {
  var table = document.createElement('table');
  table.appendChild(generateObjectPreview(formData))
  table.classList.add('table')
  table.classList.add('table-bordered')
  table.classList.add('table-hover')
  table.classList.add('table-sm')
  return table;
}

var nodeGenerator = function(value){
  if (value instanceof Array) {
    var fragment = document.createDocumentFragment();
    value.forEach(v => {
      var d = document.createElement('div')
      d.appendChild(nodeGenerator(v))
      fragment.appendChild(d)
    });
    return fragment;
  }

  if (typeof value === 'object') {
    return generateTable(value);
  }

  var text = document.createTextNode(value);
  return text;
}

var generateView = function(data) {
  if (!data.formData) {
    return document.createComment('No Data for: ' + data.formName);
  }
  var details = document.createElement('details');
  var summary = document.createElement('summary');
  var code = document.createElement('code');
  code.classList.add('text-success');
  code.innerText = data.formName || '';
  if(!data.formName) {
    code = document.createElement('small');
    code.innerText = 'Unnamed Form';
    code.classList.add('text-warning');
    code.classList.add('font-weight-light');
    code.classList.add('font-italic');
  }
  var fieldCount = Object.keys(data.formData).length;

  var span = document.createElement('small');
  span.innerText = 'Fields: ' + fieldCount;
  span.classList.add('text-muted')
  span.classList.add('float-right')

  summary.appendChild(span);

  fieldCount && details.setAttribute('open', fieldCount)
  !fieldCount && code.classList.add('text-muted');
  var table = generateTable(data.formData);
  summary.appendChild(code);
  details.appendChild(summary);
  details.appendChild(table);

  details.classList.add('clearfix');

  details.id = data.formName;
  return details;
}

document.addEventListener('DOMContentLoaded', function() {
  var target = document.querySelector('#target');
  var reload = document.querySelector('#reload');
  reload.addEventListener('click', () => {
    getCurrentTab().then(tab => {
      var message = {type: 'getData' };
      chrome.tabs.sendMessage(tab.id, message, function(response) {
        response.data.forEach(function(data){
          var obj = {
            formName: data.form || data.name,
            formData: data.data,
          };
          var oldNode = target.querySelector('#'+obj.formName);
          oldNode && target.removeChild(oldNode);
          target.appendChild(generateView(obj))
        });
      });
    });
  });
});

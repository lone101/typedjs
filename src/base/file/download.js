function(base64binary, fileName) {
  var dwl = new _.base.class('file.download', this);
  //properties:
  dwl.private.extend({
    fileExtension: '',
    fileType: '',
    fillFileInfo: function(fileName) {
      if (!isNull(fileName))
        dwl.properties.set('fileName', fileName);
      dwl.private.fileExtension =
        fileName.split(".")[fileName.split(".").length - 1];
      switch (dwl.private.fileExtension) {
        case "pdf":
          dwl.private.fileType = "pdf";
          break;
        case "xls":
        case "xlsx":
        case "xlsm":
          dwl.private.fileType = "excel";
          break;
        case "doc":
        case "docx":
          dwl.private.fileType = "word";
          break;
        default:
          dwl.private.fileType = "";
      }
      dwl.private.checkBinaryHeaders();
    },
    checkBinaryHeaders: function() {
      if (!isNullOrEmpty(dwl.properties.get('binary'))) {
        if (dwl.private.binary.indexOf('data:application/') != 0) {
          dwl.private.binary = 'data:application/' + dwl.private.fileType +
            ';' + dwl.private.binary;
        } else {
          //Check if data header is correct:
          var app =
            dwl.private.binary.split('data:application/')[1].split(';')[0];
          if (app.toUpperCase() != dwl.private.fileType.toUpperCase()) {
            var parts = dwl.private.binary.split(';');
            parts.shift();
            dwl.private.binary = 'data:application/' + dwl.private.fileType +
              ';' + parts.join(';');
          }

        }
        if (dwl.private.binary.split(';').length > 1) {
          if (dwl.private.binary.split(';')[1].indexOf('base64,') != 0) {
            var parts = dwl.private.binary.split(';');
            dwl.private.binary = parts[0] + ";";
            parts.shift();
            dwl.private.binary += 'base64,';
            dwl.private.binary += parts.join(';');
          }
        }
      }
    },
    onFileNameChanged: function(prop) {
      fillFileInfo(prop.value);
    }
  });
  dwl.protected.extend({});
  dwl.public.extend({
    download: function() {
      if (!window.ActiveXObject) {
        var save = document.createElement('a');
        save.href = dwl.protected.getBinary();
        save.target = '_blank';
        save.download = dwl.private.fileName || 'unknown';
        try {
          var evt = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': false
          });
          save.dispatchEvent(evt);

          (window.URL || window.webkitURL).revokeObjectURL(save.href);
        } catch (e) {
          var _window = window.open(dwl.private.getBinary(), '_blank');
          _window.document.close();
          _window.document.execCommand('SaveAs', true, dwl.private.fileName)
          _window.close();
        }
      } // for IE < 11
      else if (!!window.ActiveXObject && document.execCommand) {
        var _window = window.open(dwl.private.getBinary(), '_blank');
        _window.document.close();
        _window.document.execCommand('SaveAs', true, dwl.private.fileName)
        _window.close();
      }
    }
  });
  dwl.properties.set("binary", base64binary);
  dwl.properties.set("fileName", fileName, dwl.private.onFileNameChanged);
  return dwl.public;
}

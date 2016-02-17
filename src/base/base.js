var _ = (function() {
  //Static window objects:
  Date.prototype.addDays = function(days) {
  this.setDate(this.getDate() + days);
  return this;
};
window.isNull = function(obj) {
  if (typeof(obj) != 'undefined' && obj !== null) {
    return false;
  } else {
    return true;
  }
};
window.isNullOrEmpty = function(obj) {
  if (!isNull(obj)) {
    return $.trim(obj.toString()) === '';
  } else {
    return true;
  }
};
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(finder) {
    for (var i = 0; i < this.length; i++) {
      if (finder(this[i])) {
        return i;
      }
    }
    return -1;
  };
}
if (!Array.prototype.each) {
  Array.prototype.each = function(action) {
    for (var i = 0; i < this.length; i++) {
      action(this[i]);
    }
  };
}
  var tjs = {
    private: {
      _job_crit: null,
      _job_mid: null,
      _job_low: null,
      enums: {
   modelState: {
     created: 0,
     loaded: 1,
     changed: 2,
     saved: 3
   },
   propertyState: {
     created: 0,
     initilized: 1,
     changed: 2,
     saved: 3
   }
 }
    },
    public: {
      base: {
        process: function(name) {
  var prc = new tjs.public.base.class(((isNullOrEmpty(name)) ? 'process' : name),
    this);
  prc.private.extend({
    interval: 250,
    processList: new tjs.public.base.collections.dictionary(),
    time: 0,
    bussy: false,
    running: false,
    executingProcess: [],
    start: function() {
      if (!prc.private.running) {
        prc.private.running = true;
        if (prc.private.time)
          clearTimeout(prc.private.time);
        prc.private.time = 0;
        prc.private.time = setTimeout(prc.private.execute, prc.private.interval);
      }
    },
    execute: function() {
      if (prc.private.time)
        clearTimeout(prc.private.time);
      prc.private.time = 0;
      if (!prc.private.bussy) {
        prc.private.bussy = true;
        prc.private.executingProcess = prc.private.processList.getAllArray();
        var keys = prc.private.processList.getAllKeys();

        for (var i = 0; i < prc.private.executingProcess.length; i++) {
          try {
            prc.private.runProc(keys[i],
              prc.private.executingProcess[i].prc,
              prc.private.executingProcess[i].prm,
              prc.private.executingProcess[i].onEnd
            );
            //me.private.executingProcess[i].prc(
            //  me.private.executingProcess[i].prm);
          } catch (e) {
            e.message = 'Process ' + keys[i] + ' failed:' + e.message;
            prc.protected.log(e);
          }
        }
        prc.private.bussy = false;
      }
      if (prc.private.running)
        prc.private.time = setTimeout(prc.private.execute, prc.private.interval);
    },
    stop: function() {
      prc.private.running = false;
    },
    runProc: function(name, proc, params, onEnd) {
      //Cannot pass method to worker:
      /*if (Blob && Worker) {
        //Trying to run in a worker:
        // Build a worker from an anonymous function body
        var blobURL = URL.createObjectURL(new Blob(['(',
          function() {
            this.addEventListener('message', function(e) {
              var data = e.data;

              var result = null;
              var exec = 'ok';
              try {
                result = data.proc(data.params);
              } catch (e) {
                e.message = 'Process ' + data.name + ' failed:' +
                  e.message;
                log(e);
                exec = 'ko';
              }
              this.postMessage(
                'name:' + data.name + '#execution:' + exec +
                '#returned:' + result);
              self.close();
            });
          }.toString(),

          ')()'
        ], {
          type: 'application/javascript'
        }));

        worker = new Worker(blobURL);
        worker.onmessage = function(e) {
          log("Received: " + e.data);
          dat = e.data.split('#');
          if (onEnd) {

            onEnd({
              process: dat[0].split(':')[1],
              execution: dat[1].split(':')[1],
              returned: dat[2].split(':')[1]
            });
          }
        };
        worker.postMessage({
          name: name,
          proc: proc,
          params: params
        });
        // Won't be needing this anymore
        URL.revokeObjectURL(blobURL);
      } else {*/
      var result = null;
      var exec = 'ok';
      try {
        result = proc(params);
      } catch (e) {
        e.message = 'Process ' + name + ' failed:' + e.message;
        prc.protected.log(e);
        exec = 'ko';
      }
      if (onEnd) {
        onEnd({
          process: name,
          execution: exec,
          returned: result
        });
      }

      //}
    }
  });
  prc.protected.extend({

  });
  prc.public.extend({
    start: function(interval) {
      if (!isNull(interval)) {
        prc.private.interval = interval;
      }
      prc.private.start();
    },
    stop: function() {
      if (prc.private.running)
        prc.private.stop();
    },
    addProcess: function(name, process, params, onEnd) {
      try {
        prc.private.processList.add(name, {
          prc: process,
          prm: params,
          onEnd: onEnd
        });
      } catch (e) {
        prc.protected.log(e);
      }
    },
    delProcess: function(name) {
      prc.private.processList.del(name);
    },
    modifyProcess: function(name, process, params) {
      try {
        prc.private.processList.setItem(name, {
          prc: process,
          prm: params
        });
      } catch (e) {
        prc.protected.log(e);
      }
    }
  });
  return prc.public;
},
        class: function(name, obj, properties, onpropertyChangedHandler) {
  var cls = obj;
  cls.name = name;
  cls.private = {
    properties: new tjs.public.base.collections.dictionary(),
    onPropertyChangedHandlers: onpropertyChangedHandler,
    property: function(name, value, onPropertyChangedHandler) {
  var prop = this;
  prop.private = {
    name: name,
    value: value,
    initValue: value,
    lastValue: value,
    state: tjs.private.enums.propertyState.created,
    onPropertyChangedHandlers: [],
    savedHandlers: []
  };
  prop.protected = {
    fireHandlers: function() {
      for (var i = 0; i < prop.private.onPropertyChangedHandlers.length; i++) {
        prop.private.onPropertyChangedHandlers[i](prop.public);
      }
    }
  };
  prop.public = {
    name: prop.private.name,
    get: function() {
      return prop.private.value;
    },
    set: function(value, onPropertyChangedHandler) {
      if (isNull(prop.private.initValue)) {
        prop.private.initValue = value;
        prop.private.state = tjs.private.enums.propertyState.initilized;
      } else {
        prop.private.state = tjs.private.enums.propertyState.changed;
      }
      if (onPropertyChangedHandler) {
        if (!$.isArray(onPropertyChangedHandler)) {
          prop.private.onPropertyChangedHandlers.push(
            onPropertyChangedHandler);
        } else {
          for (var i = 0; i < onPropertyChangedHandler.length; i++) {
            prop.private.onPropertyChangedHandlers.push(
              onPropertyChangedHandler[i]);
          }
        }
      }
      prop.private.value = value;
      if (prop.private.lastValue != value) {
        prop.private.lastValue = prop.private.value;
        prop.private.value = value;
        prop.protected.fireHandlers();
      }
    },
    getInitValue: function() {
      return prop.private.initValue;
    },
    getLastValue: function() {
      return prop.private.lastValue;
    },
    addPropChangedHandler: function(handler) {
      prop.private.onPropertyChangedHandlers.push(handler);
    },
    getHandlers: function() {
      return prop.private.onPropertyChangedHandlers;
    },
    removeHandlers: function() {
      prop.private.savedHandlers = [];
      for (var i = 0; i < prop.private.onPropertyChangedHandlers.length; i++) {
        prop.private.savedHandlers.push(prop.private.onPropertyChangedHandlers[
          i]);
      }
      prop.private.onPropertyChangedHandlers = [];
    },
    restoreHandlers: function() {
      prop.private.onPropertyChangedHandlers = [];
      for (var i = 0; i < prop.private.savedHandlers; i++) {
        prop.private.onPropertyChangedHandlers.push(me.private.savedHandlers[
          i]);
      }
    },
    save: function() {
      if (prop.private.state >= tjs.private.enums.propertyState.changed) {
        prop.private.state = tjs.private.enums.propertyState.saved;
      }
    },
    getState: function() {
      return prop.private.state;
    }
  };
  if (!isNull(onPropertyChangedHandler)) {
    if (!$.isArray(onPropertyChangedHandler)) {
      prop.public.addPropChangedHandler(onPropertyChangedHandler);
    } else {
      for (var i = 0; i < onPropertyChangedHandler.length; i++) {
        if (!isNull(onPropertyChangedHandler[i])) {
          prop.public.addPropChangedHandler(onPropertyChangedHandler[i]);
        }
      }
    }
    //Call handler before end:
    prop.protected.fireHandlers();
  }
  return prop.public;
},
    extend: function(newObj) {
      cls.private = $.extend(true, cls.private, newObj);
    },
    logger: null,
    propertiesInspector: null,
    paramProperties: properties,
    init: function() {
      if (!isNull(cls.private.paramProperties)) {
        //initialize properties with param:
        for (var key in cls.private.paramProperties) {
          cls.properties.set(key, cls.private.paramProperties[key],
            cls.private.onPropertyChangedHandler);
        }
      }
    }
  }
  cls.protected = {
    log: function(err) {
      if (isNull(cls.private.logger))
        cls.private.logger = new tjs.public.base.logger(cls);
      cls.private.logger.log(err);
    },
    removePropertiesHandlers: function(name) {
      try {
        if (!isNull(name)) {
          cls.private.properties.getItem(name).removeHandlers();
        } else {
          var keys = cls.private.properties.getAllKeys();
          for (var key in keys) {
            cls.private.properties.getItem(key).removeHandlers();
          }
        }
      } catch (e) {
        cls.protected.log(new Error(
          'Cannot remove handlers for property "' + name + '"'));
      }
    },
    restorePropertiesHandlers: function(name) {
      try {
        if (!isNull(name)) {
          cls.private.properties.getItem(name).restoreHandlers();
        } else {
          var keys = cls.private.properties.getAllKeys();
          for (var key in keys) {
            cls.private.properties.getItem(key).restoreHandlers();
          }
        }
      } catch (e) {
        cls.protected.log(new Error(
          'Cannot restore handlers for property "' + name + '"'));
      }
    },
    setProp: function(name, value, onPropertyChangedHandler) {
      cls.properties.set(name, value, onPropertyChangedHandler);
    },
    getProp: function(name) {
      return cls.properties.get(name);
    },
    getFullProp: function(name) {
      return cls.private.properties.getItem(name);
    },
    extend: function(newObj) {
      cls.protected = $.extend(true, cls.protected, newObj);
    }
  }
  cls.properties = {
    collection: cls.private.properties,
    get: function(name) {
      return cls.private.properties.getItem(name).get();
    },
    set: function(name, value, onPropertyChangedHandler) {
      cls.public[name] = value;
      if (cls.private.properties.contains(name)) {
        cls.private.properties.getItem(name).set(value);
      } else {
        var handlers = [];
        if (cls.private.onPropertyChangedHandler)
          handlers.push(cls.private.onPropertyChangedHandler);
        if ($.isArray(onPropertyChangedHandler)) {
          for (var i = 0; i < onPropertyChangedHandler.length; i++) {
            handlers.push(onPropertyChangedHandler[i]);
          }
        } else {
          handlers.push(onPropertyChangedHandler);
        }
        cls.private.properties.add(name,
          new cls.private.property(name,
            value,
            handlers
          )
        );
      }

      if (!cls.private.propertiesInspector) {
        cls.private.propertiesInspector = new tjs.public.base.process(cls.name +
          '_propIns');
        cls.private.propertiesInspector.addProcess('propInspector',
          function(clas) {
            var keys = clas.properties.collection.getAllKeys();
            var dat = clas.properties.collection.getAllArray();
            var changed = [];
            for (var i = 0; i < keys.length; i++) {
              if (dat[i].get() != clas.public[keys[i]]) {
                changed.push(keys[i]);
                dat[i].set(clas.public[keys[i]]);
              }
            }
            return changed.join('|');
          },
          cls,
          function(data) {
            //TODO: Implement some logging
          }
        );
        cls.private.propertiesInspector.start(600);
      }

    }
  }
  cls.public = {
    inherit: function(name, currentObj) {
      var inhe = new tjs.public.base.class(name, currentObj);
      inhe.protected.extend(cls.protected);
      inhe.public.extend(cls.public);
      var prop = cls.properties.collection.getAllJson();
      for (var k in prop) {
        inhe.properties.set(k, prop[k].get(), prop[k].getHandlers());
      }
      return inhe;
    },
    className: function() {
      return cls.name;
    },
    setProp: function(name, value, onPropertyChangedHandler) {
      cls.protected.setProp(name, value, onPropertyChangedHandler);
    },
    getProp: function(name) {
      return cls.protected.getProp(name);
    },
    getProperties: function() {
      return cls.private.properties.getAllJson();
    },
    getPropertiesNames: function() {
      return cls.private.properties.getAllKeys();
    },
    getPropertiesValues: function() {
      return cls.private.properties.getAllArray();
    },
    removePropertiesHandlers: function(name) {
      cls.protected.removePropertiesHandlers(name);
    },
    restorePropertiesHandlers: function(name) {
      cls.protected.restorePropertiesHandlers(name);
    },
    extend: function(newObj) {
      cls.public = $.extend(true, cls.public, newObj);
    }
  };
  cls.private.init();
  return cls;
},
        logger: function(obj) {
  var me = obj;
  var lg = {
    private: {
      init: function() {
        if (!console) {
          window.console = (function() {
            var me = this;
            me.logText = '';
            return {
              toString: function() {
                return me.logText;
              },
              log: function(msg) {
                me.logText += '\r\n' + msg;
              }
            };
          })();
        } else {
          if (!window.console.toString) {
            window.console.logText = '';
            window.console.toString = function() {
              return window.console.logText;
            };
          }
        }

      },
      trace: [],
      saveTrace: function(msg) {
        if (lg.private.trace.length > 10) {
          lg.private.trace.shift();
        }
        lg.private.trace.push(msg);
      }
    },
    public: {
      log: function(err) {
        if ($.type(err) === 'error') {
          var errText = 'typedJs.' + me.name + ' error:' +
            ((err.description) ? '\r\n\tDescription:' + err.description :
              '') +
            ((err.message) ? '\r\n\tMessage:' + err.message : '') +
            ((err.stack) ? '\r\n\tStack:' + err.printStackTrace : '');
          console.log(errText);
          lg.private.save(errText);
        } else {
          console.log('typedJS.' + me.name + ' debug:' + err);
          lg.private.saveTrace('typedJS.' + me.name + ' debug:' + err);
        }
      }
    }
  };
  return lg.public;
},
        file: {
  download: function(base64binary, fileName) {
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
},
        utils: {},
        collections: {
  dictionary: function() {
  var dic = this;
  dic.name = "dictionary";
  dic.private = {
    logger: null,
    extend: function(newObj) {
      dic.private = $.extend(true, dic.private, newObj);
    }
  }
  dic.protected = {
    _collection: {},
    log: function(err) {
      if (isNull(dic.private.logger))
        dic.private.logger = new _.base.logger(me);
      dic.private.logger.log(err);
    },
    extend: function(newObj) {
      dic.protected = $.extend(true, dic.protected, newObj);
    }
  }
  dic.public = {
    inherit: function(name) {
      if (!isNull(name))
        dic.name = name;
      return {
        public: dic.public,
        protected: dic.protected,
        private: {}
      };
    },
    add: function(key, value) {
      if (dic.public.contains(key)) {
        throw new Error("Ya existe la clave: " + key);
      } else {
        dic.protected._collection[key.toString().trim()] =
          value;
      }
    },
    del: function(key) {
      if (dic.public.contains(key)) {
        delete dic.protected._collection[key];
      }
    },
    contains: function(key) {
      for (var ckey in dic.protected._collection) {
        if (key.toString().trim() == ckey) {
          return dic.protected._collection[ckey];
        }
      }
      return null;
    },
    getItem: function(key) {
      return dic.public.contains(key);
    },
    setItem: function(key, value) {
      var val = dic.public.contains(key);
      if (val) {
        dic.protected._collection[key.toString().trim()] =
          value;
      } else {
        throw new Error("No existe el elemento: " + key);
      }
    },
    getAllArray: function() {
      var arr = [];
      for (var k in dic.protected._collection) {
        arr.push(dic.protected._collection[k]);
      }
      return arr;
    },
    getAllJson: function() {
      return dic.protected._collection;
    },
    getAllKeys: function() {
      var arr = [];
      for (var k in dic.protected._collection) {
        arr.push(k);
      }
      return arr;
    },
    first: function() {
      var ar = dic.public.getAllKeys();
      if (ar.length > 0)
        return dic.protected._collection[ar[0]];
      else
        return null;
    },
    last: function() {
      var ar = dic.public.getAllKeys();
      if (ar.length > 0)
        return dic.protected._collection[ar[ar.length - 1]];
      else
        return null;
    },
    clear: function() {
      dic.protected._collection = {};
    },
    extend: function(newObj) {
      dic.public = $.extend(true, dic.public, newObj);
    },
    each: function(action) {
      var keys = dic.public.getAllKeys();
      for (var i = 0; i < keys.length; i++) {
        action(keys[i], dic.protected._collection[keys[i]], i);
      }
    },
    inherit: function(name, currentObj) {
      var inhe = new tjs.public.base.collections.dictionary();
      inhe.protected.extend(dic.protected);
      inhe.public.extend(dic.public);
      return inhe;
    }
  };
  return dic.public;
}
}
      },
      model: function(modelName, properties, onPropertyChangedHandler) {
  var mod = new tjs.public.base.class(modelName, this, properties,
    onPropertyChangedHandler);
  mod.private.extend({
    modelState: tjs.private.enums.modelState.created,
    hasChasges: function() {
      var props = mod.public.getProperties();
      for (var key in props) {
        if (props[key].state > tjs.private.enums.propertyState.initilized)
          return true;
      }
      return false;
    },
    _changes: [],
    modelInit: function() {
      var props = mod.public.getProperties();
      for (var key in props) {
        props[key].addPropChangedHandler(mod.private.propertyChecker);
      }
    },
    propertyChecker: function(property) {
      if (property.getState() > tjs.private.enums.propertyState.initilized) {
        if (mod.private._changes.findIndex(function(x) {
            return x === property.name;
          }) < 0)
          mod.private._changes.push(property.name);
        mod.private.modelState = tjs.private.enums.modelState.changed;
      }
    }
  });
  mod.protected.extend({});
  mod.public.extend({
    getModelState: function() {
      return mod.private.modelState;
    },
    getChangedPropsJson: function() {
      var props = mod.public.getProperties();
      var final = {};
      for (var key in props) {
        if (props[key].getState() === tjs.private.enums.propertyState.changed) {
          final[key] = props[key].get();
        }
      }
      return final;
    },
    getAllPropsJson: function() {
      return mod.public.getProperties();
    },
    setSaved: function() {
      var props = mod.public.getProperties();
      mod.private._changes.each(function(x) {
        props[x].save();
      });
      mod.private._changes = [];
      mod.private.modelState = tjs.private.enums.modelState.saved;
      return mod.private.modelState;
    },
    setModel: function(json) {
      for (var key in json) {
        mod.public.setProp(key, json[key], mod.private.propertyChecker);
      }
    }

  });
  mod.private.modelInit();
  return mod.public;
},
      jobs: {
        critical: function() {
          if (!tjs.private._job_crit)
            tjs.private._job_crit = new tjs.public.base.process(
              "Critical", 200);
          return tjs.private._job_crit;
        },
        middle: function() {
          if (!tjs.private._job_mid)
            tjs.private._job_mid = new tjs.public.base.process("Middle",
              600);
          return tjs.private._job_mid;
        },
        low: function() {
          if (!tjs.private._job_low)
            tjs.private._job_low = new tjs.public.base.process("Low",
              1200);
          return tjs.private._job_low;
        }
      }
    }
  };
  //Starts jobs engine:
  //tjs.public.jobs.critical().start();
  //tjs.public.jobs.middle().start();
  //tjs.public.jobs.low().start();

  return tjs.public;
})();

var typedJS = _;

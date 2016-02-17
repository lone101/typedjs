function(name, obj, properties, onpropertyChangedHandler) {
  var cls = obj;
  cls.name = name;
  cls.private = {
    properties: new tjs.public.base.collections.dictionary(),
    onPropertyChangedHandlers: onpropertyChangedHandler,
    property: //include class/property.js;
    ,
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
}

function(modelName, properties, onPropertyChangedHandler) {
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
}

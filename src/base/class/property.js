function(name, value, onPropertyChangedHandler) {
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
}

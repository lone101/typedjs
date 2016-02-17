function() {
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

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

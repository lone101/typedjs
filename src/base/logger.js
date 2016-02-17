function(obj) {
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
}

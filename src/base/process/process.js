function(name) {
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
}

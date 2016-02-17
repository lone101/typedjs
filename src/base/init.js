var _ = (function() {
  //Static window objects:
  //include static.js;
  var tjs = {
    private: {
      _job_crit: null,
      _job_mid: null,
      _job_low: null,
      enums: //include enums.js;
    },
    public: {
      base: {
        process: //include process/process.js;
        ,
        class: //include class/class.js;
        ,
        logger: //include logger.js;
        ,
        file: //include file/file.js;
        ,
        utils: {},
        collections: //include collections/collections.js;
      },
      model: //include class/model.js;
      ,
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

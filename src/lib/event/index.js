/**
 * https://github.com/jeromeetienne/microevent.js
 * MicroEvent - to make any js object an event emitter (server or browser)
 *
 * - pure javascript - server compatible, browser compatible
 * - dont rely on the browser doms
 * - super simple - you get it immediatly, no mistery, no magic involved
 *
 * - create a MicroEventDebug with goodies to debug
 *   - make it safer to use
*/

let MicroEvent	= function(){};
MicroEvent.prototype	= {
  bind(event, fct){
    this._events = this._events || {};
    this._events[event] = this._events[event]	|| [];
    this._events[event].push(fct);
  },
  unbind(event, fct){
    this._events = this._events || {};
    if ( event in this._events === false  )	return;
    this._events[event].splice(this._events[event].indexOf(fct), 1);
  },
  trigger(event /* , args... */){
    this._events = this._events || {};
    if ( event in this._events === false  )	return;
    for (let i = 0; i < this._events[event].length; i++){
      this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
    }
  }
};

/**
 * mixin will delegate all MicroEvent.js function in the destination object
 *
 * - require('MicroEvent').mixin(Foobar) will make Foobar able to use MicroEvent
 *
 * @param {Object} the object which will support MicroEvent
*/
MicroEvent.mixin	= function(destObject){
  let props	= ['bind', 'unbind', 'trigger'];
  for (let i = 0; i < props.length; i ++){
    if ( typeof destObject === 'function' ){
      destObject.prototype[props[i]]	= MicroEvent.prototype[props[i]];
    } else {
      destObject[props[i]] = MicroEvent.prototype[props[i]];
    }
  }
  return destObject;
};

// export in common js
if ( typeof module !== "undefined" && ('exports' in module)){
  module.exports	= MicroEvent;
}

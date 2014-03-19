/*! Infopik v0.0.0 | (c) Hatio, Lab. | MIT License */
!function(t){function e(){var t,e,n=Array.prototype.slice.call(arguments),o=[];"string"==typeof n[0]&&(t=n.shift()),r(n[0])&&(o=n.shift()),e=n.shift(),i[t]=[o,e]}function n(t){function e(e){var n=t.split("/"),i=e.split("/"),o=!1;for(n.pop();".."==i[0]&&n.length;)n.pop(),i.shift(),o=!0;return"."==i[0]&&(i.shift(),o=!0),o&&(i=n.concat(i)),i.join("/")}var r,c,a;return"undefined"==typeof o[t]&&(r=i[t],r&&(a=r[0],c=r[1],o[t]=c.apply(void 0,s(a,function(t){return n(e(t))})))),o[t]}var i={},o={},r=Array.isArray||function(t){return t.constructor==Array},s=Array.map||function(t,e,n){for(var i=0,o=t.length,r=[];o>i;i++)r.push(e.call(n,t[i]));return r};!function(){e("build/Component",["dou"],function(t){"use strict";var e;return e=function(){function t(t){this.type=t,this.__views__=[]}return t.prototype.attach=function(t){return this.__views__.push(t)},t.prototype.detach=function(t){var e;return e=this.__views__.indexOf(t),e>-1?this.__views__.splice(e,1):void 0},t.prototype.attaches=function(){return this.__views__},t}(),t.mixin(e,[t["with"].advice,t["with"].event,t["with"].property,t["with"].lifecycle,t["with"].serialize])})}.call(this),function(){var t={}.hasOwnProperty,n=function(e,n){function i(){this.constructor=e}for(var o in n)t.call(n,o)&&(e[o]=n[o]);return i.prototype=n.prototype,e.prototype=new i,e.__super__=n.prototype,e};e("build/Container",["dou","./Component"],function(t,e){"use strict";var i,o,r,s,c,a,l,u,h;return r=function(t,n){var i;return i=t.__components__.push(n)-1,t.trigger("add",t,n,i),n instanceof e?(n.delegate_on(t),n.trigger("added",t,n,i)):void 0},u=function(t,n){var i;return i=t.__components__.indexOf(n),-1!==i&&(i>-1&&t.__components__.splice(i,1),t.trigger("remove",t,n),n instanceof e)?(n.trigger("removed",t,n),n.delegate_off(t)):void 0},o=function(t){var e,n,i;if(this.__components__||(this.__components__=[]),!(t instanceof Array))return o.call(this,[t]);if(-1===this.__components__.indexOf(e))for(n=0,i=t.length;i>n;n++)e=t[n],r(this,e);return this},l=function(t){var e,n,i;if(!(t instanceof Array))return l.call(this,[t]);if(this.__components__){for(n=0,i=t.length;i>n;n++)e=t[n],u(this,e);return this}},c=function(t){return this.__components__?this.__components__[t]:void 0},s=function(t,e){return this.__components__?this.__components__.forEach(t,e):void 0},a=function(t){return(this.__components__||[]).indexOf(t)},h=function(){return(this.__components__||[]).length},i=function(t){function e(t){e.__super__.constructor.call(this,t)}return n(e,t),e.prototype.add=o,e.prototype.remove=l,e.prototype.size=h,e.prototype.getAt=c,e.prototype.indexOf=a,e.prototype.forEach=s,e}(e),t.mixin(i,[t["with"].advice,t["with"].lifecycle])})}.call(this),function(){e("build/ComponentSelector",["dou","./Component","./Container"],function(t,e,n){"use strict";var i,o,r,s,c,a,l;return o=function(t,e){return t.substr(1)===e.get("id")},r=function(t,e){return t.substr(1)===e.get("name")},s=function(t,e,n,i){switch(t){case"(all)":return!0;case"(self)":return n===e;case"(root)":return i===e;default:return!1}},c=function(t,e){return"all"===t||t===e.type},i=function(t,e,n,i){if("(all)"===t)return!0;switch(t.charAt(0)){case"#":return o(t,e,n,i);case".":return r(t,e,n,i);case"(":return s(t,e,n,i);default:return c(t,e,n,i)}},l=function(t,e,i,o,r,s){return t(e,i,o,r)&&s.push(i),i instanceof n&&i.forEach(function(n){return l(t,e,n,o,r,s)}),s},a=function(t,e,n){var i;return"(root)"===t?[e]:"(self)"===t?[n]:(i=function(){switch(t.charAt(0)){case"#":return o;case".":return r;case"(":return s;default:return c}}(),l(i,t,e,n,e,[]))},{select:a,match:i}})}.call(this),function(){var t={}.hasOwnProperty;e("build/EventPump",["dou","./ComponentSelector"],function(e,n){"use strict";var i,o,r;return o=function(e,i,o,r,s){var c,a,l,u,h;h=[];for(u in o)t.call(o,u)&&(c=o[u],n.match(u,r.origin,i,e)&&h.push(function(){var e;e=[];for(a in c)t.call(c,a)&&(l=c[a],a===r.name&&(r.listener=i,e.push(l.apply(this,s))));return e}.call(this)));return h},r=function(){var t,e,n,i,r,s,c,a;for(t=arguments,e=t[t.length-1],n=this.eventPump,c=n.listeners,a=[],r=0,s=c.length;s>r;r++)i=c[r],a.push(o.call(this.context,n.deliverer,i.listener,i.clonedHandlers,e,t));return a},i=function(){function t(t){this.setDeliverer(t),this.listeners=[]}return t.prototype.setDeliverer=function(t){return this.deliverer=t},t.prototype.start=function(t){return this.deliverer.on("all",r,{context:t||null,eventPump:this})},t.prototype.stop=function(){return this.deliverer.off("all",r)},t.prototype.on=function(t,n){var i,o,r,s,c,a,l,u;for(i=e.util.clone(n),s=Object.keys(i),l=0,u=s.length;u>l;l++)r=s[l],0===r.indexOf("?")&&(o=i[r],a=r.substr(1),c=t.get(a),delete i[r],c?i[c]=o:console.log("EventPump#on","variable "+r+" is not evaluated on listener"));return this.listeners.push({listener:t,handlers:n,clonedHandlers:i})},t.prototype.off=function(t,e){var n,i,o,r,s,c;for(s=this.listeners,c=[],n=o=0,r=s.length;r>o;n=++o)i=s[n],i.listener!==t||e&&i.handlers!==e?c.push(void 0):c.push(this.listeners.splice(n,1));return c},t.prototype.clear=t.listeners=[],t.prototype.despose=function(){return this.stop(),this.clear(),this.deliverer=null},t}()})}.call(this),function(){var t={}.hasOwnProperty;e("build/EventEngine",["dou","./EventPump","./ComponentSelector"],function(e,n,i){"use strict";var o;return o=function(){function e(t){this.eventPumps=[],this.setRoot(t)}return e.prototype.setRoot=function(t){return this.root=t},e.prototype.stop=function(){var t,e,n,i,o;for(i=this.eventPumps,o=[],e=0,n=i.length;n>e;e++)t=i[e],o.push(t.eventPump.stop());return o},e.prototype.add=function(e,o,r){var s,c,a,l,u,h;if(this.root){h=[];for(a in o)t.call(o,a)&&(c=o[a],u=i.select(a,this.root,e),h.push(function(){var t,i,a;for(a=[],t=0,i=u.length;i>t;t++)l=u[t],s=new n(l),s.on(e,c),s.start(r),a.push(this.eventPumps.push({eventPump:s,listener:e,handlerMap:o,target:l}));return a}.call(this)));return h}},e.prototype.remove=function(t,e){var n,i,o,r,s,c;for(s=this.eventPumps,c=[],n=o=0,r=s.length;r>o;n=++o)i=s[n],i.listener!==t||e&&i.handlerMap!==e?c.push(void 0):(this.eventPumps.splice(n,1),c.push(i.eventPump.despose()));return c},e.prototype.clear=function(){var t,e,n,i;for(i=this.eventPumps,e=0,n=i.length;n>e;e++)t=i[e],t.despose();return this.eventPumps=[]},e.prototype.despose=function(){return this.stop(),this.clear()},e}()})}.call(this),function(){var t={}.hasOwnProperty;e("build/EventTracker",["dou"],function(){"use strict";var e,n;return n=function(){function e(e,n,i){var o,r;this.started=!1,e&&(this.target=e),this.handlers=n,i=i||this.target||this,this.boundhandler={};for(o in n)t.call(n,o)&&(r=n[o],"function"==typeof r&&(this.boundhandler[o]=r.bind(i)))}return e.prototype.on=function(){var e,n,i;if(!this.started){i=this.boundhandler;for(e in i)t.call(i,e)&&(n=i[e],this.target.on(e,n));return this.started=!0}},e.prototype.off=function(){var e,n,i;i=this.boundhandler;for(e in i)t.call(i,e)&&(n=i[e],this.target.off(e,n));return this.started=!1},e}(),e=function(){function t(){this.trackers=[]}return t.prototype.setSelector=function(t){return this.selector=t},t.prototype.on=function(t,e,i,o){var r,s,c,a,l,u;for(s=function(){switch(typeof t){case"object":return[t];case"string":return this.selector.select(t,i);default:return[]}}.call(this),s instanceof Array||(s=[s]),u=[],a=0,l=s.length;l>a;a++)r=s[a],c=new n(r,e,{listener:i,deliverer:r,context:o||r}),this.trackers.push(c),u.push(c.on());return u},t.prototype.off=function(t,e){var n,i,o,r,s,c,a,l;for(o=function(){var i,o,s,c;for(s=this.trackers,c=[],n=i=0,o=s.length;o>i;n=++i)r=s[n],t!==r.target||e&&e!==r.handlers||c.push(n);return c}.call(this),a=o.reverse(),l=[],s=0,c=a.length;c>s;s++)i=a[s],l.push(this.trackers.splice(i,1)[0].off());return l},t.prototype.all=function(){var t,e,n,i,o;for(i=this.trackers,o=[],e=0,n=i.length;n>e;e++)t=i[e],o.push(t);return o},t.prototype.despose=function(){var t,e,n,i;for(i=this.trackers,e=0,n=i.length;n>e;e++)t=i[e],t.off();return this.trackers=[],this.selector=null},t.StandAlone=n,t}()})}.call(this),function(){var t={}.hasOwnProperty;e("build/ComponentFactory",["dou","./Component","./Container","./EventEngine","./EventTracker"],function(e,n,i){"use strict";var o;return o=function(){function o(t,e,n){this.componentRegistry=t,this.eventEngine=e,this.eventTracker=n,this.seed=1}return o.prototype.despose=function(){return this.componentRegistry=null,this.eventEngine?this.eventEngine.despose():void 0},o.prototype.uniqueId=function(){return"noid-"+this.seed++},o.prototype.createView=function(e,n){var o,r,s,c,a,l,u;if(c=e.type,s=this.componentRegistry.get(c),!s)throw new Error("Component Spec Not Found for type '"+c+"'");if(l=s.view_factory_fn.call(n,e.getAll()),l.__component__=e,e.attach(l),e instanceof i&&e.forEach(function(t){return l.add(this.createView(t,n))},this),s.view_listener){u=s.view_listener;for(r in u)t.call(u,r)&&(o=u[r],0!==r.indexOf("?")||(a=r.substr(1),r=e.get(a),void 0!==r)?this.eventTracker.on(r,o,l,n):console.log("ComponentFactory#crateView","variable "+r+" is not evaluated on listener"))}return l},o.prototype.createComponent=function(t,o){var r,s,c,a,l,u,h,p,f;if(c=this.componentRegistry.get(t.type),!c)throw new Error("Component Spec Not Found for type '"+t.type+"'");if(c.containable){if(s=new i(t.type),c.components)for(p=c.components,a=0,u=p.length;u>a;a++)r=p[a],s.add(this.createComponent(r,o));if(t.components)for(f=t.components,l=0,h=f.length;h>l;l++)r=f[l],s.add(this.createComponent(r,o))}else s=new n(t.type);return s.initialize(e.util.shallow_merge(c.defaults||{},t.attrs||{})),s.get("id")||s.set("id",this.uniqueId()),c.controller&&this.eventEngine.add(s,c.controller,o),s},o}()})}.call(this),function(){e("build/Command",["dou"],function(t){"use strict";var e;return e=function(){function e(e){this.params=t.util.clone(e)}return e.prototype.execute=function(){},e.prototype.unexecute=function(){},e}()})}.call(this),function(){e("build/CommandManager",["./Command"],function(t){"use strict";var e;return e=function(){function e(){this.reset()}return e.prototype.despose=function(){return this.reset()},e.prototype.execute=function(e){return!e instanceof t?void 0:(e.execute(),this.exq.push(e),this.uxq=[])},e.prototype.undo=function(){var t;return t=this.exq.pop(),t?(t.unexecute(),this.uxq.push(t)):void 0},e.prototype.redo=function(){var t;return t=this.uxq.pop(),t?(t.execute(),this.exq.push(t)):void 0},e.prototype.undoable=function(){return this.exq.length>0},e.prototype.redoable=function(){return this.uxq.length>0},e.prototype.reset=function(){return this.exq=[],this.uxq=[]},e}()})}.call(this),function(){var t={}.hasOwnProperty;e("build/EventController",["dou","./ComponentSelector"],function(e,n){"use strict";var i,o,r;return o=function(e,i,o){var r,s,c,a,l;l=[];for(a in e)t.call(e,a)&&(r=e[a],n.match(a,i.origin)&&l.push(function(){var e;e=[];for(s in r)t.call(r,s)&&(c=r[s],s===i.name&&e.push(c.apply(this,o)));return e}.call(this)));return l},r=function(){var t,e;return t=arguments,e=t[t.length-1],this.controllers.forEach(function(n){return o.call(this,n,e,t)},this.context)},i=function(){function t(t){this.setTarget(t)}return t.prototype.setTarget=function(t){return this.target=t},t.prototype.start=function(t){return this.target.on("all",r,{context:t||null,controllers:this})},t.prototype.stop=function(){return this.target.off("all",r)},t.prototype.despose=function(){return this.stop(),this.clear(),this.target=null},t}(),e.mixin(i,e["with"].collection.withList),i})}.call(this),function(){var t={}.hasOwnProperty;e("build/ComponentRegistry",["dou","./EventController"],function(e){"use strict";var n;return n=function(){function n(){this.componentSpecs={}}return n.prototype.despose=function(){var t,e,n,i,o;for(t=Object.keys(this.componentSpecs),o=[],n=0,i=t.length;i>n;n++)e=t[n],o.push(this.unregister(e));return o},n.prototype.setRegisterCallback=function(t,e){return this.callback_register="function"==typeof t?t.bind(e):void 0},n.prototype.setUnregisterCallback=function(t,e){return this.callback_unregister="function"==typeof t?t.bind(e):void 0},n.prototype.register=function(t){var e,n,i;if(!this.componentSpecs[t.type]){if(t.dependencies){i=t.dependencies;for(n in i)e=i[n],this.register(e)}return this.componentSpecs[t.type]=t,this.callback_register?this.callback_register(t):void 0}},n.prototype.unregister=function(t){var e;return(e=this.componentSpecs[t])?(delete this.componentSpecs[t],this.callback_unregister&&this.callback_unregister(e),e):void 0},n.prototype.forEach=function(e,n){var i,o,r,s;r=this.componentSpecs,s=[];for(i in r)t.call(r,i)&&(o=r[i],s.push(e.call(n,i,o)));return s},n.prototype.list=function(){return Object.keys(this.componentSpecs).map(function(t){return this.componentSpecs[t]},this)},n.prototype.get=function(t){var n;return n=this.componentSpecs[t],n?e.util.clone(this.componentSpecs[t]):null},n}()})}.call(this),function(){e("build/SelectionManager",["dou"],function(t){"use strict";var e;return e=function(){function e(t){this.onselectionchange=t.onselectionchange,this.context=t.context,this.selections=[]}return e.prototype.focus=function(e){var n,i;return e?(n=this.selections.indexOf(e),n>-1?(i=t.util.clone(this.selections),this.selections.splice(n,1),this.selections.unshift(e),this.onselectionchange?this.onselectionchange.call(this.context,{added:[],removed:[],before:i,after:this.selections}):void 0):this.toggle(e)):this.selections[0]},e.prototype.get=function(){return t.util.clone(this.selections)},e.prototype.toggle=function(e){var n,i,o,r;if(e)return o=t.util.clone(this.selections),i=this.selections.indexOf(e),i>-1?r=this.selections.splice(i,1):(n=[e],this.selections.unshift(e)),this.onselectionchange?this.onselectionchange.call(this.context,{added:n||[],removed:r||[],before:o,after:this.selections}):void 0},e.prototype.select=function(e){var n,i,o,r;return o=t.util.clone(this.selections),e instanceof Array||(e=e?[e]:[]),this.selections=e,n=function(){var t,e,n,r;for(n=this.selections,r=[],t=0,e=n.length;e>t;t++)i=n[t],-1===o.indexOf(i)&&r.push(i);return r}.call(this),r=function(){var t,e,n;for(n=[],t=0,e=o.length;e>t;t++)i=o[t],-1===this.selections.indexOf(i)&&n.push(i);return n}.call(this),this.onselectionchange?this.onselectionchange.call(this.context,{added:n,removed:r,before:o,after:this.selections}):void 0},e.prototype.reset=function(){var t;return t=this.selections,this.selections=[],t.length>0&&this.onselectionchange?this.onselectionchange.call(this.context,{added:[],removed:t,before:t,after:this.selections}):void 0},e}()})}.call(this),function(){e("build/ComponentSpec",["dou"],function(){"use strict";var t;return t=function(){function t(t){this.urn=t.urn,this.name=t.name,this.description=t.description,this.defaults=t.defaults,this.view_factory=t.view_factory,this.handle_factory=t.handle_factory,this.toolbox_image=t.toolbox_image}return t}()})}.call(this),function(){e("build/spec/SpecInfographic",["dou","KineticJS"],function(t,e){"use strict";var n,i;return i=function(t){return new e.Group(t)},n=function(t){return new Kin.Group(t)},{type:"infographic",name:"infographic",containable:!0,container_type:"container",description:"Infographic Specification",defaults:{draggable:!1},view_factory_fn:i,handle_factory_fn:n,toolbox_image:"images/toolbox_infographic.png"}})}.call(this),function(){var t={}.hasOwnProperty,n=function(e,n){function i(){this.constructor=e}for(var o in n)t.call(n,o)&&(e[o]=n[o]);return i.prototype=n.prototype,e.prototype=new i,e.__super__=n.prototype,e};e("build/command/CommandPropertyChange",["dou","../Command"],function(t,e){"use strict";var i;return i=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return n(e,t),e.prototype.execute=function(){var t,e,n,i,o;for(i=this.params.changes,o=[],e=0,n=i.length;n>e;e++)t=i[e],t.property?o.push(t.component.set(t.property,t.after)):o.push(t.component.set(t.after));return o},e.prototype.unexecute=function(){var t,e,n,i,o;for(i=this.params.changes,o=[],e=0,n=i.length;n>e;e++)t=i[e],t.property?o.push(t.component.set(t.property,t.before)):o.push(t.component.set(t.before));return o},e}(e)})}.call(this),function(){e("build/spec/SpecContentEditLayer",["dou","KineticJS","../EventTracker","../ComponentSelector","../command/CommandPropertyChange"],function(t,e,n,i,o){"use strict";var r,s,c,a,l,u,h,p,f,d,g,y;return s=function(t){var n,i,o,r;return r=this.getView().getStage(),o=t.offset||{x:0,y:0},i=new e.Layer(t),n=new e.Rect({draggable:!0,listening:!0,x:0,y:0,width:Math.min(r.width()+o.x,r.width()),height:Math.min(r.height()+o.y,r.height()),stroke:t.stroke,fill:"cyan"}),i.add(n),i.__background__=n,i},c=function(){},g=function(){},l=function(t,e,n){var i;return i=n.listener,e&&i.remove(e),t?i.add(t):void 0},u=function(t){return console.log("selection-changed",t)},a=function(){},d=function(t){var n,i,o,r,s,c;return i=this.listener,n=i.__background__,s=t.targetNode,this.context.selectionManager.select(s),t.targetNode&&t.targetNode!==n?void 0:(o=i.offset(),n.setAttrs({x:o.x+20,y:o.y+20}),this.start_point={x:t.offsetX,y:t.offsetY},this.origin_offset=i.offset(),c={x:this.start_point.x+this.origin_offset.x,y:this.start_point.y+this.origin_offset.y},r="MOVE","SELECT"===r&&(this.selectbox=new e.Rect({stroke:"black",strokeWidth:1,dash:[3,3]}),i.add(this.selectbox),this.selectbox.setAttrs(c)),i.draw(),t.cancelBubble=!0)},f=function(t){var e,n,i,o,r;return n=this.listener,e=n.__background__,t.targetNode&&t.targetNode!==e?void 0:(i="MOVE","SELECT"===i?(e.setAttrs({x:this.origin_offset.x+20,y:this.origin_offset.y+20}),this.selectbox.setAttrs({width:t.offsetX-this.start_point.x,height:t.offsetY-this.start_point.y})):"MOVE"===i&&(o=this.origin_offset.x-(t.offsetX-this.start_point.x),r=this.origin_offset.y-(t.offsetY-this.start_point.y),n.offset({x:o,y:r}),e.setAttrs({x:o+20,y:r+20}),n.fire("change-offset",{x:o,y:r},!1)),n.batchDraw(),t.cancelBubble=!0)},p=function(t){var e,n,i,r,s,c,a,l,u;return e=this.context,a=t.targetNode,r=a.__component__,console.log(a.offset()),r&&(i=new o({changes:[{component:r,before:{x:r.get("x"),y:r.get("y")},after:{x:a.x(),y:a.y()}}]}),e.execute(i)),s=this.listener,n=s.__background__,t.targetNode&&t.targetNode!==n?void 0:(c="MOVE","SELECT"===c?(n.setAttrs({x:this.origin_offset.x+20,y:this.origin_offset.y+20}),this.selectbox.remove(),delete this.selectbox):"MOVE"===c&&(l=Math.max(this.origin_offset.x-(t.offsetX-this.start_point.x),-20),u=Math.max(this.origin_offset.y-(t.offsetY-this.start_point.y),-20),s.offset({x:l,y:u}),n.setAttrs({x:l+20,y:u+20}),s.fire("change-offset",{x:l,y:u},!1)),s.draw(),t.cancelBubble=!0)},h=function(t){var e;return e=t.targetNode,this.context.selectionManager.select(e)},r={"(root)":{"(root)":{"change-model":l,"change-selections":u}},"(self)":{"(self)":{added:c,removed:g},"(all)":{change:a}}},y={"(self)":{dragstart:d,dragmove:f,dragend:p,click:h}},{type:"content-edit-layer",name:"content-edit-layer",containable:!0,container_type:"layer",description:"Selection Edit Layer Specification",defaults:{listening:!0,draggable:!1},controller:r,view_listener:y,view_factory_fn:s,toolbox_image:"images/toolbox_content_edit_layer.png"}})}.call(this),function(){e("build/spec/SpecGuideLayer",["KineticJS"],function(t){"use strict";var e,n,i,o,r,s,c,a,l;return n=function(e){return new t.Layer(e)},o=function(e,n,i,o){var r,s,c,a;return r=o.listener,r._track||(r._track={}),a=r._track,a.view||(a.view=o.listener.attaches()[0]),s=a.view,a.changes=(a.changes||0)+1,a.text||(a.text=new t.Text({x:10,y:10,listening:!1,fontSize:12,fontFamily:"Calibri",fill:"green"}),s.add(a.text)),c="[ PropertyChange ] "+e.type+" : "+e.get("id")+"\n[ Before ] "+JSON.stringify(n)+"\n[ After ] "+JSON.stringify(i),a.text.setAttr("text",c),s.draw(),setTimeout(function(){var e;if(!(--a.changes>0))return e=new Kinetic.Tween({node:a.text,opacity:0,duration:1,easing:t.Easings.EaseOut}),e.play(),setTimeout(function(){return a.changes>0?(e.reset(),e.destroy(),void 0):(e.finish(),e.destroy(),a.text.remove(),delete a.text,s.draw())},1e3)},5e3)},c=function(e){var n,i,o,r,s,c,a,l,u;return i=this.listener,n=this.context,a=i.getStage(),this.width=a.getWidth(),this.height=a.getHeight(),this.mouse_origin={x:e.x,y:e.y},r=e.targetNode,this.node_origin=r.getAbsolutePosition(),o=i.offset(),s=this.node_origin.x+o.x,c=this.node_origin.y+o.y,this.vert=new t.Line({stroke:"red",tension:1,points:[s,0,s,this.height]}),this.hori=new t.Line({stroke:"red",tension:1,points:[0,c,this.width,c]}),this.text=new t.Text({listening:!1,fontSize:12,fontFamily:"Calibri",fill:"green"}),this.text.setAttr("text","[ "+s+"("+r.x()+"), "+c+"("+r.y()+") ]"),l=Math.max(s,0)>this.text.width()+10?s-(this.text.width()+10):Math.max(s+10,10),u=Math.max(c,0)>this.text.height()+10?c-(this.text.height()+10):Math.max(c+10,10),this.text.setAttrs({x:l,y:u}),i=i,i.add(this.vert),i.add(this.hori),i.add(this.text),i.batchDraw()},s=function(t){var e,n,i,o,r,s,c,a,l,u;return e=this.listener,o={x:t.x-this.mouse_origin.x+this.node_origin.x,y:t.y-this.mouse_origin.y+this.node_origin.y},l=10*Math.round(o.x/10),u=10*Math.round(o.y/10),i=t.targetNode,i.setAbsolutePosition({x:l,y:u}),n=e.offset(),r=l+n.x,s=u+n.y,this.vert.setAttrs({points:[r,0,r,this.height]}),this.hori.setAttrs({points:[0,s,this.width,s]}),this.text.setAttr("text","[ "+r+"("+i.x()+"), "+s+"("+i.y()+") ]"),c=Math.max(r,0)>this.text.width()+10?r-(this.text.width()+10):Math.max(r+10,10),a=Math.max(s,0)>this.text.height()+10?s-(this.text.height()+10):Math.max(s+10,10),this.text.setAttrs({x:c,y:a}),e.draw()},r=function(){var t;return t=this.listener,this.vert.remove(),this.hori.remove(),this.text.remove(),t.draw()},i=function(){},a=function(){var t;return t=this.getView(),this.getEventHandler().off(t,guide_handler)},e={"(root)":{"(all)":{change:o}},"(self)":{"(self)":{added:i,removed:a}}},l={"(root)":{dragstart:c,dragmove:s,dragend:r}},{type:"guide-layer",name:"guide-layer",containable:!0,container_type:"layer",description:"Editing Guide Specification",defaults:{draggable:!1},controller:e,view_listener:l,view_factory_fn:n,toolbox_image:"images/toolbox_guide_layer.png"}})}.call(this),function(){e("build/spec/SpecRulerLayer",["dou","KineticJS"],function(t,e){"use strict";var n,i,o;return n=function(t){return new e.Layer(t)},i=function(t){var e,n;return n=this.listener,n.__hori__||(e=n.getChildren().toArray(),n.__hori__=e[0],n.__vert__=e[1]),n.__hori__.setAttr("zeropos",-t.x),n.__vert__.setAttr("zeropos",-t.y),n.batchDraw()},o={"?offset_monitor_target":{"change-offset":i}},{type:"ruler-layer",name:"ruler-layer",containable:!0,container_type:"layer",description:"Ruler Layer Specification",defaults:{draggable:!1},view_listener:o,view_factory_fn:n,components:[{type:"ruler",attrs:{direction:"horizontal",margin:[20,0],opacity:.8,x:0,y:0,width:1e3,height:20,zeropos:20}},{type:"ruler",attrs:{direction:"vertical",margin:[20,0],opacity:.8,x:0,y:0,width:20,height:1e3,zeropos:20}}],toolbox_image:"images/toolbox_ruler_layer.png"}})}.call(this),function(){e("build/spec/SpecHandleLayer",["dou","KineticJS"],function(t,e){"use strict";var n,i,o,r,s,c,a;return i=function(t){var n;return n=new e.Layer(t),n.handles={},n},o=function(t){var e;return e=this.listener,e.offset({x:t.x,y:t.y}),e.batchDraw()},c=function(t){var e,n,i;return i=this.listener,n=t.targetNode.getAttr("id"),e=i.handles[n],e?(e.setAbsolutePosition(t.targetNode.getAbsolutePosition()),i.batchDraw()):void 0},s=function(t){var e,n,i;return i=this.listener,n=t.targetNode.getAttr("id"),e=i.handles[n],e?(e.setAbsolutePosition(t.targetNode.getAbsolutePosition()),i.draw()):void 0},r=function(t,e,n,i,o){var r,s,c,a,l,u,h,p,f,d,g,y;for(r=o.listener,u=r.attaches()[0],f=0,g=i.length;g>f;f++)h=i[f],l=h.getAttr("id"),s=u.handles[l],c=s.__component__,r.remove(c),delete u.handles[l];for(d=0,y=n.length;y>d;d++)h=n[d],l=h.getAttr("id"),p=h.getAbsolutePosition(),c=this.createComponent({type:"handle-checker",attrs:{}}),r.add(c),a=c.attaches()[0],a.setAbsolutePosition(p),u.handles[l]=a;return u.batchDraw()},n={"(root)":{"(root)":{"change-selections":r}}},a={"?offset_monitor_target":{"change-offset":o,dragmove:c,dragend:s}},{type:"handle-layer",name:"handle-layer",containable:!0,container_type:"layer",description:"Handle Layer Specification",defaults:{draggable:!1},controller:n,view_listener:a,view_factory_fn:i,toolbox_image:"images/toolbox_handle_layer.png"}})}.call(this),function(){e("build/spec/SpecGroup",["dou","KineticJS"],function(t,e){"use strict";var n,i,o;return o=function(t){return t.targetNode&&t.targetNode!==this.__background__?void 0:t.targetNode=this},i=function(n){var i,r;return r=new e.Group(n),i=new e.Rect(t.util.shallow_merge({},n,{draggable:!1,listening:!0,x:0,y:0,id:void 0})),r.add(i),n.draggable&&(r.on("dragstart dragmove dragend",o),r.__background__=i),r},n=function(t){return new Kin.Group(t)},{type:"group",name:"group",containable:!0,container_type:"container",description:"Group Specification",defaults:{width:100,height:50,stroke:"black",strokeWidth:4,draggable:!0,listening:!0,opacity:1},view_factory_fn:i,handle_factory_fn:n,toolbox_image:"images/toolbox_group.png"}})}.call(this),function(){e("build/spec/SpecRect",["KineticJS"],function(t){"use strict";var e,n;return n=function(e){return new t.Rect(e)},e=function(t){return new Kin.Rect(t)},{type:"rectangle",name:"rectangle",description:"Rectangle Specification",defaults:{width:100,height:50,fill:"green",stroke:"black",strokeWidth:4},view_factory_fn:n,handle_factory_fn:e,toolbox_image:"images/toolbox_rectangle.png"}})}.call(this),function(){e("build/spec/SpecRing",["KineticJS"],function(t){"use strict";var e,n;return n=function(e){return new t.Ring(e)},e=function(t){return new Kin.Ring(t)},{type:"ring",name:"ring",description:"Ring Specification",defaults:{innerRadius:40,outerRadius:80,fill:"red",stroke:"black",strokeWidth:5},view_factory_fn:n,handle_factory_fn:e,toolbox_image:"images/toolbox_ring.png"}})}.call(this),function(){e("build/spec/SpecRuler",["KineticJS"],function(){"use strict";var t,e,n,i,o,r;return t=3.779527559,o=function(e){var n,i,o,r,s,c,a,l,u,h,p,f,d,g,y,_,v,m,w,x;for(h=parseInt(this.getAttr("zeropos")),r=this.getAttr("margin")[0],s=this.width()-this.getAttr("margin")[1],n=this.height()-15,i=this.height(),e.beginPath(),e.moveTo(0,0),e.lineTo(0,this.height()),e.lineTo(this.width(),this.height()),e.lineTo(this.width(),0),e.lineTo(0,0),u=this.width()-h,l=Math.ceil(u/t),o=f=0,_=l-1;(_>=0?_>=f:f>=_)&&(p=h+o*t,!(p>s));o=_>=0?++f:--f)r>p||(0===o%10?(e.moveTo(p,n),e.lineTo(p,i)):0===o%5?(e.moveTo(p,n+8),e.lineTo(p,i)):(e.moveTo(p,n+11),e.lineTo(p,i)));for(a=h,c=Math.floor(a/t),o=d=1,v=c-1;(v>=1?v>=d:d>=v)&&(p=h-o*t,!(r>p));o=v>=1?++d:--d)p>s||(0===o%10?(e.moveTo(p,n),e.lineTo(p,i)):0===o%5?(e.moveTo(p,n+8),e.lineTo(p,i)):(e.moveTo(p,n+11),e.lineTo(p,i)));for(e.closePath(),e.fillStrokeShape(this),o=g=0,m=l-1;m>=g&&(p=h+o*t,!(p>s));o=g+=10)r>p||e.strokeText(""+o/10,p+2,n+10);for(x=[],o=y=10,w=c-1;w>=y&&(p=h-o*t,!(r>p));o=y+=10)p>s||x.push(e.strokeText("-"+o/10,p+2,n+10));return x},r=function(e){var n,i,o,r,s,c,a,l,u,h,p,f,d,g,y,_,v,m,w,x;for(h=parseInt(this.getAttr("zeropos")),s=this.getAttr("margin")[0],r=this.height()-this.getAttr("margin")[1],n=this.width()-15,i=this.width(),e.beginPath(),e.moveTo(0,0),e.lineTo(0,this.height()),e.lineTo(this.width(),this.height()),e.lineTo(this.width(),0),e.lineTo(0,0),l=this.height()-h,u=Math.ceil(l/t),o=f=0,_=u-1;(_>=0?_>=f:f>=_)&&(p=h+o*t,!(p>r));o=_>=0?++f:--f)s>p||(0===o%10?(e.moveTo(n,p),e.lineTo(i,p)):0===o%5?(e.moveTo(n+8,p),e.lineTo(i,p)):(e.moveTo(n+11,p),e.lineTo(i,p)));for(c=h,a=Math.floor(c/t),o=d=1,v=a-1;v>=1?v>=d:d>=v;o=v>=1?++d:--d)if(p=h-o*t,!(p>r)){if(s>p)break;0===o%10?(e.moveTo(n,p),e.lineTo(i,p)):0===o%5?(e.moveTo(n+8,p),e.lineTo(i,p)):(e.moveTo(n+11,p),e.lineTo(i,p))}for(e.closePath(),e.fillStrokeShape(this),o=g=0,m=u-1;m>=g&&(p=h+o*t,!(p>r));o=g+=10)s>p||e.strokeText(""+o/10,1,p+10);for(x=[],o=y=10,w=a-1;w>=y&&(p=h-o*t,!(s>p));o=y+=10)p>r||x.push(e.strokeText("-"+o/10,1,p+10));return x},i=function(){return"vertical"!==this.getAttr("direction")?o.apply(this,arguments):r.apply(this,arguments)},n=function(t){return new Kinetic.Shape(t)},e=function(t){return new Kin.Rect(t)},{type:"ruler",name:"ruler",description:"Ruler Specification",defaults:{drawFunc:i,fill:"#848586",stroke:"#C2C3C5",strokeWidth:.5,width:100,height:50,margin:[15,15],zeropos:15,direction:"horizontal",font:"8px Verdana"},view_factory_fn:n,handle_factory_fn:e,toolbox_image:"images/toolbox_ruler.png"}})}.call(this),function(){e("build/spec/SpecImage",["KineticJS"],function(t){"use strict";var e,n,i,o;return i=function(e){var n,i;return n=new t.Image(e),i=new Image,i.onload=function(){return n.getLayer().draw()},i.src=e.url,n.setImage(i),n},n=function(t){return new Kin.Image(t)},e={"(self)":{"(self)":{change:function(t,e,n){var i;if(e.url||n.url)return i=t.attaches()[0].getImage(),i.src=n.url}}}},o={"(self)":{click:function(){return this.count=this.count?++this.count:1,this.count%2?this.listener.__component__.set("url","http://www.baidu.com/img/bdlogo.gif"):this.listener.__component__.set("url","http://i.cdn.turner.com/cnn/.e/img/3.0/global/header/intl/CNNi_Logo.png")}}},{type:"image",name:"image",description:"Image Specification",defaults:{width:100,height:50,stroke:"black",strokeWidth:1,rotationDeg:0,draggable:!0},controller:e,view_listener:o,view_factory_fn:i,handle_factory_fn:n,toolbox_image:"images/toolbox_image.png"}})}.call(this),function(){e("build/spec/SpecText",["KineticJS"],function(t){"use strict";var e,n;return n=function(e){return new t.Text(e)},e=function(t){return new Kin.Text(t)},{type:"text",name:"text",description:"Text Specification",defaults:{width:"auto",height:"auto",draggable:!0,strokeWidth:1,fontSize:40,fontFamily:"Arial",fontStyle:"normal",fill:"black",stroke:"black",text:"TEXT",rotationDeg:0},view_factory_fn:n,handle_factory_fn:e,toolbox_image:"images/toolbox_text.png"}})}.call(this),function(){e("build/spec/SpecStar",["KineticJS"],function(t){"use strict";var e,n;return n=function(e){return new t.Star(e)},e=function(t){return new Kin.Star(t)},{type:"star",name:"star",description:"Star Specification",defaults:{width:100,height:50,numPoints:5,innerRadius:35,outerRadius:70,fill:"red",stroke:"black",strokeWidth:4},view_factory_fn:n,handle_factory_fn:e,toolbox_image:"images/toolbox_star.png"}})}.call(this),function(){e("build/handle/HandleChecker",["KineticJS"],function(t){"use strict";var e,n;return n=function(e){return new t.Rect(e)},e=function(t){return new Kin.Rect(t)},{type:"handle-checker",name:"handle-checker",description:"Checker Handle Specification",defaults:{width:10,height:10,fill:"red",stroke:"black",strokeWidth:2},view_factory_fn:n,handle_factory_fn:e,toolbox_image:"images/toolbox_handle_checker.png"}})}.call(this),function(){e("build/spec/SpecPainter",["KineticJS","./SpecInfographic","./SpecContentEditLayer","./SpecGuideLayer","./SpecRulerLayer","./SpecHandleLayer","./SpecGroup","./SpecRect","./SpecRing","./SpecRuler","./SpecImage","./SpecText","./SpecStar","../handle/HandleChecker"],function(t,e,n,i,o,r,s,c,a,l,u,h,p,f){"use strict";var d,g;return g=function(e){return new t.Stage(e)},d={type:"painter-app",name:"painter-app",containable:!0,container_type:"application",description:"Painter Application Specification",defaults:{},controller:d,view_factory_fn:g,dependencies:{infographic:e,"content-edit-layer":n,"guide-layer":i,"ruler-layer":o,"handle-layer":r,group:s,rect:c,ring:a,ruler:l,image:u,text:h,star:p,"handle-checker":f},layers:[{type:"content-edit-layer",attrs:{offset:{x:-20,y:-20}}},{type:"handle-layer",attrs:{offset_monitor_target:"content-edit-layer",offset:{x:-20,y:-20}}},{type:"guide-layer",attrs:{offset:{x:-20,y:-20}}},{type:"ruler-layer",attrs:{offset_monitor_target:"content-edit-layer"}}],toolbox_image:"images/toolbox_painter_app.png"}})}.call(this),function(){e("build/spec/SpecContentViewLayer",["KineticJS","../EventTracker","../ComponentSelector","../command/CommandPropertyChange"],function(t){"use strict";var e,n,i,o,r,s,c;return n=function(e){return new t.Layer(e)
},i=function(){},s=function(){},r=function(t,e){var n,i,o,r,s;for(r=this.findComponent("content-view-layer"),s=[],i=0,o=r.length;o>i;i++)n=r[i],e&&n.remove(e),t&&n.add(t),s.push(this.findView("#"+n.get("id")));return s},o=function(t,e,n){var i;return i=this.findViewByComponent(t),i.setAttrs(n),this.drawView()},e={"(root)":{"(root)":{"change-model":r}},"(self)":{"(all)":{change:o},"(self)":{change:o}}},c={click:function(t){var e;return e=t.targetNode,this.selectionManager.select(e)}},{type:"content-view-layer",name:"content-view-layer",containable:!0,container_type:"layer",description:"Content View Layer Specification",defaults:{},controller:e,view_listener:c,view_factory_fn:n,toolbox_image:"images/toolbox_content_view_layer.png"}})}.call(this),function(){e("build/spec/SpecPresenter",["KineticJS","./SpecInfographic","./SpecContentViewLayer","./SpecGroup","./SpecRect","./SpecRing","./SpecRuler"],function(t,e,n,i,o,r,s){"use strict";var c,a;return a=function(e){return new t.Stage(e)},c={type:"presenter-app",name:"presenter-app",containable:!0,container_type:"application",description:"Presenter Application Specification",defaults:{},controller:c,view_factory_fn:a,dependencies:{infographic:e,"content-view-layer":n,group:i,rect:o,ring:r,ruler:s},layers:[{type:"content-view-layer",attrs:{}}],toolbox_image:"images/toolbox_presenter_app.png"}})}.call(this),function(){e("build/ApplicationContext",["dou","KineticJS","./Component","./Container","./EventEngine","./EventTracker","./ComponentFactory","./Command","./CommandManager","./ComponentRegistry","./ComponentSelector","./SelectionManager","./ComponentSpec","./spec/SpecPainter","./spec/SpecPresenter","./spec/SpecInfographic"],function(t,e,n,i,o,r,s,c,a,l,u,h){"use strict";var p;return p=function(){function t(t){var e,n,i,c,p,f,d,g;if(this.application_spec=t.application_spec,i=t.container,"string"!=typeof i)throw new Error("container is a mandatory string type option.");if(!this.application_spec)throw new Error("application_spec is a mandatory option");if(this.commandManager=new a,this.selectionManager=new h({onselectionchange:this.onselectionchange,context:this}),this.compEventTracker=new r,this.viewEventTracker=new r,this.eventEngine=new o,this.componentRegistry=new l,this.componentRegistry.setRegisterCallback(function(){},this),this.componentRegistry.setUnregisterCallback(function(){},this),this.componentFactory=new s(this.componentRegistry,this.eventEngine,this.viewEventTracker),this.componentRegistry.register(this.application_spec),e={id:"application",container:t.container,width:t.width,height:t.height},this.application=this.componentFactory.createComponent({type:this.application_spec.type,attrs:e},this),this.view=this.componentFactory.createView(this.application,this),this.eventEngine.setRoot(this.application),p=this.view,c=this.application,this.compEventTracker.setSelector({select:function(t,e){return CompoentSelector.select(t,c,e)}}),this.viewEventTracker.setSelector({select:function(t,e){var n,i,o,r,s,a,l,h,f;if("(self)"===t)return e;if("(root)"===t)return p;for(i=u.select(t,c),r=[],s=0,l=i.length;l>s;s++)for(n=i[s],f=n.attaches(),a=0,h=f.length;h>a;a++)o=f[a],r.push(o);return r}}),this.application.on("add",this.onadd,this),this.application.on("remove",this.onremove,this),this.application_spec.layers)for(g=this.application_spec.layers,f=0,d=g.length;d>f;f++)n=g[f],this.application.add(this.componentFactory.createComponent(n,this))}return t.prototype.despose=function(){return this.compEventTracker.despose(),this.eventController.despose(),this.eventRegistry.despose(),this.componentFactory.despose()},t.prototype.getEventTracker=function(){return this.compEventTracker},t.prototype.getView=function(){return this.view},t.prototype.getModel=function(){return this.model},t.prototype.setModel=function(t){var e;return e=this.model,this.model=t,this.application.trigger("change-model",this.model,e)},t.prototype.getController=function(){return this.eventController},t.prototype.getApplication=function(){return this.application},t.prototype.findComponent=function(t){return u.select(t,this.application)},t.prototype.findView=function(t){return this.view.find(t)},t.prototype.findViewByComponent=function(t){return this.view.find("#"+t.get("id"))},t.prototype.createView=function(t){return this.componentFactory.createView(t,this)},t.prototype.createComponent=function(t){return this.componentFactory.createComponent(t,this)},t.prototype.drawView=function(){return this.view.draw()},t.prototype.execute=function(t){return this.commandManager.execute(t)},t.prototype.onadd=function(t,e){var n,i;return i=t===this.application?this.view:this.findViewByComponent(t),n=this.createView(e),i.add(n),this.drawView()},t.prototype.onremove=function(t,e){var n;return console.log("removed",t,e),n=this.findViewByComponent(e),n.destroy(),this.drawView()},t.prototype.onselectionchange=function(t){return this.application.trigger("change-selections",t.after,t.before,t.added,t.removed)},t}()})}.call(this),function(){e("build/infopik",["./ApplicationContext"],function(t){"use strict";return{app:function(e){return new t(e)}}})}.call(this),t.infopik=n("build/infopik")}(this);
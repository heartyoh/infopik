/*! Infopik v0.0.0 | (c) Hatio, Lab. | MIT License */
!function(t){function e(){var t,e,n=Array.prototype.slice.call(arguments),r=[];"string"==typeof n[0]&&(t=n.shift()),i(n[0])&&(r=n.shift()),e=n.shift(),o[t]=[r,e]}function n(t){function e(e){var n=t.split("/"),o=e.split("/"),r=!1;for(n.pop();".."==o[0]&&n.length;)n.pop(),o.shift(),r=!0;return"."==o[0]&&(o.shift(),r=!0),r&&(o=n.concat(o)),o.join("/")}var i,c,a;return"undefined"==typeof r[t]&&(i=o[t],i&&(a=i[0],c=i[1],r[t]=c.apply(void 0,s(a,function(t){return n(e(t))})))),r[t]}var o={},r={},i=Array.isArray||function(t){return t.constructor==Array},s=Array.map||function(t,e,n){for(var o=0,r=t.length,i=[];r>o;o++)i.push(e.call(n,t[o]));return i};!function(){e("src/Component",["dou"],function(t){"use strict";var e;return e=function(){function t(t){this.type=t}return t}(),t.mixin(e,[t["with"].advice,t["with"].event,t["with"].property,t["with"].lifecycle,t["with"].serialize])})}.call(this),function(){var t={}.hasOwnProperty,n=function(e,n){function o(){this.constructor=e}for(var r in n)t.call(n,r)&&(e[r]=n[r]);return o.prototype=n.prototype,e.prototype=new o,e.__super__=n.prototype,e};e("src/Container",["dou","./Component"],function(t,e){"use strict";var o,r,i,s,c,a,p,u,h;return i=function(t,n){var o;return o=t.__components__.push(n)-1,t.trigger("add",t,n,o),n instanceof e?(n.delegate_on(t),n.trigger("added",t,n,o)):void 0},u=function(t,n){var o;return o=t.__components__.indexOf(n),-1!==o&&(o>-1&&t.__components__.splice(o,1),t.trigger("remove",t,n),n instanceof e)?(n.trigger("removed",t,n),n.delegate_off(t)):void 0},r=function(t){var e,n,o;if(this.__components__||(this.__components__=[]),!(t instanceof Array))return r.call(this,[t]);if(-1===this.__components__.indexOf(e))for(n=0,o=t.length;o>n;n++)e=t[n],i(this,e);return this},p=function(t){var e,n,o;if(!(t instanceof Array))return p.call(this,[t]);if(this.__components__){for(n=0,o=t.length;o>n;n++)e=t[n],u(this,e);return this}},c=function(t){return this.__components__?this.__components__[t]:void 0},s=function(t,e){return this.__components__?this.__components__.forEach(t,e):void 0},a=function(t){return(this.__components__||[]).indexOf(t)},h=function(){return(this.__components__||[]).length},o=function(t){function e(t){e.__super__.constructor.call(this,t)}return n(e,t),e.prototype.add=r,e.prototype.remove=p,e.prototype.size=h,e.prototype.getAt=c,e.prototype.indexOf=a,e.prototype.forEach=s,e}(e),t.mixin(o,[t["with"].advice,t["with"].lifecycle])})}.call(this),function(){e("src/ComponentSelector",["dou","./Component","./Container"],function(t,e,n){"use strict";var o,r,i,s,c,a;return r=function(t,e){return t.substr(1)===e.get("id")},i=function(t,e){return t.substr(1)===e.get("name")},s=function(t,e){return"all"===t||t===e.type},o=function(t,e){switch(t.charAt(0)){case"#":return r(t,e);case".":return i(t,e);default:return s(t,e)}},a=function(t,e,o,r){return t(e,o)&&r.push(o),o instanceof n&&o.forEach(function(n){return a(t,e,n,r)}),r},c=function(t,e){var n;return n=function(){switch(t.charAt(0)){case"#":return r;case".":return i;default:return s}}(),a(n,t,e,[])},{select:c,match:o}})}.call(this),function(){var t={}.hasOwnProperty;e("src/EventController",["dou","./ComponentSelector"],function(e,n){"use strict";var o,r,i;return r=function(e,o,r){var i,s,c,a,p;p=[];for(a in e)t.call(e,a)&&(i=e[a],n.match(a,o.target)&&p.push(function(){var e;e=[];for(s in i)t.call(i,s)&&(c=i[s],s===o.name&&e.push(c.apply(this,r)));return e}.call(this)));return p},i=function(){var t,e;return t=arguments,e=t[t.length-1],this.controllers.forEach(function(n){return r.call(this,n,e,t)},this.context)},o=function(){function t(t){this.setTarget(t)}return t.prototype.setTarget=function(t){return this.target=t},t.prototype.start=function(t){return this.target.on("all",i,{context:t||null,controllers:this})},t.prototype.stop=function(){return this.target.off("all",i)},t.prototype.despose=function(){return this.stop(),this.clear(),this.target=null},t}(),e.mixin(o,e["with"].collection.withList),o})}.call(this),function(){var t={}.hasOwnProperty;e("src/EventTracker",[],function(){"use strict";var e,n;return n=function(){function e(e,n,o){var r,i;this.started=!1,e&&(this.target=e),this.handlers=n,o=o||this.target||this,this.boundhandler={};for(r in n)t.call(n,r)&&(i=n[r],"function"==typeof i&&(this.boundhandler[r]=i.bind(o)))}return e.prototype.on=function(){var e,n,o;if(!this.started){o=this.boundhandler;for(e in o)t.call(o,e)&&(n=o[e],this.target.on(e,n));return this.started=!0}},e.prototype.off=function(){var e,n,o;o=this.boundhandler;for(e in o)t.call(o,e)&&(n=o[e],this.target.off(e,n));return this.started=!1},e}(),e=function(){function t(){this.trackers=[]}return t.prototype.on=function(t,e,o){var r;return r=new n(t,e,o),this.trackers.push(r),r.on()},t.prototype.off=function(t,e){var n,o,r,i,s,c,a,p;for(r=function(){var o,r,s,c;for(s=this.trackers,c=[],n=o=0,r=s.length;r>o;n=++o)i=s[n],t!==i.target||e&&e!==i.handlers||c.push(n);return c}.call(this),a=r.reverse(),p=[],s=0,c=a.length;c>s;s++)o=a[s],p.push(this.trackers.splice(o,1)[0].off());return p},t.prototype.all=function(){var t,e,n,o,r;for(o=this.trackers,r=[],e=0,n=o.length;n>e;e++)t=o[e],r.push(t);return r},t.prototype.despose=function(){var t,e,n,o;for(o=this.trackers,e=0,n=o.length;n>e;e++)t=o[e],t.off();return this.trackers=[]},t.StandAlone=n,t}()})}.call(this),function(){e("src/ComponentFactory",["dou","./Component","./Container","./EventTracker"],function(t,e,n){"use strict";var o;return o=function(){function o(t,e){this.componentRegistry=t,this.eventTracker=e,this.seed=1}return o.prototype.despose=function(){return this.componentRegistry=null},o.prototype.uniqueId=function(){return"noid-"+this.seed++},o.prototype.createView=function(t,e){var o,r,i;if(r=t.type,o=this.componentRegistry.get(r),!o)throw new Error("Component Spec Not Found for type '"+r+"'");return i=o.view_factory_fn.call(e,t.getAll()),t instanceof n&&t.forEach(function(t){return i.add(this.createView(t,e))},this),o.view_listener&&this.eventTracker.on(i,o.view_listener,e),i},o.prototype.createComponent=function(o,r){var i,s,c,a,p,u;if(c=this.componentRegistry.get(o.type),!c)throw new Error("Component Spec Not Found for type '"+o.type+"'");if(c.containable){if(s=new n(o.type),o.components)for(u=o.components,a=0,p=u.length;p>a;a++)i=u[a],s.add(this.createComponent(i,r))}else s=new e(o.type);return s.initialize(t.util.shallow_merge(c.defaults||{},o.attrs||{})),s.get("id")||s.set("id",this.uniqueId()),c.component_listener&&this.eventTracker.on(s,c.component_listener,r),s},o}()})}.call(this),function(){e("src/Command",["dou"],function(t){"use strict";var e;return e=function(){function e(e){this.params=t.util.clone(e)}return e.prototype.execute=function(){},e.prototype.unexecute=function(){},e}()})}.call(this),function(){e("src/CommandManager",["src/Command"],function(t){"use strict";var e;return e=function(){function e(){this.reset()}return e.prototype.despose=function(){return this.reset()},e.prototype.execute=function(e){return!e instanceof t?void 0:(e.execute(),this.exq.push(e),this.uxq=[])},e.prototype.undo=function(){var t;return t=this.exq.pop(),t?(t.unexecute(),this.uxq.push(t)):void 0},e.prototype.redo=function(){var t;return t=this.uxq.pop(),t?(t.execute(),this.exq.push(t)):void 0},e.prototype.undoable=function(){return this.exq.length>0},e.prototype.redoable=function(){return this.uxq.length>0},e.prototype.reset=function(){return this.exq=[],this.uxq=[]},e}()})}.call(this),function(){var t={}.hasOwnProperty,n=function(e,n){function o(){this.constructor=e}for(var r in n)t.call(n,r)&&(e[r]=n[r]);return o.prototype=n.prototype,e.prototype=new o,e.__super__=n.prototype,e};e("src/CommandPropertyChange",["dou","./Command"],function(t,e){"use strict";var o;return o=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return n(e,t),e.prototype.execute=function(){var t,e,n,o,r;for(o=this.params.changes,r=[],e=0,n=o.length;n>e;e++)t=o[e],t.property?r.push(t.component.set(t.property,t.after)):r.push(t.component.set(t.after));return r},e.prototype.unexecute=function(){var t,e,n,o,r;for(o=this.params.changes,r=[],e=0,n=o.length;n>e;e++)t=o[e],t.property?r.push(t.component.set(t.property,t.before)):r.push(t.component.set(t.before));return r},e}(e)})}.call(this),function(){var t={}.hasOwnProperty;e("src/ComponentRegistry",["dou","./EventController"],function(e){"use strict";var n;return n=function(){function n(){this.componentSpecs={}}return n.prototype.despose=function(){var t,e,n,o,r;for(t=Object.keys(this.componentSpecs),r=[],n=0,o=t.length;o>n;n++)e=t[n],r.push(this.unregister(e));return r},n.prototype.setRegisterCallback=function(t,e){return this.callback_register="function"==typeof t?t.bind(e):void 0},n.prototype.setUnregisterCallback=function(t,e){return this.callback_unregister="function"==typeof t?t.bind(e):void 0},n.prototype.register=function(t){var e,n,o;if(!this.componentSpecs[t.type]){if(t.dependencies){o=t.dependencies;for(n in o)e=o[n],this.register(e)}return this.componentSpecs[t.type]=t,this.callback_register?this.callback_register(t):void 0}},n.prototype.unregister=function(t){var e;return(e=this.componentSpecs[t])?(delete this.componentSpecs[t],this.callback_unregister&&this.callback_unregister(e),e):void 0},n.prototype.forEach=function(e,n){var o,r,i,s;i=this.componentSpecs,s=[];for(o in i)t.call(i,o)&&(r=i[o],s.push(e.call(n,o,r)));return s},n.prototype.list=function(){return Object.keys(this.componentSpecs).map(function(t){return this.componentSpecs[t]},this)},n.prototype.get=function(t){var n;return n=this.componentSpecs[t],n?e.util.clone(this.componentSpecs[t]):null},n}()})}.call(this),function(){e("src/SelectionManager",["dou"],function(t){"use strict";var e;return e=function(){function e(t){this.onselectionchange=t.onselectionchange,this.context=t.context,this.selections=[]}return e.prototype.focus=function(e){var n,o;return e?(n=this.selections.indexOf(e),n>-1?(o=t.util.clone(this.selections),this.selections.splice(n,1),this.selections.unshift(e),this.onselectionchange?this.onselectionchange.call(this.context,{added:[],removed:[],before:o,after:this.selections}):void 0):this.toggle(e)):this.selections[0]},e.prototype.get=function(){return t.util.clone(this.selections)},e.prototype.toggle=function(e){var n,o,r,i;if(e)return r=t.util.clone(this.selections),o=this.selections.indexOf(e),o>-1?i=this.selections.splice(o,1):(n=[e],this.selections.unshift(e)),this.onselectionchange?this.onselectionchange.call(this.context,{added:n||[],removed:i||[],before:r,after:this.selections}):void 0},e.prototype.select=function(e){var n,o,r,i;return r=t.util.clone(this.selections),e instanceof Array||(e=e?[e]:[]),this.selections=e,n=function(){var t,e,n,i;for(n=this.selections,i=[],t=0,e=n.length;e>t;t++)o=n[t],-1===r.indexOf(o)&&i.push(o);return i}.call(this),i=function(){var t,e,n;for(n=[],t=0,e=r.length;e>t;t++)o=r[t],-1===this.selections.indexOf(o)&&n.push(o);return n}.call(this),this.onselectionchange?this.onselectionchange.call(this.context,{added:n,removed:i,before:r,after:this.selections}):void 0},e.prototype.reset=function(){var t;return t=this.selections,this.selections=[],t.length>0&&this.onselectionchange?this.onselectionchange.call(this.context,{added:[],removed:t,before:t,after:this.selections}):void 0},e}()})}.call(this),function(){e("src/ComponentSpec",["dou"],function(){"use strict";var t;return t=function(){function t(t){this.urn=t.urn,this.name=t.name,this.description=t.description,this.defaults=t.defaults,this.view_factory=t.view_factory,this.handle_factory=t.handle_factory,this.toolbox_image=t.toolbox_image}return t}()})}.call(this),function(){e("src/ApplicationContext",["dou","KineticJS","./Component","./Container","./EventController","./EventTracker","./ComponentFactory","./Command","./CommandManager","./CommandPropertyChange","./ComponentRegistry","./ComponentSelector","./SelectionManager","./ComponentSpec"],function(t,e,n,o,r,i,s,c,a,p,u,h,l){"use strict";var f;return f=function(){function t(t){var e,n,o,c,p,h,f;if(this.application_spec=t.application_spec,c=t.container,"string"!=typeof c)throw new Error("container is a mandatory string type option.");if(!this.application_spec)throw new Error("application_spec is a mandatory option");if(this.commandManager=new a,this.selectionManager=new l({onselectionchange:this.onselectionchange,context:this}),this.eventTracker=new i,this.eventController=new r,this.componentRegistry=new u,this.componentRegistry.setRegisterCallback(function(t){return t.controller?this.eventController.append(t.controller):void 0},this),this.componentRegistry.setUnregisterCallback(function(t){return t.controller?this.eventController.remove(t.controller):void 0},this),this.componentFactory=new s(this.componentRegistry,this.eventTracker),this.componentRegistry.register(this.application_spec),e={id:"application",container:t.container,width:t.width,height:t.height},this.application=this.componentFactory.createComponent({type:this.application_spec.type,attrs:e},this),this.view=this.componentFactory.createView(this.application,this),this.eventController.setTarget(this.application),this.eventController.start(this),this.application.on("add",this.onadd,this),this.application.on("remove",this.onremove,this),this.application_spec.components)for(f=this.application_spec.components,n=p=0,h=f.length;h>p;n=++p)o=f[n],this.application.add(this.componentFactory.createComponent(o,n,this))}return t.prototype.despose=function(){return this.eventTracker.despose(),this.eventController.despose(),this.eventRegistry.despose(),this.componentFactory.despose()},t.prototype.getEventTracker=function(){return this.eventTracker},t.prototype.getView=function(){return this.view},t.prototype.getModel=function(){return this.model},t.prototype.setModel=function(t){var e;return e=this.model,this.model=t,this.application.trigger("change-model",this.model,e)},t.prototype.getController=function(){return this.eventController},t.prototype.getApplication=function(){return this.application},t.prototype.findComponent=function(t){return h.select(t,this.application)},t.prototype.findView=function(t){return this.view.find(t)},t.prototype.findViewByComponent=function(t){return this.view.find("#"+t.get("id"))},t.prototype.createView=function(t){return this.componentFactory.createView(t,this)},t.prototype.createComponent=function(t){return this.componentFactory.createComponent(t,this)},t.prototype.drawView=function(){return this.view.draw()},t.prototype.execute=function(t){return this.commandManager.execute(t)},t.prototype.onadd=function(t,e){var n,o;return o=t===this.application?this.view:this.findViewByComponent(t),n=this.createView(e),o.add(n),this.drawView()},t.prototype.onremove=function(t,e){var n,o;return o=t===this.application?this.view:this.findViewByComponent(t),n=this.findViewByComponent(e),o.remove(n),this.drawView()},t.prototype.onselectionchange=function(t){return this.application.trigger("change-selections",t.after,t.before,t.added,t.removed)},t}()})}.call(this),function(){e("src/infopik",["./ApplicationContext"],function(t){"use strict";return{app:function(e){return new t(e)}}})}.call(this),t.infopik=n("src/infopik")}(this);
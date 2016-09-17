var yass_extensionid = chrome.extension.getURL("");
var yass = {
	m_pref: {},
	m_sobj: null,
	m_jumpto: 0,
	m_wheelactive: false,
	m_lastfunctime: 0,
	m_lasteventtime: 0,
	m_lastaccel: 1.0,
	m_speed: 0.0001,
	m_keys: null,
	m_lastcheckdesignmodearg: null,
	m_lastrefreshtargetarg: null,
	m_keyscrolltarget: null,
	m_clickedtarget: null,
	m_keyeventtarget: null,
	m_mousescrolltarget: null,
	m_mousemoved: [-100000,-100000],
	m_edgesize: 54,
	m_keyenable: true,
	m_jumptoremain: 0,
	m_ticksstack: [],
	m_sumpixelscroll: 0,

	oneshot: function(func, delay) { setTimeout(func,delay); },
	range: function(t,min,max) { return (t<min)?min:((t>max)?max:t); },
	dump: function(s) { 	if(this.m_pref.dolog) console.log(s); },

	pixels_with_cssdecl: function(decl, name) {
		if ("getPropertyCSSValue" in decl) {
			return decl.getPropertyCSSValue(name).getFloatValue(5);
		}
		var cssdesc = decl.getPropertyValue(name);
		var val = cssdesc.match("^[0-9]*")[0] - 0; // makes "" -> 0
		var unit = cssdesc.match("[a-z]*$")[0]; // ignore "%" because we won't support it
		if (unit == "px") val *= 1;
		else if (unit == "in") val *= 96;
		else if (unit == "pc") val *= 16;
		else if (unit == "cm") val *= 37.78;
		else if (unit == "mm") val *= 3.778;
		return val;
	},

	// not used currently. causes another bug.
	incorrect_body_height_issue: function() {
		// fix incorrect body height ( cause of dead region of mouse events )
		if(this.m_sobj && this.m_sobj.offset != 0) return;
		if(document.body.clientHeight >= document.body.offsetHeight && Math.abs(document.body.clientHeight - document.height) > 10)
		{
			document.body.style.height = (document.height - (document.body.clientHeight - document.body.offsetHeight)) + "px";
		}
	},

	getbedgesize: function() { return Math.min(this.m_sobj.bodyClientHeight() * 0.25, this.m_edgesize); },

	m_frameelement: { src:document.URL, scrolling:"", topframe:true },

	urgeRefreshTarget: function()
	{
		this.m_mousescrolltarget = null;
		this.m_keyscrolltarget = null;
		this.m_clickedtarget = null;
	},

	checkTickWheel: function(d)
	{
		if(this.m_ticksstack == null) return;
		if(this.m_sobj == null) return; // on no scrollable area and on xul(about:blank), ev.detail is not normal value 
		this.m_ticksstack.push(Math.abs(d));
		if(this.m_ticksstack.length < 10) return;
		// pick lowest delta value
		var tickwheel = 99999;
		for(var i in this.m_ticksstack) {
			if(this.m_ticksstack[i] < tickwheel) tickwheel = this.m_ticksstack[i];
		}
		if(tickwheel < 28) tickwheel = 28;
		if(tickwheel != this.m_pref.tickwheel) {
			this.dump("yass:tickwheel set to " + tickwheel);
			this.m_pref.tickwheel = tickwheel;
			chrome.extension.sendMessage({msg:"tickwheel_set", value:tickwheel});
		}
		this.m_ticksstack = null;
	},

	handleEvent: function(ev)
	{
		if(!this.m_pref.enabled) return;
		if(ev.altKey || ev.ctrlKey || (ev.keyCode != 32 && ev.shiftKey)) return;
		var fromkeyboard = false;

		var ev_detail = 0;
		var wheeldeltax = 0;
		var mozscrollstep = 0; 

		switch(ev.type)
		{
		case "mousewheel":
		case "wheel":
			if(ev.type == "wheel") {
				ev_detail = ev.deltaY * [1.0, 28.0, 500.0][ev.deltaMode];
				wheeldeltax = ev.deltaX * [1.0, 28.0, 500.0][ev.deltaMode];
			}
			else {
				ev_detail = -ev.wheelDeltaY;
			}
			if(ev_detail == 0) return;
			mozscrollstep = mozscrollstep || (ev_detail * (this.m_pref.wheelstep / this.m_pref.tickwheel));
			this.m_keyscrolltarget = null;
			var mousex = ev.screenX - this.m_mousemoved[0];
			var mousey = ev.screenY - this.m_mousemoved[1];
			if((mousex*mousex)+(mousey*mousey) >= 16 || this.m_mousescrolltarget == null)
			{
				//this.incorrect_body_height_issue();
				this.m_mousescrolltarget = ev.target;
				this.m_mousemoved = [ev.screenX,ev.screenY];
				this.refreshTarget(ev.target,ev_detail);
				if(this.m_sobj == null) this.m_mousescrolltarget = null;
			}
			this.checkTickWheel(ev_detail);
		//this.dump("MEV: " + ev_detail);
			if(wheeldeltax != 0 && this.m_sobj) {
				this.m_sobj.body.scrollLeft += wheeldeltax;
			}
			break;

		case "keydown":
			// key type
			var spacekey = false;
			switch(ev.keyCode){
				case 38:
					ev_detail = -1; break;
				case 40:
					ev_detail = 1; break;
				case 33:
					ev_detail = -2; break;
				case 34:
					ev_detail = 2; break;
				case 35:
					ev_detail = 3; break;
				case 36:
					ev_detail = -3; break;
				case 32:
					ev_detail = (ev.shiftKey) ? -2 : 2;
					spacekey = (ev.shiftKey) ? false : true;
					break;
				default:
					// mainly for google reader shortcut issue
					this.refreshTarget(null,null);
					this.m_mousescrolltarget = null;
					return;
			}

			this.m_keyeventtarget = ev.target;
			this.checkDesignMode(ev);
			if(this.m_keyenable == false) return;
			if(this.m_keyscrolltarget == null || this.m_sobj == null || this.m_clickedtarget != null) {
				var t = this.m_clickedtarget ? this.m_clickedtarget : ev.target;
				this.refreshTarget(t,0);
				this.m_keyscrolltarget = ev.target;
			}

			if(this.m_keyeventtarget){
				var tagname = this.m_keyeventtarget.tagName.toLowerCase();
				yass.dump("key target tagname=" + tagname);
				if(tagname == "input"){
					if(spacekey) return;
					var ignoretypes = ["text","search","password","url","tel","email","datetime","date","month","week","time","datetimelocal","number","color"];
					var typeattr = (this.m_keyeventtarget.getAttribute("type"))? this.m_keyeventtarget.getAttribute("type").toLowerCase() : "text";
					for(i in ignoretypes){
						if(ignoretypes[i] == typeattr) return;
					}
				}
				if(tagname == "textarea") return;
				if(tagname == "embed") return; 
				if(tagname == "object") return;
			}

			fromkeyboard = true;
			this.m_mousescrolltarget = null;
			this.m_clickedtarget = null;
			break;

		case "resize":
			this.urgeRefreshTarget();
			return;

		case "mousedown":
			this.m_clickedtarget = ev.target;
			//this.m_wheelactive = false;
			if(this.m_sobj && this.m_sobj.offset/this.m_lastd < 0) return;
			this.m_jumpto = this.m_vpos;
			return;

		default: 
			return;
		}
		if(!this.m_sobj) { return; }

		if(ev.defaultPrevented) return; // Added for problem on googl+ feed image view mode. Image zoom function eats event and prevents default
		ev.preventDefault();
		if(ev_detail == 0) return; // maybe this fixes microsoft smooth wheel problem

		var ctm = (new Date()).getTime();

		// ignore events in edge bounce animation
		// for MacOS native flick
		if(mozscrollstep != 0 && this.m_edgesize != 0) {
			if(ctm - this.m_lasteventtime <= 200) {
				if(((this.m_sobj.offset < 0 || this.m_vpos < 5) && mozscrollstep < 0) ||
					((this.m_sobj.offset > 0 || this.m_vpos > this.m_sobj.maxscroll - 5) && mozscrollstep > 0)) {
					this.m_lasteventtime = ctm; 
					return; 
				}
			}
		}

		var detailsq = ev_detail*ev_detail;
		var pagescroll = (detailsq == 4);
		var wholepagescroll = (detailsq == 9);

		// device_tick =  ev_detail / tickwheel , sumpixelscroll = sum( device_tick * wheelstep )
		var evtime = (ctm - this.m_lasteventtime) || 1;
		this.m_sumpixelscroll += Math.abs(mozscrollstep);
		var speed = 0.225 * (this.m_sumpixelscroll / this.m_pref.wheelstep / evtime); // distance(ticks) / time
		this.m_speed *= 1.0 - this.range(((evtime - 100) / 800), 0, 0.9999); // speed loss 0.2sec offset 0.5sec to zero
		this.m_speed = this.m_speed * 0.5 + speed * 0.5;
	   //yass.dump("e detail:" + Math.floor(ev_detail) + " sum:" + this.m_sumpixelscroll +  " speed:" + this.m_speed);

		var edgemargin = (0.64 / (fromkeyboard ? this.m_pref.kbddumping : this.m_pref.wheeldumping)) + ((this.m_edgesize==0)?2:0) ;
		var edgelimit = this.getbedgesize() + edgemargin + 25;

		var step = 0;
		if(mozscrollstep != 0) {
			// pointing devices
			step = Math.abs(mozscrollstep);
			var p = 300;
			if(this.m_sumpixelscroll >= p) { this.m_sumpixelscroll = 0; this.m_lasteventtime = ctm; }
		}
		else {
			// keyboard 
			// branch of step
			var step = 
				(fromkeyboard) ?
				    ((pagescroll) ? 
				    Math.max(0, this.m_sobj.bodyClientHeight() - this.m_pref.pagemargin) :
				       ((wholepagescroll) ?
				          (this.m_sobj.maxscroll + 100) :
				          this.m_pref.kbdstep)) :
			   this.m_pref.wheelstep;
			this.m_lasteventtime = ctm;
		}

		if(!this.m_wheelactive)
		{
			this.m_beginsmoothtime = ctm;
			this.m_resetsmooth = 0;
			this.m_reset = 0;
			this.m_lastd = 0;
			var delta =  step * ((ev_detail<0)?-1:1);
			// something special power prevents scrollTop to be just 1pixel up so
			this.m_sobj.body.scrollTop = (this.m_sobj.body.scrollTop - ((ev_detail<0)?1.0000001:-1));						 
			this.m_jumpto = this.m_sobj.body.scrollTop - 0 + delta
				+ ((ev_detail*this.m_jumptoremain>0)?this.m_jumptoremain:0);
			this.m_jumpto = this.range(this.m_jumpto, -edgelimit, this.m_sobj.maxscroll + edgelimit);
			this.m_jumptoremain = 0;	
			this.m_wheelactive = true;
			this.m_lastscrolltop = this.m_sobj.body.scrollTop;
			this.m_lastfunctime = (new Date()).getTime(); - 17;
			this.m_vpos = this.m_sobj.body.scrollTop;
			this.funcwheel(fromkeyboard,delta,edgemargin);
		}
		else 
		{
			this.m_resetsmooth = 1;

			var accel = 1.0;

			if(fromkeyboard) {
				if(!pagescroll) accel = this.m_pref.kbdaccel/100;
			} else {
				if(this.m_sobj.offset == 0 && (this.m_jumpto - this.m_vpos) * ev_detail < 0) {
					this.m_jumpto += (this.m_vpos - this.m_jumpto) * 0.92; 
					return; 
				}
				accel = this.range(this.m_pref.wheelaccel * this.m_speed, 1.0, 30.0);
			}
			var delta = step*((ev_detail<0)?-1:1);
			this.m_jumpto += Math.round(delta * accel);
			this.m_jumpto = this.range(this.m_jumpto, -edgelimit, this.m_sobj.maxscroll + edgelimit);
		}
	},

	// class scroller that have no edge element
	scroller_noedge: (function(){
		var F = function(orig,b,type,w,h,log){ 
			this.target = orig;
			this.body = b;
			this.scrolltype = type;
			this.width = w;
			this.height = h;
			this.log = log;
			this.offset = 0;
			this.bodyisbody = (this.body.nodeName.toLowerCase() == "body");
		};
		F.prototype = {
			bodyClientHeight: function(){
				if(!this.bodyisbody) return this.body.clientHeight;
				return (this.body.clientHeight <= 20 || (this.body.parentNode && this.body.parentNode.clientHeight < this.body.clientHeight)) ? this.body.parentNode.clientHeight : this.body.clientHeight;
			},
			activate: function() {
				this.etop = yass.edgetop;
				this.ebot = yass.edgebot;
				this.maxscroll = this.body.scrollHeight - this.bodyClientHeight();
			},
			adjust: function(newp,oldp) {
				// adjust maxscroll
				var scrollsize = this.body.scrollHeight - this.bodyClientHeight();
				if(scrollsize != this.maxscroll) this.maxscroll = scrollsize;
				if(this.maxscroll == 0) return false;
				// on the edge
				var moveto = newp - oldp;
				// (chrome issue) on zoomed out content scrollTop is rounded and might never be to maxscroll (stop at 1px less)
				if((this.body.scrollTop == 0 && moveto < 0) 
				//	 || (this.body.scrollTop == this.maxscroll && moveto > 0)) return false;
				|| ((this.maxscroll - this.body.scrollTop) <= 1 && moveto > 0)) return false;
				return true;
			},
			scrollovercheck: function(hint) {
				dump("yass - must not be called.");
			},
			stop: function() {
			},
			release: function() {
			},
			render: function(offsetscroll,pos) {
				this.body.scrollTop = pos;
			},
			restoreedges: function(){
			}
		};
		return F;
	})(),

	// class scroller
	scroller: (function(){
		var F = function(orig,b,type,w,h,log){ 
			this.target = orig;
			this.body = b;
			this.scrolltype = type;
			this.width = w;
			this.height = h;
			this.log = log;
			this.offset = 0;
			this.bodyisbody = (this.body.nodeName.toLowerCase() == "body");
		};
		F.prototype = {
			bodyClientHeight: function(){
				if(!this.bodyisbody) return this.body.clientHeight;
				return (this.body.clientHeight <= 20 || (this.body.parentNode && this.body.parentNode.clientHeight < this.body.clientHeight)) ? this.body.parentNode.clientHeight : this.body.clientHeight;
			},
			activate: function() {
				this.etop = yass.edgetop;
				this.ebot = yass.edgebot;
				this.body._yass_ownedby = this;
				this.offset = 0;
				var h0 = this.ebot.setowner(this.body); 
				var h1 = this.etop.setowner(this.body);
				this.maxscroll = this.body.scrollHeight - this.bodyClientHeight() - h0 - h1;
			},
			adjust: function(newp,oldp) {
				// adjust maxscroll
				var scrollsize = this.body.scrollHeight - this.bodyClientHeight() - this.ebot.e.clientHeight - this.etop.e.clientHeight;
				if(scrollsize != this.maxscroll) {
					// there are evil pages that have 100% height child or absolutely positioned child. scrollHeight not be changed by making botedge height changed
					if(this._lastscrollheight == this.body.scrollHeight && newp > this.maxscroll) return false; // bot edge's height change changes maxscroll - emergency stop
					this.maxscroll = scrollsize;
				}
				this._lastscrollheight = this.body.scrollHeight;
				if(this.maxscroll == 0) return false;

				// when entering top edge
				if(oldp >= 0 && newp < 0) {
					this.etop.adjust(this.ebot);
				}
				// when entering bottom edge
				else if(oldp <= this.maxscroll && newp > this.maxscroll) {
					this.ebot.adjust();
				}

				return true;
			},
			restoreedges: function() {
				if(this.etop.restore(this.body.ownerDocument) == true)
					this.ebot.restore(this.body.ownerDocument);
			},
			scrollovercheck: function(hint) {
				if(this.offset == 0) {
					return (
					(hint > 0 && this.body.scrollTop < this.maxscroll) || 
					(hint < 0 && this.body.scrollTop > 0));
				} else {
					return !((this.offset > 0 && hint > 0) || (this.offset < 0 && hint < 0));
				}
			},
			stop: function() {
				this.etop.e.style.height = 
				this.ebot.e.style.height = "0px";
				this.etop.render_abs(0);
				if(this.offset < 0) this.body.scrollTop = 0;
				if(this.body.scrollTop > this.maxscroll) this.body.scrollTop = this.maxscroll;
				this.offset = 0;
			},
			release: function() {
				this.stop();
				if(this.body._yass_ownedby == this) this.body._yass_ownedby = null;
			},
			// realize virtual offset
			render: function(offsetscroll,pos) {
				this.offset = offsetscroll;
				if(offsetscroll < 0)
				{
					offsetscroll = -offsetscroll; // invert
					var h = this.etop.e.clientHeight;
					if(h < offsetscroll) h += 64;
					this.etop.render_abs(h);
					this.etop.e.style.height = h + "px";
					this.body.scrollTop = h - offsetscroll;
				}
				else if(offsetscroll > 0)
				{
					if(this.ebot.e.clientHeight < offsetscroll ) this.ebot.e.style.height = (offsetscroll + 50) + "px";
					this.body.scrollTop = this.maxscroll + offsetscroll;
				}
				else
				{
					this.etop.e.style.height =
					this.ebot.e.style.height = "0px";
					this.etop.render_abs(0);
					this.body.scrollTop = pos;
				}
			}
		};
		return F;
	})(),

	// edgetop object extends div element
	edgetop: {
		e: null,

		dummy :null,

		epadding: null,

		eorig: (function(){
			var e = document.createElement("div");
			e.style.backgroundImage = "url(" + yass_extensionid + "edgebgtop.png)";
			e.style.backgroundAttachment = 
			e.style.backgroundAttachment = "scroll";
			e.style.backgroundPosition = "bottom";
			e.style.height = 
			e.style.borderWidth = 
			e.style.margin = 
			e.style.padding = "0px";
			e.style.display = "block";
			//e.style.postion = "absolute";
			//e.style.left = e.style.top = "0px";
			e.setAttribute("id","yass_top_edge");
			return e;
		})(),

		dummyorig: (function(){
			var e = document.createElement("div");
			e.style.height = e.style.width = "1px";
			e.style.borderWidth = 
			e.style.margin = 
			e.style.padding = "0px";
			e.style.display = "block";
			//e.style.postion = "absolute";
			//e.style.left = e.style.top = "0px";
			e.setAttribute("id","yass_top_edge_dummy");
			return e;
		})(),

		epaddingorig: (function(){
			var e = document.createElement("div");
			e.style.height =  
			e.style.borderWidth = 
			e.style.margin = 
			e.style.padding = "0px";
			e.style.display = "block";
			e.setAttribute("id","yass_top_edge_padding");
			return e;
		})(),

		_owner: null,
		_abselm: [],

		restore: function(doc) {
			var e = doc.getElementById("yass_top_edge");
			if(e == null) return false;
			if(e == this.e) return false;
			yass.dump("different instance of the edge created and catched up\n");
			this.e = e;
			this.dummy = doc.getElementById("yass_top_edge_dummy");
			this.epadding = doc.getElementById("yass_top_edge_padding");
			return true;
		},

		setowner: function(owner) { 
			this.e = this.eorig;
			this.dummy = this.dummyorig;
			this.epadding = this.epaddingorig;
			this.abselms = [];
			// edges must be inserted inside of body not html even if html is scrollable
			// body may return frameset but owner must be scrollable something inside of frame, so it must not be, as far as here.
			var owner = (owner == owner.ownerDocument.documentElement) ? owner.ownerDocument.body : owner;
			if(this._owner == owner || this.e == owner) return this.e.clientHeight;
			if(this._owner) { try { 
				this._owner.removeChild(this.e); 
				this._owner.removeChild(this.dummy);
				this._owner.removeChild(this.epadding);
				if(this._ancientnode) this._ancientnode.style.marginTop = this._ancientnode_marginback; // restore offset - must be tested
			} catch(ex) {} }
			this.e.style.height = "0px";
			this.e.style.marginBottom = "0px";
			try { this.epadding.style.padding = "0px"; } catch(ex) {}
			this._owner = owner;
			this._ancientnode = null;
			this._paddingback = owner.style.paddingTop;
			// detect body margin size
			var bodymargintop = 0;
			var bodymarginleft = 0;
			var bodypaddingtop = 0;
			this._widthtarget = owner;
			this.e.style.marginBottom = "0px";
			if(owner == owner.ownerDocument.body) {
				var s = owner.ownerDocument.defaultView.getComputedStyle(owner,null);
				bodymargintop = yass.pixels_with_cssdecl(s, "margin-top"); // as pixels
				bodypaddingtop += yass.pixels_with_cssdecl(s, "padding-top"); // as pixels
				bodymarginleft = ((owner.parentNode.clientWidth - owner.offsetWidth)/2); // this way can get correct margin in case margin:0 auto
				//bodymarginleft = s.getPropertyCSSValue("margin-left").getFloatValue(5);
				this._widthtarget = owner.ownerDocument.documentElement;
				this._ancientnode = owner.ownerDocument.querySelector(
				"body>p:first-child,body>dl:first-child,body>multicol:first-child,body>blockquote:first-child,body>h1:first-child,"+
				"body>h2:first-child,body>h3:first-child,body>h4:first-child,body>h5:first-child,body>h6:first-child,body>listing:first-child,"+
				"body>plaintext:first-child,body>xmp:first-child,body>pre:first-child,body>ul:first-child,body>menu:first-child,body>dir:first-child,body>ol:first-child"
				); // compatible only with 3.5 and later versions 
				// put dummy div for negate first node offset hack
				if(this._ancientnode) {
					// ensure visibility - check style for display:noe
					var astyle = owner.ownerDocument.defaultView.getComputedStyle(this._ancientnode,null);
					if(astyle.getPropertyValue("display").cssText == "none") this._ancientnode = null;
					//if(astyle.getPropertyCSSValue("margin-top").getFloatValue(5) != 0) this._ancientnode = null;
					if(this._ancientnode.style.marginTop != "") this._ancientnode = null;
				}
				if(this._ancientnode) {
					this._ancientnode_marginback =  this._ancientnode.style.marginTop;
					var origmargin = yass.pixels_with_cssdecl(owner.ownerDocument.defaultView.getComputedStyle(this._ancientnode,null),"margin-top");
					//this._ancientnode.style.marginTop = (origmargin + bodymargintop) + "px";
					this._ancientnode.style.marginTop = bodymargintop + "px";
				} else {
					// apply bodymargin to dummy element
					this.e.style.marginBottom = bodymargintop + "px";
				}
			}
			// collect absolute elements
			var elms = owner.children;
			for(i in elms){
				var e = elms[i];
				if(e.nodeName === undefined) continue;
				if(e.nodeName.toLowerCase() != "div") continue;
				var s = e.ownerDocument.defaultView.getComputedStyle(e,null);
				if(s.getPropertyValue("position").cssText == "absolute"){
					try{// chrome sometimes throws error here
						var top = yass.pixels_with_cssdecl(s,"top");
						this.abselms.push([e,top]);
					}catch(ex){}
				}
			}
			if(bodypaddingtop > 0) 
			{
				if(owner.childNodes.length == 0) owner.appendChild(this.epadding);
				else owner.insertBefore(this.epadding,owner.childNodes[0]);
				this.epadding.style.paddingBottom = bodypaddingtop + "px";
			}
			this.dummy.style.marginTop = -(bodymargintop+bodypaddingtop+1) + "px"; // negate docuemnt margin
			this.e.style.marginLeft = -bodymarginleft + "px";
			this.e.style.width = "1px";
			if(owner.childNodes.length == 0) owner.appendChild(this.e); // edge is below the dummy element
			else owner.insertBefore(this.e,owner.childNodes[0]);
			if(owner.childNodes.length == 0) owner.appendChild(this.dummy); // dummy is above
			else owner.insertBefore(this.dummy,owner.childNodes[0]);
			return 0;
		},

		adjust: function(ebot) {
			// adjust width
			//this.e.style.width = this._widthtarget.clientWidth  + "px";
			// on chrome in google reader sometime this is null
			var w = yass.pixels_with_cssdecl(ebot.e.ownerDocument.defaultView.getComputedStyle(ebot.e,null),"width");
			if(w == 0) return;
			this.e.style.width = w + "px";
		},

		render_abs: function(offset) {
			for(i in this.abselms){
				this.abselms[i][0].style.top = (this.abselms[i][1] + offset) + "px";
			}
		}
	},

	// edgebot object extends div element
	edgebot: {
		e: null,

		eabsolute: (function(){
			var e = document.createElement("div");
			e.style.backgroundImage = "url(" + yass_extensionid + "edgebgbot.png)";
			e.style.backgroundPosition = "0px 0px";
			e.style.position = "absolute";
			e.style.top = 
			e.style.left = 
			e.style.height = 
			e.style.borderWidth = 
			e.style.padding =
			e.style.margin = "0px";
			e.style.width = "100%";
			e.style.display = "block";
			e.setAttribute("id","yass_bottom_edge");
			return e;
		})(),

		estatic: (function(){
			var e = document.createElement("div");
			e.style.backgroundImage = "url(" + yass_extensionid + "edgebgbot.png)";
			e.style.backgroundPosition = "0px 0px";
			e.style.position = "static";
			e.style.height = 
			e.style.borderWidth = 
			e.style.padding =
			e.style.margin = "0px";
			e.style.width = "100%";
			e.style.display = "block";
			e.setAttribute("id","yass_bottom_edge");
			return e;
		})(),

		_owner: null,

		restore: function(doc) {
			this.e = doc.getElementById("yass_bottom_edge");
		},

		setowner: function(owner) { 
			// edges must be inserted inside of body not html even if html is scrollable
			var body = owner.ownerDocument.body;
			var owner = (owner == owner.ownerDocument.documentElement) ? body : owner;
			if(this._owner == owner || this.e == owner) return this.e.clientHeight;
			if(this._owner) { try { this._owner.removeChild(this.e); } catch(e) {} }
			if(this.e) this.e.style.height = "0px";
			this._owner = owner;
			if(owner == body){
				this.e = this.eabsolute;
				// height hint is from html's if body is owner
				// body or html the one more difference between clientH and scrollH
				var doc = owner.ownerDocument.documentElement;
				var body_h = owner.scrollHeight;
				var doc_h = doc.scrollHeight;
				this._heighttarget = (body_h > doc_h) ? body : doc;
			} else {
				this.e = this.estatic;
				this._heighttarget = owner;
			}
			owner.appendChild(this.e);
			// test if changing of height of added edge reflects body's scrollHeight
			/*
			var defheight = this._heighttarget.scrollHeight;
			this.e.style.height = "3px";
			this._notavailable = false;
			if(document.baseURI.substring(0,6) != "chrome" && this._heighttarget.scrollHeight == defheight) { this._notavailable = true; console.log("not available ebot"); }
			this.e.style.height = "0px";
			*/
			return 0;
		},

		adjust: function() {
			// adjust position top
			if(this._owner == null) return;
			this.e.style.top = this._heighttarget.scrollHeight + "px";
		}
	},

	funcwheel: function(kbd,idelta,edgemargin)
	{
		if(this.m_wheelactive == false || this.m_sobj == null) 
		{
			this.m_wheelactive = false;
			//if(yassev.m_enable) yassev.glow_indicator(0); 
			if(this.m_sobj){ this.m_sobj.stop(); } 
			return; 
		}

		var bdumpfunc = (this.m_pref.prefversion <= 2) ?
			(function(t,_d) { return yass.range(t/_d + 0.2, 0.05, 1.0); }) :				
			(function(t,_d) { return yass.range(t/_d, 0.05, 1.0); }) ;

		var dump = kbd?this.m_pref.kbddumping:this.m_pref.wheeldumping;
		var bdump = kbd?this.m_pref.kbdbdumping:this.m_pref.wheelbdumping;

		var tm = (new Date()).getTime();
		var frametime = (tm - this.m_lastfunctime);
		frametime = Math.min(frametime,34);
		this.m_lastfunctime = tm;

	//yass.dump("frametime:" + frametime);
		if(frametime<=0) { this.oneshot(function(){yass.funcwheel(kbd,idelta,edgemargin);},3); return; }

		var fordest = (this.m_jumpto - this.m_vpos);

		// moving back in boucing action
		if((this.m_sobj.offset/fordest) < 0) {
			dump = 0.45;
			bdump = 0.295;
		}

		bdump *= 2000;

		var d = 0;
		var looptimetotal = 0;
		var lastd = 0;

		do {
			var localfordest = fordest - d;
			var looptime = Math.min(17,frametime-looptimetotal);
			looptimetotal += looptime;

			var f = dump * (looptime / 17);

			// dumping of begining 
			if(bdump>0.0)
			{
				// check reset beginning smooth
				if(this.m_resetsmooth > 0)
				{
					if(this.m_pref.prefversion >= 3){
						var lastsmoothtime = this.m_beginsmoothtime;
						var smoothtime = tm;
						var count = 0;
						do{
							if(smoothtime < lastsmoothtime) { break; }
							var timefromev = tm - smoothtime + 17 + looptimetotal;
							var b = bdumpfunc(timefromev,bdump);
							var x = this.m_lastd / (localfordest * f * b);
							if(x < 0) { this.m_beginsmoothtime = tm; break; }
							if(x < 1) { this.m_beginsmoothtime = smoothtime; break; }
							smoothtime -= 34;
							count++;
						}while(true);
					} else {
						this.m_beginsmoothtime = tm;
					}
					this.m_resetsmooth = 0;
				} 

				var timefromev = tm - this.m_beginsmoothtime + 17 + looptimetotal;
				f *= bdumpfunc(timefromev,bdump);
			}

			d += localfordest * f;
			if(lastd == 0) lastd = d;

		}while(frametime-looptimetotal > 4);

		if(this.m_lastd == d) { this.m_wheelactive = false; this.m_sobj.stop(); return; } // not moved
		this.m_lastd = lastd;

		var lastmvpos = this.m_vpos;
		this.m_vpos += d;

		var lenfordest = fordest*fordest;

		// adjust maxscroll (autopagerize or somthing dynamically add elements on m_sobj.body)
		if(this.m_sobj.adjust(this.m_vpos,lastmvpos) == false) {
			this.m_wheelactive = false;
			this.m_sobj.stop();
			return;
		}

		//if(yassev.m_enable) yassev.glow_indicator(this.range(Math.abs(fordest)/(kbd?this.m_pref.kbdstep:this.m_pref.wheelstep),0,1.0));

		// get virtual scrolltop offset
		var ofs = this.getbedgesize(); // offset size
		var offsetscroll = 0;
		if(this.m_vpos < 0)  
		{
			offsetscroll = this.m_vpos;
			//if((d*d < 0.9) && lenfordest < 400 && this.m_jumpto != edgemargin)
			if(this.m_jumpto != edgemargin && (d*d < ofs/(ofs-Math.min(-offsetscroll,ofs))-1))
				{ this.m_jumpto = edgemargin; this.m_resetsmooth = 1; }
			if(!this.m_frameelement.topframe) this.urgeRefreshTarget(); // forcibly reset scroll target and prompt to check scroll over
		}
		else if(this.m_vpos > this.m_sobj.maxscroll)
		{
			offsetscroll = this.m_vpos - this.m_sobj.maxscroll;
			//if((d*d < 0.9) && lenfordest < 400 && this.m_jumpto != this.m_sobj.maxscroll - edgemargin) 
			if(this.m_jumpto != this.m_sobj.maxscroll - edgemargin && (d*d < ofs/(ofs-Math.min(offsetscroll,ofs))-1)) 
				{ this.m_jumpto = this.m_sobj.maxscroll - edgemargin; this.m_resetsmooth = 1; }
			if(!this.m_frameelement.topframe) this.urgeRefreshTarget(); // forcibly reset scroll target and prompt to check scroll over
		}
		else if(lenfordest<=1.0 || (lenfordest<100.0 && d*d<0.2) || this.m_sobj.body.scrollTop != this.m_lastscrolltop )
		{ 
			this.m_wheelactive = false; 
			this.m_sobj.stop();
			this.m_jumptoremain = fordest;
			return; 
		}

		this.m_sobj.render(offsetscroll, this.m_vpos);
	
		this.m_lastscrolltop = this.m_sobj.body.scrollTop;

		this.oneshot(function(){yass.funcwheel(kbd,idelta,edgemargin);},10);
	},

	toggleKeyHook: function(b)
	{
		this.dump("toggle keyhook " + b);
		this.m_keyenable = b;
	},

	refreshTarget: function(target,detail)
	{
		// the reason this is here is just frequency of execution.
		if(this.m_sobj)	this.m_sobj.restoreedges();

		// externally ordered for releasing of m_sobj
		if(target == null) { 
			if(this.m_sobj) this.m_sobj.release();
			this.m_sobj = null;
			return;
		}

		var newobj = this.findNodeToScroll(target,detail,"");
		// null : stop immediately
		// object not activated : change to it
		// 1 : do not change the target
		// 2 : should move parent frame

		if(newobj === 1) return;

		if(newobj === 2)
		{
			if(this.m_sobj) this.m_sobj.release();
			this.m_sobj = null;
			return;
		}

		if(newobj == null)
		{
			this.m_wheelactive = false;
			if(this.m_sobj) this.m_sobj.release();
			this.m_sobj = null;
			this.dump("N: target null\n");
		}
		else if(this.m_sobj && newobj.body != this.m_sobj.body) 
		{
			this.m_wheelactive = false;
			this.m_sobj.release();
			this.m_sobj = newobj;
			this.m_sobj.activate();
			this.dump("A:");
		}
		else if(this.m_sobj == null)
		{
			this.m_sobj = newobj;
			this.m_sobj.activate();
			this.dump("B:");
		}
		
		if(newobj) { this.dump(newobj.log + "\n"); }
	},

	checkDesignMode: function(ev)
	{
		if(ev.target == this.m_lastcheckdesignmodearg) return;
		this.m_lastcheckdesignmodearg = ev.target;

		var b = true;
		var mode = (ev.target.ownerDocument && ev.target.ownerDocument.designMode)
			? ev.target.ownerDocument.designMode : "off";
		if(mode && mode.toLowerCase() == "on") b = false;
		if(ev.target.isContentEditable == true) b = false; 
		if(ev.target.style["-webkit-user-modify"] != "") b = false;
		this.toggleKeyHook(b);
	},

	// based on the code in All-in-One Gestures
	findNodeToScroll: function(orig,hint,log) 
	{
		function getstyle(e, pname) 
		{
			var p = e.ownerDocument.defaultView.getComputedStyle(e, "").getPropertyValue(pname);
			var val = parseFloat(p);
			if(!isNaN(val)) return Math.ceil(val);
			if(p == "thin") return 1;
			if(p == "medium") return 3;
			if(p == "thick") return 5;
			return 0;
		}

		// 0 neither scrollable 1 vertical only  2 horizontal only 3 both
		function getscrolltype(wscroll, wclient, hscroll, hclient) 
		{
			if(hclient < 50) return 0;
			if(hscroll - hclient < 10) hclient = hscroll; // too small to scroll
			//if(hscroll - hclient == 1) hclient += 1; // there are some region unmovable really but looks 1px scrollable
			var flag = 0;
			if(wscroll > wclient) flag += 1;
			if(hscroll > hclient) flag += 2;
			return flag; 
		}

		// true: scrollable / false: bottom most or top most
		// this is called onto html or body only
		var scrollovercheck = 
			(!hint)?
			(function(){return true;}):(
			(hint<0)?
				(function(fe,n,a,b){
					if(fe == null) return true;
					return (("_yass_ownedby" in n) && n._yass_ownedby) ? n._yass_ownedby.scrollovercheck(hint) : (a>0);
				}):
				(function(fe,n,a,b){
					if(fe == null) return true;
					return (("_yass_ownedby" in n) && n._yass_ownedby) ? n._yass_ownedby.scrollovercheck(hint) : (a<b)&&(b>1); // <- magic code | there are some region unmovable really but looks 1px scrollable 
				})
		);

		var newobject = function(p){
			var editable = false;
			if(p.nodeName.toLowerCase() == "textarea") editable = true;
			var mode = (p.ownerDocument && p.ownerDocument.designMode)
				? p.ownerDocument.designMode : "off";
			if(mode && mode.toLowerCase() == "on") editable = true;
			if(p.isContentEditable) editable = true;
			if(p.style["-webkit-user-modify"] != "") editable = true;

			if(editable) return yass.scroller_noedge;
			return (yass.m_edgesize == 0) ? yass.scroller_noedge : yass.scroller;
		}
			
		var doc = orig.ownerDocument.documentElement;
		if(doc && doc.nodeName.toLowerCase() != "html") { this.dump("doc is " + doc.nodeName + " not html\n"); return null; }

		var bodies = doc.getElementsByTagName("body");
		if(!bodies || bodies.length == 0) { this.dump("no body\n"); return null; }
		var body = bodies[0];

		var node = (orig == doc) ? body : orig;

		function getscrollheight(node)
		{
			if(node != body) return node.scrollHeight;
			return Math.max(body.scrollHeight,doc.scrollHeight);
		}

		function getclientheight(node)
		{
			if(node != body) return node.clientHeight + getstyle(node,"border-top-width") + getstyle(node,"border-bottom-width");
			return (doc.clientHeight != doc.scrollHeight) ? doc.clientHeight: node.clientHeight;
		}

		// on cross domain (simply different servername actually) inner frame, throws error when we access frameElement
		// WTF!!
		//frameelement = orig.ownerDocument.defaultView.frameElement;
		frameelement = this.m_frameelement;

		this.dump("body:" + body.clientHeight + "," + body.scrollHeight + " html:" + doc.clientHeight + "," + doc.scrollHeight);

		// if this is in a unscrollable frame element
		if(frameelement.scrolling.toLowerCase() == "no") 
		{
			this.dump("unscrollable frame");
			return 2;
			//return this.findNodeToScroll(frameelement.ownerDocument.documentElement,hint,log + "!");
		}

		do{
			var nodename = node.nodeName.toLowerCase();

			/*log*/log += nodename;

			/***/try{

			if(/^(option|optgroup)$/.test(nodename)) { this.dump("option found :" + log); return null; }

			var overflowprop = node.ownerDocument.defaultView.getComputedStyle(node, "").getPropertyValue("overflow-y");

			if(node.clientWidth && node.clientHeight &&
				(overflowprop != "hidden") &&
				(node == doc || node == body || overflowprop != "visible") 
			  )
			{
				var realwidth = node.clientWidth + getstyle(node,"border-left-width") + getstyle(node,"border-right-width");
				var realheight = getclientheight(node);

				var scrolltype = getscrolltype(node.scrollWidth, realwidth, getscrollheight(node), realheight);
				/*log*/log += "(" + node.scrollTop + " " + getclientheight(node) + " " + getscrollheight(node) + ")";

				if((scrolltype >= 2) && 
					// scroll focus overflow applied only on inner frame (HTML|BODY)
					// -> Chrome allows scroll pass even for scrollable div in contrast to firefox, so let it go.
					(scrollovercheck(1,node,node.scrollTop,getscrollheight(node)-realheight)) 
				)
				{
					return new (newobject(node))(orig,node,scrolltype,realwidth,realheight,log);
				}
			}

			if(node == body) break;

			/***/}catch(e){}

			/*log*/log += ">";

			node = node.parentNode;

		}while(node);

		if(!frameelement.topframe) 
		{
			this.dump(log + " frame upper");
			return 2;
			//var upper = this.findNodeToScroll(frameelement.ownerDocument.documentElement,hint,log + "!");
			//if(upper != null) return upper;
			//return 1;
		}

		// no scrollable area found in content ( mainly for image only page to handle )

		if(getscrollheight(body) - getclientheight(body) > 1){
			log += " *DEFAULT body*";
			return new (newobject(body))(orig,body,3,body.clientWidth,body.clientHeight,log);
		}

		this.dump(log + " *continue*\n");
		return 1;
	},

	refresh_preferences: function()
	{
		chrome.extension.sendMessage({msg:"loadpref"},function(res){
			yass.refresh_preferences_cb(res);
		});
	},

	refresh_preferences_cb: function(pref)
	{
		this.dump("loading preferences");
		// evaluate black list
		if(pref.blacklist){
			var bl = pref.blacklist.split(/\n/);
			for(i in bl){
				var pattern = bl[i];
				if(typeof(pattern) != "string") continue;
				if(pattern.length == 0) continue;
				if(RegExp(pattern).test(document.location.href)) {
					window.yass_unloadlisteners();
					console.log("blacklist pattern [" + pattern + "] matched to [" + document.location.href + "]\n");
					return; 
				}
			}
		}

		this.refreshTarget(null,null);
		this.m_mousescrolltarget = null;

		var f;

		var presetid = pref.selectedpreset;
		var presets = pref["preset_"+presetid].split(",");

		this.m_pref.wheelstep = presets[0] - 0;
		this.m_pref.wheeldumping = (900-presets[1])/1000;
		this.m_pref.wheelbdumping = presets[2]/890;
		this.m_pref.wheelaccel = presets[3] - 0;
		this.m_pref.kbdstep = presets[4] - 0;
		this.m_pref.kbddumping = (900-presets[5])/1000;
		this.m_pref.kbdbdumping = presets[6]/890;
		this.m_pref.kbdaccel = presets[7] - 0;
		this.m_pref.usekbd = true;
		this.m_pref.enabled = (pref.enabled != 0);
		this.m_pref.usepagejump = true;
		this.m_pref.pagemargin = 40;
		this.m_pref.prefversion = 3;
		this.m_pref.usewholejump = true;
		this.m_pref.dolog = (pref.dolog == "true");
		this.m_pref.usepixelscroll = (pref.usepixelscroll == "true");
		this.m_edgesize = pref.edgetype - 0;
		this.m_pref.tickwheel = pref.tickwheel || 84;

		// status bar color indicator
//		var showstatus = ps.GetBoolPref("extensions.yass.showstatusbar");
//		document.getElementById("yass_status").hidden = !showstatus;
//		yassev.m_enable = showstatus;
//		yassev.update_indicator(presetid);

		// contextmenu
//		this.m_pref.showcontextmenu = ps.GetBoolPref("extensions.yass.showcontextmenu");

	},

	scroll: function(val)
	{
		var ev = { preventDefault: function(){}, stopPropagation: function(){}, detail: val, type: "shortcut" };
		this.handleEvent(ev);
	},

	change_preset: function(val)
	{
		this.m_prefservice.SetCharPref("extensions.yass.selectedpreset",val);
		this.refresh_preferences(null);
	},

	toggle_enable: function(sw)
	{
		this.m_prefservice.SetCharPref("extensions.yass.enabled",sw);
		this.refresh_preferences(null);
	},

	request_listener: function(req,send,res){
		if(req.msg == "iframe_push"){
			if(document == null) return;
			if(document.URL.indexOf(req.src) != 0) return;
			yass.m_frameelement = req;
			yass.dump("frame element set by push " + req.src + " , " + req.scrolling + " , " + req.topframe);
			res({});
		}
		else if(req.msg == "refresh_pref"){
			this.dump("got message refresh_pref");
			yass.oneshot(function(){yass.refresh_preferences();},10);
		}
	},

	_e_:0
};

// run immediately
(function(){
	var wheelevent = ("onwheel" in (document.documentElement || document.createElementNS("http://www.w3.org/1999/xhtml", "div"))) ? "wheel" : "mousewheel";

	window.addEventListener(wheelevent,yass,false);
	window.addEventListener("mousedown",yass,false);
	window.addEventListener("keydown",yass,false);
	window.addEventListener("resize",yass,false);

	window.yass_unloadlisteners = function() {
		window.removeEventListener(wheelevent,yass,false);
		window.removeEventListener("mousedown",yass,false);
		window.removeEventListener("keydown",yass,false);
		window.removeEventListener("resize",yass,false);
	};

	yass.oneshot(function(){yass.refresh_preferences();},10);

	chrome.extension.onMessage.addListener(function(req,send,res){yass.request_listener(req,send,res);});
})();

document.addEventListener("DOMContentLoaded",function(){
	var framearray = [];
	var iframes = document.getElementsByTagName("iframe");
	var frames = document.getElementsByTagName("frame");
	for(i in iframes) { framearray.push(iframes[i]); }
	for(i in frames) { framearray.push(frames[i]); }

	for(i in framearray) {
		var f = framearray[i];
		if(f.src != undefined && f.src.length >= 3 && f.src != document.location.href) 
			chrome.extension.sendMessage({msg:"iframe_broadcast", src:f.src, scrolling:""+f.getAttribute("scrolling"), topframe:false});
	}

	chrome.extension.sendMessage({msg:"iframe_pull", src:document.URL, referrer:document.referrer},function(res){
		if(res === null) return; // i am top frame
		yass.m_frameelement = res;
		yass.dump("frame element set " + res.src + " , " + res.scrolling + " , " + res.topframe);
	});

//	yass.incorrect_body_height_issue();


},false);




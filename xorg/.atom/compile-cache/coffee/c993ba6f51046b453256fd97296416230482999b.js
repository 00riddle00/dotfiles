(function() {
  var GlobalVimState, StatusBarManager, VimMode, VimState, dispatchKeyboardEvent, dispatchTextEvent, getEditorElement, globalVimState, keydown, mockPlatform, ref, statusBarManager, unmockPlatform,
    slice = [].slice;

  VimState = require('../lib/vim-state');

  GlobalVimState = require('../lib/global-vim-state');

  VimMode = require('../lib/vim-mode');

  StatusBarManager = require('../lib/status-bar-manager');

  ref = [], globalVimState = ref[0], statusBarManager = ref[1];

  beforeEach(function() {
    atom.workspace || (atom.workspace = {});
    statusBarManager = null;
    globalVimState = null;
    return spyOn(atom, 'beep');
  });

  getEditorElement = function(callback) {
    var textEditor;
    textEditor = null;
    waitsForPromise(function() {
      return atom.workspace.open().then(function(e) {
        return textEditor = e;
      });
    });
    return runs(function() {
      var element;
      element = atom.views.getView(textEditor);
      element.setUpdatedSynchronously(true);
      element.classList.add('vim-mode');
      if (statusBarManager == null) {
        statusBarManager = new StatusBarManager;
      }
      if (globalVimState == null) {
        globalVimState = new GlobalVimState;
      }
      element.vimState = new VimState(element, statusBarManager, globalVimState);
      element.addEventListener("keydown", function(e) {
        return atom.keymaps.handleKeyboardEvent(e);
      });
      document.createElement("html").appendChild(element);
      return callback(element);
    });
  };

  mockPlatform = function(editorElement, platform) {
    var wrapper;
    wrapper = document.createElement('div');
    wrapper.className = platform;
    return wrapper.appendChild(editorElement);
  };

  unmockPlatform = function(editorElement) {
    return editorElement.parentNode.removeChild(editorElement);
  };

  dispatchKeyboardEvent = function() {
    var e, eventArgs, target;
    target = arguments[0], eventArgs = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    e = document.createEvent('KeyboardEvent');
    e.initKeyboardEvent.apply(e, eventArgs);
    if (e.keyCode === 0) {
      Object.defineProperty(e, 'keyCode', {
        get: function() {
          return void 0;
        }
      });
    }
    return target.dispatchEvent(e);
  };

  dispatchTextEvent = function() {
    var e, eventArgs, target;
    target = arguments[0], eventArgs = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    e = document.createEvent('TextEvent');
    e.initTextEvent.apply(e, eventArgs);
    return target.dispatchEvent(e);
  };

  keydown = function(key, arg) {
    var alt, canceled, ctrl, element, eventArgs, meta, raw, ref1, shift;
    ref1 = arg != null ? arg : {}, element = ref1.element, ctrl = ref1.ctrl, shift = ref1.shift, alt = ref1.alt, meta = ref1.meta, raw = ref1.raw;
    if (!(key === 'escape' || (raw != null))) {
      key = "U+" + (key.charCodeAt(0).toString(16));
    }
    element || (element = document.activeElement);
    eventArgs = [false, true, null, key, 0, ctrl, alt, shift, meta];
    canceled = !dispatchKeyboardEvent.apply(null, [element, 'keydown'].concat(slice.call(eventArgs)));
    dispatchKeyboardEvent.apply(null, [element, 'keypress'].concat(slice.call(eventArgs)));
    if (!canceled) {
      if (dispatchTextEvent.apply(null, [element, 'textInput'].concat(slice.call(eventArgs)))) {
        element.value += key;
      }
    }
    return dispatchKeyboardEvent.apply(null, [element, 'keyup'].concat(slice.call(eventArgs)));
  };

  module.exports = {
    keydown: keydown,
    getEditorElement: getEditorElement,
    mockPlatform: mockPlatform,
    unmockPlatform: unmockPlatform
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL3NwZWMvc3BlYy1oZWxwZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw2TEFBQTtJQUFBOztFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsa0JBQVI7O0VBQ1gsY0FBQSxHQUFpQixPQUFBLENBQVEseUJBQVI7O0VBQ2pCLE9BQUEsR0FBVyxPQUFBLENBQVEsaUJBQVI7O0VBQ1gsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDJCQUFSOztFQUVuQixNQUFxQyxFQUFyQyxFQUFDLHVCQUFELEVBQWlCOztFQUVqQixVQUFBLENBQVcsU0FBQTtJQUNULElBQUksQ0FBQyxjQUFMLElBQUksQ0FBQyxZQUFjO0lBQ25CLGdCQUFBLEdBQW1CO0lBQ25CLGNBQUEsR0FBaUI7V0FDakIsS0FBQSxDQUFNLElBQU4sRUFBWSxNQUFaO0VBSlMsQ0FBWDs7RUFNQSxnQkFBQSxHQUFtQixTQUFDLFFBQUQ7QUFDakIsUUFBQTtJQUFBLFVBQUEsR0FBYTtJQUViLGVBQUEsQ0FBZ0IsU0FBQTthQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsU0FBQyxDQUFEO2VBQ3pCLFVBQUEsR0FBYTtNQURZLENBQTNCO0lBRGMsQ0FBaEI7V0FJQSxJQUFBLENBQUssU0FBQTtBQUNILFVBQUE7TUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLFVBQW5CO01BQ1YsT0FBTyxDQUFDLHVCQUFSLENBQWdDLElBQWhDO01BQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFsQixDQUFzQixVQUF0Qjs7UUFDQSxtQkFBb0IsSUFBSTs7O1FBQ3hCLGlCQUFrQixJQUFJOztNQUN0QixPQUFPLENBQUMsUUFBUixHQUF1QixJQUFBLFFBQUEsQ0FBUyxPQUFULEVBQWtCLGdCQUFsQixFQUFvQyxjQUFwQztNQUV2QixPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsU0FBekIsRUFBb0MsU0FBQyxDQUFEO2VBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQWIsQ0FBaUMsQ0FBakM7TUFEa0MsQ0FBcEM7TUFJQSxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QixDQUE4QixDQUFDLFdBQS9CLENBQTJDLE9BQTNDO2FBRUEsUUFBQSxDQUFTLE9BQVQ7SUFkRyxDQUFMO0VBUGlCOztFQXVCbkIsWUFBQSxHQUFlLFNBQUMsYUFBRCxFQUFnQixRQUFoQjtBQUNiLFFBQUE7SUFBQSxPQUFBLEdBQVUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7SUFDVixPQUFPLENBQUMsU0FBUixHQUFvQjtXQUNwQixPQUFPLENBQUMsV0FBUixDQUFvQixhQUFwQjtFQUhhOztFQUtmLGNBQUEsR0FBaUIsU0FBQyxhQUFEO1dBQ2YsYUFBYSxDQUFDLFVBQVUsQ0FBQyxXQUF6QixDQUFxQyxhQUFyQztFQURlOztFQUdqQixxQkFBQSxHQUF3QixTQUFBO0FBQ3RCLFFBQUE7SUFEdUIsdUJBQVE7SUFDL0IsQ0FBQSxHQUFJLFFBQVEsQ0FBQyxXQUFULENBQXFCLGVBQXJCO0lBQ0osQ0FBQyxDQUFDLGlCQUFGLFVBQW9CLFNBQXBCO0lBRUEsSUFBMEQsQ0FBQyxDQUFDLE9BQUYsS0FBYSxDQUF2RTtNQUFBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLENBQXRCLEVBQXlCLFNBQXpCLEVBQW9DO1FBQUEsR0FBQSxFQUFLLFNBQUE7aUJBQUc7UUFBSCxDQUFMO09BQXBDLEVBQUE7O1dBQ0EsTUFBTSxDQUFDLGFBQVAsQ0FBcUIsQ0FBckI7RUFMc0I7O0VBT3hCLGlCQUFBLEdBQW9CLFNBQUE7QUFDbEIsUUFBQTtJQURtQix1QkFBUTtJQUMzQixDQUFBLEdBQUksUUFBUSxDQUFDLFdBQVQsQ0FBcUIsV0FBckI7SUFDSixDQUFDLENBQUMsYUFBRixVQUFnQixTQUFoQjtXQUNBLE1BQU0sQ0FBQyxhQUFQLENBQXFCLENBQXJCO0VBSGtCOztFQUtwQixPQUFBLEdBQVUsU0FBQyxHQUFELEVBQU0sR0FBTjtBQUNSLFFBQUE7eUJBRGMsTUFBdUMsSUFBdEMsd0JBQVMsa0JBQU0sb0JBQU8sZ0JBQUssa0JBQU07SUFDaEQsSUFBQSxDQUFBLENBQW1ELEdBQUEsS0FBTyxRQUFQLElBQW1CLGFBQXRFLENBQUE7TUFBQSxHQUFBLEdBQU0sSUFBQSxHQUFJLENBQUMsR0FBRyxDQUFDLFVBQUosQ0FBZSxDQUFmLENBQWlCLENBQUMsUUFBbEIsQ0FBMkIsRUFBM0IsQ0FBRCxFQUFWOztJQUNBLFlBQUEsVUFBWSxRQUFRLENBQUM7SUFDckIsU0FBQSxHQUFZLENBQ1YsS0FEVSxFQUVWLElBRlUsRUFHVixJQUhVLEVBSVYsR0FKVSxFQUtWLENBTFUsRUFNVixJQU5VLEVBTUosR0FOSSxFQU1DLEtBTkQsRUFNUSxJQU5SO0lBU1osUUFBQSxHQUFXLENBQUkscUJBQUEsYUFBc0IsQ0FBQSxPQUFBLEVBQVMsU0FBVyxTQUFBLFdBQUEsU0FBQSxDQUFBLENBQTFDO0lBQ2YscUJBQUEsYUFBc0IsQ0FBQSxPQUFBLEVBQVMsVUFBWSxTQUFBLFdBQUEsU0FBQSxDQUFBLENBQTNDO0lBQ0EsSUFBRyxDQUFJLFFBQVA7TUFDRSxJQUFHLGlCQUFBLGFBQWtCLENBQUEsT0FBQSxFQUFTLFdBQWEsU0FBQSxXQUFBLFNBQUEsQ0FBQSxDQUF4QyxDQUFIO1FBQ0UsT0FBTyxDQUFDLEtBQVIsSUFBaUIsSUFEbkI7T0FERjs7V0FHQSxxQkFBQSxhQUFzQixDQUFBLE9BQUEsRUFBUyxPQUFTLFNBQUEsV0FBQSxTQUFBLENBQUEsQ0FBeEM7RUFqQlE7O0VBbUJWLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQUMsU0FBQSxPQUFEO0lBQVUsa0JBQUEsZ0JBQVY7SUFBNEIsY0FBQSxZQUE1QjtJQUEwQyxnQkFBQSxjQUExQzs7QUEzRWpCIiwic291cmNlc0NvbnRlbnQiOlsiVmltU3RhdGUgPSByZXF1aXJlICcuLi9saWIvdmltLXN0YXRlJ1xuR2xvYmFsVmltU3RhdGUgPSByZXF1aXJlICcuLi9saWIvZ2xvYmFsLXZpbS1zdGF0ZSdcblZpbU1vZGUgID0gcmVxdWlyZSAnLi4vbGliL3ZpbS1tb2RlJ1xuU3RhdHVzQmFyTWFuYWdlciA9IHJlcXVpcmUgJy4uL2xpYi9zdGF0dXMtYmFyLW1hbmFnZXInXG5cbltnbG9iYWxWaW1TdGF0ZSwgc3RhdHVzQmFyTWFuYWdlcl0gPSBbXVxuXG5iZWZvcmVFYWNoIC0+XG4gIGF0b20ud29ya3NwYWNlIHx8PSB7fVxuICBzdGF0dXNCYXJNYW5hZ2VyID0gbnVsbFxuICBnbG9iYWxWaW1TdGF0ZSA9IG51bGxcbiAgc3B5T24oYXRvbSwgJ2JlZXAnKVxuXG5nZXRFZGl0b3JFbGVtZW50ID0gKGNhbGxiYWNrKSAtPlxuICB0ZXh0RWRpdG9yID0gbnVsbFxuXG4gIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oKS50aGVuIChlKSAtPlxuICAgICAgdGV4dEVkaXRvciA9IGVcblxuICBydW5zIC0+XG4gICAgZWxlbWVudCA9IGF0b20udmlld3MuZ2V0Vmlldyh0ZXh0RWRpdG9yKVxuICAgIGVsZW1lbnQuc2V0VXBkYXRlZFN5bmNocm9ub3VzbHkodHJ1ZSlcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3ZpbS1tb2RlJylcbiAgICBzdGF0dXNCYXJNYW5hZ2VyID89IG5ldyBTdGF0dXNCYXJNYW5hZ2VyXG4gICAgZ2xvYmFsVmltU3RhdGUgPz0gbmV3IEdsb2JhbFZpbVN0YXRlXG4gICAgZWxlbWVudC52aW1TdGF0ZSA9IG5ldyBWaW1TdGF0ZShlbGVtZW50LCBzdGF0dXNCYXJNYW5hZ2VyLCBnbG9iYWxWaW1TdGF0ZSlcblxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcImtleWRvd25cIiwgKGUpIC0+XG4gICAgICBhdG9tLmtleW1hcHMuaGFuZGxlS2V5Ym9hcmRFdmVudChlKVxuXG4gICAgIyBtb2NrIHBhcmVudCBlbGVtZW50IGZvciB0aGUgdGV4dCBlZGl0b3JcbiAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaHRtbFwiKS5hcHBlbmRDaGlsZChlbGVtZW50KVxuXG4gICAgY2FsbGJhY2soZWxlbWVudClcblxubW9ja1BsYXRmb3JtID0gKGVkaXRvckVsZW1lbnQsIHBsYXRmb3JtKSAtPlxuICB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgd3JhcHBlci5jbGFzc05hbWUgPSBwbGF0Zm9ybVxuICB3cmFwcGVyLmFwcGVuZENoaWxkKGVkaXRvckVsZW1lbnQpXG5cbnVubW9ja1BsYXRmb3JtID0gKGVkaXRvckVsZW1lbnQpIC0+XG4gIGVkaXRvckVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlZGl0b3JFbGVtZW50KVxuXG5kaXNwYXRjaEtleWJvYXJkRXZlbnQgPSAodGFyZ2V0LCBldmVudEFyZ3MuLi4pIC0+XG4gIGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnS2V5Ym9hcmRFdmVudCcpXG4gIGUuaW5pdEtleWJvYXJkRXZlbnQoZXZlbnRBcmdzLi4uKVxuICAjIDAgaXMgdGhlIGRlZmF1bHQsIGFuZCBpdCdzIHZhbGlkIEFTQ0lJLCBidXQgaXQncyB3cm9uZy5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsICdrZXlDb2RlJywgZ2V0OiAtPiB1bmRlZmluZWQpIGlmIGUua2V5Q29kZSBpcyAwXG4gIHRhcmdldC5kaXNwYXRjaEV2ZW50IGVcblxuZGlzcGF0Y2hUZXh0RXZlbnQgPSAodGFyZ2V0LCBldmVudEFyZ3MuLi4pIC0+XG4gIGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnVGV4dEV2ZW50JylcbiAgZS5pbml0VGV4dEV2ZW50KGV2ZW50QXJncy4uLilcbiAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQgZVxuXG5rZXlkb3duID0gKGtleSwge2VsZW1lbnQsIGN0cmwsIHNoaWZ0LCBhbHQsIG1ldGEsIHJhd309e30pIC0+XG4gIGtleSA9IFwiVSsje2tleS5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KX1cIiB1bmxlc3Mga2V5IGlzICdlc2NhcGUnIG9yIHJhdz9cbiAgZWxlbWVudCB8fD0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICBldmVudEFyZ3MgPSBbXG4gICAgZmFsc2UsICMgYnViYmxlc1xuICAgIHRydWUsICMgY2FuY2VsYWJsZVxuICAgIG51bGwsICMgdmlld1xuICAgIGtleSwgICMga2V5XG4gICAgMCwgICAgIyBsb2NhdGlvblxuICAgIGN0cmwsIGFsdCwgc2hpZnQsIG1ldGFcbiAgXVxuXG4gIGNhbmNlbGVkID0gbm90IGRpc3BhdGNoS2V5Ym9hcmRFdmVudChlbGVtZW50LCAna2V5ZG93bicsIGV2ZW50QXJncy4uLilcbiAgZGlzcGF0Y2hLZXlib2FyZEV2ZW50KGVsZW1lbnQsICdrZXlwcmVzcycsIGV2ZW50QXJncy4uLilcbiAgaWYgbm90IGNhbmNlbGVkXG4gICAgaWYgZGlzcGF0Y2hUZXh0RXZlbnQoZWxlbWVudCwgJ3RleHRJbnB1dCcsIGV2ZW50QXJncy4uLilcbiAgICAgIGVsZW1lbnQudmFsdWUgKz0ga2V5XG4gIGRpc3BhdGNoS2V5Ym9hcmRFdmVudChlbGVtZW50LCAna2V5dXAnLCBldmVudEFyZ3MuLi4pXG5cbm1vZHVsZS5leHBvcnRzID0ge2tleWRvd24sIGdldEVkaXRvckVsZW1lbnQsIG1vY2tQbGF0Zm9ybSwgdW5tb2NrUGxhdGZvcm19XG4iXX0=

(function() {
  var settings;

  settings = {
    config: {
      startInInsertMode: {
        type: 'boolean',
        "default": false
      },
      useSmartcaseForSearch: {
        type: 'boolean',
        "default": false
      },
      wrapLeftRightMotion: {
        type: 'boolean',
        "default": false
      },
      useClipboardAsDefaultRegister: {
        type: 'boolean',
        "default": true
      },
      numberRegex: {
        type: 'string',
        "default": '-?[0-9]+',
        description: 'Use this to control how Ctrl-A/Ctrl-X finds numbers; use "(?:\\B-)?[0-9]+" to treat numbers as positive if the minus is preceded by a character, e.g. in "identifier-1".'
      }
    }
  };

  Object.keys(settings.config).forEach(function(k) {
    return settings[k] = function() {
      return atom.config.get('vim-mode.' + k);
    };
  });

  settings.defaultRegister = function() {
    if (settings.useClipboardAsDefaultRegister()) {
      return '*';
    } else {
      return '"';
    }
  };

  module.exports = settings;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9zZXR0aW5ncy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBOztFQUFBLFFBQUEsR0FDRTtJQUFBLE1BQUEsRUFDRTtNQUFBLGlCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtPQURGO01BR0EscUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO09BSkY7TUFNQSxtQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7T0FQRjtNQVNBLDZCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtPQVZGO01BWUEsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLFVBRFQ7UUFFQSxXQUFBLEVBQWEsMEtBRmI7T0FiRjtLQURGOzs7RUFrQkYsTUFBTSxDQUFDLElBQVAsQ0FBWSxRQUFRLENBQUMsTUFBckIsQ0FBNEIsQ0FBQyxPQUE3QixDQUFxQyxTQUFDLENBQUQ7V0FDbkMsUUFBUyxDQUFBLENBQUEsQ0FBVCxHQUFjLFNBQUE7YUFDWixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsV0FBQSxHQUFZLENBQTVCO0lBRFk7RUFEcUIsQ0FBckM7O0VBSUEsUUFBUSxDQUFDLGVBQVQsR0FBMkIsU0FBQTtJQUN6QixJQUFHLFFBQVEsQ0FBQyw2QkFBVCxDQUFBLENBQUg7YUFBaUQsSUFBakQ7S0FBQSxNQUFBO2FBQTBELElBQTFEOztFQUR5Qjs7RUFHM0IsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUExQmpCIiwic291cmNlc0NvbnRlbnQiOlsiXG5zZXR0aW5ncyA9XG4gIGNvbmZpZzpcbiAgICBzdGFydEluSW5zZXJ0TW9kZTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB1c2VTbWFydGNhc2VGb3JTZWFyY2g6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgd3JhcExlZnRSaWdodE1vdGlvbjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB1c2VDbGlwYm9hcmRBc0RlZmF1bHRSZWdpc3RlcjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIG51bWJlclJlZ2V4OlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICctP1swLTldKydcbiAgICAgIGRlc2NyaXB0aW9uOiAnVXNlIHRoaXMgdG8gY29udHJvbCBob3cgQ3RybC1BL0N0cmwtWCBmaW5kcyBudW1iZXJzOyB1c2UgXCIoPzpcXFxcQi0pP1swLTldK1wiIHRvIHRyZWF0IG51bWJlcnMgYXMgcG9zaXRpdmUgaWYgdGhlIG1pbnVzIGlzIHByZWNlZGVkIGJ5IGEgY2hhcmFjdGVyLCBlLmcuIGluIFwiaWRlbnRpZmllci0xXCIuJ1xuXG5PYmplY3Qua2V5cyhzZXR0aW5ncy5jb25maWcpLmZvckVhY2ggKGspIC0+XG4gIHNldHRpbmdzW2tdID0gLT5cbiAgICBhdG9tLmNvbmZpZy5nZXQoJ3ZpbS1tb2RlLicraylcblxuc2V0dGluZ3MuZGVmYXVsdFJlZ2lzdGVyID0gLT5cbiAgaWYgc2V0dGluZ3MudXNlQ2xpcGJvYXJkQXNEZWZhdWx0UmVnaXN0ZXIoKSB0aGVuICcqJyBlbHNlICdcIidcblxubW9kdWxlLmV4cG9ydHMgPSBzZXR0aW5nc1xuIl19

(function() {
  var Prefix, Register, Repeat,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Prefix = (function() {
    function Prefix() {}

    Prefix.prototype.complete = null;

    Prefix.prototype.composedObject = null;

    Prefix.prototype.isComplete = function() {
      return this.complete;
    };

    Prefix.prototype.isRecordable = function() {
      return this.composedObject.isRecordable();
    };

    Prefix.prototype.compose = function(composedObject1) {
      this.composedObject = composedObject1;
      return this.complete = true;
    };

    Prefix.prototype.execute = function() {
      var base;
      return typeof (base = this.composedObject).execute === "function" ? base.execute(this.count) : void 0;
    };

    Prefix.prototype.select = function() {
      var base;
      return typeof (base = this.composedObject).select === "function" ? base.select(this.count) : void 0;
    };

    Prefix.prototype.isLinewise = function() {
      var base;
      return typeof (base = this.composedObject).isLinewise === "function" ? base.isLinewise() : void 0;
    };

    return Prefix;

  })();

  Repeat = (function(superClass) {
    extend(Repeat, superClass);

    Repeat.prototype.count = null;

    function Repeat(count) {
      this.count = count;
      this.complete = false;
    }

    Repeat.prototype.addDigit = function(digit) {
      return this.count = this.count * 10 + digit;
    };

    return Repeat;

  })(Prefix);

  Register = (function(superClass) {
    extend(Register, superClass);

    Register.prototype.name = null;

    function Register(name) {
      this.name = name;
      this.complete = false;
    }

    Register.prototype.compose = function(composedObject) {
      Register.__super__.compose.call(this, composedObject);
      if (composedObject.register != null) {
        return composedObject.register = this.name;
      }
    };

    return Register;

  })(Prefix);

  module.exports = {
    Repeat: Repeat,
    Register: Register
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9wcmVmaXhlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHdCQUFBO0lBQUE7OztFQUFNOzs7cUJBQ0osUUFBQSxHQUFVOztxQkFDVixjQUFBLEdBQWdCOztxQkFFaEIsVUFBQSxHQUFZLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSjs7cUJBRVosWUFBQSxHQUFjLFNBQUE7YUFBRyxJQUFDLENBQUEsY0FBYyxDQUFDLFlBQWhCLENBQUE7SUFBSDs7cUJBT2QsT0FBQSxHQUFTLFNBQUMsZUFBRDtNQUFDLElBQUMsQ0FBQSxpQkFBRDthQUNSLElBQUMsQ0FBQSxRQUFELEdBQVk7SUFETDs7cUJBTVQsT0FBQSxHQUFTLFNBQUE7QUFDUCxVQUFBOzhFQUFlLENBQUMsUUFBUyxJQUFDLENBQUE7SUFEbkI7O3FCQU1ULE1BQUEsR0FBUSxTQUFBO0FBQ04sVUFBQTs2RUFBZSxDQUFDLE9BQVEsSUFBQyxDQUFBO0lBRG5COztxQkFHUixVQUFBLEdBQVksU0FBQTtBQUNWLFVBQUE7aUZBQWUsQ0FBQztJQUROOzs7Ozs7RUFPUjs7O3FCQUNKLEtBQUEsR0FBTzs7SUFHTSxnQkFBQyxLQUFEO01BQUMsSUFBQyxDQUFBLFFBQUQ7TUFBVyxJQUFDLENBQUEsUUFBRCxHQUFZO0lBQXhCOztxQkFPYixRQUFBLEdBQVUsU0FBQyxLQUFEO2FBQ1IsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUEsS0FBRCxHQUFTLEVBQVQsR0FBYztJQURmOzs7O0tBWFM7O0VBaUJmOzs7dUJBQ0osSUFBQSxHQUFNOztJQUdPLGtCQUFDLElBQUQ7TUFBQyxJQUFDLENBQUEsT0FBRDtNQUFVLElBQUMsQ0FBQSxRQUFELEdBQVk7SUFBdkI7O3VCQU9iLE9BQUEsR0FBUyxTQUFDLGNBQUQ7TUFDUCxzQ0FBTSxjQUFOO01BQ0EsSUFBbUMsK0JBQW5DO2VBQUEsY0FBYyxDQUFDLFFBQWYsR0FBMEIsSUFBQyxDQUFBLEtBQTNCOztJQUZPOzs7O0tBWFk7O0VBZXZCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQUMsUUFBQSxNQUFEO0lBQVMsVUFBQSxRQUFUOztBQW5FakIiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBQcmVmaXhcbiAgY29tcGxldGU6IG51bGxcbiAgY29tcG9zZWRPYmplY3Q6IG51bGxcblxuICBpc0NvbXBsZXRlOiAtPiBAY29tcGxldGVcblxuICBpc1JlY29yZGFibGU6IC0+IEBjb21wb3NlZE9iamVjdC5pc1JlY29yZGFibGUoKVxuXG4gICMgUHVibGljOiBNYXJrcyB0aGlzIGFzIGNvbXBsZXRlIHVwb24gcmVjZWl2aW5nIGFuIG9iamVjdCB0byBjb21wb3NlIHdpdGguXG4gICNcbiAgIyBjb21wb3NlZE9iamVjdCAtIFRoZSBuZXh0IG1vdGlvbiBvciBvcGVyYXRvci5cbiAgI1xuICAjIFJldHVybnMgbm90aGluZy5cbiAgY29tcG9zZTogKEBjb21wb3NlZE9iamVjdCkgLT5cbiAgICBAY29tcGxldGUgPSB0cnVlXG5cbiAgIyBQdWJsaWM6IEV4ZWN1dGVzIHRoZSBjb21wb3NlZCBvcGVyYXRvciBvciBtb3Rpb24uXG4gICNcbiAgIyBSZXR1cm5zIG5vdGhpbmcuXG4gIGV4ZWN1dGU6IC0+XG4gICAgQGNvbXBvc2VkT2JqZWN0LmV4ZWN1dGU/KEBjb3VudClcblxuICAjIFB1YmxpYzogU2VsZWN0cyB1c2luZyB0aGUgY29tcG9zZWQgbW90aW9uLlxuICAjXG4gICMgUmV0dXJucyBhbiBhcnJheSBvZiBib29sZWFucyByZXByZXNlbnRpbmcgd2hldGhlciBlYWNoIHNlbGVjdGlvbnMnIHN1Y2Nlc3MuXG4gIHNlbGVjdDogLT5cbiAgICBAY29tcG9zZWRPYmplY3Quc2VsZWN0PyhAY291bnQpXG5cbiAgaXNMaW5ld2lzZTogLT5cbiAgICBAY29tcG9zZWRPYmplY3QuaXNMaW5ld2lzZT8oKVxuXG4jXG4jIFVzZWQgdG8gdHJhY2sgdGhlIG51bWJlciBvZiB0aW1lcyBlaXRoZXIgYSBtb3Rpb24gb3Igb3BlcmF0b3Igc2hvdWxkXG4jIGJlIHJlcGVhdGVkLlxuI1xuY2xhc3MgUmVwZWF0IGV4dGVuZHMgUHJlZml4XG4gIGNvdW50OiBudWxsXG5cbiAgIyBjb3VudCAtIFRoZSBpbml0aWFsIGRpZ2l0IG9mIHRoZSByZXBlYXQgc2VxdWVuY2UuXG4gIGNvbnN0cnVjdG9yOiAoQGNvdW50KSAtPiBAY29tcGxldGUgPSBmYWxzZVxuXG4gICMgUHVibGljOiBBZGRzIGFuIGFkZGl0aW9uYWwgZGlnaXQgdG8gdGhpcyByZXBlYXQgc2VxdWVuY2UuXG4gICNcbiAgIyBkaWdpdCAtIEEgc2luZ2xlIGRpZ2l0LCAwLTkuXG4gICNcbiAgIyBSZXR1cm5zIG5vdGhpbmcuXG4gIGFkZERpZ2l0OiAoZGlnaXQpIC0+XG4gICAgQGNvdW50ID0gQGNvdW50ICogMTAgKyBkaWdpdFxuXG4jXG4jIFVzZWQgdG8gdHJhY2sgd2hpY2ggcmVnaXN0ZXIgdGhlIGZvbGxvd2luZyBvcGVyYXRvciBzaG91bGQgb3BlcmF0ZSBvbi5cbiNcbmNsYXNzIFJlZ2lzdGVyIGV4dGVuZHMgUHJlZml4XG4gIG5hbWU6IG51bGxcblxuICAjIG5hbWUgLSBUaGUgc2luZ2xlIGNoYXJhY3RlciBuYW1lIG9mIHRoZSBkZXNpcmVkIHJlZ2lzdGVyXG4gIGNvbnN0cnVjdG9yOiAoQG5hbWUpIC0+IEBjb21wbGV0ZSA9IGZhbHNlXG5cbiAgIyBQdWJsaWM6IE1hcmtzIGFzIGNvbXBsZXRlIGFuZCBzZXRzIHRoZSBvcGVyYXRvcidzIHJlZ2lzdGVyIGlmIGl0IGFjY2VwdHMgaXQuXG4gICNcbiAgIyBjb21wb3NlZE9wZXJhdG9yIC0gVGhlIG9wZXJhdG9yIHRoaXMgcmVnaXN0ZXIgcGVydGFpbnMgdG8uXG4gICNcbiAgIyBSZXR1cm5zIG5vdGhpbmcuXG4gIGNvbXBvc2U6IChjb21wb3NlZE9iamVjdCkgLT5cbiAgICBzdXBlcihjb21wb3NlZE9iamVjdClcbiAgICBjb21wb3NlZE9iamVjdC5yZWdpc3RlciA9IEBuYW1lIGlmIGNvbXBvc2VkT2JqZWN0LnJlZ2lzdGVyP1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtSZXBlYXQsIFJlZ2lzdGVyfVxuIl19

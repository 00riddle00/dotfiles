(function() {
  var Range;

  Range = require('atom').Range;

  module.exports = {
    copyType: function(text) {
      if (text.lastIndexOf("\n") === text.length - 1) {
        return 'linewise';
      } else if (text.lastIndexOf("\r") === text.length - 1) {
        return 'linewise';
      } else {
        return 'character';
      }
    },
    mergeRanges: function(oldRange, newRange) {
      oldRange = Range.fromObject(oldRange);
      newRange = Range.fromObject(newRange);
      if (oldRange.isEmpty()) {
        return newRange;
      } else {
        return oldRange.union(newRange);
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi91dGlscy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVI7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FPRTtJQUFBLFFBQUEsRUFBVSxTQUFDLElBQUQ7TUFDUixJQUFHLElBQUksQ0FBQyxXQUFMLENBQWlCLElBQWpCLENBQUEsS0FBMEIsSUFBSSxDQUFDLE1BQUwsR0FBYyxDQUEzQztlQUNFLFdBREY7T0FBQSxNQUVLLElBQUcsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsSUFBakIsQ0FBQSxLQUEwQixJQUFJLENBQUMsTUFBTCxHQUFjLENBQTNDO2VBQ0gsV0FERztPQUFBLE1BQUE7ZUFHSCxZQUhHOztJQUhHLENBQVY7SUFXQSxXQUFBLEVBQWEsU0FBQyxRQUFELEVBQVcsUUFBWDtNQUNYLFFBQUEsR0FBVyxLQUFLLENBQUMsVUFBTixDQUFpQixRQUFqQjtNQUNYLFFBQUEsR0FBVyxLQUFLLENBQUMsVUFBTixDQUFpQixRQUFqQjtNQUNYLElBQUcsUUFBUSxDQUFDLE9BQVQsQ0FBQSxDQUFIO2VBQ0UsU0FERjtPQUFBLE1BQUE7ZUFHRSxRQUFRLENBQUMsS0FBVCxDQUFlLFFBQWYsRUFIRjs7SUFIVyxDQVhiOztBQVRGIiwic291cmNlc0NvbnRlbnQiOlsie1JhbmdlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgIyBQdWJsaWM6IERldGVybWluZXMgaWYgYSBzdHJpbmcgc2hvdWxkIGJlIGNvbnNpZGVyZWQgbGluZXdpc2Ugb3IgY2hhcmFjdGVyXG4gICNcbiAgIyB0ZXh0IC0gVGhlIHN0cmluZyB0byBjb25zaWRlclxuICAjXG4gICMgUmV0dXJucyAnbGluZXdpc2UnIGlmIHRoZSBzdHJpbmcgZW5kcyB3aXRoIGEgbGluZSByZXR1cm4gYW5kICdjaGFyYWN0ZXInXG4gICMgIG90aGVyd2lzZS5cbiAgY29weVR5cGU6ICh0ZXh0KSAtPlxuICAgIGlmIHRleHQubGFzdEluZGV4T2YoXCJcXG5cIikgaXMgdGV4dC5sZW5ndGggLSAxXG4gICAgICAnbGluZXdpc2UnXG4gICAgZWxzZSBpZiB0ZXh0Lmxhc3RJbmRleE9mKFwiXFxyXCIpIGlzIHRleHQubGVuZ3RoIC0gMVxuICAgICAgJ2xpbmV3aXNlJ1xuICAgIGVsc2VcbiAgICAgICdjaGFyYWN0ZXInXG5cbiAgIyBQdWJsaWM6IHJldHVybiBhIHVuaW9uIG9mIHR3byByYW5nZXMsIG9yIHNpbXBseSB0aGUgbmV3UmFuZ2UgaWYgdGhlIG9sZFJhbmdlIGlzIGVtcHR5LlxuICAjXG4gICMgUmV0dXJucyBhIFJhbmdlXG4gIG1lcmdlUmFuZ2VzOiAob2xkUmFuZ2UsIG5ld1JhbmdlKSAtPlxuICAgIG9sZFJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdCBvbGRSYW5nZVxuICAgIG5ld1JhbmdlID0gUmFuZ2UuZnJvbU9iamVjdCBuZXdSYW5nZVxuICAgIGlmIG9sZFJhbmdlLmlzRW1wdHkoKVxuICAgICAgbmV3UmFuZ2VcbiAgICBlbHNlXG4gICAgICBvbGRSYW5nZS51bmlvbihuZXdSYW5nZSlcbiJdfQ==

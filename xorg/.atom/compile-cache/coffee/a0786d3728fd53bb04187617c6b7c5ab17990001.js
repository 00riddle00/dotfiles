(function() {
  var FailureTree, _, coffeestack, path, sourceMaps,
    slice = [].slice;

  path = require('path');

  _ = require('underscore');

  coffeestack = require('coffeestack');

  sourceMaps = {};

  module.exports = FailureTree = (function() {
    FailureTree.prototype.suites = null;

    function FailureTree() {
      this.suites = [];
    }

    FailureTree.prototype.isEmpty = function() {
      return this.suites.length === 0;
    };

    FailureTree.prototype.add = function(spec) {
      var base, base1, failure, failurePath, i, item, j, len, len1, name, name1, parent, parentSuite, ref, results;
      ref = spec.results().items_;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        if (!(item.passed_ === false)) {
          continue;
        }
        failurePath = [];
        parent = spec.suite;
        while (parent) {
          failurePath.unshift(parent);
          parent = parent.parentSuite;
        }
        parentSuite = this;
        for (j = 0, len1 = failurePath.length; j < len1; j++) {
          failure = failurePath[j];
          if ((base = parentSuite.suites)[name = failure.id] == null) {
            base[name] = {
              spec: failure,
              suites: [],
              specs: []
            };
          }
          parentSuite = parentSuite.suites[failure.id];
        }
        if ((base1 = parentSuite.specs)[name1 = spec.id] == null) {
          base1[name1] = {
            spec: spec,
            failures: []
          };
        }
        parentSuite.specs[spec.id].failures.push(item);
        results.push(this.filterStackTrace(item));
      }
      return results;
    };

    FailureTree.prototype.filterJasmineLines = function(stackTraceLines) {
      var index, jasminePattern, results;
      jasminePattern = /^\s*at\s+.*\(?.*[\\\/]jasmine(-[^\\\/]*)?\.js:\d+:\d+\)?\s*$/;
      index = 0;
      results = [];
      while (index < stackTraceLines.length) {
        if (jasminePattern.test(stackTraceLines[index])) {
          results.push(stackTraceLines.splice(index, 1));
        } else {
          results.push(index++);
        }
      }
      return results;
    };

    FailureTree.prototype.filterTrailingTimersLine = function(stackTraceLines) {
      if (/^(\s*at .* )\(timers\.js:\d+:\d+\)/.test(_.last(stackTraceLines))) {
        return stackTraceLines.pop();
      }
    };

    FailureTree.prototype.filterSetupLines = function(stackTraceLines) {
      var index, removeLine, results;
      removeLine = false;
      index = 0;
      results = [];
      while (index < stackTraceLines.length) {
        removeLine || (removeLine = /^\s*at Object\.jasmine\.executeSpecsInFolder/.test(stackTraceLines[index]));
        if (removeLine) {
          results.push(stackTraceLines.splice(index, 1));
        } else {
          results.push(index++);
        }
      }
      return results;
    };

    FailureTree.prototype.filterFailureMessageLine = function(failure, stackTraceLines) {
      var errorLines, message, stackTraceErrorMessage;
      errorLines = [];
      while (stackTraceLines.length > 0) {
        if (/^\s+at\s+.*\((.*):(\d+):(\d+)\)\s*$/.test(stackTraceLines[0])) {
          break;
        } else {
          errorLines.push(stackTraceLines.shift());
        }
      }
      stackTraceErrorMessage = errorLines.join('\n');
      message = failure.message;
      if (stackTraceErrorMessage !== message && stackTraceErrorMessage !== ("Error: " + message)) {
        return stackTraceLines.splice.apply(stackTraceLines, [0, 0].concat(slice.call(errorLines)));
      }
    };

    FailureTree.prototype.filterOriginLine = function(failure, stackTraceLines) {
      var column, filePath, line, match;
      if (stackTraceLines.length !== 1) {
        return stackTraceLines;
      }
      if (match = /^\s*at\s+((\[object Object\])|(null))\.<anonymous>\s+\((.*):(\d+):(\d+)\)\s*$/.exec(stackTraceLines[0])) {
        stackTraceLines.shift();
        filePath = path.relative(process.cwd(), match[4]);
        line = match[5];
        column = match[6];
        return failure.messageLine = filePath + ":" + line + ":" + column;
      }
    };

    FailureTree.prototype.filterStackTrace = function(failure) {
      var stackTrace, stackTraceLines;
      stackTrace = failure.trace.stack;
      if (!stackTrace) {
        return;
      }
      stackTraceLines = stackTrace.split('\n').filter(function(line) {
        return line;
      });
      this.filterJasmineLines(stackTraceLines);
      this.filterTrailingTimersLine(stackTraceLines);
      this.filterSetupLines(stackTraceLines);
      stackTrace = coffeestack.convertStackTrace(stackTraceLines.join('\n'), sourceMaps);
      if (!stackTrace) {
        return;
      }
      stackTraceLines = stackTrace.split('\n').filter(function(line) {
        return line;
      });
      this.filterFailureMessageLine(failure, stackTraceLines);
      this.filterOriginLine(failure, stackTraceLines);
      return failure.filteredStackTrace = stackTraceLines.join('\n');
    };

    FailureTree.prototype.forEachSpec = function(arg, callback, depth) {
      var child, failure, failures, i, j, k, len, len1, len2, ref, ref1, ref2, results, results1, spec, specs, suites;
      ref = arg != null ? arg : {}, spec = ref.spec, suites = ref.suites, specs = ref.specs, failures = ref.failures;
      if (depth == null) {
        depth = 0;
      }
      if (failures != null) {
        callback(spec, null, depth);
        results = [];
        for (i = 0, len = failures.length; i < len; i++) {
          failure = failures[i];
          results.push(callback(spec, failure, depth));
        }
        return results;
      } else {
        callback(spec, null, depth);
        depth++;
        ref1 = _.compact(suites);
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          child = ref1[j];
          this.forEachSpec(child, callback, depth);
        }
        ref2 = _.compact(specs);
        results1 = [];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          child = ref2[k];
          results1.push(this.forEachSpec(child, callback, depth));
        }
        return results1;
      }
    };

    FailureTree.prototype.forEach = function(callback) {
      var i, len, ref, results, suite;
      ref = _.compact(this.suites);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        suite = ref[i];
        results.push(this.forEachSpec(suite, callback));
      }
      return results;
    };

    return FailureTree;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL3Vzci9saWIvYXRvbS9ub2RlX21vZHVsZXMvamFzbWluZS1ub2RlL2xpYi9qYXNtaW5lLW5vZGUvZmFpbHVyZS10cmVlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNkNBQUE7SUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxZQUFSOztFQUNKLFdBQUEsR0FBYyxPQUFBLENBQVEsYUFBUjs7RUFFZCxVQUFBLEdBQWE7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FDTTswQkFDSixNQUFBLEdBQVE7O0lBRUsscUJBQUE7TUFDWCxJQUFDLENBQUEsTUFBRCxHQUFVO0lBREM7OzBCQUdiLE9BQUEsR0FBUyxTQUFBO2FBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEtBQWtCO0lBQXJCOzswQkFFVCxHQUFBLEdBQUssU0FBQyxJQUFEO0FBQ0gsVUFBQTtBQUFBO0FBQUE7V0FBQSxxQ0FBQTs7Y0FBdUMsSUFBSSxDQUFDLE9BQUwsS0FBZ0I7OztRQUNyRCxXQUFBLEdBQWM7UUFDZCxNQUFBLEdBQVMsSUFBSSxDQUFDO0FBQ2QsZUFBTSxNQUFOO1VBQ0UsV0FBVyxDQUFDLE9BQVosQ0FBb0IsTUFBcEI7VUFDQSxNQUFBLEdBQVMsTUFBTSxDQUFDO1FBRmxCO1FBSUEsV0FBQSxHQUFjO0FBQ2QsYUFBQSwrQ0FBQTs7O3lCQUNvQztjQUFDLElBQUEsRUFBTSxPQUFQO2NBQWdCLE1BQUEsRUFBUSxFQUF4QjtjQUE0QixLQUFBLEVBQU8sRUFBbkM7OztVQUNsQyxXQUFBLEdBQWMsV0FBVyxDQUFDLE1BQU8sQ0FBQSxPQUFPLENBQUMsRUFBUjtBQUZuQzs7eUJBSThCO1lBQUMsTUFBQSxJQUFEO1lBQU8sUUFBQSxFQUFTLEVBQWhCOzs7UUFDOUIsV0FBVyxDQUFDLEtBQU0sQ0FBQSxJQUFJLENBQUMsRUFBTCxDQUFRLENB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QUE7YUFBQSx3Q0FBQTs7d0JBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxLQUFiLEVBQW9CLFFBQXBCLEVBQThCLEtBQTlCO0FBQUE7d0JBUEY7O0lBRFc7OzBCQVViLE9BQUEsR0FBUyxTQUFDLFFBQUQ7QUFDUCxVQUFBO0FBQUE7QUFBQTtXQUFBLHFDQUFBOztxQkFBQSxJQUFDLENBQUEsV0FBRCxDQUFhLEtBQWIsRUFBb0IsUUFBcEI7QUFBQTs7SUFETzs7Ozs7QUE3R1giLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSAncGF0aCdcblxuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUnXG5jb2ZmZWVzdGFjayA9IHJlcXVpcmUgJ2NvZmZlZXN0YWNrJ1xuXG5zb3VyY2VNYXBzID0ge31cblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgRmFpbHVyZVRyZWVcbiAgc3VpdGVzOiBudWxsXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQHN1aXRlcyA9IFtdXG5cbiAgaXNFbXB0eTogLT4gQHN1aXRlcy5sZW5ndGggaXMgMFxuXG4gIGFkZDogKHNwZWMpIC0+XG4gICAgZm9yIGl0ZW0gaW4gc3BlYy5yZXN1bHRzKCkuaXRlbXNfIHdoZW4gaXRlbS5wYXNzZWRfIGlzIGZhbHNlXG4gICAgICBmYWlsdXJlUGF0aCA9IFtdXG4gICAgICBwYXJlbnQgPSBzcGVjLnN1aXRlXG4gICAgICB3aGlsZSBwYXJlbnRcbiAgICAgICAgZmFpbHVyZVBhdGgudW5zaGlmdChwYXJlbnQpXG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRTdWl0ZVxuXG4gICAgICBwYXJlbnRTdWl0ZSA9IHRoaXNcbiAgICAgIGZvciBmYWlsdXJlIGluIGZhaWx1cmVQYXRoXG4gICAgICAgIHBhcmVudFN1aXRlLnN1aXRlc1tmYWlsdXJlLmlkXSA/PSB7c3BlYzogZmFpbHVyZSwgc3VpdGVzOiBbXSwgc3BlY3M6IFtdfVxuICAgICAgICBwYXJlbnRTdWl0ZSA9IHBhcmVudFN1aXRlLnN1aXRlc1tmYWlsdXJlLmlkXVxuXG4gICAgICBwYXJlbnRTdWl0ZS5zcGVjc1tzcGVjLmlkXSA/PSB7c3BlYywgZmFpbHVyZXM6W119XG4gICAgICBwYXJlbnRTdWl0ZS5zcGVjc1tzcGVjLmlkXS5mYWlsdXJlcy5wdXNoKGl0ZW0pXG4gICAgICBAZmlsdGVyU3RhY2tUcmFjZShpdGVtKVxuXG4gIGZpbHRlckphc21pbmVMaW5lczogKHN0YWNrVHJhY2VMaW5lcykgLT5cbiAgICBqYXNtaW5lUGF0dGVybiA9IC9eXFxzKmF0XFxzKy4qXFwoPy4qW1xcXFwvXWphc21pbmUoLVteXFxcXC9dKik/XFwuanM6XFxkKzpcXGQrXFwpP1xccyokL1xuXG4gICAgaW5kZXggPSAwXG4gICAgd2hpbGUgaW5kZXggPCBzdGFja1RyYWNlTGluZXMubGVuZ3RoXG4gICAgICBpZiBqYXNtaW5lUGF0dGVybi50ZXN0KHN0YWNrVHJhY2VMaW5lc1tpbmRleF0pXG4gICAgICAgIHN0YWNrVHJhY2VMaW5lcy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICBlbHNlXG4gICAgICAgIGluZGV4KytcblxuICBmaWx0ZXJUcmFpbGluZ1RpbWVyc0xpbmU6IChzdGFja1RyYWNlTGluZXMpIC0+XG4gICAgaWYgKC9eKFxccyphdCAuKiApXFwodGltZXJzXFwuanM6XFxkKzpcXGQrXFwpLy50ZXN0KF8ubGFzdChzdGFja1RyYWNlTGluZXMpKSlcbiAgICAgIHN0YWNrVHJhY2VMaW5lcy5wb3AoKVxuXG4gIGZpbHRlclNldHVwTGluZXM6IChzdGFja1RyYWNlTGluZXMpIC0+XG4gICAgIyBJZ25vcmUgYWxsIGxpbmVzIHN0YXJ0aW5nIGF0IHRoZSBmaXJzdCBjYWxsIHRvIE9iamVjdC5qYXNtaW5lLmV4ZWN1dGVTcGVjc0luRm9sZGVyKClcbiAgICByZW1vdmVMaW5lID0gZmFsc2VcbiAgICBpbmRleCA9IDBcbiAgICB3aGlsZSBpbmRleCA8IHN0YWNrVHJhY2VMaW5lcy5sZW5ndGhcbiAgICAgIHJlbW92ZUxpbmUgb3I9IC9eXFxzKmF0IE9iamVjdFxcLmphc21pbmVcXC5leGVjdXRlU3BlY3NJbkZvbGRlci8udGVzdChzdGFja1RyYWNlTGluZXNbaW5kZXhdKVxuICAgICAgaWYgcmVtb3ZlTGluZVxuICAgICAgICBzdGFja1RyYWNlTGluZXMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgZWxzZVxuICAgICAgICBpbmRleCsrXG5cbiAgZmlsdGVyRmFpbHVyZU1lc3NhZ2VMaW5lOiAoZmFpbHVyZSwgc3RhY2tUcmFjZUxpbmVzKSAtPlxuICAgICMgUmVtb3ZlIGluaXRpYWwgbGluZShzKSB3aGVuIHRoZXkgbWF0Y2ggdGhlIGZhaWx1cmUgbWVzc2FnZVxuICAgIGVycm9yTGluZXMgPSBbXVxuICAgIHdoaWxlIHN0YWNrVHJhY2VMaW5lcy5sZW5ndGggPiAwXG4gICAgICBpZiAvXlxccythdFxccysuKlxcKCguKik6KFxcZCspOihcXGQrKVxcKVxccyokLy50ZXN0KHN0YWNrVHJhY2VMaW5lc1swXSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGVsc2VcbiAgICAgICAgZXJyb3JMaW5lcy5wdXNoKHN0YWNrVHJhY2VMaW5lcy5zaGlmdCgpKVxuXG4gICAgc3RhY2tUcmFjZUVycm9yTWVzc2FnZSA9IGVycm9yTGluZXMuam9pbignXFxuJylcbiAgICB7bWVzc2FnZX0gPSBmYWlsdXJlXG4gICAgaWYgc3RhY2tUcmFjZUVycm9yTWVzc2FnZSBpc250IG1lc3NhZ2UgYW5kIHN0YWNrVHJhY2VFcnJvck1lc3NhZ2UgaXNudCBcIkVycm9yOiAje21lc3NhZ2V9XCJcbiAgICAgIHN0YWNrVHJhY2VMaW5lcy5zcGxpY2UoMCwgMCwgZXJyb3JMaW5lcy4uLilcblxuICBmaWx0ZXJPcmlnaW5MaW5lOiAoZmFpbHVyZSwgc3RhY2tUcmFjZUxpbmVzKSAtPlxuICAgIHJldHVybiBzdGFja1RyYWNlTGluZXMgdW5sZXNzIHN0YWNrVHJhY2VMaW5lcy5sZW5ndGggaXMgMVxuXG4gICAgIyBSZW1vdmUgcmVtYWluaW5nIGxpbmUgaWYgaXQgaXMgZnJvbSBhbiBhbm9ueW1vdXMgZnVuY3Rpb25cbiAgICBpZiBtYXRjaCA9IC9eXFxzKmF0XFxzKygoXFxbb2JqZWN0IE9iamVjdFxcXSl8KG51bGwpKVxcLjxhbm9ueW1vdXM+XFxzK1xcKCguKik6KFxcZCspOihcXGQrKVxcKVxccyokLy5leGVjKHN0YWNrVHJhY2VMaW5lc1swXSlcbiAgICAgIHN0YWNrVHJhY2VMaW5lcy5zaGlmdCgpXG4gICAgICBmaWxlUGF0aCA9IHBhdGgucmVsYXRpdmUocHJvY2Vzcy5jd2QoKSwgbWF0Y2hbNF0pXG4gICAgICBsaW5lID0gbWF0Y2hbNV1cbiAgICAgIGNvbHVtbiA9IG1hdGNoWzZdXG4gICAgICBmYWlsdXJlLm1lc3NhZ2VMaW5lID0gXCIje2ZpbGVQYXRofToje2xpbmV9OiN7Y29sdW1ufVwiXG5cbiAgZmlsdGVyU3RhY2tUcmFjZTogKGZhaWx1cmUpIC0+XG4gICAgc3RhY2tUcmFjZSA9IGZhaWx1cmUudHJhY2Uuc3RhY2tcbiAgICByZXR1cm4gdW5sZXNzIHN0YWNrVHJhY2VcblxuICAgIHN0YWNrVHJhY2VMaW5lcyA9IHN0YWNrVHJhY2Uuc3BsaXQoJ1xcbicpLmZpbHRlciAobGluZSkgLT4gbGluZVxuICAgIEBmaWx0ZXJKYXNtaW5lTGluZXMoc3RhY2tUcmFjZUxpbmVzKVxuICAgIEBmaWx0ZXJUcmFpbGluZ1RpbWVyc0xpbmUoc3RhY2tUcmFjZUxpbmVzKVxuICAgIEBmaWx0ZXJTZXR1cExpbmVzKHN0YWNrVHJhY2VMaW5lcylcbiAgICBzdGFja1RyYWNlID0gY29mZmVlc3RhY2suY29udmVydFN0YWNrVHJhY2Uoc3RhY2tUcmFjZUxpbmVzLmpvaW4oJ1xcbicpLCBzb3VyY2VNYXBzKVxuICAgIHJldHVybiB1bmxlc3Mgc3RhY2tUcmFjZVxuXG4gICAgc3RhY2tUcmFjZUxpbmVzID0gc3RhY2tUcmFjZS5zcGxpdCgnXFxuJykuZmlsdGVyIChsaW5lKSAtPiBsaW5lXG4gICAgQGZpbHRlckZhaWx1cmVNZXNzYWdlTGluZShmYWlsdXJlLCBzdGFja1RyYWNlTGluZXMpXG4gICAgQGZpbHRlck9yaWdpbkxpbmUoZmFpbHVyZSwgc3RhY2tUcmFjZUxpbmVzKVxuICAgIGZhaWx1cmUuZmlsdGVyZWRTdGFja1RyYWNlID0gc3RhY2tUcmFjZUxpbmVzLmpvaW4oJ1xcbicpXG5cbiAgZm9yRWFjaFNwZWM6ICh7c3BlYywgc3VpdGVzLCBzcGVjcywgZmFpbHVyZXN9PXt9LCBjYWxsYmFjaywgZGVwdGg9MCkgLT5cbiAgICBpZiBmYWlsdXJlcz9cbiAgICAgIGNhbGxiYWNrKHNwZWMsIG51bGwsIGRlcHRoKVxuICAgICAgY2FsbGJhY2soc3BlYywgZmFpbHVyZSwgZGVwdGgpIGZvciBmYWlsdXJlIGluIGZhaWx1cmVzXG4gICAgZWxzZVxuICAgICAgY2FsbGJhY2soc3BlYywgbnVsbCwgZGVwdGgpXG4gICAgICBkZXB0aCsrXG4gICAgICBAZm9yRWFjaFNwZWMoY2hpbGQsIGNhbGxiYWNrLCBkZXB0aCkgZm9yIGNoaWxkIGluIF8uY29tcGFjdChzdWl0ZXMpXG4gICAgICBAZm9yRWFjaFNwZWMoY2hpbGQsIGNhbGxiYWNrLCBkZXB0aCkgZm9yIGNoaWxkIGluIF8uY29tcGFjdChzcGVjcylcblxuICBmb3JFYWNoOiAoY2FsbGJhY2spIC0+XG4gICAgQGZvckVhY2hTcGVjKHN1aXRlLCBjYWxsYmFjaykgZm9yIHN1aXRlIGluIF8uY29tcGFjdChAc3VpdGVzKVxuIl19

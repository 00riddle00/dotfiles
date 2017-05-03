(function() {
  var config, path;

  path = require("path");

  config = require("../lib/config");

  describe("config", function() {
    describe(".set", function() {
      it("get user modified value", function() {
        atom.config.set("markdown-writer.test", "special");
        return expect(config.get("test")).toEqual("special");
      });
      return it("set key and value", function() {
        config.set("test", "value");
        return expect(atom.config.get("markdown-writer.test")).toEqual("value");
      });
    });
    describe(".get", function() {
      it("get value from default", function() {
        return expect(config.get("fileExtension")).toEqual(".markdown");
      });
      it("get value from engine config", function() {
        config.set("siteEngine", "jekyll");
        return expect(config.get("codeblock.before")).toEqual(config.getEngine("codeblock.before"));
      });
      it("get value from default if engine is invalid", function() {
        config.set("siteEngine", "not-exists");
        return expect(config.get("codeblock.before")).toEqual(config.getDefault("codeblock.before"));
      });
      it("get value from user config", function() {
        config.set("codeblock.before", "changed");
        return expect(config.get("codeblock.before")).toEqual("changed");
      });
      it("get value from user config even if the config is empty string", function() {
        config.set("codeblock.before", "");
        return expect(config.get("codeblock.before")).toEqual("");
      });
      it("get value from default config if the config is empty string but not allow blank", function() {
        config.set("codeblock.before", "");
        return expect(config.get("codeblock.before", {
          allow_blank: false
        })).toEqual(config.getDefault("codeblock.before"));
      });
      return it("get value from default config if user config is undefined", function() {
        config.set("codeblock.before", void 0);
        expect(config.get("codeblock.before")).toEqual(config.getDefault("codeblock.before"));
        config.set("codeblock.before", null);
        return expect(config.get("codeblock.before")).toEqual(config.getDefault("codeblock.before"));
      });
    });
    describe(".getFiletype", function() {
      var originalgetActiveTextEditor;
      originalgetActiveTextEditor = atom.workspace.getActiveTextEditor;
      afterEach(function() {
        return atom.workspace.getActiveTextEditor = originalgetActiveTextEditor;
      });
      it("get value from filestyle config", function() {
        atom.workspace.getActiveTextEditor = function() {
          return {
            getGrammar: function() {
              return {
                scopeName: "source.asciidoc"
              };
            }
          };
        };
        expect(config.getFiletype("linkInlineTag")).not.toBeNull();
        return expect(config.getFiletype("siteEngine")).not.toBeDefined();
      });
      return it("get value from invalid filestyle config", function() {
        atom.workspace.getActiveTextEditor = function() {
          return {
            getGrammar: function() {
              return {
                scopeName: null
              };
            }
          };
        };
        return expect(config.getEngine("siteEngine")).not.toBeDefined();
      });
    });
    describe(".getEngine", function() {
      it("get value from engine config", function() {
        config.set("siteEngine", "jekyll");
        expect(config.getEngine("codeblock.before")).not.toBeNull();
        return expect(config.getEngine("imageTag")).not.toBeDefined();
      });
      return it("get value from invalid engine config", function() {
        config.set("siteEngine", "not-exists");
        return expect(config.getEngine("imageTag")).not.toBeDefined();
      });
    });
    describe(".getProject", function() {
      var originalGetProjectConfigFile;
      originalGetProjectConfigFile = config.getProjectConfigFile;
      afterEach(function() {
        return config.getProjectConfigFile = originalGetProjectConfigFile;
      });
      it("get value when file found", function() {
        config.getProjectConfigFile = function() {
          return path.resolve(__dirname, "fixtures", "dummy.cson");
        };
        return expect(config.getProject("imageTag")).toEqual("imageTag");
      });
      it("get empty when file is empty", function() {
        config.getProjectConfigFile = function() {
          return path.resolve(__dirname, "fixtures", "empty.cson");
        };
        return expect(config.getProject("imageTag")).not.toBeDefined();
      });
      return it("get empty when file is not found", function() {
        config.getProjectConfigFile = function() {
          return path.resolve(__dirname, "fixtures", "notfound.cson");
        };
        return expect(config.getProject("imageTag")).not.toBeDefined();
      });
    });
    return describe(".getSampleConfigFile", function() {
      return it("get the config file path", function() {
        var configPath;
        configPath = path.join("lib", "config.cson");
        return expect(config.getSampleConfigFile()).toContain(configPath);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL2NvbmZpZy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLE1BQUEsR0FBUyxPQUFBLENBQVEsZUFBUjs7RUFFVCxRQUFBLENBQVMsUUFBVCxFQUFtQixTQUFBO0lBQ2pCLFFBQUEsQ0FBUyxNQUFULEVBQWlCLFNBQUE7TUFDZixFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQTtRQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLFNBQXhDO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxHQUFQLENBQVcsTUFBWCxDQUFQLENBQTBCLENBQUMsT0FBM0IsQ0FBbUMsU0FBbkM7TUFGNEIsQ0FBOUI7YUFJQSxFQUFBLENBQUcsbUJBQUgsRUFBd0IsU0FBQTtRQUN0QixNQUFNLENBQUMsR0FBUCxDQUFXLE1BQVgsRUFBbUIsT0FBbkI7ZUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFoQixDQUFQLENBQStDLENBQUMsT0FBaEQsQ0FBd0QsT0FBeEQ7TUFGc0IsQ0FBeEI7SUFMZSxDQUFqQjtJQVNBLFFBQUEsQ0FBUyxNQUFULEVBQWlCLFNBQUE7TUFDZixFQUFBLENBQUcsd0JBQUgsRUFBNkIsU0FBQTtlQUMzQixNQUFBLENBQU8sTUFBTSxDQUFDLEdBQVAsQ0FBVyxlQUFYLENBQVAsQ0FBbUMsQ0FBQyxPQUFwQyxDQUE0QyxXQUE1QztNQUQyQixDQUE3QjtNQUdBLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBO1FBQ2pDLE1BQU0sQ0FBQyxHQUFQLENBQVcsWUFBWCxFQUF5QixRQUF6QjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsR0FBUCxD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QTtRQUNqQyxNQUFNLENBQUMsb0JBQVAsR0FBOEIsU0FBQTtpQkFBRyxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBd0IsVUFBeEIsRUFBb0MsWUFBcEM7UUFBSDtlQUM5QixNQUFBLENBQU8sTUFBTSxDQUFDLFVBQVAsQ0FBa0IsVUFBbEIsQ0FBUCxDQUFxQyxDQUFDLEdBQUcsQ0FBQyxXQUExQyxDQUFBO01BRmlDLENBQW5DO2FBSUEsRUFBQSxDQUFHLGtDQUFILEVBQXVDLFNBQUE7UUFDckMsTUFBTSxDQUFDLG9CQUFQLEdBQThCLFNBQUE7aUJBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLFVBQXhCLEVBQW9DLGVBQXBDO1FBQUg7ZUFDOUIsTUFBQSxDQUFPLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFVBQWxCLENBQVAsQ0FBcUMsQ0FBQyxHQUFHLENBQUMsV0FBMUMsQ0FBQTtNQUZxQyxDQUF2QztJQVpzQixDQUF4QjtXQWdCQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQTthQUMvQixFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQTtBQUM3QixZQUFBO1FBQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxJQUFMLENBQVUsS0FBVixFQUFpQixhQUFqQjtlQUNiLE1BQUEsQ0FBTyxNQUFNLENBQUMsbUJBQVAsQ0FBQSxDQUFQLENBQW9DLENBQUMsU0FBckMsQ0FBK0MsVUFBL0M7TUFGNkIsQ0FBL0I7SUFEK0IsQ0FBakM7RUF6RmlCLENBQW5CO0FBSEEiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSBcInBhdGhcIlxuY29uZmlnID0gcmVxdWlyZSBcIi4uL2xpYi9jb25maWdcIlxuXG5kZXNjcmliZSBcImNvbmZpZ1wiLCAtPlxuICBkZXNjcmliZSBcIi5zZXRcIiwgLT5cbiAgICBpdCBcImdldCB1c2VyIG1vZGlmaWVkIHZhbHVlXCIsIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJtYXJrZG93bi13cml0ZXIudGVzdFwiLCBcInNwZWNpYWxcIilcbiAgICAgIGV4cGVjdChjb25maWcuZ2V0KFwidGVzdFwiKSkudG9FcXVhbChcInNwZWNpYWxcIilcblxuICAgIGl0IFwic2V0IGtleSBhbmQgdmFsdWVcIiwgLT5cbiAgICAgIGNvbmZpZy5zZXQoXCJ0ZXN0XCIsIFwidmFsdWVcIilcbiAgICAgIGV4cGVjdChhdG9tLmNvbmZpZy5nZXQoXCJtYXJrZG93bi13cml0ZXIudGVzdFwiKSkudG9FcXVhbChcInZhbHVlXCIpXG5cbiAgZGVzY3JpYmUgXCIuZ2V0XCIsIC0+XG4gICAgaXQgXCJnZXQgdmFsdWUgZnJvbSBkZWZhdWx0XCIsIC0+XG4gICAgICBleHBlY3QoY29uZmlnLmdldChcImZpbGVFeHRlbnNpb25cIikpLnRvRXF1YWwoXCIubWFya2Rvd25cIilcblxuICAgIGl0IFwiZ2V0IHZhbHVlIGZyb20gZW5naW5lIGNvbmZpZ1wiLCAtPlxuICAgICAgY29uZmlnLnNldChcInNpdGVFbmdpbmVcIiwgXCJqZWt5bGxcIilcbiAgICAgIGV4cGVjdChjb25maWcuZ2V0KFwiY29kZWJsb2NrLmJlZm9yZVwiKSlcbiAgICAgICAgLnRvRXF1YWwoY29uZmlnLmdldEVuZ2luZShcImNvZGVibG9jay5iZWZvcmVcIikpXG5cbiAgICBpdCBcImdldCB2YWx1ZSBmcm9tIGRlZmF1bHQgaWYgZW5naW5lIGlzIGludmFsaWRcIiwgLT5cbiAgICAgIGNvbmZpZy5zZXQoXCJzaXRlRW5naW5lXCIsIFwibm90LWV4aXN0c1wiKVxuICAgICAgZXhwZWN0KGNvbmZpZy5nZXQoXCJjb2RlYmxvY2suYmVmb3JlXCIpKVxuICAgICAgICAudG9FcXVhbChjb25maWcuZ2V0RGVmYXVsdChcImNvZGVibG9jay5iZWZvcmVcIikpXG5cbiAgICBpdCBcImdldCB2YWx1ZSBmcm9tIHVzZXIgY29uZmlnXCIsIC0+XG4gICAgICBjb25maWcuc2V0KFwiY29kZWJsb2NrLmJlZm9yZVwiLCBcImNoYW5nZWRcIilcbiAgICAgIGV4cGVjdChjb25maWcuZ2V0KFwiY29kZWJsb2NrLmJlZm9yZVwiKSkudG9FcXVhbChcImNoYW5nZWRcIilcblxuICAgIGl0IFwiZ2V0IHZhbHVlIGZyb20gdXNlciBjb25maWcgZXZlbiBpZiB0aGUgY29uZmlnIGlzIGVtcHR5IHN0cmluZ1wiLCAtPlxuICAgICAgY29uZmlnLnNldChcImNvZGVibG9jay5iZWZvcmVcIiwgXCJcIilcbiAgICAgIGV4cGVjdChjb25maWcuZ2V0KFwiY29kZWJsb2NrLmJlZm9yZVwiKSkudG9FcXVhbChcIlwiKVxuXG4gICAgaXQgXCJnZXQgdmFsdWUgZnJvbSBkZWZhdWx0IGNvbmZpZyBpZiB0aGUgY29uZmlnIGlzIGVtcHR5IHN0cmluZyBidXQgbm90IGFsbG93IGJsYW5rXCIsIC0+XG4gICAgICBjb25maWcuc2V0KFwiY29kZWJsb2NrLmJlZm9yZVwiLCBcIlwiKVxuICAgICAgZXhwZWN0KGNvbmZpZy5nZXQoXCJjb2RlYmxvY2suYmVmb3JlXCIsIGFsbG93X2JsYW5rOiBmYWxzZSkpXG4gICAgICAgIC50b0VxdWFsKGNvbmZpZy5nZXREZWZhdWx0KFwiY29kZWJsb2NrLmJlZm9yZVwiKSlcblxuICAgIGl0IFwiZ2V0IHZhbHVlIGZyb20gZGVmYXVsdCBjb25maWcgaWYgdXNlciBjb25maWcgaXMgdW5kZWZpbmVkXCIsIC0+XG4gICAgICBjb25maWcuc2V0KFwiY29kZWJsb2NrLmJlZm9yZVwiLCB1bmRlZmluZWQpXG4gICAgICBleHBlY3QoY29uZmlnLmdldChcImNvZGVibG9jay5iZWZvcmVcIikpXG4gICAgICAgIC50b0VxdWFsKGNvbmZpZy5nZXREZWZhdWx0KFwiY29kZWJsb2NrLmJlZm9yZVwiKSlcblxuICAgICAgY29uZmlnLnNldChcImNvZGVibG9jay5iZWZvcmVcIiwgbnVsbClcbiAgICAgIGV4cGVjdChjb25maWcuZ2V0KFwiY29kZWJsb2NrLmJlZm9yZVwiKSlcbiAgICAgICAgLnRvRXF1YWwoY29uZmlnLmdldERlZmF1bHQoXCJjb2RlYmxvY2suYmVmb3JlXCIpKVxuXG4gIGRlc2NyaWJlIFwiLmdldEZpbGV0eXBlXCIsIC0+XG4gICAgb3JpZ2luYWxnZXRBY3RpdmVUZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvclxuICAgIGFmdGVyRWFjaCAtPiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yID0gb3JpZ2luYWxnZXRBY3RpdmVUZXh0RWRpdG9yXG5cbiAgICBpdCBcImdldCB2YWx1ZSBmcm9tIGZpbGVzdHlsZSBjb25maWdcIiwgLT5cbiAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IgPSAtPlxuICAgICAgICBnZXRHcmFtbWFyOiAtPiB7IHNjb3BlTmFtZTogXCJzb3VyY2UuYXNjaWlkb2NcIiB9XG5cbiAgICAgIGV4cGVjdChjb25maWcuZ2V0RmlsZXR5cGUoXCJsaW5rSW5saW5lVGFnXCIpKS5ub3QudG9CZU51bGwoKVxuICAgICAgZXhwZWN0KGNvbmZpZy5nZXRGaWxldHlwZShcInNpdGVFbmdpbmVcIikpLm5vdC50b0JlRGVmaW5lZCgpXG5cbiAgICBpdCBcImdldCB2YWx1ZSBmcm9tIGludmFsaWQgZmlsZXN0eWxlIGNvbmZpZ1wiLCAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvciA9IC0+XG4gICAgICAgIGdldEdyYW1tYXI6IC0+IHsgc2NvcGVOYW1lOiBudWxsIH1cblxuICAgICAgZXhwZWN0KGNvbmZpZy5nZXRFbmdpbmUoXCJzaXRlRW5naW5lXCIpKS5ub3QudG9CZURlZmluZWQoKVxuXG4gIGRlc2NyaWJlIFwiLmdldEVuZ2luZVwiLCAtPlxuICAgIGl0IFwiZ2V0IHZhbHVlIGZyb20gZW5naW5lIGNvbmZpZ1wiLCAtPlxuICAgICAgY29uZmlnLnNldChcInNpdGVFbmdpbmVcIiwgXCJqZWt5bGxcIilcbiAgICAgIGV4cGVjdChjb25maWcuZ2V0RW5naW5lKFwiY29kZWJsb2NrLmJlZm9yZVwiKSkubm90LnRvQmVOdWxsKClcbiAgICAgIGV4cGVjdChjb25maWcuZ2V0RW5naW5lKFwiaW1hZ2VUYWdcIikpLm5vdC50b0JlRGVmaW5lZCgpXG5cbiAgICBpdCBcImdldCB2YWx1ZSBmcm9tIGludmFsaWQgZW5naW5lIGNvbmZpZ1wiLCAtPlxuICAgICAgY29uZmlnLnNldChcInNpdGVFbmdpbmVcIiwgXCJub3QtZXhpc3RzXCIpXG4gICAgICBleHBlY3QoY29uZmlnLmdldEVuZ2luZShcImltYWdlVGFnXCIpKS5ub3QudG9CZURlZmluZWQoKVxuXG4gIGRlc2NyaWJlIFwiLmdldFByb2plY3RcIiwgLT5cbiAgICBvcmlnaW5hbEdldFByb2plY3RDb25maWdGaWxlID0gY29uZmlnLmdldFByb2plY3RDb25maWdGaWxlXG4gICAgYWZ0ZXJFYWNoIC0+IGNvbmZpZy5nZXRQcm9qZWN0Q29uZmlnRmlsZSA9IG9yaWdpbmFsR2V0UHJvamVjdENvbmZpZ0ZpbGVcblxuICAgIGl0IFwiZ2V0IHZhbHVlIHdoZW4gZmlsZSBmb3VuZFwiLCAtPlxuICAgICAgY29uZmlnLmdldFByb2plY3RDb25maWdGaWxlID0gLT4gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJmaXh0dXJlc1wiLCBcImR1bW15LmNzb25cIilcbiAgICAgIGV4cGVjdChjb25maWcuZ2V0UHJvamVjdChcImltYWdlVGFnXCIpKS50b0VxdWFsKFwiaW1hZ2VUYWdcIilcblxuICAgIGl0IFwiZ2V0IGVtcHR5IHdoZW4gZmlsZSBpcyBlbXB0eVwiLCAtPlxuICAgICAgY29uZmlnLmdldFByb2plY3RDb25maWdGaWxlID0gLT4gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJmaXh0dXJlc1wiLCBcImVtcHR5LmNzb25cIilcbiAgICAgIGV4cGVjdChjb25maWcuZ2V0UHJvamVjdChcImltYWdlVGFnXCIpKS5ub3QudG9CZURlZmluZWQoKVxuXG4gICAgaXQgXCJnZXQgZW1wdHkgd2hlbiBmaWxlIGlzIG5vdCBmb3VuZFwiLCAtPlxuICAgICAgY29uZmlnLmdldFByb2plY3RDb25maWdGaWxlID0gLT4gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJmaXh0dXJlc1wiLCBcIm5vdGZvdW5kLmNzb25cIilcbiAgICAgIGV4cGVjdChjb25maWcuZ2V0UHJvamVjdChcImltYWdlVGFnXCIpKS5ub3QudG9CZURlZmluZWQoKVxuXG4gIGRlc2NyaWJlIFwiLmdldFNhbXBsZUNvbmZpZ0ZpbGVcIiwgLT5cbiAgICBpdCBcImdldCB0aGUgY29uZmlnIGZpbGUgcGF0aFwiLCAtPlxuICAgICAgY29uZmlnUGF0aCA9IHBhdGguam9pbihcImxpYlwiLCBcImNvbmZpZy5jc29uXCIpXG4gICAgICBleHBlY3QoY29uZmlnLmdldFNhbXBsZUNvbmZpZ0ZpbGUoKSkudG9Db250YWluKGNvbmZpZ1BhdGgpXG4iXX0=

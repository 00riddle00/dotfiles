(function() {
  var CSON, defaults, engines, filetypes, getConfigFile, packagePath, path, prefix,
    slice = [].slice;

  CSON = require("season");

  path = require("path");

  prefix = "markdown-writer";

  packagePath = atom.packages.resolvePackagePath("markdown-writer");

  getConfigFile = function() {
    var parts;
    parts = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (packagePath) {
      return path.join.apply(path, [packagePath, "lib"].concat(slice.call(parts)));
    } else {
      return path.join.apply(path, [__dirname].concat(slice.call(parts)));
    }
  };

  defaults = CSON.readFileSync(getConfigFile("config.cson"));

  defaults["siteEngine"] = "general";

  defaults["projectConfigFile"] = "_mdwriter.cson";

  defaults["siteLinkPath"] = path.join(atom.getConfigDirPath(), prefix + "-links.cson");

  defaults["grammars"] = ['source.gfm', 'source.gfm.nvatom', 'source.litcoffee', 'source.asciidoc', 'text.md', 'text.plain', 'text.plain.null-grammar'];

  filetypes = {
    'source.asciidoc': CSON.readFileSync(getConfigFile("filetypes", "asciidoc.cson"))
  };

  engines = {
    html: {
      imageTag: "<a href=\"{site}/{slug}.html\" target=\"_blank\">\n  <img class=\"align{align}\" alt=\"{alt}\" src=\"{src}\" width=\"{width}\" height=\"{height}\" />\n</a>"
    },
    jekyll: {
      textStyles: {
        codeblock: {
          before: "{% highlight %}\n",
          after: "\n{% endhighlight %}",
          regexBefore: "{% highlight(?: .+)? %}\\r?\\n",
          regexAfter: "\\r?\\n{% endhighlight %}"
        }
      }
    },
    octopress: {
      imageTag: "{% img {align} {src} {width} {height} '{alt}' %}"
    },
    hexo: {
      newPostFileName: "{title}{extension}",
      frontMatter: "layout: \"{layout}\"\ntitle: \"{title}\"\ndate: \"{date}\"\n---"
    }
  };

  module.exports = {
    projectConfigs: {},
    engineNames: function() {
      return Object.keys(engines);
    },
    keyPath: function(key) {
      return prefix + "." + key;
    },
    get: function(key, options) {
      var allow_blank, config, i, len, ref, val;
      if (options == null) {
        options = {};
      }
      allow_blank = options["allow_blank"] != null ? options["allow_blank"] : true;
      ref = ["Project", "User", "Engine", "Filetype", "Default"];
      for (i = 0, len = ref.length; i < len; i++) {
        config = ref[i];
        val = this["get" + config](key);
        if (allow_blank) {
          if (val != null) {
            return val;
          }
        } else {
          if (val) {
            return val;
          }
        }
      }
    },
    set: function(key, val) {
      return atom.config.set(this.keyPath(key), val);
    },
    restoreDefault: function(key) {
      return atom.config.unset(this.keyPath(key));
    },
    getDefault: function(key) {
      return this._valueForKeyPath(defaults, key);
    },
    getFiletype: function(key) {
      var editor, filetypeConfig;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return void 0;
      }
      filetypeConfig = filetypes[editor.getGrammar().scopeName];
      if (filetypeConfig == null) {
        return void 0;
      }
      return this._valueForKeyPath(filetypeConfig, key);
    },
    getEngine: function(key) {
      var engine, engineConfig;
      engine = this.getProject("siteEngine") || this.getUser("siteEngine") || this.getDefault("siteEngine");
      engineConfig = engines[engine];
      if (engineConfig == null) {
        return void 0;
      }
      return this._valueForKeyPath(engineConfig, key);
    },
    getCurrentDefault: function(key) {
      return this.getEngine(key) || this.getDefault(key);
    },
    getUser: function(key) {
      return atom.config.get(this.keyPath(key), {
        sources: [atom.config.getUserConfigPath()]
      });
    },
    getProject: function(key) {
      var config, configFile;
      configFile = this.getProjectConfigFile();
      if (!configFile) {
        return;
      }
      config = this._loadProjectConfig(configFile);
      return this._valueForKeyPath(config, key);
    },
    getSampleConfigFile: function() {
      return getConfigFile("config.cson");
    },
    getProjectConfigFile: function() {
      var fileName, projectPath;
      if (!atom.project || atom.project.getPaths().length < 1) {
        return;
      }
      projectPath = atom.project.getPaths()[0];
      fileName = this.getUser("projectConfigFile") || this.getDefault("projectConfigFile");
      return path.join(projectPath, fileName);
    },
    _loadProjectConfig: function(configFile) {
      var error;
      if (this.projectConfigs[configFile]) {
        return this.projectConfigs[configFile];
      }
      try {
        return this.projectConfigs[configFile] = CSON.readFileSync(configFile) || {};
      } catch (error1) {
        error = error1;
        if (atom.inDevMode() && !/ENOENT/.test(error.message)) {
          console.info("Markdown Writer [config.coffee]: " + error);
        }
        return this.projectConfigs[configFile] = {};
      }
    },
    _valueForKeyPath: function(object, keyPath) {
      var i, key, keys, len;
      keys = keyPath.split(".");
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        object = object[key];
        if (object == null) {
          return;
        }
      }
      return object;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29uZmlnLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNEVBQUE7SUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7O0VBQ1AsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQUEsR0FBUzs7RUFDVCxXQUFBLEdBQWMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBZCxDQUFpQyxpQkFBakM7O0VBQ2QsYUFBQSxHQUFnQixTQUFBO0FBQ2QsUUFBQTtJQURlO0lBQ2YsSUFBRyxXQUFIO2FBQW9CLElBQUksQ0FBQyxJQUFMLGFBQVUsQ0FBQSxXQUFBLEVBQWEsS0FBTyxTQUFBLFdBQUEsS0FBQSxDQUFBLENBQTlCLEVBQXBCO0tBQUEsTUFBQTthQUNLLElBQUksQ0FBQyxJQUFMLGFBQVUsQ0FBQSxTQUFXLFNBQUEsV0FBQSxLQUFBLENBQUEsQ0FBckIsRUFETDs7RUFEYzs7RUFLaEIsUUFBQSxHQUFXLElBQUksQ0FBQyxZQUFMLENBQWtCLGFBQUEsQ0FBYyxhQUFkLENBQWxCOztFQUdYLFFBQVMsQ0FBQSxZQUFBLENBQVQsR0FBeUI7O0VBR3pCLFFBQVMsQ0FBQSxtQkFBQSxDQUFULEdBQWdDOztFQUdoQyxRQUFTLENBQUEsY0FBQSxDQUFULEdBQTJCLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLGdCQUFMLENBQUEsQ0FBVixFQUFzQyxNQUFELEdBQVEsYUFBN0M7O0VBRTNCLFFBQVMsQ0FBQSxVQUFBLENBQVQsR0FBdUIsQ0FDckIsWUFEcUIsRUFFckIsbUJBRnFCLEVBR3JCLGtCQUhxQixFQUlyQixpQkFKcUIsRUFLckIsU0FMcUIsRUFNckIsWUFOcUIsRUFPckIseUJBUHFCOztFQVd2QixTQUFBLEdBQ0U7SUFBQSxpQkFBQSxFQUFtQixJQUFJLENBQUMs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Q0FBQSxjQUFlLENBQUEsVUFBQSxDQUFoQixHQUE4QixJQUFJLENBQUMsWUFBTCxDQUFrQixVQUFsQixDQUFBLElBQWlDLEdBRmpFO09BQUEsY0FBQTtRQUdNO1FBR0osSUFBRyxJQUFJLENBQUMsU0FBTCxDQUFBLENBQUEsSUFBb0IsQ0FBQyxRQUFRLENBQUMsSUFBVCxDQUFjLEtBQUssQ0FBQyxPQUFwQixDQUF4QjtVQUNFLE9BQU8sQ0FBQyxJQUFSLENBQWEsbUNBQUEsR0FBb0MsS0FBakQsRUFERjs7ZUFHQSxJQUFDLENBQUEsY0FBZSxDQUFBLFVBQUEsQ0FBaEIsR0FBOEIsR0FUaEM7O0lBSGtCLENBdkVwQjtJQXFGQSxnQkFBQSxFQUFrQixTQUFDLE1BQUQsRUFBUyxPQUFUO0FBQ2hCLFVBQUE7TUFBQSxJQUFBLEdBQU8sT0FBTyxDQUFDLEtBQVIsQ0FBYyxHQUFkO0FBQ1AsV0FBQSxzQ0FBQTs7UUFDRSxNQUFBLEdBQVMsTUFBTyxDQUFBLEdBQUE7UUFDaEIsSUFBYyxjQUFkO0FBQUEsaUJBQUE7O0FBRkY7YUFHQTtJQUxnQixDQXJGbEI7O0FBOURGIiwic291cmNlc0NvbnRlbnQiOlsiQ1NPTiA9IHJlcXVpcmUgXCJzZWFzb25cIlxucGF0aCA9IHJlcXVpcmUgXCJwYXRoXCJcblxucHJlZml4ID0gXCJtYXJrZG93bi13cml0ZXJcIlxucGFja2FnZVBhdGggPSBhdG9tLnBhY2thZ2VzLnJlc29sdmVQYWNrYWdlUGF0aChcIm1hcmtkb3duLXdyaXRlclwiKVxuZ2V0Q29uZmlnRmlsZSA9IChwYXJ0cy4uLikgLT5cbiAgaWYgcGFja2FnZVBhdGggdGhlbiBwYXRoLmpvaW4ocGFja2FnZVBhdGgsIFwibGliXCIsIHBhcnRzLi4uKVxuICBlbHNlIHBhdGguam9pbihfX2Rpcm5hbWUsIHBhcnRzLi4uKVxuXG4jIGxvYWQgc2FtcGxlIGNvbmZpZyB0byBkZWZhdWx0c1xuZGVmYXVsdHMgPSBDU09OLnJlYWRGaWxlU3luYyhnZXRDb25maWdGaWxlKFwiY29uZmlnLmNzb25cIikpXG5cbiMgc3RhdGljIGVuZ2luZSBvZiB5b3VyIGJsb2csIHNlZSBgQGVuZ2luZXNgXG5kZWZhdWx0c1tcInNpdGVFbmdpbmVcIl0gPSBcImdlbmVyYWxcIlxuIyBwcm9qZWN0IHNwZWNpZmljIGNvbmZpZ3VyYXRpb24gZmlsZSBuYW1lXG4jIGh0dHBzOi8vZ2l0aHViLmNvbS96aHVvY2h1bi9tZC13cml0ZXIvd2lraS9TZXR0aW5ncy1mb3ItaW5kaXZpZHVhbC1wcm9qZWN0c1xuZGVmYXVsdHNbXCJwcm9qZWN0Q29uZmlnRmlsZVwiXSA9IFwiX21kd3JpdGVyLmNzb25cIlxuIyBwYXRoIHRvIGEgY3NvbiBmaWxlIHRoYXQgc3RvcmVzIGxpbmtzIGFkZGVkIGZvciBhdXRvbWF0aWMgbGlua2luZ1xuIyBkZWZhdWx0IHRvIGBtYXJrZG93bi13cml0ZXItbGlua3MuY3NvbmAgZmlsZSB1bmRlciB1c2VyJ3MgY29uZmlnIGRpcmVjdG9yeVxuZGVmYXVsdHNbXCJzaXRlTGlua1BhdGhcIl0gPSBwYXRoLmpvaW4oYXRvbS5nZXRDb25maWdEaXJQYXRoKCksIFwiI3twcmVmaXh9LWxpbmtzLmNzb25cIilcbiMgZmlsZXR5cGVzIG1hcmtkb3duLXdyaXRlciBjb21tYW5kcyBhcHBseVxuZGVmYXVsdHNbXCJncmFtbWFyc1wiXSA9IFtcbiAgJ3NvdXJjZS5nZm0nXG4gICdzb3VyY2UuZ2ZtLm52YXRvbSdcbiAgJ3NvdXJjZS5saXRjb2ZmZWUnXG4gICdzb3VyY2UuYXNjaWlkb2MnXG4gICd0ZXh0Lm1kJ1xuICAndGV4dC5wbGFpbidcbiAgJ3RleHQucGxhaW4ubnVsbC1ncmFtbWFyJ1xuXVxuXG4jIGZpbGV0eXBlIGRlZmF1bHRzXG5maWxldHlwZXMgPVxuICAnc291cmNlLmFzY2lpZG9jJzogQ1NPTi5yZWFkRmlsZVN5bmMoZ2V0Q29uZmlnRmlsZShcImZpbGV0eXBlc1wiLCBcImFzY2lpZG9jLmNzb25cIikpXG5cbiMgZW5naW5lIGRlZmF1bHRzXG5lbmdpbmVzID1cbiAgaHRtbDpcbiAgICBpbWFnZVRhZzogXCJcIlwiXG4gICAgICA8YSBocmVmPVwie3NpdGV9L3tzbHVnfS5odG1sXCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG4gICAgICAgIDxpbWcgY2xhc3M9XCJhbGlnbnthbGlnbn1cIiBhbHQ9XCJ7YWx0fVwiIHNyYz1cIntzcmN9XCIgd2lkdGg9XCJ7d2lkdGh9XCIgaGVpZ2h0PVwie2hlaWdodH1cIiAvPlxuICAgICAgPC9hPlxuICAgICAgXCJcIlwiXG4gIGpla3lsbDpcbiAgICB0ZXh0U3R5bGVzOlxuICAgICAgY29kZWJsb2NrOlxuICAgICAgICBiZWZvcmU6IFwieyUgaGlnaGxpZ2h0ICV9XFxuXCJcbiAgICAgICAgYWZ0ZXI6IFwiXFxueyUgZW5kaGlnaGxpZ2h0ICV9XCJcbiAgICAgICAgcmVnZXhCZWZvcmU6IFwieyUgaGlnaGxpZ2h0KD86IC4rKT8gJX1cXFxccj9cXFxcblwiXG4gICAgICAgIHJlZ2V4QWZ0ZXI6IFwiXFxcXHI/XFxcXG57JSBlbmRoaWdobGlnaHQgJX1cIlxuICBvY3RvcHJlc3M6XG4gICAgaW1hZ2VUYWc6IFwieyUgaW1nIHthbGlnbn0ge3NyY30ge3dpZHRofSB7aGVpZ2h0fSAne2FsdH0nICV9XCJcbiAgaGV4bzpcbiAgICBuZXdQb3N0RmlsZU5hbWU6IFwie3RpdGxlfXtleHRlbnNpb259XCJcbiAgICBmcm9udE1hdHRlcjogXCJcIlwiXG4gICAgICBsYXlvdXQ6IFwie2xheW91dH1cIlxuICAgICAgdGl0bGU6IFwie3RpdGxlfVwiXG4gICAgICBkYXRlOiBcIntkYXRlfVwiXG4gICAgICAtLS1cbiAgICAgIFwiXCJcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHByb2plY3RDb25maWdzOiB7fVxuXG4gIGVuZ2luZU5hbWVzOiAtPiBPYmplY3Qua2V5cyhlbmdpbmVzKVxuXG4gIGtleVBhdGg6IChrZXkpIC0+IFwiI3twcmVmaXh9LiN7a2V5fVwiXG5cbiAgZ2V0OiAoa2V5LCBvcHRpb25zID0ge30pIC0+XG4gICAgYWxsb3dfYmxhbmsgPSBpZiBvcHRpb25zW1wiYWxsb3dfYmxhbmtcIl0/IHRoZW4gb3B0aW9uc1tcImFsbG93X2JsYW5rXCJdIGVsc2UgdHJ1ZVxuXG4gICAgZm9yIGNvbmZpZyBpbiBbXCJQcm9qZWN0XCIsIFwiVXNlclwiLCBcIkVuZ2luZVwiLCBcIkZpbGV0eXBlXCIsIFwiRGVmYXVsdFwiXVxuICAgICAgdmFsID0gQFtcImdldCN7Y29uZmlnfVwiXShrZXkpXG5cbiAgICAgIGlmIGFsbG93X2JsYW5rIHRoZW4gcmV0dXJuIHZhbCBpZiB2YWw/XG4gICAgICBlbHNlIHJldHVybiB2YWwgaWYgdmFsXG5cbiAgc2V0OiAoa2V5LCB2YWwpIC0+XG4gICAgYXRvbS5jb25maWcuc2V0KEBrZXlQYXRoKGtleSksIHZhbClcblxuICByZXN0b3JlRGVmYXVsdDogKGtleSkgLT5cbiAgICBhdG9tLmNvbmZpZy51bnNldChAa2V5UGF0aChrZXkpKVxuXG4gICMgZ2V0IGNvbmZpZy5kZWZhdWx0c1xuICBnZXREZWZhdWx0OiAoa2V5KSAtPlxuICAgIEBfdmFsdWVGb3JLZXlQYXRoKGRlZmF1bHRzLCBrZXkpXG5cbiAgIyBnZXQgY29uZmlnLmZpbGV0eXBlc1tmaWxldHlwZV0gYmFzZWQgb24gY3VycmVudCBmaWxlXG4gIGdldEZpbGV0eXBlOiAoa2V5KSAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIHJldHVybiB1bmRlZmluZWQgdW5sZXNzIGVkaXRvcj9cblxuICAgIGZpbGV0eXBlQ29uZmlnID0gZmlsZXR5cGVzW2VkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lXVxuICAgIHJldHVybiB1bmRlZmluZWQgdW5sZXNzIGZpbGV0eXBlQ29uZmlnP1xuXG4gICAgQF92YWx1ZUZvcktleVBhdGgoZmlsZXR5cGVDb25maWcsIGtleSlcblxuICAjIGdldCBjb25maWcuZW5naW5lcyBiYXNlZCBvbiBzaXRlRW5naW5lIHNldFxuICBnZXRFbmdpbmU6IChrZXkpIC0+XG4gICAgZW5naW5lID0gQGdldFByb2plY3QoXCJzaXRlRW5naW5lXCIpIHx8XG4gICAgICAgICAgICAgQGdldFVzZXIoXCJzaXRlRW5naW5lXCIpIHx8XG4gICAgICAgICAgICAgQGdldERlZmF1bHQoXCJzaXRlRW5naW5lXCIpXG5cbiAgICBlbmdpbmVDb25maWcgPSBlbmdpbmVzW2VuZ2luZV1cbiAgICByZXR1cm4gdW5kZWZpbmVkIHVubGVzcyBlbmdpbmVDb25maWc/XG5cbiAgICBAX3ZhbHVlRm9yS2V5UGF0aChlbmdpbmVDb25maWcsIGtleSlcblxuICAjIGdldCBjb25maWcgYmFzZWQgb24gZW5naW5lIHNldCBvciBnbG9iYWwgZGVmYXVsdHNcbiAgZ2V0Q3VycmVudERlZmF1bHQ6IChrZXkpIC0+XG4gICAgQGdldEVuZ2luZShrZXkpIHx8IEBnZXREZWZhdWx0KGtleSlcblxuICAjIGdldCBjb25maWcgZnJvbSB1c2VyJ3MgY29uZmlnIGZpbGVcbiAgZ2V0VXNlcjogKGtleSkgLT5cbiAgICBhdG9tLmNvbmZpZy5nZXQoQGtleVBhdGgoa2V5KSwgc291cmNlczogW2F0b20uY29uZmlnLmdldFVzZXJDb25maWdQYXRoKCldKVxuXG4gICMgZ2V0IHByb2plY3Qgc3BlY2lmaWMgY29uZmlnIGZyb20gcHJvamVjdCdzIGNvbmZpZyBmaWxlXG4gIGdldFByb2plY3Q6IChrZXkpIC0+XG4gICAgY29uZmlnRmlsZSA9IEBnZXRQcm9qZWN0Q29uZmlnRmlsZSgpXG4gICAgcmV0dXJuIHVubGVzcyBjb25maWdGaWxlXG5cbiAgICBjb25maWcgPSBAX2xvYWRQcm9qZWN0Q29uZmlnKGNvbmZpZ0ZpbGUpXG4gICAgQF92YWx1ZUZvcktleVBhdGgoY29uZmlnLCBrZXkpXG5cbiAgZ2V0U2FtcGxlQ29uZmlnRmlsZTogLT4gZ2V0Q29uZmlnRmlsZShcImNvbmZpZy5jc29uXCIpXG5cbiAgZ2V0UHJvamVjdENvbmZpZ0ZpbGU6IC0+XG4gICAgcmV0dXJuIGlmICFhdG9tLnByb2plY3QgfHwgYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkubGVuZ3RoIDwgMVxuXG4gICAgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXVxuICAgIGZpbGVOYW1lID0gQGdldFVzZXIoXCJwcm9qZWN0Q29uZmlnRmlsZVwiKSB8fCBAZ2V0RGVmYXVsdChcInByb2plY3RDb25maWdGaWxlXCIpXG4gICAgcGF0aC5qb2luKHByb2plY3RQYXRoLCBmaWxlTmFtZSlcblxuICBfbG9hZFByb2plY3RDb25maWc6IChjb25maWdGaWxlKSAtPlxuICAgIHJldHVybiBAcHJvamVjdENvbmZpZ3NbY29uZmlnRmlsZV0gaWYgQHByb2plY3RDb25maWdzW2NvbmZpZ0ZpbGVdXG5cbiAgICB0cnlcbiAgICAgICMgd2hlbiBjb25maWdGaWxlIGlzIGVtcHR5LCBDU09OIHJldHVybiB1bmRlZmluZWQsIGZhbGxiYWNrIHRvIHt9XG4gICAgICBAcHJvamVjdENvbmZpZ3NbY29uZmlnRmlsZV0gPSBDU09OLnJlYWRGaWxlU3luYyhjb25maWdGaWxlKSB8fCB7fVxuICAgIGNhdGNoIGVycm9yXG4gICAgICAjIGxvZyBlcnJvciBtZXNzYWdlIGluIGRldiBtb2RlIGZvciBlYXNpZXIgdHJvdWJsZXNob3R0aW5nLFxuICAgICAgIyBidXQgaWdub3JpbmcgZmlsZSBub3QgZXhpc3RzIGVycm9yXG4gICAgICBpZiBhdG9tLmluRGV2TW9kZSgpICYmICEvRU5PRU5ULy50ZXN0KGVycm9yLm1lc3NhZ2UpXG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIk1hcmtkb3duIFdyaXRlciBbY29uZmlnLmNvZmZlZV06ICN7ZXJyb3J9XCIpXG5cbiAgICAgIEBwcm9qZWN0Q29uZmlnc1tjb25maWdGaWxlXSA9IHt9XG5cbiAgX3ZhbHVlRm9yS2V5UGF0aDogKG9iamVjdCwga2V5UGF0aCkgLT5cbiAgICBrZXlzID0ga2V5UGF0aC5zcGxpdChcIi5cIilcbiAgICBmb3Iga2V5IGluIGtleXNcbiAgICAgIG9iamVjdCA9IG9iamVjdFtrZXldXG4gICAgICByZXR1cm4gdW5sZXNzIG9iamVjdD9cbiAgICBvYmplY3RcbiJdfQ==

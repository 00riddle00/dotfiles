(function() {
  var CompositeDisposable, Directory, File, MarkdownImageAssistant, crypto, defaultImageDir, fs, path, ref,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Directory = ref.Directory, File = ref.File;

  fs = require('fs');

  path = require('path');

  crypto = require("crypto");

  defaultImageDir = "assets/";

  module.exports = MarkdownImageAssistant = {
    subscriptions: null,
    config: {
      suffixes: {
        title: "Active file types",
        description: "File type that image assistant should activate for",
        type: 'array',
        "default": ['.markdown', '.md', '.mdown', '.mkd', '.mkdow'],
        items: {
          type: 'string'
        }
      },
      preserveOrigName: {
        title: "Preserve original file names",
        description: "When dragging and dropping files, whether to perserve original file names when copying over into the image directory",
        type: 'boolean',
        "default": false
      },
      preserveFileNameInAssetsFolder: {
        title: "Create per-file asset directories",
        description: "Creates a separate asset directory for each markdown file, e.g. `README.assets/`; setting `Image Directory` to a value other than the default of `assets/` overrides this option",
        type: 'boolean',
        "default": false
      },
      imageDir: {
        title: "Image directory",
        description: "Local directory to copy images into; created if not found.",
        type: 'string',
        "default": defaultImageDir
      },
      insertHtmlOverMarkdown: {
        title: "Insert image as Markup, instead of Markdown",
        description: "Insert an image as HTML Markup, `<img src=''>`, instead of Markdown, `![]()`.  Useful if you want to adjust image `width` or `height`",
        type: 'boolean',
        "default": false
      }
    },
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.handle_subscription(editor);
        };
      })(this)));
      return this.subscriptions.add(atom.commands.onWillDispatch((function(_this) {
        return function(e) {
          var editor;
          if ((typeof event !== "undefined" && event !== null) && event.type === 'core:paste') {
            editor = atom.workspace.getActiveTextEditor();
            if (!editor) {
              return;
            }
            return _this.handle_cp(e);
          }
        };
      })(this)));
    },
    handle_subscription: function(editor) {
      var textEditorElement;
      textEditorElement = atom.views.getView(editor);
      return textEditorElement.addEventListener("drop", (function(_this) {
        return function(e) {
          return _this.handle_dropped(e);
        };
      })(this));
    },
    handle_dropped: function(e) {
      var dropped_files, editor, extname, f, i, imgbuffer, len, origname, results;
      if (typeof e.preventDefault === "function") {
        e.preventDefault();
      }
      if (typeof e.stopPropagation === "function") {
        e.stopPropagation();
      }
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      dropped_files = e.dataTransfer.files;
      results = [];
      for (i = 0, len = dropped_files.length; i < len; i++) {
        f = dropped_files[i];
        if (fs.lstatSync(f.path).isFile()) {
          imgbuffer = new Buffer(fs.readFileSync(f.path));
          extname = path.extname(f.path);
          if (atom.config.get('markdown-image-assistant.preserveOrigName')) {
            origname = path.basename(f.path, extname);
          } else {
            origname = "";
          }
          results.push(this.process_file(editor, imgbuffer, extname, origname));
        } else {
          results.push(void 0);
        }
      }
      return results;
    },
    handle_cp: function(e) {
      var clipboard, editor, img, imgbuffer;
      clipboard = require('clipboard');
      img = clipboard.readImage();
      if (img.isEmpty()) {
        return;
      }
      editor = atom.workspace.getActiveTextEditor();
      e.stopImmediatePropagation();
      imgbuffer = img.toPng();
      return this.process_file(editor, imgbuffer, ".png", "");
    },
    process_file: function(editor, imgbuffer, extname, origname) {
      var assets_dir, assets_path, img_filename, md5, ref1, target_file;
      target_file = editor.getPath();
      if (ref1 = path.extname(target_file), indexOf.call(atom.config.get('markdown-image-assistant.suffixes'), ref1) < 0) {
        console.log("Adding images to non-markdown files is not supported");
        return false;
      }
      if (atom.config.get('markdown-image-assistant.imageDir') === defaultImageDir && atom.config.get('markdown-image-assistant.preserveFileNameInAssetsFolder')) {
        assets_dir = path.basename(path.parse(target_file).name + "." + atom.config.get('markdown-image-assistant.imageDir'));
      } else {
        assets_dir = path.basename(atom.config.get('markdown-image-assistant.imageDir'));
      }
      assets_path = path.join(target_file, "..", assets_dir);
      md5 = crypto.createHash('md5');
      md5.update(imgbuffer);
      if (origname === "") {
        img_filename = (path.parse(target_file).name) + "-" + (md5.digest('hex').slice(0, 8)) + extname;
      } else {
        img_filename = (path.parse(target_file).name) + "-" + origname + extname;
      }
      console.log(img_filename);
      this.create_dir(assets_path, (function(_this) {
        return function() {
          return fs.writeFile(path.join(assets_path, img_filename), imgbuffer, 'binary', function() {
            console.log("Copied file over to " + assets_path);
            if (atom.config.get('markdown-image-assistant.insertHtmlOverMarkdown')) {
              return editor.insertText("<img alt=\"" + img_filename + "\" src=\"" + assets_dir + "/" + img_filename + "\" width=\"\" height=\"\" >");
            } else {
              return editor.insertText("![](" + assets_dir + "/" + img_filename + ")");
            }
          });
        };
      })(this));
      return false;
    },
    create_dir: (function(_this) {
      return function(dir_path, callback) {
        var dir_handle;
        dir_handle = new Directory(dir_path);
        return dir_handle.exists().then(function(existed) {
          if (!existed) {
            return dir_handle.create().then(function(created) {
              if (created) {
                console.log("Successfully created " + dir_path);
                return callback();
              }
            });
          } else {
            return callback();
          }
        });
      };
    })(this),
    deactivate: function() {
      return this.subscriptions.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLWltYWdlLWFzc2lzdGFudC9saWIvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG9HQUFBO0lBQUE7O0VBQUEsTUFBeUMsT0FBQSxDQUFRLE1BQVIsQ0FBekMsRUFBQyw2Q0FBRCxFQUFzQix5QkFBdEIsRUFBaUM7O0VBQ2pDLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSOztFQUVULGVBQUEsR0FBa0I7O0VBRWxCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLHNCQUFBLEdBQ2I7SUFBQSxhQUFBLEVBQWUsSUFBZjtJQUNBLE1BQUEsRUFDSTtNQUFBLFFBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTyxtQkFBUDtRQUNBLFdBQUEsRUFBYSxvREFEYjtRQUVBLElBQUEsRUFBTSxPQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQUFDLFdBQUQsRUFBYyxLQUFkLEVBQXFCLFFBQXJCLEVBQStCLE1BQS9CLEVBQXVDLFFBQXZDLENBSFQ7UUFJQSxLQUFBLEVBQ0k7VUFBQSxJQUFBLEVBQU0sUUFBTjtTQUxKO09BREo7TUFPQSxnQkFBQSxFQUNJO1FBQUEsS0FBQSxFQUFPLDhCQUFQO1FBQ0EsV0FBQSxFQUFhLHNIQURiO1FBRUEsSUFBQSxFQUFNLFNBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7T0FSSjtNQVlBLDhCQUFBLEVBQ0k7UUFBQSxLQUFBLEVBQU8sbUNBQVA7UUFDQSxXQUFBLEVBQWEsa0xBRGI7UUFFQSxJQUFBLEVBQU0sU0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtPQWJKO01BaUJBLFFBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTyxpQkFBUDtRQUNBLFdBQUEs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YUFBTztJQTlCRyxDQS9FZDtJQStHQSxVQUFBLEVBQVksQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLFFBQUQsRUFBVyxRQUFYO0FBQ1IsWUFBQTtRQUFBLFVBQUEsR0FBaUIsSUFBQSxTQUFBLENBQVUsUUFBVjtlQUVqQixVQUFVLENBQUMsTUFBWCxDQUFBLENBQW1CLENBQUMsSUFBcEIsQ0FBeUIsU0FBQyxPQUFEO1VBQ3JCLElBQUcsQ0FBSSxPQUFQO21CQUNJLFVBQVUsQ0FBQyxNQUFYLENBQUEsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixTQUFDLE9BQUQ7Y0FDckIsSUFBRyxPQUFIO2dCQUNJLE9BQU8sQ0FBQyxHQUFSLENBQVksdUJBQUEsR0FBd0IsUUFBcEM7dUJBQ0EsUUFBQSxDQUFBLEVBRko7O1lBRHFCLENBQXpCLEVBREo7V0FBQSxNQUFBO21CQU1JLFFBQUEsQ0FBQSxFQU5KOztRQURxQixDQUF6QjtNQUhRO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQS9HWjtJQTJIQSxVQUFBLEVBQVksU0FBQTthQUNSLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO0lBRFEsQ0EzSFo7O0FBUkoiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRGlyZWN0b3J5LCBGaWxlfSA9IHJlcXVpcmUgJ2F0b20nXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5jcnlwdG8gPSByZXF1aXJlIFwiY3J5cHRvXCJcblxuZGVmYXVsdEltYWdlRGlyID0gXCJhc3NldHMvXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNYXJrZG93bkltYWdlQXNzaXN0YW50ID1cbiAgICBzdWJzY3JpcHRpb25zOiBudWxsXG4gICAgY29uZmlnOlxuICAgICAgICBzdWZmaXhlczpcbiAgICAgICAgICAgIHRpdGxlOiBcIkFjdGl2ZSBmaWxlIHR5cGVzXCJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkZpbGUgdHlwZSB0aGF0IGltYWdlIGFzc2lzdGFudCBzaG91bGQgYWN0aXZhdGUgZm9yXCJcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgICAgICAgIGRlZmF1bHQ6IFsnLm1hcmtkb3duJywgJy5tZCcsICcubWRvd24nLCAnLm1rZCcsICcubWtkb3cnXVxuICAgICAgICAgICAgaXRlbXM6XG4gICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgcHJlc2VydmVPcmlnTmFtZTpcbiAgICAgICAgICAgIHRpdGxlOiBcIlByZXNlcnZlIG9yaWdpbmFsIGZpbGUgbmFtZXNcIlxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiV2hlbiBkcmFnZ2luZyBhbmQgZHJvcHBpbmcgZmlsZXMsIHdoZXRoZXIgdG8gcGVyc2VydmUgb3JpZ2luYWwgZmlsZSBuYW1lcyB3aGVuIGNvcHlpbmcgb3ZlciBpbnRvIHRoZSBpbWFnZSBkaXJlY3RvcnlcIlxuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBwcmVzZXJ2ZUZpbGVOYW1lSW5Bc3NldHNGb2xkZXI6XG4gICAgICAgICAgICB0aXRsZTogXCJDcmVhdGUgcGVyLWZpbGUgYXNzZXQgZGlyZWN0b3JpZXNcIlxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiQ3JlYXRlcyBhIHNlcGFyYXRlIGFzc2V0IGRpcmVjdG9yeSBmb3IgZWFjaCBtYXJrZG93biBmaWxlLCBlLmcuIGBSRUFETUUuYXNzZXRzL2A7IHNldHRpbmcgYEltYWdlIERpcmVjdG9yeWAgdG8gYSB2YWx1ZSBvdGhlciB0aGFuIHRoZSBkZWZhdWx0IG9mIGBhc3NldHMvYCBvdmVycmlkZXMgdGhpcyBvcHRpb25cIlxuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBpbWFnZURpcjpcbiAgICAgICAgICAgIHRpdGxlOiBcIkltYWdlIGRpcmVjdG9yeVwiXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJMb2NhbCBkaXJlY3RvcnkgdG8gY29weSBpbWFnZXMgaW50bzsgY3JlYXRlZCBpZiBub3QgZm91bmQuXCJcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICBkZWZhdWx0OiBkZWZhdWx0SW1hZ2VEaXJcbiAgICAgICAgaW5zZXJ0SHRtbE92ZXJNYXJrZG93bjpcbiAgICAgICAgICAgIHRpdGxlOiBcIkluc2VydCBpbWFnZSBhcyBNYXJrdXAsIGluc3RlYWQgb2YgTWFya2Rvd25cIlxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiSW5zZXJ0IGFuIGltYWdlIGFzIEhUTUwgTWFya3VwLCBgPGltZyBzcmM9Jyc+YCwgaW5zdGVhZCBvZiBNYXJrZG93biwgYCFbXSgpYC4gIFVzZWZ1bCBpZiB5b3Ugd2FudCB0byBhZGp1c3QgaW1hZ2UgYHdpZHRoYCBvciBgaGVpZ2h0YFwiXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG5cbiAgICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgICAgICAjIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwXG4gICAgICAgICMgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICAgICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgICAgICMgUmVnaXN0ZXIgaGFuZGxlciBmb3IgZHJhZyAnbiBkcm9wIGV2ZW50c1xuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+IEBoYW5kbGVfc3Vic2NyaXB0aW9uKGVkaXRvcilcbiAgICAgICAgIyBSZWdpc3RlciBoYW5kbGVyIGZvciBjb3B5IGFuZCBwYXN0ZSBldmVudHNcbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMub25XaWxsRGlzcGF0Y2ggKGUpID0+XG4gICAgICAgICAgICBpZiBldmVudD8gYW5kIGV2ZW50LnR5cGUgPT0gJ2NvcmU6cGFzdGUnXG4gICAgICAgICAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBlZGl0b3JcbiAgICAgICAgICAgICAgICBAaGFuZGxlX2NwKGUpXG5cbiAgICBoYW5kbGVfc3Vic2NyaXB0aW9uOiAoZWRpdG9yKSAtPlxuICAgICAgICB0ZXh0RWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyBlZGl0b3JcbiAgICAgICAgIyBvbiBkcmFnIGFuZCBkcm9wIGV2ZW50XG4gICAgICAgIHRleHRFZGl0b3JFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJkcm9wXCIsIChlKSA9PiBAaGFuZGxlX2Ryb3BwZWQoZSlcblxuICAgICMgdHJpZ2dlcmVkIGluIHJlc3BvbnNlIHRvIGRyYWdnZWQgYW5kIGRyb3BwZWQgZmlsZXNcbiAgICBoYW5kbGVfZHJvcHBlZDogKGUpIC0+XG4gICAgICAgIGUucHJldmVudERlZmF1bHQ/KClcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24/KClcbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIHJldHVybiB1bmxlc3MgZWRpdG9yXG5cbiAgICAgICAgZHJvcHBlZF9maWxlcyA9IGUuZGF0YVRyYW5zZmVyLmZpbGVzXG5cbiAgICAgICAgZm9yIGYgaW4gZHJvcHBlZF9maWxlc1xuICAgICAgICAgICAgaWYgZnMubHN0YXRTeW5jKGYucGF0aCkuaXNGaWxlKClcbiAgICAgICAgICAgICAgICBpbWdidWZmZXIgPSBuZXcgQnVmZmVyKGZzLnJlYWRGaWxlU3luYyhmLnBhdGgpKVxuICAgICAgICAgICAgICAgIGV4dG5hbWUgPSBwYXRoLmV4dG5hbWUoZi5wYXRoKVxuICAgICAgICAgICAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnbWFya2Rvd24taW1hZ2UtYXNzaXN0YW50LnByZXNlcnZlT3JpZ05hbWUnKVxuICAgICAgICAgICAgICAgICAgICBvcmlnbmFtZSA9IHBhdGguYmFzZW5hbWUoZi5wYXRoLCBleHRuYW1lKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgb3JpZ25hbWUgPSBcIlwiXG4gICAgICAgICAgICAgICAgQHByb2Nlc3NfZmlsZShlZGl0b3IsIGltZ2J1ZmZlciwgZXh0bmFtZSwgb3JpZ25hbWUpXG5cbiAgICAjIHRyaWdnZXJlZCBpbiByZXNwb25zZSB0byBhIGNvcHkgcGFzdGVkIGltYWdlXG4gICAgaGFuZGxlX2NwOiAoZSkgLT5cbiAgICAgICAgY2xpcGJvYXJkID0gcmVxdWlyZSAnY2xpcGJvYXJkJ1xuICAgICAgICBpbWcgPSBjbGlwYm9hcmQucmVhZEltYWdlKClcbiAgICAgICAgcmV0dXJuIGlmIGltZy5pc0VtcHR5KClcbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKClcbiAgICAgICAgaW1nYnVmZmVyID0gaW1nLnRvUG5nKClcbiAgICAgICAgQHByb2Nlc3NfZmlsZShlZGl0b3IsIGltZ2J1ZmZlciwgXCIucG5nXCIsIFwiXCIpXG5cbiAgICAjIHdyaXRlIGEgZ2l2ZW4gYnVmZmVyIHRvIHRoZSBsb2NhbCBcImFzc2V0cy9cIiBkaXJlY3RvcnlcbiAgICBwcm9jZXNzX2ZpbGU6IChlZGl0b3IsIGltZ2J1ZmZlciwgZXh0bmFtZSwgb3JpZ25hbWUpIC0+XG4gICAgICAgIHRhcmdldF9maWxlID0gZWRpdG9yLmdldFBhdGgoKVxuXG4gICAgICAgIGlmIHBhdGguZXh0bmFtZSh0YXJnZXRfZmlsZSkgbm90IGluIGF0b20uY29uZmlnLmdldCgnbWFya2Rvd24taW1hZ2UtYXNzaXN0YW50LnN1ZmZpeGVzJylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nIFwiQWRkaW5nIGltYWdlcyB0byBub24tbWFya2Rvd24gZmlsZXMgaXMgbm90IHN1cHBvcnRlZFwiXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ21hcmtkb3duLWltYWdlLWFzc2lzdGFudC5pbWFnZURpcicpID09IGRlZmF1bHRJbWFnZURpciAmJiBhdG9tLmNvbmZpZy5nZXQoJ21hcmtkb3duLWltYWdlLWFzc2lzdGFudC5wcmVzZXJ2ZUZpbGVOYW1lSW5Bc3NldHNGb2xkZXInKVxuICAgICAgICAgICAgYXNzZXRzX2RpciA9IHBhdGguYmFzZW5hbWUocGF0aC5wYXJzZSh0YXJnZXRfZmlsZSkubmFtZSArIFwiLlwiICsgYXRvbS5jb25maWcuZ2V0KCdtYXJrZG93bi1pbWFnZS1hc3Npc3RhbnQuaW1hZ2VEaXInKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgYXNzZXRzX2RpciA9IHBhdGguYmFzZW5hbWUoYXRvbS5jb25maWcuZ2V0KCdtYXJrZG93bi1pbWFnZS1hc3Npc3RhbnQuaW1hZ2VEaXInKSlcbiAgICAgICAgYXNzZXRzX3BhdGggPSBwYXRoLmpvaW4odGFyZ2V0X2ZpbGUsIFwiLi5cIiwgYXNzZXRzX2RpcilcblxuICAgICAgICBtZDUgPSBjcnlwdG8uY3JlYXRlSGFzaCAnbWQ1J1xuICAgICAgICBtZDUudXBkYXRlKGltZ2J1ZmZlcilcblxuICAgICAgICBpZiBvcmlnbmFtZSA9PSBcIlwiXG4gICAgICAgICAgICBpbWdfZmlsZW5hbWUgPSBcIiN7cGF0aC5wYXJzZSh0YXJnZXRfZmlsZSkubmFtZX0tI3ttZDUuZGlnZXN0KCdoZXgnKS5zbGljZSgwLDgpfSN7ZXh0bmFtZX1cIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBpbWdfZmlsZW5hbWUgPSBcIiN7cGF0aC5wYXJzZSh0YXJnZXRfZmlsZSkubmFtZX0tI3tvcmlnbmFtZX0je2V4dG5hbWV9XCJcbiAgICAgICAgY29uc29sZS5sb2cgaW1nX2ZpbGVuYW1lXG5cbiAgICAgICAgQGNyZWF0ZV9kaXIgYXNzZXRzX3BhdGgsICgpPT5cbiAgICAgICAgICAgIGZzLndyaXRlRmlsZSBwYXRoLmpvaW4oYXNzZXRzX3BhdGgsIGltZ19maWxlbmFtZSksIGltZ2J1ZmZlciwgJ2JpbmFyeScsICgpPT5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyBcIkNvcGllZCBmaWxlIG92ZXIgdG8gI3thc3NldHNfcGF0aH1cIlxuICAgICAgICAgICAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnbWFya2Rvd24taW1hZ2UtYXNzaXN0YW50Lmluc2VydEh0bWxPdmVyTWFya2Rvd24nKVxuICAgICAgICAgICAgICAgICAgZWRpdG9yLmluc2VydFRleHQgXCI8aW1nIGFsdD1cXFwiI3tpbWdfZmlsZW5hbWV9XFxcIiBzcmM9XFxcIiN7YXNzZXRzX2Rpcn0vI3tpbWdfZmlsZW5hbWV9XFxcIiB3aWR0aD1cXFwiXFxcIiBoZWlnaHQ9XFxcIlxcXCIgPlwiXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgZWRpdG9yLmluc2VydFRleHQgXCIhW10oI3thc3NldHNfZGlyfS8je2ltZ19maWxlbmFtZX0pXCJcblxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgIGNyZWF0ZV9kaXI6IChkaXJfcGF0aCwgY2FsbGJhY2spPT5cbiAgICAgICAgZGlyX2hhbmRsZSA9IG5ldyBEaXJlY3RvcnkoZGlyX3BhdGgpXG5cbiAgICAgICAgZGlyX2hhbmRsZS5leGlzdHMoKS50aGVuIChleGlzdGVkKSA9PlxuICAgICAgICAgICAgaWYgbm90IGV4aXN0ZWRcbiAgICAgICAgICAgICAgICBkaXJfaGFuZGxlLmNyZWF0ZSgpLnRoZW4gKGNyZWF0ZWQpID0+XG4gICAgICAgICAgICAgICAgICAgIGlmIGNyZWF0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nIFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWQgI3tkaXJfcGF0aH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKClcblxuICAgIGRlYWN0aXZhdGU6IC0+XG4gICAgICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuIl19

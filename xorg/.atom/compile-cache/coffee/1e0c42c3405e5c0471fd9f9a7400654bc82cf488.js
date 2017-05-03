(function() {
  var $, FrontMatter, PublishDraft, config, fs, path, shell, templateHelper, utils;

  $ = require("atom-space-pen-views").$;

  fs = require("fs-plus");

  path = require("path");

  shell = require("shell");

  config = require("../config");

  utils = require("../utils");

  templateHelper = require("../helpers/template-helper");

  FrontMatter = require("../helpers/front-matter");

  module.exports = PublishDraft = (function() {
    function PublishDraft() {
      this.editor = atom.workspace.getActiveTextEditor();
      this.draftPath = this.editor.getPath();
      this.frontMatter = new FrontMatter(this.editor);
      this.dateTime = templateHelper.getDateTime();
    }

    PublishDraft.prototype.trigger = function(e) {
      this.updateFrontMatter();
      this.postPath = this.getPostPath();
      return this.confirmPublish((function(_this) {
        return function() {
          var error;
          try {
            _this.editor.saveAs(_this.postPath);
            if (_this.draftPath) {
              return shell.moveItemToTrash(_this.draftPath);
            }
          } catch (error1) {
            error = error1;
            return atom.confirm({
              message: "[Markdown Writer] Error!",
              detailedMessage: "Publish Draft:\n" + error.message,
              buttons: ['OK']
            });
          }
        };
      })(this));
    };

    PublishDraft.prototype.confirmPublish = function(callback) {
      if (fs.existsSync(this.postPath)) {
        return atom.confirm({
          message: "Do you want to overwrite file?",
          detailedMessage: "Another file already exists at:\n" + this.postPath,
          buttons: {
            "Confirm": callback,
            "Cancel": null
          }
        });
      } else if (this.draftPath === this.postPath) {
        return atom.confirm({
          message: "This file is published!",
          detailedMessage: "This file already published at:\n" + this.draftPath,
          buttons: ['OK']
        });
      } else {
        return callback();
      }
    };

    PublishDraft.prototype.updateFrontMatter = function() {
      if (this.frontMatter.isEmpty) {
        return;
      }
      this.frontMatter.setIfExists("published", true);
      this.frontMatter.setIfExists("date", templateHelper.getFrontMatterDate(this.dateTime));
      return this.frontMatter.save();
    };

    PublishDraft.prototype.getPostPath = function() {
      var fileName, frontMatter, localDir, postsDir;
      frontMatter = templateHelper.getFrontMatter(this);
      localDir = utils.getSitePath(config.get("siteLocalDir"));
      postsDir = templateHelper.create("sitePostsDir", frontMatter, this.dateTime);
      fileName = templateHelper.create("newPostFileName", frontMatter, this.dateTime);
      return path.join(localDir, postsDir, fileName);
    };

    PublishDraft.prototype.getLayout = function() {
      return this.frontMatter.get("layout");
    };

    PublishDraft.prototype.getPublished = function() {
      return this.frontMatter.get("published");
    };

    PublishDraft.prototype.getTitle = function() {
      return this.frontMatter.get("title");
    };

    PublishDraft.prototype.getSlug = function() {
      var slug, useFrontMatter;
      useFrontMatter = !this.draftPath || !!config.get("publishRenameBasedOnTitle");
      if (useFrontMatter) {
        slug = utils.slugize(this.frontMatter.get("title"), config.get('slugSeparator'));
      }
      return slug || templateHelper.getFileSlug(this.draftPath) || utils.slugize("New Post", config.get('slugSeparator'));
    };

    PublishDraft.prototype.getDate = function() {
      return templateHelper.getFrontMatterDate(this.dateTime);
    };

    PublishDraft.prototype.getExtension = function() {
      var extname, keepExtension;
      keepExtension = this.draftPath && !!config.get("publishKeepFileExtname");
      if (keepExtension) {
        extname = path.extname(this.draftPath);
      }
      return extname || config.get("fileExtension");
    };

    return PublishDraft;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29tbWFuZHMvcHVibGlzaC1kcmFmdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLElBQUssT0FBQSxDQUFRLHNCQUFSOztFQUNOLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztFQUVSLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUjs7RUFDVCxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVI7O0VBQ1IsY0FBQSxHQUFpQixPQUFBLENBQVEsNEJBQVI7O0VBQ2pCLFdBQUEsR0FBYyxPQUFBLENBQVEseUJBQVI7O0VBRWQsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLHNCQUFBO01BQ1gsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFDVixJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBO01BQ2IsSUFBQyxDQUFBLFdBQUQsR0FBbUIsSUFBQSxXQUFBLENBQVksSUFBQyxDQUFBLE1BQWI7TUFDbkIsSUFBQyxDQUFBLFFBQUQsR0FBWSxjQUFjLENBQUMsV0FBZixDQUFBO0lBSkQ7OzJCQU1iLE9BQUEsR0FBUyxTQUFDLENBQUQ7TUFDUCxJQUFDLENBQUEsaUJBQUQsQ0FBQTtNQUVBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLFdBQUQsQ0FBQTthQUNaLElBQUMsQ0FBQSxjQUFELENBQWdCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUNkLGNBQUE7QUFBQTtZQUNFLEtBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixDQUFlLEtBQUMsQ0FBQSxRQUFoQjtZQUNBLElBQXFDLEtB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QUMsV0FBZixDQUEyQixJQUFDLENBQUEsU0FBNUIsQ0FBUixJQUFrRCxLQUFLLENBQUMsT0FBTixDQUFjLFVBQWQsRUFBMEIsTUFBTSxDQUFDLEdBQVAsQ0FBVyxlQUFYLENBQTFCO0lBTDNDOzsyQkFNVCxPQUFBLEdBQVMsU0FBQTthQUFHLGNBQWMsQ0FBQyxrQkFBZixDQUFrQyxJQUFDLENBQUEsUUFBbkM7SUFBSDs7MkJBQ1QsWUFBQSxHQUFjLFNBQUE7QUFFWixVQUFBO01BQUEsYUFBQSxHQUFnQixJQUFDLENBQUEsU0FBRCxJQUFjLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBUCxDQUFXLHdCQUFYO01BQ2hDLElBQXNDLGFBQXRDO1FBQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBQyxDQUFBLFNBQWQsRUFBVjs7YUFDQSxPQUFBLElBQVcsTUFBTSxDQUFDLEdBQVAsQ0FBVyxlQUFYO0lBSkM7Ozs7O0FBM0VoQiIsInNvdXJjZXNDb250ZW50IjpbInskfSA9IHJlcXVpcmUgXCJhdG9tLXNwYWNlLXBlbi12aWV3c1wiXG5mcyA9IHJlcXVpcmUgXCJmcy1wbHVzXCJcbnBhdGggPSByZXF1aXJlIFwicGF0aFwiXG5zaGVsbCA9IHJlcXVpcmUgXCJzaGVsbFwiXG5cbmNvbmZpZyA9IHJlcXVpcmUgXCIuLi9jb25maWdcIlxudXRpbHMgPSByZXF1aXJlIFwiLi4vdXRpbHNcIlxudGVtcGxhdGVIZWxwZXIgPSByZXF1aXJlIFwiLi4vaGVscGVycy90ZW1wbGF0ZS1oZWxwZXJcIlxuRnJvbnRNYXR0ZXIgPSByZXF1aXJlIFwiLi4vaGVscGVycy9mcm9udC1tYXR0ZXJcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBQdWJsaXNoRHJhZnRcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBkcmFmdFBhdGggPSBAZWRpdG9yLmdldFBhdGgoKVxuICAgIEBmcm9udE1hdHRlciA9IG5ldyBGcm9udE1hdHRlcihAZWRpdG9yKVxuICAgIEBkYXRlVGltZSA9IHRlbXBsYXRlSGVscGVyLmdldERhdGVUaW1lKClcblxuICB0cmlnZ2VyOiAoZSkgLT5cbiAgICBAdXBkYXRlRnJvbnRNYXR0ZXIoKVxuXG4gICAgQHBvc3RQYXRoID0gQGdldFBvc3RQYXRoKClcbiAgICBAY29uZmlybVB1Ymxpc2ggPT5cbiAgICAgIHRyeVxuICAgICAgICBAZWRpdG9yLnNhdmVBcyhAcG9zdFBhdGgpXG4gICAgICAgIHNoZWxsLm1vdmVJdGVtVG9UcmFzaChAZHJhZnRQYXRoKSBpZiBAZHJhZnRQYXRoXG4gICAgICBjYXRjaCBlcnJvclxuICAgICAgICBhdG9tLmNvbmZpcm1cbiAgICAgICAgICBtZXNzYWdlOiBcIltNYXJrZG93biBXcml0ZXJdIEVycm9yIVwiXG4gICAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBcIlB1Ymxpc2ggRHJhZnQ6XFxuI3tlcnJvci5tZXNzYWdlfVwiXG4gICAgICAgICAgYnV0dG9uczogWydPSyddXG5cbiAgY29uZmlybVB1Ymxpc2g6IChjYWxsYmFjaykgLT5cbiAgICBpZiBmcy5leGlzdHNTeW5jKEBwb3N0UGF0aClcbiAgICAgIGF0b20uY29uZmlybVxuICAgICAgICBtZXNzYWdlOiBcIkRvIHlvdSB3YW50IHRvIG92ZXJ3cml0ZSBmaWxlP1wiXG4gICAgICAgIGRldGFpbGVkTWVzc2FnZTogXCJBbm90aGVyIGZpbGUgYWxyZWFkeSBleGlzdHMgYXQ6XFxuI3tAcG9zdFBhdGh9XCJcbiAgICAgICAgYnV0dG9uczpcbiAgICAgICAgICBcIkNvbmZpcm1cIjogY2FsbGJhY2tcbiAgICAgICAgICBcIkNhbmNlbFwiOiBudWxsXG4gICAgZWxzZSBpZiBAZHJhZnRQYXRoID09IEBwb3N0UGF0aFxuICAgICAgYXRvbS5jb25maXJtXG4gICAgICAgIG1lc3NhZ2U6IFwiVGhpcyBmaWxlIGlzIHB1Ymxpc2hlZCFcIlxuICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IFwiVGhpcyBmaWxlIGFscmVhZHkgcHVibGlzaGVkIGF0OlxcbiN7QGRyYWZ0UGF0aH1cIlxuICAgICAgICBidXR0b25zOiBbJ09LJ11cbiAgICBlbHNlIGNhbGxiYWNrKClcblxuICB1cGRhdGVGcm9udE1hdHRlcjogLT5cbiAgICByZXR1cm4gaWYgQGZyb250TWF0dGVyLmlzRW1wdHlcblxuICAgIEBmcm9udE1hdHRlci5zZXRJZkV4aXN0cyhcInB1Ymxpc2hlZFwiLCB0cnVlKVxuICAgIEBmcm9udE1hdHRlci5zZXRJZkV4aXN0cyhcImRhdGVcIiwgdGVtcGxhdGVIZWxwZXIuZ2V0RnJvbnRNYXR0ZXJEYXRlKEBkYXRlVGltZSkpXG5cbiAgICBAZnJvbnRNYXR0ZXIuc2F2ZSgpXG5cbiAgZ2V0UG9zdFBhdGg6IC0+XG4gICAgZnJvbnRNYXR0ZXI9IHRlbXBsYXRlSGVscGVyLmdldEZyb250TWF0dGVyKHRoaXMpXG5cbiAgICBsb2NhbERpciA9IHV0aWxzLmdldFNpdGVQYXRoKGNvbmZpZy5nZXQoXCJzaXRlTG9jYWxEaXJcIikpXG4gICAgcG9zdHNEaXIgPSB0ZW1wbGF0ZUhlbHBlci5jcmVhdGUoXCJzaXRlUG9zdHNEaXJcIiwgZnJvbnRNYXR0ZXIsIEBkYXRlVGltZSlcbiAgICBmaWxlTmFtZSA9IHRlbXBsYXRlSGVscGVyLmNyZWF0ZShcIm5ld1Bvc3RGaWxlTmFtZVwiLCBmcm9udE1hdHRlciwgQGRhdGVUaW1lKVxuXG4gICAgcGF0aC5qb2luKGxvY2FsRGlyLCBwb3N0c0RpciwgZmlsZU5hbWUpXG5cbiAgIyBjb21tb24gaW50ZXJmYWNlIGZvciBGcm9udE1hdHRlclxuICBnZXRMYXlvdXQ6IC0+IEBmcm9udE1hdHRlci5nZXQoXCJsYXlvdXRcIilcbiAgZ2V0UHVibGlzaGVkOiAtPiBAZnJvbnRNYXR0ZXIuZ2V0KFwicHVibGlzaGVkXCIpXG4gIGdldFRpdGxlOiAtPiBAZnJvbnRNYXR0ZXIuZ2V0KFwidGl0bGVcIilcbiAgZ2V0U2x1ZzogLT5cbiAgICAjIGRlcml2ZSBzbHVnIGZyb20gZnJvbnQgbWF0dGVycyBpZiBjdXJyZW50IGZpbGUgaXMgbm90IHNhdmVkIChub3QgaGF2aW5nIGEgcGF0aCksIG9yXG4gICAgIyBjb25maWd1cmVkIHRvIHJlbmFtZSBiYXNlIG9uIHRpdGxlIG9yIHRoZSBmaWxlIHBhdGggZG9lbid0IGV4aXN0cy5cbiAgICB1c2VGcm9udE1hdHRlciA9ICFAZHJhZnRQYXRoIHx8ICEhY29uZmlnLmdldChcInB1Ymxpc2hSZW5hbWVCYXNlZE9uVGl0bGVcIilcbiAgICBzbHVnID0gdXRpbHMuc2x1Z2l6ZShAZnJvbnRNYXR0ZXIuZ2V0KFwidGl0bGVcIiksIGNvbmZpZy5nZXQoJ3NsdWdTZXBhcmF0b3InKSkgaWYgdXNlRnJvbnRNYXR0ZXJcbiAgICBzbHVnIHx8IHRlbXBsYXRlSGVscGVyLmdldEZpbGVTbHVnKEBkcmFmdFBhdGgpIHx8IHV0aWxzLnNsdWdpemUoXCJOZXcgUG9zdFwiLCBjb25maWcuZ2V0KCdzbHVnU2VwYXJhdG9yJykpXG4gIGdldERhdGU6IC0+IHRlbXBsYXRlSGVscGVyLmdldEZyb250TWF0dGVyRGF0ZShAZGF0ZVRpbWUpXG4gIGdldEV4dGVuc2lvbjogLT5cbiAgICAjIGtlZXAgZmlsZSBleHRlbnNpb24gaWYgcGF0aCBleGlzdHMgYW5kIGhhcyBjb25maWd1cmVkIHRvIGtlZXAgaXQuXG4gICAga2VlcEV4dGVuc2lvbiA9IEBkcmFmdFBhdGggJiYgISFjb25maWcuZ2V0KFwicHVibGlzaEtlZXBGaWxlRXh0bmFtZVwiKVxuICAgIGV4dG5hbWUgPSBwYXRoLmV4dG5hbWUoQGRyYWZ0UGF0aCkgaWYga2VlcEV4dGVuc2lvblxuICAgIGV4dG5hbWUgfHwgY29uZmlnLmdldChcImZpbGVFeHRlbnNpb25cIilcbiJdfQ==

(function() {
  $(document).ready(function() {

    /**
     * Reset values for testing
     */
    // localStorage['hide_donate_message'] = false;
    // localStorage['num_times_options_viewed'] = 0;

    /**
     * Default values set in load-default-options.js
     */
    var timeperiod = localStorage['timeperiod'];
    var dataToRemove = JSON.parse(localStorage['data_to_remove']);
    var cookieSettings = JSON.parse(localStorage['cookie_settings']);
    var autorefresh = localStorage['autorefresh'] == 'true' || false;
    var numTimesOptionsViewed = parseInt(localStorage['num_times_options_viewed']);
    var shouldHideDonateMessage = numTimesOptionsViewed > 2 || localStorage['hide_donate_message'] == 'true';
    var isFirstRun = window.location.hash.indexOf('first-run') !== -1;

    window.location.hash = '';
    localStorage['num_times_options_viewed'] = numTimesOptionsViewed + 1;

    /**
     * Hotfix: 'originBoundCertificates' is not supported any more
     */
    if (dataToRemove['originBoundCertificates']) {
      delete dataToRemove['originBoundCertificates'];
      saveSettings();
    }

    /**
     * Generic event tracking
     */
    $("[data-ga-event]").click(function(event) {
      var $target = $(event.target);
      var info = ($target.data('ga-event') || '').split(',');
      var category = info && info.length >= 1 ? info[0] : '';
      var action = info && info.length >= 2 ? info[1] : '';
      var label = info && info.length >= 3 ? info[2] : null;

      if (category && action) {
        trackEvent(category, action, label);
      }
    });

    /**
     * Support for opening the extensions overview page
     */
    $(".extensions-link").click(function() {
      var url = event.target.href;
      if (url) {
        try {
          chrome.tabs.update({
            url: url
          });
        } catch (error) {

        }
      }
    });

    /**
     * Parse time periods
     */
    $("input[name='timeperiod']").each(function() {
      var element = $(this);
      var period = element.attr("value");
      element.prop('checked', period == timeperiod);
      element.change(function() {
        timeperiod = period;
        saveSettings();
        trackEvent('options', 'timeperiod-changed', timeperiod);
      });
    });

    /**
     * Parse data_to_remove
     */
    $("input[name='data_to_remove']").each(function() {
      var element = $(this);
      var dataType = element.attr("value");
      element.prop('checked', dataToRemove[dataType]);
      element.change(function() {
        var value = element.prop('checked');
        dataToRemove[dataType] = value;
        saveSettings();
        trackEvent('options', 'remove-' + dataType + '-changed', value ? 'enabled' : 'disabled');
      });
    });

    /**
     * Parse autorefresh
     */
    $("input[name='autorefresh']")
      .prop('checked', autorefresh == true)
      .change(function() {
        var value = $(this).prop('checked');
        autorefresh = value;
        saveSettings();
        trackEvent('options', 'autorefresh-changed', value ? 'enabled' : 'disabled');
      });




    /*=======================================================
     * Cookie Settings
     *=======================================================/
    /**
     * Load sub-options instead of deeplinking
     */
    $("a[href*='#cookie-filters'").click(function(event) {
      event.preventDefault();
      var listItem = $(this).closest("li");
      var suboptions = $("aside", listItem);
      suboptions.slideToggle();
      return false;
    });

    /**
     * Add new cookie filter
     */
    $("#cookie-filters a.add").click(function(event) {
      event.preventDefault();
      addCookieFilter('', true);
      return false;
    });

    /**
     * Remove cookie filter
     */
    function removeCookieFilter(event) {
      event.preventDefault();
      var listItem = $(this).closest("li");
      listItem.addClass("hidden");
      saveFilters();
      listItem.closest("li").delay(200).slideUp(150, function() {
        $(this).remove();
      });
      trackEvent('options', 'cookie-filter-removed');
      return false;
    }

    $("#cookie-filters a.remove").click(removeCookieFilter);

    /**
     * Add cookie filter
     */
    function addCookieFilter(value, focus) {
      value = value || "";
      var list = $("#cookie-filters ol");
      var listItem = $('<li class="suboption hidden"><input type="text" value="' + value + '" placeholder="e.g. \'.domain.com\' or \'sub.domain.com\'" /><a href="#" class="remove">remove</a></li>');
      list.append(listItem);
      listItem.hide();
      listItem.fadeIn(100, function() {
        listItem.removeClass("hidden");
        if (focus) {
          $("input", listItem).focus();
        }
      });
      listItem.find('a.remove').click(removeCookieFilter);
      listItem.find("input[type='text']")
        .on('blur', {
          "validate": true
        }, saveFilters)
        .on('change', {
          "validate": true
        }, saveFilters)
        .on('keyup', {
          "validate": false
        }, saveFilters);
      trackEvent('options', 'cookie-filter-added');
      return listItem;
    }

    /**
     * Save cookie filters
     */
    function saveFilters(event) {
      var filters = [];

      $("#cookie-filters input[type='text']").each(function() {

        // skip filters that are being removed
        if ($(this).closest("li").hasClass("hidden")) {
          return;
        }

        var filter = this.value;

        if (!filter || filter == '' || filter.length < 3) {
          return;
        }

        if (!event || event.data.validate) {
          $(this).removeClass("error");

          var segments = filter.split(".");

          // error
          if (segments.length <= 1 && filter != "localhost") {
            $(this).addClass("error");
            return;

            // success
          } else {

            if (segments.length == 2 && segments[1] != "local") {
              filter = "." + filter;
            }

            this.value = filter;
          }

          trackEvent('options', 'cookie-filters-saved', undefined, filters.length);
        }

        filters.push(filter);

      });

      cookieSettings.filters = filters;
      saveSettings();
    }

    $("#cookies_filter_inclusive_yes, #cookies_filter_inclusive_no").change(function() {
      cookieSettings.inclusive = $("#cookies_filter_inclusive_yes").is(":checked");
      saveSettings();
      trackEvent('options', 'cookie-filter-type-changed', cookieSettings.inclusive ? 'inclusive' : 'exclusive');
    });

    $("a[href*='#hide-donation'").click(function(event){
      event.preventDefault();
      hideDonateMessage();
      return false;
    });


    /*=======================================================
     * Initialize
     *=======================================================/

    /**
     * Init
     */
    timeperiod = timeperiod || timeperiods[0];
    $("input[value='" + timeperiod + "']").prop('checked', true);

    $.each(cookieSettings.filters, function(index, value) {
      addCookieFilter(value);
    });

    if (cookieSettings.inclusive) {
      $("#cookies_filter_inclusive_yes").prop('checked', true);
    } else {
      $("#cookies_filter_inclusive_no").prop('checked', true);
    }

    // if (!shouldHideDonateMessage) {
    //   $("#donate-message").show();
    // } else {
    //   $("#donate-message-short").show();
    // }

    // if (isFirstRun) {
    //   $("#donate-headline-first-run").show();
    // }

    /**
     * Helpers
     */
    function saveSettings() {
      localStorage['data_to_remove'] = JSON.stringify(dataToRemove);
      localStorage['timeperiod'] = timeperiod;
      localStorage['autorefresh'] = autorefresh;
      localStorage['hide_donate_message'] = shouldHideDonateMessage;
      localStorage['cookie_settings'] = JSON.stringify(cookieSettings);
    }
    
    function hideDonateMessage() {
      shouldHideDonateMessage = true;
      saveSettings();
      $("#donate-message").slideUp(150);
    }

    /**
     * Based on http://daringfireball.net/2010/07/improved_regex_for_matching_urls
     */
    function validateUrl(url) {
      var regex = /^(?:([a-z0-9+.-]+:\/\/)((?:(?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(:(?:\d*))?(\/(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?|([a-z0-9+.-]+:)(\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})+(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?)(\?(?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*)?(#(?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*)?$/i;
      return url.match(regex);
    }
  });
})();

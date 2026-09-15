(function(document, $) {
    "use strict";

    var SEARCH_FIELD = ".dictionary-translator-key-search";
    var CLEAR_BUTTON = ".dictionary-translator-key-search-clear";
    var PARAMETER = "q";
    var AUTO_SEARCH_MIN_LENGTH = 3;
    var AUTO_SEARCH_DELAY_MS = 500;

    var currentQuery = new URLSearchParams(window.location.search).get(PARAMETER) || "";
    var autoSearchTimeout;

    function search(query, replaceHistoryEntry) {
        clearTimeout(autoSearchTimeout);
        if (query === currentQuery) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        if (query) {
            params.set(PARAMETER, query);
        } else {
            params.delete(PARAMETER);
        }
        var queryString = params.toString();
        var url = window.location.pathname + (queryString ? "?" + queryString : "");
        if (replaceHistoryEntry) {
            window.location.replace(url);
        } else {
            window.location.assign(url);
        }
    }

    function updateClearButton(field) {
        $(CLEAR_BUTTON).each(function(i, button) {
            button.disabled = !field.value && !currentQuery;
        });
    }

    $(document).one("foundation-contentloaded", function() {
        $(SEARCH_FIELD).each(function(i, field) {
            field.value = currentQuery;
            updateClearButton(field);
            if (currentQuery) {
                // the page is reloaded for every search, so continue where the user stopped typing
                field.focus();
                field.setSelectionRange(currentQuery.length, currentQuery.length);
            }
        });
    });

    $(document).on("input", SEARCH_FIELD, function(e) {
        var query = e.target.value.trim();
        updateClearButton(e.target);
        clearTimeout(autoSearchTimeout);
        if (query.length >= AUTO_SEARCH_MIN_LENGTH || (!query && currentQuery)) {
            // refining an active search replaces its history entry instead of adding one per pause in typing
            autoSearchTimeout = setTimeout(function() {
                search(query, !!currentQuery);
            }, AUTO_SEARCH_DELAY_MS);
        }
    });

    $(document).on("keydown", SEARCH_FIELD, function(e) {
        if (e.key !== "Enter") {
            return;
        }
        e.preventDefault();
        search(e.target.value.trim(), false);
    });

    $(document).on("click", CLEAR_BUTTON, function() {
        $(SEARCH_FIELD).each(function(i, field) {
            field.value = "";
            updateClearButton(field);
        });
        search("", false);
    });

})(document, Granite.$);

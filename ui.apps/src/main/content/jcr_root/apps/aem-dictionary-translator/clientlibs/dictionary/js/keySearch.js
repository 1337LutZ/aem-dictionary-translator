(function(document, $) {
    "use strict";

    var SEARCH_FIELD = ".dictionary-translator-key-search";
    var PARAMETER = "q";

    // show the current search term in the search field
    $(document).on("foundation-contentloaded", function() {
        var query = new URLSearchParams(window.location.search).get(PARAMETER) || "";
        $(SEARCH_FIELD).each(function(i, element) {
            element.value = query;
        });
    });

    // reload the page with the entered search term, an empty search term shows all entries again
    $(document).on("keydown", SEARCH_FIELD, function(e) {
        if (e.key !== "Enter") {
            return;
        }
        e.preventDefault();
        var params = new URLSearchParams(window.location.search);
        var query = e.target.value.trim();
        if (query) {
            params.set(PARAMETER, query);
        } else {
            params.delete(PARAMETER);
        }
        var search = params.toString();
        window.location.assign(window.location.pathname + (search ? "?" + search : ""));
    });

})(document, Granite.$);

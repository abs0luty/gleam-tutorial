// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="introduction.html"><strong aria-hidden="true">1.</strong> Introduction</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="quick-start.html"><strong aria-hidden="true">1.1.</strong> Quick start</a></li></ol></li><li class="chapter-item expanded "><a href="basics/intro.html"><strong aria-hidden="true">2.</strong> Basics</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="basics/booleans-and-numbers.html"><strong aria-hidden="true">2.1.</strong> Booleans and numbers</a></li><li class="chapter-item expanded "><a href="basics/strings.html"><strong aria-hidden="true">2.2.</strong> Strings</a></li><li class="chapter-item expanded "><a href="basics/tuples-and-lists.html"><strong aria-hidden="true">2.3.</strong> Tuples and lists</a></li><li class="chapter-item expanded "><a href="assignments.html"><strong aria-hidden="true">2.4.</strong> Assignments</a></li><li class="chapter-item expanded "><a href="pattern-matching.html"><strong aria-hidden="true">2.5.</strong> Pattern matching</a></li><li class="chapter-item expanded "><a href="functions.html"><strong aria-hidden="true">2.6.</strong> Functions</a></li><li class="chapter-item expanded "><a href="result.html"><strong aria-hidden="true">2.7.</strong> Result and optional types</a></li><li class="chapter-item expanded "><a href="expression-blocks.html"><strong aria-hidden="true">2.8.</strong> Expression blocks</a></li><li class="chapter-item expanded "><a href="panic.html"><strong aria-hidden="true">2.9.</strong> Panic and assert</a></li><li class="chapter-item expanded "><a href="custom-types.html"><strong aria-hidden="true">2.10.</strong> Creating custom types</a></li><li class="chapter-item expanded "><a href="modules.html"><strong aria-hidden="true">2.11.</strong> Modules and imports</a></li><li class="chapter-item expanded "><a href="generics.html"><strong aria-hidden="true">2.12.</strong> Generics</a></li></ol></li><li class="chapter-item expanded "><a href="advanced.html"><strong aria-hidden="true">3.</strong> Advanced Gleam</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="todo.html"><strong aria-hidden="true">3.1.</strong> Todo</a></li><li class="chapter-item expanded "><a href="bitstrings.html"><strong aria-hidden="true">3.2.</strong> Bit strings</a></li><li class="chapter-item expanded "><a href="escape-sequences.html"><strong aria-hidden="true">3.3.</strong> Escape sequences</a></li><li class="chapter-item expanded "><a href="tail-call.html"><strong aria-hidden="true">3.4.</strong> Tail call optimisation</a></li><li class="chapter-item expanded "><a href="phantom.html"><strong aria-hidden="true">3.5.</strong> Phantom types</a></li><li class="chapter-item expanded "><a href="labelled_arguments.html"><strong aria-hidden="true">3.6.</strong> Labelled arguments</a></li><li class="chapter-item expanded "><a href="labelled_fields.html"><strong aria-hidden="true">3.7.</strong> Labelled fields</a></li><li class="chapter-item expanded "><a href="dict.html"><strong aria-hidden="true">3.8.</strong> Dict</a></li><li class="chapter-item expanded "><a href="pair.html"><strong aria-hidden="true">3.9.</strong> Pairs</a></li><li class="chapter-item expanded "><a href="set.html"><strong aria-hidden="true">3.10.</strong> Sets</a></li><li class="chapter-item expanded "><a href="option.html"><strong aria-hidden="true">3.11.</strong> Option</a></li><li class="chapter-item expanded "><a href="order.html"><strong aria-hidden="true">3.12.</strong> Order</a></li><li class="chapter-item expanded "><a href="iterator.html"><strong aria-hidden="true">3.13.</strong> Iterators</a></li><li class="chapter-item expanded "><a href="opaque.html"><strong aria-hidden="true">3.14.</strong> Opaque types</a></li><li class="chapter-item expanded "><a href="queue.html"><strong aria-hidden="true">3.15.</strong> Queue</a></li><li class="chapter-item expanded "><a href="interop.html"><strong aria-hidden="true">3.16.</strong> Erlang and Javascript interop</a></li><li class="chapter-item expanded "><a href="testing.html"><strong aria-hidden="true">3.17.</strong> Testing and gleeunit</a></li><li class="chapter-item expanded "><a href="bytes-and-string-builders.html"><strong aria-hidden="true">3.18.</strong> Bytes and string builders</a></li><li class="chapter-item expanded "><a href="base64.html"><strong aria-hidden="true">3.19.</strong> Base64</a></li><li class="chapter-item expanded "><a href="regex.html"><strong aria-hidden="true">3.20.</strong> Regex</a></li><li class="chapter-item expanded "><a href="uri.html"><strong aria-hidden="true">3.21.</strong> URI</a></li></ol></li><li class="chapter-item expanded "><a href="ecosystem.html"><strong aria-hidden="true">4.</strong> Ecosystem</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="installing-packages.html"><strong aria-hidden="true">4.1.</strong> Installing custom packages</a></li><li class="chapter-item expanded "><a href="publishing.html"><strong aria-hidden="true">4.2.</strong> Creating and publishing a package</a></li><li class="chapter-item expanded "><a href="docker-images.html"><strong aria-hidden="true">4.3.</strong> Gleam docker images</a></li><li class="chapter-item expanded "><a href="simplifile.html"><strong aria-hidden="true">4.4.</strong> IO: simplifile</a></li><li class="chapter-item expanded "><a href="filepath.html"><strong aria-hidden="true">4.5.</strong> Filepath: filepath</a></li><li class="chapter-item expanded "><a href="ranger.html"><strong aria-hidden="true">4.6.</strong> Ranges: ranger</a></li><li class="chapter-item expanded "><a href="birl.html"><strong aria-hidden="true">4.7.</strong> Datetime: birl</a></li><li class="chapter-item expanded "><a href="snag.html"><strong aria-hidden="true">4.8.</strong> Ad-hoc error type: snag</a></li><li class="chapter-item expanded "><a href="json.html"><strong aria-hidden="true">4.9.</strong> Json: gleam_json</a></li><li class="chapter-item expanded "><a href="crypto.html"><strong aria-hidden="true">4.10.</strong> Cryptography: gleam_crypto</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);

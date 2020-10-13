var html = document.documentElement;

$(document).ready(function() {
	registerEvents();
	currentTag();
	search();
});

function currentTag() {
	let path = window.location.pathname;

	if(path === "/" || path.includes("page/") && !path.includes("tag/")) {
		$(".c-tags-list__item-link").get(0).classList.add("c-tags-list__item-link--current");
	} else {
		if(path.includes("tag/")) {
			let tagPath = path.replace(/page.*/g, "");
			$(".c-tags-list__item-link[href='"+ tagPath +"']").get(0).classList.add("c-tags-list__item-link--current");
		}
	}
}

function registerEvents() {
	let html = document.documentElement;

	let searchButtonEl = document.getElementById("js-search");
	let searchModalEl = document.getElementById("js-search-modal");
	let searchWrapperEl = document.getElementById("js-search-modal__wrapper");
	let searchInputEl = document.getElementById("js-search-input");

	let menuButtonEl = document.getElementById("js-menu");

	searchButtonEl.addEventListener("click", function() {

		html.classList.remove("menu-opened");
		html.classList.add("search-opened");

		setTimeout(function() {
			searchInputEl.focus();
		}, 500);
	});

	searchModalEl.addEventListener("click", function() {
		html.classList.remove("search-opened");
		searchInputEl.blur();
	});

	searchWrapperEl.addEventListener("click", function(e) {
		e.stopPropagation();
	});

	menuButtonEl.addEventListener("click", function() {
		let menuOpened = html.classList.contains("menu-opened");

		if(menuOpened) {
			html.classList.remove("menu-opened");
		} else {
			html.classList.add("menu-opened");
		}
	});

	hotkeys.filter = function(event){
		return true;
	}

	hotkeys('esc', function(event, handler){
		event.preventDefault()

		html.classList.remove("menu-opened");
	});
}

function search() {
	if (typeof ghostsearch_key !== 'undefined' && typeof ghostsearch_url !== 'undefined') {

		let searchButtonEl = document.getElementById("js-search-button");
		let searchInputEl = document.getElementById("js-search-input");
		let searchEmptyEl = document.getElementById("js-search-empty");
		let searchResultsEl = document.getElementById('js-results-container');

		searchButtonEl.style.display = "block";

		ghostSearch = new GhostSearch({
			input: '#js-search-input',
			trigger: 'focus',
			results: '#js-results-container',
			key: ghostsearch_key,
			url: ghostsearch_url,
			template: function(result) {
				let url = [location.protocol, '//', location.host].join('');
				return '<a href="' + url + '/' + result.slug + '/"' + ' class="c-search__item"><span class="c-search__item-name">' + result.title + '</span></a>';
			},
			on: {
				beforeDisplay: function(results) {
				},
				afterDisplay: function(results){
					let inputEl = document.getElementById('js-search-input');

					if(!(inputEl.value == "")) {
						searchEmptyEl.style.display = "none";

						if(searchResultsEl.childNodes.length) {
							searchResultsEl.firstElementChild.classList.add("c-search__item--selected");
						}
					} else {
						searchEmptyEl.style.display = "block";
					}

					if (results.total == 0 && inputEl.value != '') {
						let e = document.createElement('div');

						e.classList.add("c-search__no-items");
						e.innerHTML = document.querySelector("#js-no-results").innerHTML;

						searchResultsEl.appendChild(e);
					};
				},
				beforeFetch: function() {
				},
				afterFetch: function() {
				}
			}
		});

		hotkeys('esc', function(event, handler){
			event.preventDefault()

			html.classList.remove("search-opened");
		});

		hotkeys('alt+s', function(event, handler){
			event.preventDefault()

			let searchOpened = html.classList.contains("search-opened");

			if(searchOpened) {
				html.classList.remove("search-opened");
				searchInputEl.blur();
			} else {
				html.classList.add("search-opened");
				setTimeout(function() {
					searchInputEl.focus();
				}, 500);
			}
		});

		hotkeys('backspace', function(event, handler){
			searchInputEl.focus();
		});

		hotkeys('enter', function(event, handler){
			let searchOpened = html.classList.contains("search-opened");
			let selected = document.querySelector(".c-search__item--selected");

			if(searchOpened && selected) {
				selected.click();
			}
		});

		let elScroller = zenscroll.createScroller(searchResultsEl);

		hotkeys('up,down', function(event, handler){
			let searchOpened = html.classList.contains("search-opened");
			let results = searchResultsEl.childNodes.length > 0 && !searchResultsEl.getElementsByClassName("c-search__no-items").length;

			if(searchOpened && results) {
				event.preventDefault()

				searchInputEl.blur();

				let selected = document.querySelector(".c-search__item--selected");

				if(!selected) {
					selected = searchResultsEl.firstElementChild
				}

				switch (handler.key) {
					case 'up':
						let prev = selected.previousElementSibling || searchResultsEl.lastElementChild;
						selected.classList.remove("c-search__item--selected");
						prev.classList.add("c-search__item--selected");
						elScroller.center(prev);
						break;
					case 'down':
						let next = selected.nextElementSibling || searchResultsEl.firstElementChild;
						selected.classList.remove("c-search__item--selected");
						next.classList.add("c-search__item--selected");
						elScroller.center(next);
						break;
					default:
						break;
				}
			}
		});

		window.addEventListener("beforeunload", function() {
			searchInputEl.value = "";
		});
	}
}
//# sourceMappingURL=main.js.map

let $postHeader = $(".c-post-header");

$(document).ready(function() {
	conf();

	stickyHeader();

	tables();
	clipboard();
	gallery();
	zoom();
	videos();
	authors();
	disqus();
});

function conf() {
	toastr.options.timeOut = 1500;
	toastr.options.extendedTimeOut = 60;
	toastr.options.positionClass = "toast-top-full-width";

	toastr.options.showMethod = 'slideDown';
	toastr.options.hideMethod = 'slideUp';
	toastr.options.closeMethod = 'slideUp';

	toastr.options.showDuration = "100";
	toastr.options.hideDuration = "100";
}

function tables() {
	$("table").wrap("<div class='responsive-table'></div>");
}

function stickyHeader() {
	let toc = document.querySelector('.c-sticky-header__toc');

	if(toc) {

		let stickyHeader = document.querySelector('.c-sticky-header');
		let stickyTitle = document.querySelector('.c-sticky-header__title');

		tocbot.init({
			tocSelector: '.c-sticky-header__toc',
			contentSelector: '.c-post-content',
			hasInnerContainers: true
		});

		if(!toc.childElementCount) {
			stickyTitle.style.display = 'block';
		}

		readingProgress('.c-post-content', '.c-sticky-header__progress-bar');

		stickyHeader.addEventListener('click', function() {
			zenscroll.toY(0);
		});

		window.addEventListener('scroll', function() {
			checkTop();
		});
	}
}

function checkTop() {
	let scroll = $(window).scrollTop();

	let bottomHeader = ($postHeader.height() + $postHeader.offset().top);
	let belowHeader = scroll > bottomHeader;

	let bottomPost = $(".c-post-content").height() + bottomHeader;
	let belowPost = scroll > bottomPost;

	if(belowHeader) {
		if(!belowPost) {
			document.body.classList.add("sticky-opened");
		} else {
			document.body.classList.remove("sticky-opened");
		}
	} else {
		document.body.classList.remove("sticky-opened");
	}
}

function clipboard() {
	let clipboard = new ClipboardJS('#js-clipboard');

	clipboard.on('success', function(e) {
		toastr.success('Copied!');
	});
}

function gallery() {
	var images = document.querySelectorAll('.kg-gallery-image img');
	images.forEach(function (image) {
		var container = image.closest('.kg-gallery-image');
		var width = image.attributes.width.value;
		var height = image.attributes.height.value;
		var ratio = width / height;
		container.style.flex = ratio + ' 1 0%';
	});
}

function zoom() {
	mediumZoom(document.querySelectorAll('.kg-image'));
	mediumZoom(document.querySelectorAll('.kg-gallery-image img'));
}

function videos() {
	var $postContent = $(".c-post-content");
	$postContent.fitVids();
}

function authors() {
	let multipleAuthors = document.querySelector(".c-post-header__link-authors");
	let authorsSection = document.querySelector("#post-authors");

	if(multipleAuthors) {
		multipleAuthors.addEventListener("click", function() {
			zenscroll.to(authorsSection, 500);
		});
	}
}

function readingProgress(contentArea, progressBar) {
	const content = document.querySelector(contentArea);
	const progress = document.querySelector(progressBar);

	const frameListening = () => {
		const contentBox = content.getBoundingClientRect();
		const midPoint = 0;
		const minsRemaining = Math.round(progress.max - progress.value);

		if (contentBox.top > midPoint) {
			progress.style.width = "0%";
		}

		if (contentBox.top < midPoint) {
			progress.style.width = "100%";
		}

		if (contentBox.top <= midPoint && contentBox.bottom >= midPoint) {
			progress.style.width =
				((100 * Math.abs(contentBox.top - midPoint)) /
					contentBox.height) + "%";
		}

		window.requestAnimationFrame(frameListening);
	};

	window.requestAnimationFrame(frameListening);
};

function disqus() {
	let commentsSection = document.querySelector(".c-post-section--comments");
	let commentsButton = document.querySelector(".c-comments__link");

	if(commentsSection && typeof disqus_shortname !== 'undefined') {
		commentsSection.style.display = "block";

		commentsButton.addEventListener("click", function() {
			commentsButton.style.display = "none";
			(function() { // DON'T EDIT BELOW THIS LINE
				var d = document, s = d.createElement('script');
				s.src = 'https://' + disqus_shortname + '.disqus.com/embed.js';
				s.setAttribute('data-timestamp', +new Date());
				(d.head || d.body).appendChild(s);
			})();
		});

	}
}

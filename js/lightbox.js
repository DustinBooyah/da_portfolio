(function () {
	const links = Array.from(document.querySelectorAll('.gallery__link'));
	if (!links.length) return;

	const lb = document.createElement('div');
	lb.className = 'lightbox';
	lb.setAttribute('role', 'dialog');
	lb.setAttribute('aria-modal', 'true');
	lb.setAttribute('aria-labelledby', 'lightbox-title');
	lb.innerHTML =
		'<button class="lightbox__close" type="button" aria-label="Close">&times;</button>' +
		'<button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous project">&lsaquo;</button>' +
		'<button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next project">&rsaquo;</button>' +
		'<div class="lightbox__content">' +
			'<div class="lightbox__info">' +
				'<p class="lightbox__title" id="lightbox-title"></p>' +
				'<p class="lightbox__description"></p>' +
			'</div>' +
			'<img class="lightbox__image" src="" alt="">' +
		'</div>';
	document.body.appendChild(lb);

	const lbImg = lb.querySelector('.lightbox__image');
	const lbTitle = lb.querySelector('.lightbox__title');
	const lbDesc = lb.querySelector('.lightbox__description');
	const lbClose = lb.querySelector('.lightbox__close');
	const lbPrev = lb.querySelector('.lightbox__nav--prev');
	const lbNext = lb.querySelector('.lightbox__nav--next');
	const focusables = [lbClose, lbPrev, lbNext];

	let currentIdx = 0;
	let triggerEl = null;

	function show(idx) {
		currentIdx = (idx + links.length) % links.length;
		const link = links[currentIdx];
		const figure = link.closest('figure');
		const thumb = link.querySelector('img');
		const titleEl = figure ? figure.querySelector('.gallery__title') : null;
		const toolsEl = figure ? figure.querySelector('.gallery__tools') : null;

		const title = titleEl ? titleEl.textContent.trim() : '';
		const tools = toolsEl ? toolsEl.textContent.trim() : '';
		const description = link.dataset.description || '';
		const urls = link.dataset.urls || '';

		lbImg.src = link.href;
		lbImg.alt = thumb ? thumb.alt : '';

		lbTitle.textContent = title;
		if (tools) {
			const small = document.createElement('small');
			small.textContent = tools;
			lbTitle.appendChild(small);
		}

		lbDesc.textContent = description;
		if (urls) {
			const small = document.createElement('small');
			small.textContent = urls;
			lbDesc.appendChild(small);
		}
	}

	function open(idx, trigger) {
		triggerEl = trigger;
		show(idx);
		lb.setAttribute('open', '');
		document.body.style.overflow = 'hidden';
		document.addEventListener('keydown', onKey);
		lbClose.focus();
	}

	function close() {
		lb.removeAttribute('open');
		document.body.style.overflow = '';
		document.removeEventListener('keydown', onKey);
		if (triggerEl && typeof triggerEl.focus === 'function') {
			triggerEl.focus();
		}
	}

	function onKey(e) {
		if (e.key === 'Escape') {
			close();
		} else if (e.key === 'ArrowRight') {
			show(currentIdx + 1);
		} else if (e.key === 'ArrowLeft') {
			show(currentIdx - 1);
		} else if (e.key === 'Tab') {
			const i = focusables.indexOf(document.activeElement);
			if (e.shiftKey && i <= 0) {
				e.preventDefault();
				focusables[focusables.length - 1].focus();
			} else if (!e.shiftKey && i === focusables.length - 1) {
				e.preventDefault();
				focusables[0].focus();
			}
		}
	}

	links.forEach(function (link, idx) {
		link.addEventListener('click', function (e) {
			e.preventDefault();
			open(idx, link);
		});
	});

	lb.addEventListener('click', function (e) {
		if (e.target === lb) close();
	});
	lbClose.addEventListener('click', close);
	lbPrev.addEventListener('click', function () { show(currentIdx - 1); });
	lbNext.addEventListener('click', function () { show(currentIdx + 1); });
})();

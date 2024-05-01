class ProductContentAreas {
	constructor(el) {
		this.el = el;

		this.nav = this.el.querySelector("nav");
		this.tabs = this.nav.querySelectorAll(`button[role="tab"]`);
		this.contentAreas = this.el.querySelectorAll(".product-content-area");

		this.init();
	}

	init() {
		this.tabs.forEach((t) => {
			t.addEventListener("click", () => {
				const tabId = t.getAttribute("aria-controls");

				this.tabs.forEach((x) => {
					if (x === t) {
						x.setAttribute("aria-selected", true);
					} else {
						x.removeAttribute("aria-selected");
					}
				});

				this.contentAreas.forEach((a) => {
					if (a.id != tabId) {
						a.removeAttribute("aria-expanded");
					} else {
						a.setAttribute("aria-expanded", true);
					}
				});
			});
		});
	}
}

window.addEventListener("DOMContentLoaded", () => {
	const areas = document.querySelectorAll(
		".product-content-areas:not(.initialized)"
	);

	areas.forEach((a) => {
		new ProductContentAreas(a);
	});
});

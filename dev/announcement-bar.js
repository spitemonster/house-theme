class AnnouncementBar {
	constructor(el) {
		this.el = el;
		this.announcementId = this.el.dataset.announcementId;

		// there is an "in page" announcement bar section; for these we need to pop them out of their current position and move them to the top of the page.
		if (
			this.el.parentElement.classList.contains("announcement-bar--page")
		) {
			const c = this.el.cloneNode(true);
			this.el.parentElement.removeChild(this.el);
			this.el = c;

			document
				.querySelector("header")
				.insertBefore(
					this.el,
					document.querySelector("header").firstElementChild
				);
		}

		this.closeButton = this.el.querySelector(
			"button.announcement-bar__close"
		);

		this.shown =
			localStorage.getItem(`${this.announcementId}-closed`) === "true";

		this.closeButton.addEventListener("click", this.close.bind(this));

		if (!this.shown) {
			this.el.classList.remove("display-none");
		}
	}

	close() {
		this.el.classList.add("display-none");
		localStorage.setItem(`${this.announcementId}-closed`, "true");
	}
}
window.addEventListener("DOMContentLoaded", () => {
	const announcementBars = document.querySelectorAll(".announcement-bar");

	announcementBars.forEach((b) => {
		console.log(b);
		new AnnouncementBar(b);
	});
});

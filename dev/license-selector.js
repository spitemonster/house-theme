class LicenseSelector {
	constructor(el) {
		this.el = el;
		this.educationSelect = this.el.querySelector("#education-type");
		this.specialtySelector = this.el.querySelector("#specialty");
		this.specialtyOptions = Array.from(this.specialtySelector.children);
		this.submit = this.el.querySelector("button");

		this.specialtyOptions = this.specialtyOptions.map((o) => {
			return o.cloneNode(true);
		});

		this.educationSelect.addEventListener(
			"change",
			this.filterSpecialties.bind(this)
		);

		this.submit.addEventListener("click", (e) => {
			e.preventDefault();
			if (
				!this.specialtySelector.getAttribute("disabled") &&
				this.specialtySelector.value != ""
			) {
				window.location.href = `${window.location.origin}${this.specialtySelector.value}`;
			}
		});
	}

	filterSpecialties() {
		const educationType = this.educationSelect.value;

		if (educationType == "") {
			return;
		}

		this.specialtySelector.removeAttribute("disabled");
		this.specialtySelector.innerHTML = "";

		this.specialtyOptions.forEach((o) => {
			if (o.dataset.educationType == educationType) {
				this.specialtySelector.append(o.cloneNode(true));
			}
		});
	}
}

window.addEventListener("DOMContentLoaded", () => {
	const selectors = document.querySelectorAll(".license-selector");

	selectors.forEach((sel) => {
		new LicenseSelector(sel);
	});
});

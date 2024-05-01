class BookBundleObserver {
	constructor(el) {
		this.el = el;
		this.confirmationTrigger = this.el.querySelector(
			".book-bundle-confirmation-trigger"
		);
		this.confirmationLightbox = document.querySelector(
			".book-bundle-confirmation-lightbox"
		);
		this.addToCartButton = this.confirmationLightbox.querySelector(
			".book-bundle-add-to-cart"
		);
		this.nonStudentFeeSelector = this.el.querySelector(
			'.variant-select-wrap select[data-name="non-student-fee"]'
		);
		this.confirmationCheckbox = this.confirmationLightbox.querySelector(
			"#non_student_fee_confirmed"
		);
		this.lightboxClose =
			this.confirmationLightbox.querySelector(".lightbox-close");

		this.init();
	}

	init() {
		this.confirmationTrigger.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();

			// here we need to determine if the user has selected any add-on products
			if (this.checkFeeApplicable()) {
				return this.confirmationLightbox.classList.remove(
					"display-none"
				);
			}

			const productForm = document.querySelector(".shopify-product-form");
			this.nonStudentFeeSelector.value = "Without Non-Student Fee";

			productForm.submit();
		});

		this.addToCartButton.addEventListener("click", () => {
			const add = document.querySelector("#add");
			if (!add) {
				return;
			}

			add.click();
		});

		this.confirmationCheckbox.addEventListener("change", () => {
			if (this.confirmationCheckbox.checked) {
				this.nonStudentFeeSelector.value = "With Non-Student Fee";
				this.addToCartButton.removeAttribute("disabled");
			} else {
				// this.nonStudentFeeSelector.value = "Without Non-Student Fee";
				this.addToCartButton.setAttribute("disabled", true);
			}
		});

		this.confirmationLightbox.addEventListener("click", (e) => {
			if (
				e.target == this.confirmationLightbox ||
				e.target == this.lightboxClose
			) {
				this.confirmationLightbox.classList.add("display-none");
			}
		});
	}

	// check if there are any EPA addons available for this product that would negate the non-student fee
	// if there are not then bundling is not an option so we can remove the
	checkFeeApplicable() {
		const addons = Array.from(
			this.el.querySelectorAll(".spice-spa-addon-product-item")
		);

		let feeApplicable = true;

		addons.forEach((a) => {
			const cb = a.querySelector("input[type='checkbox']");

			if (cb.checked) {
				feeApplicable = false;
			}
		});

		return feeApplicable;
	}
}

window.addEventListener("DOMContentLoaded", () => {
	const bookBundleProductCard = document.querySelector(
		".product-details-card.book_bundle"
	);

	if (bookBundleProductCard) {
		new BookBundleObserver(bookBundleProductCard);
	}
});

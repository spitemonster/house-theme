document.documentElement.classList.remove("no-js");

window.currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
	minimumFractionDigits: 0,
});

window.addEventListener("DOMContentLoaded", () => {
	{
		// add "save $DISCOUNT AMOUNT" tag to add-on products
		const addonContainer = document.querySelector("#bundle-addons");

		if (addonContainer) {
			const moConfig = {
				attributes: true,
				childList: true,
				subtree: true,
			};
			const mutationObserver = new MutationObserver(
				(mutationList, observer) => {
					for (const mutation of mutationList) {
						if (mutation.type == "childList") {
							const addons = Array.from(
								addonContainer.querySelectorAll(
									".spice-spa-addon-product-item"
								)
							);
							if (
								addons.length > 0 &&
								!addonContainer.classList.contains(
									"initialized"
								)
							) {
								const form = addonContainer.closest("form");
								addonContainer.classList.add("initialized");
								addons.forEach((a) => {
									setupAddOnPrice(a, form);
									setupDefaultOption(a);
								});

								mutationObserver.disconnect();
								break;
							}
						}
					}
				}
			);

			mutationObserver.observe(addonContainer, moConfig);
		}
	}

	{
		const productCard = document.querySelector(".product-details-card");
		// set up variant selector for products that have 2 or more variant drop downs
		const productOptionSelectors = document.querySelectorAll(
			".product-option-selector"
		);
		const productVariantSelector = document.querySelector(
			".product-variant-selector"
		);
		const atcButton = document.querySelector(
			'.product-details-card .shopify-product-form button[type="submit"]'
		);

		if (
			productOptionSelectors &&
			productVariantSelector &&
			!productCard.classList.contains("book_bundle")
		) {
			const options = Array.from(productVariantSelector.children);
			atcButton.setAttribute("disabled", true);

			productOptionSelectors.forEach((sel) => {
				sel.addEventListener("change", (e) => {
					const name = createVariantNameSelector(
						productOptionSelectors
					);

					const selectedOption = options.find((o) => {
						if (o.dataset.title == name) {
							return o;
						}
					});

					if (selectedOption) {
						const value = selectedOption.value;

						productVariantSelector.value = value;
						productVariantSelector.dispatchEvent(
							new Event("change")
						);

						if (selectedOption.dataset.available == "true") {
							atcButton.innerText = "Add to Cart";
							atcButton.removeAttribute("disabled");
						} else {
							atcButton.innerText = "Sold Out";
							atcButton.setAttribute("disabled", true);
						}
					}
				});
			});

			const selectedOption =
				productVariantSelector.querySelector("option[selected]");

			if (selectedOption) {
				const available = selectedOption.dataset.available;

				if (available) {
					atcButton.removeAttribute("disabled");
					atcButton.innerText = "Add to Cart";
				}
			}
		}
	}

	{
		// set up price to reflect price of selected variant
		const priceWrap = document.querySelector(".product-card__price");

		const sel = document.querySelector("select.product-variant-selector");

		if (priceWrap && sel) {
			const priceEl = priceWrap.firstElementChild;
			sel.addEventListener("change", (e) => {
				const selected = sel.querySelector(
					`option[value="${sel.value}"]`
				);

				const price = selected.dataset.price;
				const salePrice = selected.dataset.salePrice;

				priceEl.innerText = price;
			});
		}
	}

	// open external links in a new tab
	externalLinks();
});

function externalLinks() {
	for (var c = document.getElementsByTagName("a"), a = 0; a < c.length; a++) {
		var b = c[a];
		b.getAttribute("href") &&
			b.hostname !== location.hostname &&
			(b.target = "_blank");
	}
}
function setupAddOnPrice(addon, productForm) {
	const basePriceEl = addon.querySelector(".spice-spa-addon-price-main");
	const discountedPriceEl = addon.querySelector(
		".spice-spa-addon-product-price"
	);

	if (basePriceEl && discountedPriceEl) {
		const savingsEl = document.createElement("span");
		savingsEl.classList.add("price-savings", "text-uppercase");
		savingsEl.innerText = productForm.dataset.discountContent;
		discountedPriceEl.classList.add("display-none", "visibility-hidden");

		basePriceEl.after(savingsEl);
	}
}

function createVariantNameSelector(options) {
	let name = "";
	options.forEach((o, idx) => {
		if (idx == options.length - 1) {
			name += `${o.value}`;
		} else {
			name += `${o.value} / `;
		}
	});

	return name;
}

function setupDefaultOption(addon) {
	const sel = addon.querySelector("select");
	if (sel) {
		const first = sel.firstElementChild;
		const option = document.createElement("option");
		const price = addon.querySelector(".spice-spa-addon-product-price");
		price.innerText = "";

		first.removeAttribute("selected");
		option.selected = true;
		option.value = "";
		option.innerText = "Select Option";
		first.before(option);
		sel.dispatchEvent(new Event("change"));
	}
}

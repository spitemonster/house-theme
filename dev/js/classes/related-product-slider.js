import { ProductSlider } from "./product-slider";

export class RelatedProductSlider extends ProductSlider {
	constructor(el) {
		super(el);
		this.currencyFormatter = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		});
		this.mainEl = document.querySelector(".related-products");
	}

	init() {
		this.productUrl = this.el.dataset.productUrl;

		// clone our card template and then remove it from the product area
		this.cardTemplate = this.productArea
			.querySelector("#product-card-template")
			.cloneNode(true);
		this.cardTemplate.removeAttribute("id");
		this.productArea.innerHTML = "";

		// fetch products
		fetch(this.productUrl)
			.then((res) => res.json())
			.then((recData) => {
				if (recData.products.length > 0) {
					this.initializeProducts(recData.products);
				} else {
					this.mainEl.classList.add("display-none");
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}

	// set up products cards
	initializeProducts(products) {
		// create each card and add to product area
		products.forEach((p) => {
			const c = this.cardTemplate.cloneNode(true);
			const title = c.querySelector("h3");
			const price = c.querySelector(".price");
			const compareAt = c.querySelector(".compare-at");
			const inner = c.querySelector(".product-card");
			const img = c.querySelector("img");
			inner.classList.add("visible");
			c.setAttribute("href", p.url);
			img.setAttribute("src", `${p.featured_image}?width=400`);

			title.innerText = p.title;
			// divide by 100 to convert to dollars and cents
			price.innerText = this.currencyFormatter.format(p.price / 100);

			if (p.compare_at_price) {
				compareAt.innerText = this.currencyFormatter.format(
					p.compare_at_price / 100
				);
			} else {
				compareAt.parentElement.removeChild(compareAt);
			}

			this.productArea.appendChild(c);
		});

		// update products array
		this.products = Array.from(
			this.productArea.querySelectorAll(".product-card")
		);

		// update slide count
		this.slideCount = this.products.length;

		// call init on product slider class
		super.init();
	}
}

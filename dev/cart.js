class Cart {
	constructor(el) {
		this.el = el;
		this.form = this.el.querySelector("form");
		// array so we can use array methods on this down the line
		this.items = Array.from(this.el.querySelectorAll(".cart-item"));
		this.subtotalEl = this.el.querySelector(".subtotal-value");
		this.totalEl = this.el.querySelector(".total");

		// products are only available in the US so this doesn't need to be dynamic
		this.currencyFormatter = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		});

		this.agreeCheckbox = this.el.querySelector("#agree");
		this.checkoutButton = this.el.querySelector("button#checkout");

		this.init();
	}

	init() {
		// don't run anything if there are no cart items
		if (this.items.length > 0 && this.agreeCheckbox) {
			this.agreeCheckbox.addEventListener("click", () => {
				if (this.agreeCheckbox.checked && this.items.length > 0) {
					this.checkoutButton.removeAttribute("disabled");
				} else {
					this.checkoutButton.setAttribute("disabled", "");
				}
			});

			this.initItems();
		}
	}

	initItems() {
		this.items.forEach((cartItem) => {
			const itemId = cartItem.dataset.productId;
			const itemKey = cartItem.dataset.itemKey;
			const itemIndex = cartItem.dataset.itemIndex;
			const removeButton = cartItem.querySelector(".btn.remove");

			const quantityEl = cartItem.querySelector(".quantity-input");

			removeButton.addEventListener("click", (e) => {
				e.preventDefault();
				this.updateItemQuantity(itemId, itemKey, itemIndex, 0);
			});

			this.setupQuantityInput(quantityEl, itemId, itemKey, itemIndex);
		});
	}

	setupQuantityInput(quantityElement, itemId, itemKey, itemIndex) {
		const input = quantityElement.querySelector("input");
		const buttons = quantityElement.querySelectorAll("button");

		buttons.forEach((b) => {
			b.addEventListener("click", (e) => {
				e.preventDefault();

				const action = b.dataset.action;
				let value = input.value * 1;

				if (action == "remove") {
					value -= 1;
				} else if (action == "add") {
					value += 1;
				}

				this.updateItemQuantity(itemId, itemKey, itemIndex, value);
			});
		});
	}

	// obvs handles updating quantity including removing products since it all goes to the same endpoint
	// using the index seems to be the most robust method of handling and updating cart items as the API doesn't want to accept Key and ID is not unique
	updateItemQuantity(id, key, index, quantity) {
		const body = JSON.stringify({
			line: index,
			quantity: quantity * 1,
		});

		const config = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: `application/json`,
			},
		};

		fetch(`${routes.cart_change_url}`, { ...config, ...{ body } })
			.then((res) => {
				return res.json();
			})
			.then((b) => {
				const subtotal = b.total_price;
				this.updateCartSubtotal(subtotal);

				if (b.itemCount > 0) {
					const updatedItem = b.items.find((i) => i.id == id);

					if (updatedItem == null) {
						window.location.reload();
					} else {
						this.updateCartItem(
							id,
							updatedItem.quantity,
							updatedItem.final_line_price
						);
					}
				} else {
					window.location.reload();
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}

	updateCartSubtotal(newSubtotal) {
		this.subtotalEl.innerText = this.currencyFormatter.format(
			(newSubtotal * 1) / 100
		);
	}

	// finds the item element in the cart and updates quantities and such
	updateCartItem(id, quantity, total = 0.0) {
		const item = this.items.find((i) => i.dataset.productId == id);

		// remove item if quantity is 0
		if ((quantity = 0)) {
			this.items = this.items.filter((i) => i.dataset.productId == id);
			item.parentElement.removeChild(item);
			return;
		}

		const itemTotal = item.querySelector(".line-total");
		const itemQuantity = item.querySelector(".quantity-value");

		itemTotal.innerText = this.currencyFormatter.format((total * 1) / 100);
		itemQuantity.value = quantity * 1;
	}
}

window.addEventListener("DOMContentLoaded", () => {
	const cart = document.getElementById("cart-main");

	new Cart(cart);
});

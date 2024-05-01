class AddressManager {
	constructor(el) {
		this.el = el;
		this.userAddresses = Array.from(
			this.el.querySelectorAll(".user-address")
		);

		this.userAddresses.forEach((a) => this.initUserAddress(a));

		this.addAddressButton = this.el.querySelector("button.add");
		this.addAddressForm = this.el.querySelector(".add-address-form");
		this.cancelAddButton = this.el.querySelector(".cancel-add");
		this.addAddressButton.addEventListener("click", () => {
			this.addAddressForm.classList.toggle("display-none");
			this.addAddressButton.classList.add("display-none");
		});

		this.cancelAddButton.addEventListener("click", (e) => {
			e.preventDefault();
			this.addAddressButton.classList.remove("display-none");
			this.addAddressForm.classList.add("display-none");
		});
	}

	initUserAddress(address) {
		const editButton = address.querySelector("button.edit");
		const deleteButton = address.querySelector("button.delete");
		const cancelButton = address.querySelector("button.cancel");
		const editForm = address.querySelector(".user-address__edit-form");

		editButton.addEventListener("click", () => {
			editForm.classList.toggle("display-none");
		});

		cancelButton.addEventListener("click", (e) => {
			e.preventDefault();
			editForm.classList.add("display-none");
		});
	}
}

window.addEventListener("DOMContentLoaded", () => {
	const addressList = document.querySelector(".addresses");
	new AddressManager(addressList);
});

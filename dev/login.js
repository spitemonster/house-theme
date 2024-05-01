class Login {
	constructor(el) {
		this.el = el;
		this.recover = this.el.querySelector("#recover");
		this.login = this.el.querySelector("#login");
		this.recoverTrigger = this.el.querySelector("#recover-trigger");
		this.cancelRecoverTrigger = this.el.querySelector(`a[href="#login"]`);

		if (window.location.href.includes("#recover")) {
			this.showRecover();
		}

		this.recoverTrigger.addEventListener(
			"click",
			this.showRecover.bind(this)
		);

		this.cancelRecoverTrigger.addEventListener(
			"click",
			this.showLogin.bind(this)
		);
	}

	showRecover() {
		this.recover.classList.remove("display-none");
		this.login.classList.add("display-none");
	}

	showLogin() {
		this.login.classList.remove("display-none");
		this.recover.classList.add("display-none");
	}
}

window.addEventListener("DOMContentLoaded", () => {
	const loginSection = document.getElementById("account-login");

	new Login(loginSection);
});

class AccordionGroup {
	constructor(el) {
	  this.el = el;
	  this.detailsElements = el.querySelectorAll("details");
	  this.addToggleListeners();
	}
  
	addToggleListeners() {
	  this.detailsElements.forEach((details) => {
		details.addEventListener("toggle", () => this.handleToggle(details));
	  });
	}
  
	handleToggle(toggledDetails) {
	  if (toggledDetails.hasAttribute("open")) {
		this.closeOtherDetails(toggledDetails);
	  }
	}
  
	closeOtherDetails(currentDetails) {
	  this.detailsElements.forEach((details) => {
		if (details !== currentDetails && details.hasAttribute("open")) {
		  details.removeAttribute("open");
		}
	  });
	}
  }
  
  window.addEventListener("DOMContentLoaded", () => {
	const accordionGroups = document.querySelectorAll(".accordion-group");
  
	accordionGroups.forEach((group) => {
	  new AccordionGroup(group);
	});
  });
  
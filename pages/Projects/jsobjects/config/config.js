export default {
	appid: "projectsmith",
	status: [
		{ value: "open", label: "Open" },
		{ value: "closed", label: "Closed" },
		{ value: "inProgress", label: "In progress" },
		{ value: "waitingFeedback", label: "Waiting on feedback" },
		{ value: "waitingApproval", label: "Waiting on approval" },
	],
	defaultResponse: {
		"project": 0,
		"email" : "",
		"form_response": false,
		"approved": false,
		"comments": null,
	},
}
export default {
	async onLoad() {
		await SelectProjectsByUser.run()
		state.projects = SelectProjectsByUser.data

		const projectId = appsmith.URL.queryParams.project
		const project = projectId ? this.findProjectById(projectId) : null

		if (project) {
			this.isValidProject(project) ? this.setCurrent(project) : this.handleInvalidProject()
		} else {
			this.loadState()
			state.current && this.isValidProject(state.current)
				? this.saveState()
			: this.handleInvalidProject()
		}
		console.log(state)
		const responsesOnThisProject = await GetResponsesByProject.run({ project: state.current.id })
		const userEmail = appsmith.user.email
		const userHasSubmitted = responsesOnThisProject.some(response => response.email === userEmail)
		console.log("responses on this project", responsesOnThisProject)
		console.log("userhas submited?", userHasSubmitted)

		if (userHasSubmitted) {
			showModal(AlreadySavedModal.name)
		}

	},

	findProjectById(projectId) {
		return state.projects.find(proj => proj.id == projectId)
	},

	setCurrent(project) {
		state.current = project
		state.currentTab = "project"
		this.saveState()
	},

	isOwner() {
		return appsmith.user.email === state.current.owner
	},

	isValidProject(project) {
		const userEmail = appsmith.user.email
		return project.owner === userEmail || (Array.isArray(project.stakeholders) && project.stakeholders.includes(userEmail))
	},

	saveState() {
		storeValue("projectsmith", state)
	},

	loadState() {
		let loadedState = appsmith.store.projectsmith || false
		if (loadedState) {
			state = _.cloneDeep(loadedState)
		}
	},

	deleteState() {
		removeValue("projectsmith")
	},

	handleInvalidProject() {
		console.error("User is not authorized for this project or project not found")
		this.displayError()
	},

	displayError() {
		showModal(ErrorModal.name)
	}
}

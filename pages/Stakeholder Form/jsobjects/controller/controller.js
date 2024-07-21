export default {
	async onLoad() {
		await SelectProjectsByUser.run()
		state.projects = SelectProjectsByUser.data
		console.log("STATE PROJECTS:", state.projects)

		const projectId = appsmith.URL.queryParams.project
		console.log("PROJECT ID:", projectId)

		const project = projectId ? this.findProjectById(projectId) : null

		if (project) {
			this.isValidProject(project) ? this.setCurrent(project) : this.handleInvalidProject()
		} else {
			this.loadState()
			console.log("LOADED STATE CURRENT:", state.current)

			state.current && this.isValidProject(state.current)
				? this.saveState()
				: this.handleInvalidProject()
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
		return project.owner === userEmail || project.stakeholders.includes(userEmail)
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
		this.redirectToProjectsPage()
	},

	redirectToProjectsPage() {
		navigateTo('Projects')  // Adjust the navigation based on your app's configuration
	}
}

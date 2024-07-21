export default {
	async onLoad() {
		await SelectProjectsByUser.run()
		state.projects = SelectProjectsByUser.data
		console.log("STATE PROJECTS:", state.projects)

		const projectId = appsmith.URL.queryParams.project
		console.log("PROJECT ID:", projectId)

		if (projectId !== undefined && projectId !== null) {
			// Try to find the project with the given ID in the SelectUsersByUser
			const project = state.projects.find(proj => proj.id == projectId)
			console.log("FOUND PROJECT:", project)

			if (project) {
				this.setCurrent(project)
			} else {
				console.error("Project not found in the projects list")
				this.redirectToProjectsPage()
			}
		} else {
			console.log("LOAD STATE BECAUSE THERE IS NO PARAMETER")
			// Load state from local storage
			this.loadState()
			console.log("LOADED STATE CURRENT:", state.current)

			if (!state.current) {
				console.error("No project found in URL query params or local storage")
				this.redirectToProjectsPage()
			}
		}
		this.saveState()
		console.log("CURRENT PROJECT STATE", state.current)
	},

	setCurrent(project) {
		state.current = project
		state.currentTab = "project"
		this.saveState()
	},

	isOwner() {
		// Check if the current email is the same as the owner email
		return appsmith.user.email === state.current.owner
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

	redirectToProjectsPage() {
		// Redirect user to the projects page or show an error message
		navigateTo('Projects')  // Adjust the navigation based on your app's configuration
	}
}

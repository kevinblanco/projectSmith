export default {
	async onLoad() {
		
		await SelectProjectsByUser.run()
		state.projects = SelectProjectsByUser.data

		const projectId = appsmith.URL.queryParams.project

		if (projectId) {
			// Try to find the project with the given ID in the SelectUsersByUser
			const project = state.projects.find(proj => proj.id == projectId)

			if (project) {
				this.setCurrent(project)
			} else {
				console.error("Project not found in the projects list")
				this.redirectToProjectsPage()
			}
		} else {
			// Load state from local storage
			this.loadState()

			if (!state.current) {
				console.error("No project found in URL query params or local storage")
				this.redirectToProjectsPage()
			}
		}
		this.saveState()
	},

	setCurrent(project) {
		state.current = project
		state.currentTab = "project"
		this.saveState()
	},

	isOwner() {
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
		navigateTo('Projects') 
	}
}

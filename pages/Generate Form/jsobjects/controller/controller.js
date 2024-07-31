export default {
	async onLoad() {
		const project = await SelectProjectById.run();
		state.current = project[0];
	},
	setCurrent(project) {
		state.current = project
		state.currentTab = "project"
		this.saveState()
	},
	isOwner() {
		// Check if the current email is the same as the owner email
		
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
	}
}
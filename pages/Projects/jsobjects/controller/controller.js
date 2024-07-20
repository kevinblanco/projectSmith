export default {
	async onLoad() {
		await SelectProjectsByUser.run()
		state.projects = SelectProjectsByUser.data;
		this.saveState();
	},
	setCurrent(id) {
		state.currentProject = id;
		state.currentTab = "project";
		this.saveState();
	},
	getData(field = "name") {
		let list = state.projects
		let id = state.currentProject
		let project = Object.values(list).find(obj => obj.id === id);
		return project[field]
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
export default {
	async onLoad() {
		await projectSelectAll.run();
		state.projects = projectSelectAll.data;
		if (_.isEmpty(state.current)) {
			state.currentTab = "list";
		}
		this.saveState()
	},
	setCurrent(project) {
		state.current = project;
		state.currentTab = "project";
		this.saveState();
	},
	isOwner() {
		return state.current.owner === appsmith.user.email;
	},
	buttonIcon() {
		return (state.currentTab === "list") ? "plus" : "arrow-left";
	},
	buttonActon() {
		if (state.currentTab == "list") {
			console.log("open new project modal")
			showModal(mod_addProject.name);
		} else {
			state.currentTab = "list";
		}
	},
	
	// Project management
	projectCreate() {
		projectInsert.run();
		closeModal()
	},
	projectUpdate() {},
	projectDelete() {},
	
	// State management 
	saveState() {
		storeValue(config.appid, state);
	},
	loadState() {
		let loadedState = appsmith.store[config.appid] || false;
		if (loadedState) {
			state = _.cloneDeep(loadedState);
		}
	},
	deleteState() {
		removeValue(config.appid);
	},
	test() {
		console.log(appsmith.store[config.appid]);
	}
}
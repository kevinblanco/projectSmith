export default {
	async onLoad() {
		await SelectProjectsByUser.run();
		state.projects = SelectProjectsByUser.data;
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
		// Check if the current email is the same as the owner email
		return state.current.owner == appsmith.user.email;
	},
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
		console.log(_.isEmpty(state.current));
	}
}
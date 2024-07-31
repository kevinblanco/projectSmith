export default {
	/**
	 * Called when the component is loaded. Fetches project and response data,
	 * processes projects, sets the current tab if needed, and saves the state.
	 * @async
	 */
	async onLoad() {
		await projectSelectAll.run();
		await responseSelectAll.run();
		state.projects = this.projectsAugmented();
		if (!_.isEmpty(state.current)) {
			state.currentTab = "project";
		}
		this.saveState();
	},

	/**
	 * Sets the current project and updates the current tab to "project".
	 * @param {Object} project - The project to set as current.
	 */
	setCurrent(project) {
		state.current = project;
		state.currentTab = "project";
		this.saveState();
	},

	/**
	 * Checks if the current user is the owner of the current project.
	 * @return {boolean} True if the current user is the owner, otherwise false.
	 */
	isOwner() {
		return state.current.owner === appsmith.user.email;
	},

	/**
	 * Determines the icon for the action button based on the current tab.
	 * @return {string} The icon name.
	 */
	buttonIcon() {
		return (state.currentTab === "list") ? "plus" : "arrow-left";
	},

	/**
	 * Handles the action of the main button. Shows modal for adding project
	 * or switches to list view based on the current tab.
	 */
	buttonActon() {
		if (state.currentTab == "list") {
			showModal(mod_addProject.name);
		} else {
			state.currentTab = "list";
			state.current = {};
			this.saveState();
		}
	},

	/*** Project management ***/

	/**
	 * Creates a new project and closes the add project modal.
	 */
	async projectCreate() {
		await projectInsert.run();
		closeModal(mod_addProject.name);
	},

	/**
	 * Updates the current project and closes the edit project modal.
	 */
	async projectUpdate() {
		await projectUpdate.run();
		closeModal(mod_editProject.name);
		await projectSelectAll.run();
	},

	/**
	 * Deletes the current project and closes the delete project modal.
	 */
	async projectDelete() {
		await projectDelete.run();
		closeModal(mod_deleteProject);
	},

	/**
	 * Processes each project and returns an object of projects keyed by their id.
	 * @return {Object} Updated projects keyed by their id.
	 */
	projectsAugmented() {
		let projects = projectSelectAll.data;
		// Process each project and return updated projects
		return projects.map(project => this.updateProject(project));
	},

	/**
	 * Updates a project by mapping its stakeholders to an object keyed by their email.
	 * @param {Object} project - The project to update.
	 * @return {Object} The updated project.
	 */
	updateProject(project) {
		let updatedStakeholders = project.stakeholders.map(email => this.mapStakeholders(email));
		return {
			...project,
			responses: updatedStakeholders
		};
	},

	/**
	 * Maps a stakeholder's email to their response. If no response is found,
	 * uses the default response. If form_response has any values, sets it to true.
	 * @param {string} email - The email of the stakeholder.
	 * @return {Object} The mapped stakeholder response.
	 */
	mapStakeholders(email) {
		let responseMap = _.keyBy(responseSelectAll.data, 'email');
		let response = responseMap[email];

		// Merge defaultResponse with response data
		let mergedResponse = { ...config.defaultResponse, ...response };

		// If form_response has any values, set it to true
		if (response && response.form_response && Object.keys(response.form_response).length > 0) {
			mergedResponse.form_response = true;
		}
		mergedResponse.email = email

		return mergedResponse;
	},

	/*** State management ***/

	/**
	 * Saves the current state to the store.
	 */
	saveState() {
		storeValue(config.appid, state);
	},

	/**
	 * Loads the state from the store. If no state is found, it initializes the state.
	 */
	loadState() {
		let loadedState = appsmith.store[config.appid] || false;
		if (loadedState) {
			state = _.cloneDeep(loadedState);
		}
	},

	/**
	 * Deletes the current state from the store.
	 */
	deleteState() {
		removeValue(config.appid);
	},

	/**
	 * Logs the current state stored in appsmith.store to the console.
	 */
	test() {
		console.log(appsmith.store[config.appid]);
	}
};

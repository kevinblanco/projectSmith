export default {
	parseMsg () {
		const resp = JSON.parse(getMessages.data?.data[0].content[0].text.value);
		return _.omit(resp, 'onSubmitValid') ;
	},



	async checkMessages(){
		setInterval(async ()=>{
			await getMessages.run();

		if(getMessages.data.data[0].role ==='assistant' && getMessages.data.data[0].content[0].text.value){
			clearInterval('timer')
			return
		}
		}, 3000, 'timer')
		

	}
}
({
	handleConfirm : function(component, event, helper) {
		console.log('Going to confirm prediction');
        helper.savePrediction(component, event, helper);
    }
})
({
	verifyReferenceId : function(component, event, helper) {
        console.log('calling server for verification--');
		var action = component.get('c.verifyConReference');
        action.setParam('refId' , component.get('v.referenceId'));
        action.setCallback(this, function(result){
            var state = result.getState();
            if(state === 'SUCCESS'){
                var response = result.getReturnValue();
                console.log(response);
                if(response){
                    console.log('valid');
                    this.hideError(component);
                    var evt = $A.get('e.c:RefVerifyEvent');
                    evt.setParam('isSuccess',true);
                    evt.setParam('referenceId',component.get('v.referenceId'));
                    evt.fire();
                    component.find("overlayLib").notifyClose();
                }else{
                    this.showError(component);
                }
            }else if(state === 'ERROR'){
                this.showError(component);
            }
        });
        $A.enqueueAction(action);
	},
    
    showError: function (component) {
        var errorPanel = component.find("errorId");
        $A.util.removeClass(errorPanel, "slds-hide");
        $A.util.addClass(errorPanel, "slds-show");
    },
    
    hideError: function (component) {
        var errorPanel = component.find("errorId");
        $A.util.addClass(errorPanel, "slds-hide");
        $A.util.removeClass(errorPanel, "slds-show");
    },
})
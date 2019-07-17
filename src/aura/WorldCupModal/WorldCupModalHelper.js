({
	savePrediction : function(component, event, helper) {
        var action = component.get('c.matchPrediction');
        var pred = component.get('v.prediction');
        action.setParams({input : JSON.stringify(pred)});
        action.setCallback(this, function(result){
           var state = result.getState();
            console.log('state=='+state);
            if(state === 'SUCCESS'){
                console.log('success prediction');
                var evt = $A.get('e.c:PredictionEvent');
                if(component.get('v.isPlayer')){
                    evt.setParam('predictionStatusForPlayer',true);
                }else{
                    evt.setParam('predictionStatusForTeam',true);
                }
                if(component.get('v.isMatch1')){
                    evt.setParam('isMatch1',true);
                }else{
                    evt.setParam('isMatch1',false);
                }
                evt.fire();
                console.log('event fired');
                component.find("overlayLib").notifyClose();
            }else if(state === 'ERROR'){
                var evt = $A.get('e.c:PredictionEvent');
                evt.fire();
            }
        });
        $A.enqueueAction(action);
    },
})
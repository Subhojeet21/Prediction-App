({
	doInit : function(component, event, helper) {
        /*var contactReferenceId = component.get('v.contactRefId');
        if(!contactReferenceId){
            helper.verifyRefId(component, event, helper);
        }else{
            component.set('v.isVerificationSuccess', true);
            helper.fetchPlayers(component, event, helper);
        }*/
        component.set('v.isVerificationSuccess', true);
        helper.fetchPlayers(component, event, helper);
    },
    
    onPlayerClick : function(component, event, helper) {
        var isPlayer1Checked = component.get('v.isManOfMatchSelected');
        console.log(isPlayer1Checked);
        var clickedClass = event.getSource().get("v.class");
        console.log(clickedClass);
        var playerId = event.getSource().get("v.id");
        console.log(playerId);
		//if(!isPlayer1Checked){
            var isPredictionAllowed = helper.checkAllowedTime(component);
            if(isPredictionAllowed){
                component.set('v.matchPrediction.ManOfMatch_Bid__c',playerId);
            	component.set('v.matchPrediction.Bidder__c',$A.get("$SObjectType.CurrentUser.Id"));
            	component.set('v.matchPrediction.Match__c',component.get('v.matchId'));
            	helper.showModal(component, playerId, '', true, helper);
            }else{
                helper.fireToast("Oops...Prediction Time up", false);
            }
        /*}else{
            helper.fireToast("You have already made your choice for Man of the Match", false);
        }*/
    },
    
    onPlayer2Click : function(component, event, helper) {
        var isPlayer1Checked = component.get('v.isManOfMatchSelected2');
        console.log(isPlayer1Checked);
        var clickedClass = event.getSource().get("v.class");
        console.log(clickedClass);
        var playerId = event.getSource().get("v.id");
        console.log(playerId);
		//if(!isPlayer1Checked){
            var isPredictionAllowed = helper.checkAllowedTime2(component);
            if(isPredictionAllowed){
                component.set('v.matchPrediction2.ManOfMatch_Bid__c',playerId);
            	component.set('v.matchPrediction2.Bidder__c',$A.get("$SObjectType.CurrentUser.Id"));
            	component.set('v.matchPrediction2.Match__c',component.get('v.match2Id'));
            	helper.showModal(component, playerId, '', false, helper);
            }else{
                helper.fireToast("Oops...Prediction Time up", false);
            }
        /*}else{
            helper.fireToast("You have already made your choice for Man of the Match", false);
        }*/
    },
    
    onTeamClick : function(component, event, helper) {
        var isTeamChecked = component.get('v.isWinnerSelected');
        console.log(isTeamChecked);
        var teamName = event.getSource().get("v.class");
        console.log(teamName);
        var teamId = JSON.parse(component.get('v.teamMap'))[teamName].Id;
        //if(!isTeamChecked){
            var isPredictionAllowed = helper.checkAllowedTime(component);
            if(isPredictionAllowed){
                component.set('v.matchPrediction.Winning_Team_Bid__c',teamId);
            	component.set('v.matchPrediction.Bidder__c',$A.get("$SObjectType.CurrentUser.Id"));
            	component.set('v.matchPrediction.Match__c',component.get('v.matchId'));
            	helper.showModal(component, '', teamName, true, helper);
            }else{
                helper.fireToast("Oops...Prediction Time up", false);
            }
        /*}else{
            helper.fireToast("You have already made your choice for the Winner", false);
        }*/
    },
    
    onTeam2Click : function(component, event, helper) {
        var isTeamChecked = component.get('v.isWinnerSelected2');
        console.log(isTeamChecked);
        var teamName = event.getSource().get("v.class");
        console.log(teamName);
        var teamId = JSON.parse(component.get('v.teamMap'))[teamName].Id;
        //if(!isTeamChecked){
            var isPredictionAllowed = helper.checkAllowedTime2(component);
            if(isPredictionAllowed){
                component.set('v.matchPrediction2.Winning_Team_Bid__c',teamId);
            	component.set('v.matchPrediction2.Bidder__c',$A.get("$SObjectType.CurrentUser.Id"));
            	component.set('v.matchPrediction2.Match__c',component.get('v.match2Id'));
            	helper.showModal(component, '', teamName, false, helper);
            }else{
                helper.fireToast("Oops...Prediction Time up", false);
            }
        /*}else{
            helper.fireToast("You have already made your choice for the Winner", false);
        }*/
    },
    
    /*savePrediction : function(component, event, helper) {
        helper.predictManOfMatch(component, event, helper);
    },*/
    
    handlePostPrediction : function(component, event, helper) {
        console.log('Post prediction event received from aura action');
        //console.log(component.get('v.matchPrediction'));
        var playerPrediction = event.getParam('predictionStatusForPlayer');
        var teamPrediction = event.getParam('predictionStatusForTeam');
        //var matchPred = event.getParam('matchPrediction');
        var isfirstMatch = event.getParam('isMatch1');
        console.log('isfirstMatch---'+isfirstMatch);
        if(isfirstMatch){
            if(playerPrediction){
                component.set('v.isManOfMatchSelected',true);
            }else if(teamPrediction){
                component.set('v.isWinnerSelected',true);
            }else{
                if(component.get('v.isManOfMatchSelected')){
                    component.set('v.matchPrediction.Winning_Team_Bid__c','');
                }else if(component.get('v.isWinnerSelected')){
                    component.set('v.matchPrediction.ManOfMatch_Bid__c','');
                }
                
            }
        }else{
            if(playerPrediction){
                component.set('v.isManOfMatchSelected2',true);
            }else if(teamPrediction){
                component.set('v.isWinnerSelected2',true);
            }else{
                if(component.get('v.isManOfMatchSelected2')){
                    component.set('v.matchPrediction2.Winning_Team_Bid__c','');
                }else if(component.get('v.isWinnerSelected2')){
                    component.set('v.matchPrediction2.ManOfMatch_Bid__c','');
                }
                
            }
        }
        
        component.find("overlayLib").notifyClose();
        helper.fireToast("Prediction Successful. Go to \'Your Predictions\' tab to see your choices", true);
    },
    
    onVerifyComplete : function(component, event, helper){
        console.log('referenceId--');
        console.log(event.getParam('referenceId'));
        var verifyResult = event.getParam('isSuccess');
        component.set('v.isVerificationSuccess',verifyResult);
        component.set('v.contactRefId',event.getParam('referenceId'));
        helper.fetchPlayers(component, event, helper);
    }
    
})
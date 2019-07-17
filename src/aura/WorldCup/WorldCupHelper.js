({
	fetchPlayers : function(component, event, helper) {
        'use strict'
        this.showSpinner(component);
		var action = component.get('c.getPlayers');
        action.setCallback(this, function(result){
           var state = result.getState();
            console.log('state--'+state);
            if(state === 'SUCCESS'){
                var response = JSON.parse(result.getReturnValue());
                console.log(response);
                if(response.matchIdMap && response.matchIdMap[1]){
                    component.set('v.matchId',response.matchIdMap[1]);
                    component.set('v.playerMap',JSON.stringify(response.playersMap));
                    component.set('v.teamMap',JSON.stringify(response.teamMap));
                    //console.log(response.matchPrediction.ManOfMatch_Bid__c);
                    if(response.matchPredictionMap[1]){
                        component.set('v.matchPrediction', response.matchPredictionMap[1]);
                        if(response.matchPredictionMap[1].ManOfMatch_Bid__c){
                            component.set('v.isManOfMatchSelected',true);
                        }
                        if(response.matchPredictionMap[1].Winning_Team_Bid__c){
                            component.set('v.isWinnerSelected',true);
                        }
                    }
                    if(response.matchToTeamMap[1]){
                        let teamTemp = component.get('v.teams');
                        teamTemp = teamTemp.concat(response.matchToTeamMap[1]);
                        component.set('v.teams',teamTemp);
                    }
                    console.log(component.get('v.teams'));
                    console.log(component.get('v.teams')[0]);
                    console.log(component.get('v.teams')[1]);
                    var returnStr = response.teamToPlayersMap;
                    for(var prop in returnStr){
                        //let teamTemp = component.get('v.teams');
                        let playerTemp = component.get('v.players');
                        //teamTemp.push(prop);
                        playerTemp = playerTemp.concat(returnStr[prop]);
                        //component.set('v.teams',teamTemp);
                        component.set('v.players',playerTemp);
                        
                    }
                    component.set('v.playersOfTeam1',returnStr[component.get('v.teams')[0]]);
                    component.set('v.playersOfTeam2',returnStr[component.get('v.teams')[1]]);
                }
                
                // for match 2------------
                if(response.matchIdMap && response.matchIdMap[2]){
                    component.set('v.match2Id',response.matchIdMap[2]);
                    if(response.matchPredictionMap[2]){
                        component.set('v.matchPrediction2', response.matchPredictionMap[2]);
                        if(response.matchPredictionMap[2].ManOfMatch_Bid__c){
                            component.set('v.isManOfMatchSelected2',true);
                        }
                        if(response.matchPredictionMap[2].Winning_Team_Bid__c){
                            component.set('v.isWinnerSelected2',true);
                        }
                    }
                    if(response.matchToTeamMap[2]){
                        let teamTemp = component.get('v.teams2');
                        teamTemp = teamTemp.concat(response.matchToTeamMap[2]);
                        component.set('v.teams2',teamTemp);
                    }
                    console.log(component.get('v.teams2'));
                    console.log(component.get('v.teams2')[0]);
                    console.log(component.get('v.teams2')[1]);
                    var returnStr = response.teamToPlayersMap;
                    for(var prop in returnStr){
                        //let teamTemp = component.get('v.teams');
                        let playerTemp = component.get('v.players2');
                        //teamTemp.push(prop);
                        playerTemp = playerTemp.concat(returnStr[prop]);
                        //component.set('v.teams',teamTemp);
                        component.set('v.players2',playerTemp);
                        
                    }
                    component.set('v.players2OfTeam1',returnStr[component.get('v.teams2')[0]]);
                    component.set('v.players2OfTeam2',returnStr[component.get('v.teams2')[1]]);
                }
                
            }else if(state === 'ERROR'){
            
            }
            this.hideSpinner(component);
        });
        $A.enqueueAction(action);
	},
    
    /*predictManOfMatch : function(component, event, helper) {
        var action = component.get('c.matchPrediction');
        var matchPred = component.get('v.matchPrediction');
        console.log('matchPred');
        console.log(matchPred);
        action.setParams({input : JSON.stringify(matchPred)});
        action.setCallback(this, function(result){
           var state = result.getState();
            console.log('state=='+state);
            if(state === 'SUCCESS'){
                component.set('v.isManOfMatchSelected',true);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type": "success",
                    "message": "Predicted Man of the Match : "+clickedClass
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },*/
    
    showModal : function(component, playerId, teamName, isMatch1, helper) {
        'use strict'
        var modalBody;
        console.log('inside show Modal');
        console.log(component.get('v.matchPrediction'));
        //"parentMethod" : component.getReference('c.savePrediction'),
               
        $A.createComponent("c:WorldCupModal", 
           {
               "player" : JSON.parse(component.get('v.playerMap'))[playerId],
               "team" : JSON.parse(component.get('v.teamMap'))[teamName],
               "prediction" : isMatch1 ? component.get('v.matchPrediction') : component.get('v.matchPrediction2'),
               "isPlayer" : playerId ? true : false,
               "isMatch1" : isMatch1 ? true : false
           },
           function(content, status) {
               if (status === "SUCCESS") {
                   modalBody = content;
                   component.find('overlayLib').showCustomModal({
                       header: " Prediction Confirmation",
                       body: modalBody, 
                       showCloseButton: true
                   })
               }                               
           });
    },
    
    fireToast : function(msg, isSuccess){
        var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "type": isSuccess ? "success" : "error",
                "message": msg
            });
            toastEvent.fire();
    },
    
    checkAllowedTime : function(component){
        var currentDate = new Date();
        var currentTime = currentDate.getTime();
        console.log(currentTime);
        var allowedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 15, 0, 0); // till 3 pm of the match date(today's date IST)
        var allowedTime = allowedDate.getTime();
        console.log(allowedTime);
        //return true;
        if(currentTime <= allowedTime){
            return true;
        }else{
            return false;
        }
    },
    
    checkAllowedTime2 : function(component){
        var currentDate = new Date();
        var currentTime = currentDate.getTime();
        console.log(currentTime);
        var allowedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 18, 0, 0); // till 6 pm of the match date(today's date IST)
        var allowedTime = allowedDate.getTime();
        console.log(allowedTime);
        //return true;
        if(currentTime <= allowedTime){
            return true;
        }else{
            return false;
        }
    },
    
    showSpinner: function (component) {
        console.log('inside showSpinner');
        var myspinner = component.find("spinnerId");
        $A.util.removeClass(myspinner, "slds-hide");
    },
     
    hideSpinner: function (component) {
        console.log('inside hideSpinner');
        var myspinner = component.find("spinnerId");
        $A.util.addClass(myspinner, "slds-hide");
    },
    
    verifyRefId : function(component, event, helper) {
        var modalBody;
        $A.createComponent("c:ContactRefVerification", 
           {},
           function(content, status) {
               if (status === "SUCCESS") {
                   modalBody = content;
                   component.find('overlayLib').showCustomModal({
                       header: "Verify Reference Id",
                       body: modalBody, 
                       showCloseButton: false
                   })
               }                               
           });
    }
    
})
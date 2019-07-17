trigger MatchResultTrigger on Match_Result__c (after insert) {
    
    Set<Id> matchIds = new Set<Id>();
    Map<Id,Id> matchIdToWinTeam = new Map<Id,Id>();
    Map<Id,Id> matchIdToManOfMatch = new Map<Id,Id>();
    Map<Id,Final_Result_Summary__c> finalResSumm = new Map<Id,Final_Result_Summary__c>();
    Map<String, Integer> pointMap = new Map<String,Integer>();
    for(WorldCupPoint__mdt wcPoint : [select id, DeveloperName, point__c from WorldCupPoint__mdt]){
        pointMap.put(wcPoint.DeveloperName,Integer.valueOf(wcPoint.point__c));
    }
    for(Match_Result__c matRes : Trigger.new){
        matchIds.add(matRes.Match__c);
        matchIdToWinTeam.put(matRes.Match__c,matRes.Winning_Team__c);
        matchIdToManOfMatch.put(matRes.Match__c,matRes.ManOfMatch__c);
    }
    
    for(Final_Result_Summary__c finalRes : [select id, Bidder__c from Final_Result_Summary__c]){
        finalResSumm.put(finalRes.Bidder__c, finalRes);
    }
    
    List<Bidder_Result__c> bidResults = new List<Bidder_Result__c>();
    for(Match_Prediction__c matchPred : [select id, Match__c, Bidder__c, Winning_Team_Bid__c, ManOfMatch_Bid__c from Match_Prediction__c where Match__c in :matchIds]){
        Bidder_Result__c bidRes = new Bidder_Result__c();
        bidRes.Bidder__c = matchPred.Bidder__c;
        bidRes.Match__c = matchPred.Match__c;
        bidRes.Is_Team_Prediction_Correct__c = 
        	(matchIdToWinTeam.containsKey(matchPred.Match__c) && matchPred.Winning_Team_Bid__c != null && matchIdToWinTeam.get(matchPred.Match__c) != null && matchIdToWinTeam.get(matchPred.Match__c) == matchPred.Winning_Team_Bid__c) ? 
            true :
        	false;
        bidRes.Is_ManOfMatch_Correct__c = 
        	(matchIdToManOfMatch.containsKey(matchPred.Match__c) && matchPred.ManOfMatch_Bid__c != null && matchIdToManOfMatch.get(matchPred.Match__c) != null && matchIdToManOfMatch.get(matchPred.Match__c) == matchPred.ManOfMatch_Bid__c) ? 
            true :
        	false;
        Integer teamPoints = bidRes.Is_Team_Prediction_Correct__c ? pointMap.get('Winning_Team') : 0;
        Integer manOfMatchPoints = bidRes.Is_ManOfMatch_Correct__c ? pointMap.get('Man_Of_The_Match') : 0;
        bidRes.Points_Earned__c = teamPoints+manOfMatchPoints;
        bidRes.UniqueKey__c = matchPred.Bidder__c+','+matchPred.Match__c; // combination of "bidderId,matchId"
        bidRes.Bidder_Summary__c = finalResSumm.get(matchPred.Bidder__c).Id;
        bidResults.add(bidRes);
    }
    
    Database.insert(bidResults, false);
}
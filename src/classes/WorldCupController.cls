public class WorldCupController {
	
    @AuraEnabled
    public static String getPlayers(){
        List<Match__c> matches = [select id,Team_1__c,Team_1__r.name,Team_2__c,Team_2__r.name,Match_Number__c, (select id, ManOfMatch_Bid__c, ManOfMatch_Bid__r.Name, ManOfMatch_Bid__r.Picture__c, Winning_Team_Bid__c, Winning_Team_Bid__r.Name, Winning_Team_Bid__r.Flag_Icon__c, Match__c, Bidder__c from Match_Predictions__r where Bidder__c = :UserInfo.getUserId()) from Match__c where Match_Date__c = today order by match_number__c];
        Set<Id> teamIds = new Set<Id>();
        WrapData1 wrapData = new WrapData1();
        if(matches != null && matches.size() > 0){
            Integer count=1;
            wrapData.matchIdMap = new Map<Integer,Id>();
            wrapData.matchPredictionMap = new Map<Integer,Match_Prediction__c>();
            wrapData.teamToPlayersMap = new Map<String, List<Player__c>>();
            wrapData.playersMap = new Map<Id, Player__c>();
            wrapData.teamMap = new Map<String, Team__c>();
            wrapData.matchToTeamMap = new Map<Integer, List<String>>();
            for(Match__c m : matches){
                teamIds.add(m.Team_1__c);
                teamIds.add(m.Team_2__c);
                wrapData.matchIdMap.put(count,m.id);
                wrapData.matchToTeamMap.put(count, new List<String>{m.Team_1__r.name, m.Team_2__r.name});
                if(m.Match_Predictions__r != null && m.Match_Predictions__r.size() > 0 ){
                    wrapData.matchPredictionMap.put(count, m.Match_Predictions__r[0]);
                }else{
                    wrapData.matchPredictionMap.put(count, new Match_Prediction__c());
                }
                count++;
            }
        }
        if(teamIds != null && teamIds.size() > 0){
            for(Player__c player : [select id, Name, Picture__c, Team__c, Team__r.Name, Team__r.Flag_Icon__c from Player__c where Team__c in :teamIds]){
                wrapData.playersMap.put(player.Id, player);
                wrapData.teamMap.put(player.Team__r.Name, new Team__c(id=player.Team__c, Name=player.Team__r.Name, Flag_Icon__c=player.Team__r.Flag_Icon__c));
                if(wrapData.teamToPlayersMap.containsKey(player.Team__r.Name)){
                    List<Player__c> playerList = wrapData.teamToPlayersMap.get(player.Team__r.Name);
                    playerList.add(player);
                    wrapData.teamToPlayersMap.put(player.Team__r.Name,playerList);
                }else{
                    wrapData.teamToPlayersMap.put(player.Team__r.Name, new List<Player__c>{player});
                }
            }
        }
        
        system.debug('wrapData--'+wrapData);
        return (String)JSON.serialize(wrapData);
        /*WrapData wrap = new WrapData();
        if(matches != null && matches.size() > 0){
            wrap.matchId = matches[0].id;
            wrap.matchPrediction = matches[0].Match_Predictions__r != null && matches[0].Match_Predictions__r.size() > 0 ? matches[0].Match_Predictions__r[0] : new Match_Prediction__c();
            wrap.teamToPlayersMap = new Map<String, List<Player__c>>();
            wrap.playersMap = new Map<Id, Player__c>();
            wrap.teamMap = new Map<String, Team__c>();
            Set<Id> teamIds = new Set<Id>{matches[0].Team_1__c, matches[0].Team_2__c};
            for(Player__c player : [select id, Name, Picture__c, Team__c, Team__r.Name, Team__r.Flag_Icon__c from Player__c where Team__c in :teamIds]){
                wrap.playersMap.put(player.Id, player);
                wrap.teamMap.put(player.Team__r.Name, new Team__c(id=player.Team__c, Name=player.Team__r.Name, Flag_Icon__c=player.Team__r.Flag_Icon__c));
                if(wrap.teamToPlayersMap.containsKey(player.Team__r.Name)){
                    List<Player__c> playerList = wrap.teamToPlayersMap.get(player.Team__r.Name);
                    playerList.add(player);
                    wrap.teamToPlayersMap.put(player.Team__r.Name,playerList);
                }else{
                    wrap.teamToPlayersMap.put(player.Team__r.Name, new List<Player__c>{player});
                }
            }
        }
        system.debug('wrap--'+wrap);
        return (String)JSON.serialize(wrap);*/
    }
    
    @AuraEnabled
    public static void matchPrediction(String input){
        system.debug('input--'+input);
        Match_Prediction__c matchPred = (Match_Prediction__c) JSON.deserialize(input, Match_Prediction__c.class);
        system.debug('matchPred--'+matchPred);
        List<Match_Prediction__c> matchPreds = [select id, Match__c, Bidder__c, Winning_Team_Bid__c, ManOfMatch_Bid__c from Match_Prediction__c where Bidder__c = :matchPred.Bidder__c and Match__c = :matchPred.Match__c];
        if(matchPreds ==  null || matchPreds.size() <= 0){
            insert matchPred;
        /*}else if(matchPreds[0].Winning_Team_Bid__c == null || matchPreds[0].ManOfMatch_Bid__c == null){
            matchPreds[0].Winning_Team_Bid__c = matchPreds[0].Winning_Team_Bid__c != null ? matchPreds[0].Winning_Team_Bid__c : matchPred.Winning_Team_Bid__c;
            matchPreds[0].ManOfMatch_Bid__c = matchPreds[0].ManOfMatch_Bid__c != null ? matchPreds[0].ManOfMatch_Bid__c : matchPred.ManOfMatch_Bid__c;
            update matchPreds[0];
        }*/
        }else{
        	matchPreds[0].Winning_Team_Bid__c = matchPred.Winning_Team_Bid__c != null ? matchPred.Winning_Team_Bid__c : matchPreds[0].Winning_Team_Bid__c;
            matchPreds[0].ManOfMatch_Bid__c = matchPred.ManOfMatch_Bid__c != null ? matchPred.ManOfMatch_Bid__c : matchPreds[0].ManOfMatch_Bid__c;
            update matchPreds[0];
        }
    }
    
    public class WrapData{
        public Map<String, List<Player__c>> teamToPlayersMap {get;set;}
        public Id matchId {get;set;}
        public Map<Id, Player__c> playersMap {get;set;}
        public Match_Prediction__c matchPrediction {get;set;}
        public Map<String, Team__c> teamMap {get; set;}
    }
    
    public class WrapData1{
        public Map<String, List<Player__c>> teamToPlayersMap {get;set;}
        public Map<Integer,Id> matchIdMap {get;set;} // {1=> id, 2=>id}
        public Map<Id, Player__c> playersMap {get;set;}
        public Map<Integer,Match_Prediction__c> matchPredictionMap {get;set;}  // {1=>matchPrediction, 2 => matchPrediction}
        public Map<String, Team__c> teamMap {get; set;}
        public Map<Integer, List<String>> matchToTeamMap {get;set;}
    }
    
    @AuraEnabled
    public static Boolean verifyConReference(String refId){
        if(String.isNotBlank(refId)){
            List<Contact> conList = [select id from Contact where Reference_Id__c = :refId];
            if(conList != null && conList.size() == 1){
                return true;
            }
        }
        return false;
    }
}
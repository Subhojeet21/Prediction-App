public class SendFirstReminder implements Database.Batchable<sObject>, Schedulable, Database.Stateful {
	public Map<Id, Set<Id>> matchIdTobiddersPredicted = new Map<Id,Set<Id>>();
    public Set<Id> allBidders = new Set<Id>();
    Set<Id> finalSetBidders = new Set<Id>();
    public Map<Id, User> allBidderMap;
    public List<Match__c> matchToday = new List<Match__c>();
    public final List<String> allowedProfiles = new List<String>{'World Cup Community Plus','World Cup Partner Community','World Cup Community Plus Login'};
    public SendFirstReminder(){
        matchToday = [select id, name, match_number__c from match__c where match_date__c = today];
        allBidderMap = new Map<Id,User>([select id,email from User where profile.name in :allowedProfiles]);
        allBidders = allBidderMap.keySet();
    }
    
    public Database.QueryLocator start(Database.BatchableContext con){
        String query = 'select id, bidder__c, match__c from Match_Prediction__c where Match__r.Match_date__c = today';
        return Database.getQueryLocator(query);
    }
    
    public void execute(Database.BatchableContext con, List<sObject> scope){
        List<Match_Prediction__c> matchPreds = (List<Match_Prediction__c>) scope;
        
        if(matchToday != null && matchToday.size() > 0){
            for(Match_Prediction__c pred : matchPreds){
                if(matchIdTobiddersPredicted.containsKey(pred.match__c)){
                    matchIdTobiddersPredicted.get(pred.match__c).add(pred.Bidder__c);
                }else{
                    matchIdTobiddersPredicted.put(pred.match__c, new Set<Id>{pred.Bidder__c});
                }
           }
            
            for(Id matchId : matchIdTobiddersPredicted.KeySet()){
                Set<Id> tempAllBidders = allBidders;
                tempAllBidders.removeAll(matchIdTobiddersPredicted.get(matchId));
                finalSetBidders.addAll(tempAllBidders);
            }
        }
    }
    
    public void finish(Database.BatchableContext con){
        
        List<EmailTemplate> temp = [select id, name,HtmlValue,Subject from EmailTemplate where name = 'SendReminder'];
        List<Messaging.SingleEmailMessage> emailMessages = new List<Messaging.SingleEmailMessage>();
        if(temp != null && temp.size() > 0 && finalSetBidders.size() > 0){
            for(Id userId :finalSetBidders){
                Messaging.SingleEmailMessage eMsg = new Messaging.SingleEmailMessage();
                eMsg.setTemplateId(temp[0].id);
                eMsg.setTargetObjectId(userId);
                eMsg.setSaveAsActivity(false);
                emailMessages.add(eMsg);
            }
        }
        try{
            system.debug('Total number of emails to be send--'+emailMessages.size());
            Messaging.sendEmail(emailMessages);
            system.debug('Email sent successfully--');
        }catch(Exception ex){
            system.debug('Error occurred while sending email--'+ex.getStackTraceString());
            Error_Log__c log = new Error_Log__c();
            log.Error_Description__c = ex.getMessage()+'----'+ex.getStackTraceString();
            insert log;
        }
        
    }
    
    public void execute(System.SchedulableContext sch){
        Database.executeBatch(new SendFirstReminder(), 200);
    }
}
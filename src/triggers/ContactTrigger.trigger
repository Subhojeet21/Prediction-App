trigger ContactTrigger on Contact (before insert) {
    
    /*String chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    for(Contact con : Trigger.new){
        String randStr = '';
        while (randStr.length() < 10) {
           Integer idx = Math.mod(Math.abs(Crypto.getRandomInteger()), chars.length());
           randStr += chars.substring(idx, idx+1);
        }
        con.Reference_Id__c = randStr;
    }*/
}
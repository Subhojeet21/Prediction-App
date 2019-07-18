# Prediction-App

# Upload an image file in File and then execute a below script so that it can be used in home community page: 

ContentVersion cv = [select id from contentversion where contentdocumentid = '0692v0000076vFaAAI']; <br/>
ContentDistribution cd = new ContentDistribution(); <br/>
cd.Name = 'DrainedWCTrophy'; <br/>
cd.ContentVersionId = cv.id; <br/>
cd.PreferencesAllowViewInBrowser= true; <br/>
cd.PreferencesLinkLatestVersion=true; <br/>
cd.PreferencesNotifyOnVisit=false; <br/>
cd.PreferencesPasswordRequired=false; <br/>
cd.PreferencesAllowOriginalDownload= true; <br/>
insert cd;

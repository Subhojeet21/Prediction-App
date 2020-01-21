# DEMO:
<div align="center">
  <a href="https://youtu.be/gH_m2_kBZi0"><img src="https://img.youtube.com/vi/gH_m2_kBZi0/0.jpg" alt="IMAGE ALT TEXT"></a>
</div>

# More Detail:

https://techietips99.wordpress.com/2019/05/20/predict-compare-an-app-to-predict-winner-man-of-the-match-for-every-match-in-icc-world-cup/

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

# use the "ContentDownloadUrl" from "ContentDistribution" object in the community page or any other external page

select id, DistributionPublicUrl, PdfDownloadUrl, ContentDownloadUrl from ContentDistribution where name = 'DrainedWCTrophy'

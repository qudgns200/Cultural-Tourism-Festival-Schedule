import requests
from datetime import date, timedelta

def dateResponse(date):
    url = 'http://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api'
    params ={
                'serviceKey' : 'a927afc2f6eca450e11c1db2f30c6011600f238f313eb0a7c36294708698a890', 
                'pageNo' : '1', 
                'numOfRows' : '100', 
                'type' : 'JSON', 
                #'fstvlNm' : '', 
                #'opar' : '', 
                'fstvlStartDate' : date.strftime("%Y-%m-%d"), 
                #'fstvlEndDate' : two_weeks_later.strftime("%Y-%m-%d"), 
                #'fstvlCo' : '', 
                #'mnnstNm' : '', 
                #'auspcInsttNm' : '', 
                #'suprtInsttNm' : '', 
                #'phoneNumber' : '', 
                #'homepageUrl' : '', 
                #'relateInfo' : '', 
                #'rdnmadr' : '', 
                #'lnmadr' : '', 
                #'latitude' : '', 
                #'longitude' : '', 
                #'referenceDate' : '', 
                #'instt_code' : '', 
                #'instt_nm' : '' 
            }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    return None


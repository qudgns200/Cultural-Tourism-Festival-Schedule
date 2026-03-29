from flask import Flask, render_template, jsonify
from datetime import date, timedelta
from dateResponse import dateResponse

app = Flask(__name__)

@app.route('/')
def index():
    # 메인 페이지 (iframe을 포함)
    return render_template('index.html')

@app.route('/list')
def list_page():
    # iframe 내부에 들어갈 실제 목록 페이지
    return render_template('list.html')

@app.route('/api/festivals')
def get_festivals():
    today = date.today()
    all_data = []
    # 향후 7일간의 데이터를 가져옴
    for i in range(7):
        day_data = dateResponse(today + timedelta(days=i))
        if day_data and 'response' in day_data and 'body' in day_data['response']:
            items = day_data['response']['body'].get('items', [])
            if items:
                all_data.extend(items)
    
    # 중복 제거 (축제명이 같으면 동일 축제로 간주)
    unique_festivals = {f['fstvlNm']: f for f in all_data}.values()
    return jsonify(list(unique_festivals))

if __name__ == '__main__':
    app.run(debug=True)

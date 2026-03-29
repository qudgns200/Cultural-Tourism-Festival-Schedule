from flask import Flask, render_template, jsonify
from datetime import date, timedelta
from dateResponse import dateResponse

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/festivals')
def get_festivals():
    today = date.today()
    all_data = []
    for i in range(7):
        day_data = dateResponse(today + timedelta(days=i))
        if day_data:
            all_data.append(day_data)
    return jsonify(all_data)

if __name__ == '__main__':
    app.run(debug=True)

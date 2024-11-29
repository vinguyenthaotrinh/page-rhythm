from routes.home_route import home_blueprint
from flask import Flask, request, jsonify

app = Flask(__name__)

app.register_blueprint(home_blueprint)

if __name__ == "__main__":

    app.run(debug = True)




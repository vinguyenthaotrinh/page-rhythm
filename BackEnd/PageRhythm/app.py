from routes.home import home_blueprint
from flask import Flask, request, jsonify

app = Flask(__name__)

app.register_blueprint(home_blueprint)

#Test account registration

from services.authentication.authentication_service import AuthenticationService
import datetime

if __name__ == "__main__":

    AuthenticationService().register_account(
        "mrbean@gmail.com",
        "Mr. Bean",
        "Rowan",
        "Atkinson",
        datetime.date(1955, 1, 6),
        "I am Mr. Bean",
        "password",
        "user",
        None
    )

    app.run(debug = True)




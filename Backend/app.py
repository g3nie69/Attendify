from api import create_app
from api.routes import register_routes
from api.auth import auth_routes

app = create_app()
auth_routes(app)
register_routes(app)


if __name__ == '__main__':
    app.run()

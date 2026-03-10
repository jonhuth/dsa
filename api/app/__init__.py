"""Flask application factory."""

from flask import Flask
from flask_cors import CORS


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)

    # Enable CORS for all origins (supports Railway, localhost, and tailnet)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    from app.routes import algorithms

    app.register_blueprint(algorithms.bp)

    @app.route("/health")
    def health():
        """Health check endpoint."""
        return {"status": "ok"}

    return app

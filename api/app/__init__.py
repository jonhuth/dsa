"""Flask application factory."""

from flask import Flask
from flask_cors import CORS


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)

    # Enable CORS for Next.js frontend (localhost and tailnet)
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:3000",
                    "http://127.0.0.1:3000",
                    "http://100.78.10.98:3000",  # Tailnet IP
                ],
                "methods": ["GET", "POST", "OPTIONS"],
                "allow_headers": ["Content-Type"],
            }
        },
    )

    # Register blueprints
    from app.routes import algorithms

    app.register_blueprint(algorithms.bp)

    @app.route("/health")
    def health():
        """Health check endpoint."""
        return {"status": "ok"}

    return app

from flask import Flask, send_from_directory
from config import Config
from extensions import db, cors
from routes import api
import os
from sqlalchemy import inspect

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    cors.init_app(app)

    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')

    # Create upload folder if it doesn't exist
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    # Helper to serve uploaded files
    @app.route('/uploads/<path:filename>')
    def serve_uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    return app

app = create_app()

with app.app_context():
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    
    if not tables:
        print("Creating database tables...")
        db.create_all()
        print("Database tables created successfully.")
    else:
        print(f"Database already initialized. Found {len(tables)} tables.")

if __name__ == '__main__':
    app.run(debug=True, port=5001)

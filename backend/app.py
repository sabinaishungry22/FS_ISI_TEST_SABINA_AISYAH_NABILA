from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})  # Adjust origin if needed

# Database Configuration
DATABASE_URL = "postgresql://root:root@db:5432/todo_db"  # Ensure 'db' matches your docker-compose service name

def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL)
    return conn

def close_db_connection(conn):
    if conn:
        conn.close()

@app.route('/api/todos/', methods=['POST'])
def create_todo():
    data = request.get_json()
    title = data.get('title')

    if not title:
        return jsonify({"error": "Title is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    query = "INSERT INTO todos (title, created_at, updated_at) VALUES (%s, %s, %s) RETURNING id, title, completed, created_at, updated_at"
    now = datetime.utcnow()
    cursor.execute(query, (title, now, now))
    new_todo = cursor.fetchone()
    conn.commit()
    cursor.close()
    close_db_connection(conn)

    if new_todo:
        todo_dict = {
            "id": new_todo[0],
            "title": new_todo[1],
            "completed": new_todo[2],
            "created_at": new_todo[3].isoformat() + 'Z',
            "updated_at": new_todo[4].isoformat() + 'Z'
        }
        logging.info(f"Todo created: {todo_dict}")
        return jsonify(todo_dict), 201
    return jsonify({"error": "Failed to create todo"}), 500

@app.route('/api/todos/', methods=['GET'])
def list_todos():
    completed = request.args.get('completed')
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "SELECT id, title, completed, created_at, updated_at FROM todos"
    if completed is not None:
        query += " WHERE completed = %s"
        if completed.lower() == 'true':
            query += " ORDER BY created_at DESC"
            cursor.execute(query, (True,))
        elif completed.lower() == 'false':
            query += " ORDER BY created_at ASC"
            cursor.execute(query, (False,))
        else:
            query += " ORDER BY created_at ASC" # Default if not true/false
            cursor.execute(query)
    else:
        query += " ORDER BY created_at ASC"
        cursor.execute(query)

    todos = cursor.fetchall()
    cursor.close()
    close_db_connection(conn)

    todo_list = []
    for todo in todos:
        todo_list.append({
            "id": todo[0],
            "title": todo[1],
            "completed": todo[2],
            "created_at": todo[3].isoformat() + 'Z',
            "updated_at": todo[4].isoformat() + 'Z'
        })
    logging.info(f"Retrieved todos (completed={completed}): {len(todo_list)} items")
    return jsonify(todo_list)

@app.route('/api/todos/<int:todo_id>', methods=['GET'])
def get_todo(todo_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "SELECT id, title, completed, created_at, updated_at FROM todos WHERE id = %s"
    cursor.execute(query, (todo_id,))
    todo = cursor.fetchone()
    cursor.close()
    close_db_connection(conn)

    if todo:
        todo_dict = {
            "id": todo[0],
            "title": todo[1],
            "completed": todo[2],
            "created_at": todo[3].isoformat() + 'Z',
            "updated_at": todo[4].isoformat() + 'Z'
        }
        return jsonify(todo_dict)
    return jsonify({"error": "Todo not found"}), 404

@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    data = request.get_json()
    title = data.get('title')
    completed = data.get('completed')
    now = datetime.utcnow()

    conn = get_db_connection()
    cursor = conn.cursor()
    query_parts = []
    params = []

    if title is not None:
        query_parts.append("title = %s")
        params.append(title)
    if completed is not None:
        query_parts.append("completed = %s")
        params.append(completed)

    query_parts.append("updated_at = %s")
    params.append(now)
    params.append(todo_id)

    if not query_parts:
        cursor.close()
        close_db_connection(conn)
        return jsonify({"error": "No fields to update"}), 400

    query = f"UPDATE todos SET {', '.join(query_parts)} WHERE id = %s RETURNING id, title, completed, created_at, updated_at"
    cursor.execute(query, tuple(params))
    updated_todo = cursor.fetchone()
    conn.commit()
    cursor.close()
    close_db_connection(conn)

    if updated_todo:
        todo_dict = {
            "id": updated_todo[0],
            "title": updated_todo[1],
            "completed": updated_todo[2],
            "created_at": updated_todo[3].isoformat() + 'Z',
            "updated_at": updated_todo[4].isoformat() + 'Z'
        }
        logging.info(f"Todo updated: {todo_dict}")
        return jsonify(todo_dict)
    return jsonify({"error": "Todo not found"}), 404

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "DELETE FROM todos WHERE id=%s"
    cursor.execute(query, (todo_id,))
    rows_deleted = cursor.rowcount
    conn.commit()
    cursor.close()
    close_db_connection(conn)

    if rows_deleted > 0:
        logging.info(f"Todo deleted: ID {todo_id}")
        return jsonify({"message": "Todo deleted successfully"}), 204
    return jsonify({"error": "Todo not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
import sqlite3
from flask import Flask, render_template, request, redirect, url_for, g

app = Flask(__name__)
DATABASE = 'data.db'
PORT = 57780


@app.context_processor
def inject_year():
    from datetime import datetime
    return {'now': datetime.now().year}


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv


def modify_db(query, args=()):
    db = get_db()
    db.execute(query, args)
    db.commit()

@app.route('/')
def recipe_index():
    recipes = query_db('SELECT * FROM recipe')
    return render_template('recipe/index.html', recipes=recipes)

@app.route('/recipe/<int:recipe_id>')
def recipe_show(recipe_id):
    recipe = query_db('SELECT * FROM recipe WHERE id = ?', [recipe_id], one=True)
    if recipe is None:
        return render_template('404.html'), 404
    return render_template('recipe/show.html', recipe=recipe)

@app.route('/recipe/create', methods=['GET', 'POST'])
def recipe_create():
    if request.method == 'POST':
        name = request.form['name']
        steps = request.form['steps']
        ingredients = request.form['ingredients']
        modify_db(
            'INSERT INTO recipe (name, steps, ingredients) VALUES (?, ?, ?)',
            [name, steps, ingredients]
        )
        return redirect(url_for('recipe_index'))
    return render_template('recipe/create.html')

@app.route('/recipe/<int:recipe_id>/edit', methods=['GET', 'POST'])
def recipe_edit(recipe_id):
    recipe = query_db('SELECT * FROM recipe WHERE id = ?', [recipe_id], one=True)
    if recipe is None:
        return render_template('404.html'), 404
    if request.method == 'POST':
        name = request.form['name']
        steps = request.form['steps']
        ingredients = request.form['ingredients']
        modify_db(
            'UPDATE recipe SET name = ?, steps = ?, ingredients = ? WHERE id = ?',
            [name, steps, ingredients, recipe_id]
        )
        return redirect(url_for('recipe_index'))
    return render_template('recipe/edit.html', recipe=recipe)

@app.route('/recipe/<int:recipe_id>/delete', methods=['POST'])
def recipe_delete(recipe_id):
    recipe = query_db('SELECT * FROM recipe WHERE id = ?', [recipe_id], one=True)
    if recipe is None:
        return render_template('404.html'), 404
    modify_db('DELETE FROM recipe WHERE id = ?', [recipe_id])
    return redirect(url_for('recipe_index'))


if __name__ == '__main__':
    app.run(debug=True, port=PORT)

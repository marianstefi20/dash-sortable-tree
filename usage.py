import dash
from dash import html, dcc, Input, Output, State
import dash_sortable_tree

app = dash.Dash(__name__)

# Sample items with labels
items = [
    {"id": "1", "parent_id": None, "label": "Home Page"},
    {"id": "2", "parent_id": None, "label": "Products"},
    {"id": "3", "parent_id": "2", "label": "Electronics"},
    {"id": "4", "parent_id": "2", "label": "Clothing"},
    {"id": "5", "parent_id": "3", "label": "Smartphones"},
    {"id": "6", "parent_id": "3", "label": "Laptops"},
    {"id": "7", "parent_id": None, "label": "About Us"},
    {"id": "8", "parent_id": None, "label": "Contact"}
]

app.layout = html.Div([
    html.H1("Tree Editor with Labels"),
    dcc.Location(id="url", refresh=False),
    html.Div(id="output"),
    dash_sortable_tree.DndTreeEditor(
        id="tree-editor",
        items=items,
        collapsible=True,
        removable=False,
        indicator=True,
        indentationWidth=30
    ),
    html.Hr(),
    html.Div(id="selected-item"),
    html.Div(id="tree-structure")
])

@app.callback(
    Output("selected-item", "children"),
    Input("tree-editor", "selectedId")
)
def display_selected(selected_id):
    if selected_id:
        return f"Selected item ID: {selected_id}"
    return "No item selected"

@app.callback(
    Output("tree-structure", "children"),
    Input("tree-editor", "items")
)
def display_structure(items):
    if items:
        return html.Pre(
            "\n".join([
                f"ID: {item['id']}, Label: {item.get('label', 'No label')}, Parent: {item['parent_id']}"
                for item in items
            ])
        )
    return "No items"

# Expand-to-id from URL: use query param ?node=<id>
@app.callback(
    Output("tree-editor", "expandToId"),
    Output("tree-editor", "selectedId"),
    Output("tree-editor", "scrollToSelected"),
    Input("url", "search")
)
def expand_from_url(search):
    if not search:
        return None, None, False
    # Simple parse (avoid extra deps)
    try:
        query = search.lstrip("?")
        params = dict(part.split("=", 1) for part in query.split("&") if "=" in part)
        node_id = params.get("node") or params.get("id")
    except Exception:
        node_id = None
    if node_id:
        return node_id, node_id, True
    return None, None, False

if __name__ == "__main__":
    app.run(debug=True)

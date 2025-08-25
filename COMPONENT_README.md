# DndTreeEditor Component

A general-purpose drag-and-drop tree editor component for Dash applications. This component allows users to:
- View hierarchical data in a tree structure
- Drag and drop items to reorder or reparent them
- Select items for editing
- Collapse/expand tree nodes
- Remove items (optional)

## Key Features

### General Purpose Design
- Only requires `id` and `parent_id` fields
- Preserves all additional fields in your data
- No assumptions about data structure
- Clean, minimal API

### Built-in Functionality
- Drag and drop reordering
- Parent-child relationship management
- Selection support for editing workflows
- Collapsible nodes with internal state management
- Optional item removal

## Installation

```bash
# Install the package (once published)
pip install dash-dndkit-tree
```

## Basic Usage

```python
import dash
from dash import html
import dash_sortable_tree

# Your hierarchical data - only id and parent_id are required
items = [
    {"id": "1", "parent_id": None, "name": "Root Item"},
    {"id": "2", "parent_id": "1", "name": "Child Item"},
    {"id": "3", "parent_id": "1", "name": "Another Child"},
]

app = dash.Dash(__name__)

app.layout = html.Div([
    dash_sortable_tree.DndTreeEditor(
        id="my-tree",
        items=items
    )
])

if __name__ == "__main__":
    app.run_server(debug=True)
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | - | Component ID for Dash callbacks |
| `items` | list of dicts | Required | List of items with `id` and `parent_id` fields |
| `selectedId` | string | null | Currently selected item ID |
| `collapsible` | boolean | true | Whether nodes can be collapsed/expanded |
| `removable` | boolean | false | Whether items can be removed |
| `indicator` | boolean | false | Show drop indicator during drag |
| `indentationWidth` | number | 50 | Indentation width in pixels |

## Callbacks

The component triggers callbacks when:
- Items are reordered (updates `items` prop)
- An item is selected (updates `selectedId` prop)

### Example with Selection

```python
@app.callback(
    Output("selected-info", "children"),
    Input("my-tree", "selectedId"),
    State("my-tree", "items")
)
def display_selected(selected_id, items):
    if selected_id:
        item = next((i for i in items if i["id"] == selected_id), None)
        if item:
            return f"Selected: {item.get('name', selected_id)}"
    return "No selection"
```

## Restaurant Menu Editor Example

See `example_menu_editor.py` for a complete example showing:
- Tree view for menu structure (sections and dishes)
- Form panel for editing selected items
- Real-time updates when dragging items
- Preserving all custom fields (price, description, etc.)

## Migration from Previous Version

If you were using the previous version with `uuid`, `parent_uuid`, and `sort_order`:

```python
# Old format
old_items = [
    {"uuid": "1", "parent_uuid": None, "sort_order": 0, "item_data": {...}}
]

# New format - simpler!
new_items = [
    {"id": "1", "parent_id": None, ...}  # All fields at top level
]
```

Key changes:
- `uuid` → `id`
- `parent_uuid` → `parent_id`
- No more `sort_order` (handled internally)
- No more `item_data` wrapper (fields at top level)
- `expanded_ids` is now managed internally

## Styling

The component includes basic styling with selection highlighting. You can override styles using CSS:

```css
/* Override selection color */
.dnd-tree-editor .selected {
    background-color: #your-color;
}

/* Override hover effect */
.dnd-tree-editor li > div:hover {
    background-color: #your-hover-color;
}
```

## Development

To run the example:

```bash
python example_menu_editor.py
```

## License

MIT License 
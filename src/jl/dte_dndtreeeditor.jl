# AUTO GENERATED FILE - DO NOT EDIT

export dte_dndtreeeditor

"""
    dte_dndtreeeditor(;kwargs...)

A DndTreeEditor component.

Keyword arguments:
- `id` (String; optional)
- `collapsible` (Bool | Real | String | Dict | Array; optional)
- `indentationWidth` (Real; optional)
- `indicator` (Bool | Real | String | Dict | Array; optional)
- `items` (optional): . items has the following type: Array of lists containing elements 'id', 'parent_id', 'label'.
Those elements have the following types:
  - `id` (String; required)
  - `parent_id` (String; required)
  - `label` (String; optional)s
- `onItemsChange` (optional)
- `onRemove` (optional)
- `onSelect` (optional)
- `removable` (Bool | Real | String | Dict | Array; optional)
- `selectedId` (String; optional)
- `setProps` (optional)
"""
function dte_dndtreeeditor(; kwargs...)
        available_props = Symbol[:id, :collapsible, :indentationWidth, :indicator, :items, :onItemsChange, :onRemove, :onSelect, :removable, :selectedId]
        wild_props = Symbol[]
        return Component("dte_dndtreeeditor", "DndTreeEditor", "dash_sortable_tree", available_props, wild_props; kwargs...)
end


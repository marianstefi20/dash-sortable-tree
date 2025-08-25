# AUTO GENERATED FILE - DO NOT EDIT

export dst_dndtreeeditor

"""
    dst_dndtreeeditor(;kwargs...)

A DndTreeEditor component.

Keyword arguments:
- `id` (String; optional)
- `collapsible` (Bool | Real | String | Dict | Array; optional)
- `expandToId` (String; optional)
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
- `scrollToSelected` (Bool | Real | String | Dict | Array; optional)
- `selectedId` (String; optional)
- `setProps` (optional)
"""
function dst_dndtreeeditor(; kwargs...)
        available_props = Symbol[:id, :collapsible, :expandToId, :indentationWidth, :indicator, :items, :onItemsChange, :onRemove, :onSelect, :removable, :scrollToSelected, :selectedId]
        wild_props = Symbol[]
        return Component("dst_dndtreeeditor", "DndTreeEditor", "dash_sortable_tree", available_props, wild_props; kwargs...)
end


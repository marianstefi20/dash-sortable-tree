# AUTO GENERATED FILE - DO NOT EDIT

#' @export
dteDndTreeEditor <- function(id=NULL, collapsible=NULL, indentationWidth=NULL, indicator=NULL, items=NULL, onItemsChange=NULL, onRemove=NULL, onSelect=NULL, removable=NULL, selectedId=NULL) {
    
    props <- list(id=id, collapsible=collapsible, indentationWidth=indentationWidth, indicator=indicator, items=items, onItemsChange=onItemsChange, onRemove=onRemove, onSelect=onSelect, removable=removable, selectedId=selectedId)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'DndTreeEditor',
        namespace = 'dash_sortable_tree',
        propNames = c('id', 'collapsible', 'indentationWidth', 'indicator', 'items', 'onItemsChange', 'onRemove', 'onSelect', 'removable', 'selectedId'),
        package = 'dashDndkitTree'
        )

    structure(component, class = c('dash_component', 'list'))
}

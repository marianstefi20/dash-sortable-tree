# AUTO GENERATED FILE - DO NOT EDIT

#' @export
dstDndTreeEditor <- function(id=NULL, collapsible=NULL, expandToId=NULL, indentationWidth=NULL, indicator=NULL, items=NULL, onItemsChange=NULL, onRemove=NULL, onSelect=NULL, removable=NULL, scrollToSelected=NULL, selectedId=NULL) {
    
    props <- list(id=id, collapsible=collapsible, expandToId=expandToId, indentationWidth=indentationWidth, indicator=indicator, items=items, onItemsChange=onItemsChange, onRemove=onRemove, onSelect=onSelect, removable=removable, scrollToSelected=scrollToSelected, selectedId=selectedId)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'DndTreeEditor',
        namespace = 'dash_sortable_tree',
        propNames = c('id', 'collapsible', 'expandToId', 'indentationWidth', 'indicator', 'items', 'onItemsChange', 'onRemove', 'onSelect', 'removable', 'scrollToSelected', 'selectedId'),
        package = 'dashSortableTree'
        )

    structure(component, class = c('dash_component', 'list'))
}

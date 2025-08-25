import React, { useEffect, useState, useMemo, useCallback } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";

import { SortableTree } from "../dndkit_tree/SortableTree";
import { TreeItems, TreeItem } from "../dndkit_tree/types";
import { flattenTree, removeChildrenOf } from "../dndkit_tree/utilities";
import styles from "./DndTreeEditor.module.css";

// Generic item type - only requires id and parent_id
type Item = {
  id: string;
  parent_id: string | null;
  label?: string;
  [key: string]: any; // Allow any additional properties
};

type DndTreeEditorProps = {
  id?: string;
  items: Item[];
  selectedId?: string | null;
  expandToId?: string | null;
  collapsible?: boolean;
  removable?: boolean;
  indicator?: boolean;
  indentationWidth?: number;
  onItemsChange?: (items: Item[]) => void;
  onSelect?: (id: string | null) => void;
  onRemove?: (id: string) => void;
  scrollToSelected?: boolean;
  setProps?: (p: any) => void;
};

// Extended TreeItem to preserve original data
interface TreeItemWithData extends TreeItem {
  data: any; // Original item data
  label?: string; // Add label property
}

const DndTreeEditor: React.FC<DndTreeEditorProps> = ({ 
  id, 
  items = [], 
  selectedId = null,
  expandToId = null,
  collapsible = true,
  removable = false,
  indicator = false,
  indentationWidth = 50,
  onItemsChange,
  onSelect,
  onRemove,
  scrollToSelected = false,
  setProps 
}) => {
  // Track expanded state internally
  const [expandedIds, setExpandedIds] = useState<Set<UniqueIdentifier>>(new Set());
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(selectedId);

  // Sync selectedId when it changes from parent
  useEffect(() => {
    setInternalSelectedId(selectedId);
  }, [selectedId]);

  // Helper: build parent map and compute ancestor ids for a target id
  const getAncestorIds = useCallback((targetId: string): string[] => {
    const parentById = new Map<string, string | null>();
    items.forEach((it) => parentById.set(it.id, it.parent_id));

    const ancestors: string[] = [];
    let current: string | null | undefined = parentById.get(targetId);
    const safetyLimit = items.length + 1;
    let guard = 0;
    while (current) {
      ancestors.push(current);
      current = parentById.get(current) ?? null;
      guard += 1;
      if (guard > safetyLimit) break; // cycle guard
    }
    return ancestors;
  }, [items]);

  // Effect: expand ancestors when expandToId changes
  useEffect(() => {
    if (!expandToId) return;
    // If target id doesn't exist, no-op
    if (!items.some((it) => it.id === expandToId)) return;

    const ancestors = getAncestorIds(expandToId);
    if (ancestors.length === 0) return;

    setExpandedIds((prev) => {
      const next = new Set(prev);
      ancestors.forEach((aid) => next.add(aid));
      return next;
    });
  }, [expandToId, items, getAncestorIds]);

  // Convert flat items to nested tree structure
  const nested = useMemo(() => {
    // Build a map for quick lookups
    const itemMap = new Map<string, TreeItemWithData>();
    const rootItems: TreeItemWithData[] = [];

    // First pass: create all nodes
    items.forEach(item => {
      const { id, parent_id, label, ...data } = item;
      itemMap.set(id, {
        id,
        children: [],
        collapsed: !expandedIds.has(id),
        label: label || id, // Use label if provided, otherwise fallback to id
        data: item // Store original item
      });
    });

    // Second pass: build tree structure
    items.forEach(item => {
      const treeItem = itemMap.get(item.id)!;
      
      if (item.parent_id === null) {
        rootItems.push(treeItem);
      } else {
        const parent = itemMap.get(item.parent_id);
        if (parent) {
          parent.children.push(treeItem);
        }
      }
    });

    // Sort children by their original order in the items array
    const sortChildren = (treeItems: TreeItemWithData[]) => {
      treeItems.sort((a, b) => {
        const aIndex = items.findIndex(item => item.id === a.id);
        const bIndex = items.findIndex(item => item.id === b.id);
        return aIndex - bIndex;
      });
      treeItems.forEach(item => {
        if (item.children && item.children.length > 0) {
          sortChildren(item.children as TreeItemWithData[]);
        }
      });
    };
    sortChildren(rootItems);

    return rootItems;
  }, [items, expandedIds]);

  // Helper: scroll to a specific node id using current visible ordering
  const scrollToNodeId = useCallback((targetId: string) => {
    const containerSelector = id ? `#${id}` : undefined;
    const nodeList = document.querySelectorAll(`${containerSelector ?? ''} [role="button"][aria-roledescription="sortable"]`);
    if (!nodeList || nodeList.length === 0) return;

    const flattened = flattenTree(nested);
    const collapsedIds = flattened
      .filter((n) => n.collapsed && n.children.length)
      .map((n) => n.id);
    const visibleFlatItems = removeChildrenOf(flattened, collapsedIds);

    const idx = visibleFlatItems.findIndex((n) => String(n.id) === String(targetId));
    if (idx >= 0 && nodeList[idx]) {
      const li = (nodeList[idx] as HTMLElement).closest('li');
      if (li && typeof li.scrollIntoView === 'function') {
        // Let layout settle first
        requestAnimationFrame(() => li.scrollIntoView({block: 'nearest'}));
      }
    }
  }, [id, nested]);

  // Effect: optional scroll after expansion/selection
  useEffect(() => {
    if (!scrollToSelected) return;
    const target = internalSelectedId ?? expandToId;
    if (!target) return;
    scrollToNodeId(target);
  }, [scrollToSelected, internalSelectedId, expandToId, scrollToNodeId]);

  // Handle drag and drop changes
  const handleItemsChange = useCallback((newTreeItems: TreeItems) => {
    // Convert back to our Item format, preserving original data
    const updatedItems: Item[] = [];
    
    // Helper to recursively process items
    const processItems = (treeItems: TreeItems, parentId: string | null = null) => {
      treeItems.forEach((item) => {
        // Find the original item to preserve all its data
        const originalItem = items.find(i => i.id === String(item.id));
        
        if (originalItem) {
          updatedItems.push({
            ...originalItem,
            parent_id: parentId
          });
        } else {
          // Fallback for new items
          updatedItems.push({
            id: String(item.id),
            parent_id: parentId
          });
        }

        // Process children
        if (item.children.length > 0) {
          processItems(item.children, String(item.id));
        }
      });
    };

    processItems(newTreeItems);

    // Update expanded state
    const newExpandedIds = new Set<UniqueIdentifier>();
    const collectExpandedIds = (items: TreeItems) => {
      items.forEach(item => {
        if (!item.collapsed && item.children.length > 0) {
          newExpandedIds.add(item.id);
        }
        collectExpandedIds(item.children);
      });
    };
    collectExpandedIds(newTreeItems);
    setExpandedIds(newExpandedIds);

    // Call the callback
    if (onItemsChange) {
      onItemsChange(updatedItems);
    }
    
    // Update Dash props if needed
    setProps?.({ 
      items: updatedItems,
      selectedId: internalSelectedId
    });
  }, [items, internalSelectedId, onItemsChange, setProps]);

  // Handle item removal
  const handleRemove = useCallback((id: string) => {
    if (onRemove) {
      onRemove(id);
    } else {
      // Default removal behavior
      const filteredItems = items.filter(item => {
        // Remove the item and its descendants
        const isDescendant = (itemId: string, ancestorId: string): boolean => {
          const item = items.find(i => i.id === itemId);
          if (!item || !item.parent_id) return false;
          if (item.parent_id === ancestorId) return true;
          return isDescendant(item.parent_id, ancestorId);
        };
        
        return item.id !== id && !isDescendant(item.id, id);
      });
      
      if (onItemsChange) {
        onItemsChange(filteredItems);
      }
      
      setProps?.({ 
        items: filteredItems 
      });
    }
  }, [items, onItemsChange, onRemove, setProps]);

  // Custom click handler for selection
  const handleTreeClick = useCallback((e: React.MouseEvent) => {
    // Find the clicked tree item by traversing up the DOM
    let target = e.target as HTMLElement;
    let treeItemElement: HTMLElement | null = null;
    
    // Look for the list item that contains the tree item
    while (target && target !== e.currentTarget) {
      if (target.tagName === 'LI') {
        // Check if this is a tree item by looking for the handle
        const handle = target.querySelector('[aria-roledescription="sortable"]');
        if (handle) {
          treeItemElement = target;
          break;
        }
      }
      target = target.parentElement as HTMLElement;
    }
    
    if (treeItemElement) {
      // Determine the index of the clicked element among the rendered (visible) nodes
      const allItems = document.querySelectorAll('[role="button"][aria-roledescription="sortable"]');
      let clickedId: string | null = null;

      allItems.forEach((item, index) => {
        if (treeItemElement?.contains(item as HTMLElement)) {
          // Build a flattened version that only includes visible nodes (i.e., excludes children of collapsed nodes)
          const flattened = flattenTree(nested);
          const collapsedIds = flattened
            .filter((n) => n.collapsed && n.children.length)
            .map((n) => n.id);
          const visibleFlatItems = removeChildrenOf(flattened, collapsedIds);

          if (visibleFlatItems[index]) {
            clickedId = String(visibleFlatItems[index].id);
          }
        }
      });
      
      if (clickedId) {
        const newSelectedId = clickedId === internalSelectedId ? null : clickedId;
        setInternalSelectedId(newSelectedId);
        
        if (onSelect) {
          onSelect(newSelectedId);
        }
        
        setProps?.({ 
          selectedId: newSelectedId 
        });
      }
    }
  }, [nested, internalSelectedId, onSelect, setProps]);

  // Apply selection styling
  useEffect(() => {
    // Remove all selected classes
    const allSelected = document.querySelectorAll('.selected');
    allSelected.forEach(el => el.classList.remove('selected'));
    
    // Add selected class to the current selection
    if (internalSelectedId) {
      // Find the element by looking through all list items
      const allItems = document.querySelectorAll(`#${id} [role="button"][aria-roledescription="sortable"]`);

      const flattened = flattenTree(nested);
      const collapsedIds = flattened
        .filter((n) => n.collapsed && n.children.length)
        .map((n) => n.id);
      const visibleFlatItems = removeChildrenOf(flattened, collapsedIds);
      
      allItems.forEach((item, index) => {
        if (visibleFlatItems[index] && String(visibleFlatItems[index].id) === internalSelectedId) {
          const li = item.closest('li');
          if (li) {
            li.classList.add('selected');
          }
        }
      });
    }
  }, [internalSelectedId, id, nested]);

  return (
    <div id={id} className={styles.treeContainer}>
      <div className={styles.treeWrapper} onClick={handleTreeClick}>
        <SortableTree
          items={nested}
          onItemsChange={handleItemsChange}
          collapsible={collapsible}
          removable={removable}
          indicator={indicator}
          indentationWidth={indentationWidth}
        />
      </div>
    </div>
  );
};

// Use static property for default props
(DndTreeEditor as any).defaultProps = {
  items: [],
  selectedId: null,
  expandToId: null,
  collapsible: true,
  removable: false,
  indicator: false,
  indentationWidth: 50,
  scrollToSelected: false
};

export default DndTreeEditor;

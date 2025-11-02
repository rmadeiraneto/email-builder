/**
 * Component Tree Builder
 *
 * Builds hierarchical component trees from flat component arrays
 */

import type { BaseComponent } from '../types/component.types';
import type { ComponentTreeNode } from '../types/template.types';

/**
 * Cache entry for tree building
 */
interface TreeCacheEntry {
  components: BaseComponent[];
  tree: ComponentTreeNode[];
  timestamp: number;
}

/**
 * Component Tree Builder Service
 *
 * Converts flat component arrays to hierarchical tree structures
 * and provides tree traversal and manipulation utilities.
 * Includes performance caching for repeated tree builds.
 */
export class ComponentTreeBuilder {
  private cache: Map<string, TreeCacheEntry> = new Map();
  private readonly maxCacheSize: number = 100;
  private readonly cacheExpiryMs: number = 5 * 60 * 1000; // 5 minutes

  /**
   * Build component tree from flat array of components with caching
   *
   * @param components - Flat array of components
   * @returns Array of root tree nodes
   */
  buildTree(components: BaseComponent[]): ComponentTreeNode[] {
    if (!components || components.length === 0) {
      return [];
    }

    // Generate cache key from components
    const cacheKey = this.generateCacheKey(components);

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached)) {
      return this.deepCloneTree(cached.tree);
    }

    // Build tree if not cached or cache expired
    const tree = this.buildTreeInternal(components);

    // Store in cache
    this.addToCache(cacheKey, components, tree);

    return tree;
  }

  /**
   * Internal method to build the tree
   */
  private buildTreeInternal(components: BaseComponent[]): ComponentTreeNode[] {

    // Create a map for quick lookup
    const componentMap = new Map<string, BaseComponent>();
    components.forEach(comp => {
      componentMap.set(comp.id, comp);
    });

    // Track nodes we've already processed
    const nodeMap = new Map<string, ComponentTreeNode>();

    // Helper to create tree node
    const createNode = (
      component: BaseComponent,
      depth: number,
      order: number
    ): ComponentTreeNode => {
      return {
        component,
        children: [],
        parentId: component.parentId || null,
        depth,
        order,
      };
    };

    // First pass: create all nodes
    components.forEach((component, index) => {
      if (!nodeMap.has(component.id)) {
        const node = createNode(component, 0, index);
        nodeMap.set(component.id, node);
      }
    });

    // Second pass: build parent-child relationships
    const rootNodes: ComponentTreeNode[] = [];

    nodeMap.forEach((node) => {
      if (node.parentId) {
        // This is a child node
        const parentNode = nodeMap.get(node.parentId);
        if (parentNode) {
          // Update depth based on parent
          node.depth = parentNode.depth + 1;
          // Add to parent's children
          parentNode.children.push(node);
        } else {
          // Parent not found, treat as root
          console.warn(
            `Component ${node.component.id} references non-existent parent ${node.parentId}`
          );
          node.parentId = null;
          rootNodes.push(node);
        }
      } else {
        // This is a root node
        rootNodes.push(node);
      }
    });

    // Sort children by order
    const sortChildren = (node: ComponentTreeNode) => {
      if (node.children.length > 0) {
        node.children.sort((a, b) => a.order - b.order);
        node.children.forEach(sortChildren);
      }
    };

    rootNodes.forEach(sortChildren);
    rootNodes.sort((a, b) => a.order - b.order);

    return rootNodes;
  }

  /**
   * Flatten tree back to component array
   *
   * @param tree - Component tree
   * @returns Flat array of components
   */
  flattenTree(tree: ComponentTreeNode[]): BaseComponent[] {
    const components: BaseComponent[] = [];

    const traverse = (node: ComponentTreeNode) => {
      components.push(node.component);
      node.children.forEach(traverse);
    };

    tree.forEach(traverse);
    return components;
  }

  /**
   * Find node by component ID
   *
   * @param tree - Component tree
   * @param componentId - Component ID to find
   * @returns Tree node or undefined
   */
  findNode(
    tree: ComponentTreeNode[],
    componentId: string
  ): ComponentTreeNode | undefined {
    for (const node of tree) {
      if (node.component.id === componentId) {
        return node;
      }

      if (node.children.length > 0) {
        const found = this.findNode(node.children, componentId);
        if (found) {
          return found;
        }
      }
    }

    return undefined;
  }

  /**
   * Get all ancestors of a node
   *
   * @param tree - Component tree
   * @param componentId - Component ID
   * @returns Array of ancestor components (from root to parent)
   */
  getAncestors(
    tree: ComponentTreeNode[],
    componentId: string
  ): BaseComponent[] {
    const ancestors: BaseComponent[] = [];

    const findWithPath = (
      nodes: ComponentTreeNode[],
      path: BaseComponent[]
    ): boolean => {
      for (const node of nodes) {
        if (node.component.id === componentId) {
          ancestors.push(...path);
          return true;
        }

        if (node.children.length > 0) {
          const found = findWithPath(node.children, [
            ...path,
            node.component,
          ]);
          if (found) {
            return true;
          }
        }
      }
      return false;
    };

    findWithPath(tree, []);
    return ancestors;
  }

  /**
   * Get all descendants of a node
   *
   * @param tree - Component tree
   * @param componentId - Component ID
   * @returns Array of descendant components
   */
  getDescendants(
    tree: ComponentTreeNode[],
    componentId: string
  ): BaseComponent[] {
    const node = this.findNode(tree, componentId);
    if (!node) {
      return [];
    }

    const descendants: BaseComponent[] = [];

    const traverse = (treeNode: ComponentTreeNode) => {
      treeNode.children.forEach((child) => {
        descendants.push(child.component);
        traverse(child);
      });
    };

    traverse(node);
    return descendants;
  }

  /**
   * Get siblings of a node
   *
   * @param tree - Component tree
   * @param componentId - Component ID
   * @returns Array of sibling components
   */
  getSiblings(
    tree: ComponentTreeNode[],
    componentId: string
  ): BaseComponent[] {
    const node = this.findNode(tree, componentId);
    if (!node) {
      return [];
    }

    // Find parent
    if (!node.parentId) {
      // Root node - siblings are other root nodes
      return tree
        .filter((n) => n.component.id !== componentId)
        .map((n) => n.component);
    }

    const parent = this.findNode(tree, node.parentId);
    if (!parent) {
      return [];
    }

    return parent.children
      .filter((child) => child.component.id !== componentId)
      .map((child) => child.component);
  }

  /**
   * Validate tree structure
   *
   * @param tree - Component tree
   * @returns Validation result with errors
   */
  validateTree(tree: ComponentTreeNode[]): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const visited = new Set<string>();

    const validateNode = (node: ComponentTreeNode, path: string[]) => {
      // Check for duplicate IDs
      if (visited.has(node.component.id)) {
        errors.push(`Duplicate component ID: ${node.component.id}`);
      }
      visited.add(node.component.id);

      // Check for circular references
      if (path.includes(node.component.id)) {
        errors.push(
          `Circular reference detected: ${path.join(' -> ')} -> ${node.component.id}`
        );
        return;
      }

      // Validate children
      node.children.forEach((child) => {
        // Check parent ID matches
        if (child.parentId !== node.component.id) {
          errors.push(
            `Child ${child.component.id} has incorrect parentId: ${child.parentId} (should be ${node.component.id})`
          );
        }

        // Check depth is correct
        if (child.depth !== node.depth + 1) {
          errors.push(
            `Child ${child.component.id} has incorrect depth: ${child.depth} (should be ${node.depth + 1})`
          );
        }

        validateNode(child, [...path, node.component.id]);
      });
    };

    tree.forEach((node) => {
      validateNode(node, []);
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Rebuild tree with updated components
   *
   * Useful when components have been modified but tree structure should be preserved
   *
   * @param tree - Existing tree
   * @param components - Updated components
   * @returns New tree with updated components
   */
  rebuildTree(
    tree: ComponentTreeNode[],
    components: BaseComponent[]
  ): ComponentTreeNode[] {
    // Flatten to get structure info
    const flatComponents = this.flattenTree(tree);

    // Create map of updated components
    const componentMap = new Map<string, BaseComponent>();
    components.forEach((comp) => {
      componentMap.set(comp.id, comp);
    });

    // Rebuild with updated components
    const updatedComponents = flatComponents.map((comp) => {
      return componentMap.get(comp.id) || comp;
    });

    return this.buildTree(updatedComponents);
  }

  /**
   * Generate cache key from components array
   */
  private generateCacheKey(components: BaseComponent[]): string {
    // Create a stable key based on component IDs and structure
    const ids = components.map(c => c.id).sort().join(',');
    return `tree_${ids}`;
  }

  /**
   * Check if cache entry is still valid
   */
  private isCacheValid(entry: TreeCacheEntry): boolean {
    const now = Date.now();
    return now - entry.timestamp < this.cacheExpiryMs;
  }

  /**
   * Add entry to cache with size management
   */
  private addToCache(key: string, components: BaseComponent[], tree: ComponentTreeNode[]): void {
    // Limit cache size
    if (this.cache.size >= this.maxCacheSize) {
      // Remove oldest entry
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      components: components.slice(),
      tree: this.deepCloneTree(tree),
      timestamp: Date.now(),
    });
  }

  /**
   * Deep clone tree to prevent mutations
   */
  private deepCloneTree(tree: ComponentTreeNode[]): ComponentTreeNode[] {
    return tree.map(node => this.cloneNode(node));
  }

  /**
   * Clone a single tree node
   */
  private cloneNode(node: ComponentTreeNode): ComponentTreeNode {
    return {
      component: { ...node.component },
      children: node.children.map(child => this.cloneNode(child)),
      parentId: node.parentId,
      depth: node.depth,
      order: node.order,
    };
  }

  /**
   * Clear the cache (useful for testing or memory management)
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics (useful for debugging/monitoring)
   */
  public getCacheStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
    };
  }
}

/**
 * ListEditor component tests
 *
 * Tests for ListEditor component to ensure proper functionality:
 * - Add/remove items
 * - Drag and drop reordering
 * - Min/max item constraints
 * - Custom render functions
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../../test-utils';
import { ListEditor } from './ListEditor';

// Polyfill for DragEvent (not available in jsdom)
if (typeof DragEvent === 'undefined') {
  (global as any).DragEvent = class DragEvent extends Event {
    dataTransfer: DataTransfer | null;
    constructor(type: string, init?: EventInit) {
      super(type, init);
      this.dataTransfer = {
        effectAllowed: '',
        dropEffect: 'none' as any,
        setData: vi.fn(),
        getData: vi.fn(),
        clearData: vi.fn(),
        items: [] as any,
        types: [],
        files: [] as any,
      } as any;
    }
  };
}

describe('ListEditor', () => {
  describe('rendering', () => {
    it('should render with default props', () => {
      const { container } = render(() => <ListEditor />);

      const editor = container.querySelector('[class*="list-editor"]');
      expect(editor).toBeInTheDocument();
    });

    it('should render with empty items', () => {
      const { container } = render(() => <ListEditor items={[]} />);

      // Should show empty state
      const emptyState = container.querySelector('[class*="list-editor__empty"]');
      expect(emptyState).toBeInTheDocument();
    });

    it('should render with items', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];
      const { container } = render(() => <ListEditor items={items} />);

      const listItems = container.querySelectorAll('[class*="list-editor__item"]:not([class*="list-editor__item-"])');
      expect(listItems.length).toBe(3);
    });

    it('should render with label', () => {
      const { container } = render(() => (
        <ListEditor label="My List" items={[]} />
      ));

      const label = container.querySelector('[class*="list-editor__label"]');
      expect(label).toBeInTheDocument();
      expect(label?.textContent).toBe('My List');
    });

    it('should render without label', () => {
      const { container } = render(() => <ListEditor items={[]} />);

      const label = container.querySelector('[class*="list-editor__label"]');
      expect(label).not.toBeInTheDocument();
    });

    it('should render with custom class', () => {
      const { container } = render(() => (
        <ListEditor class="custom-list" items={[]} />
      ));

      const editor = container.querySelector('.custom-list');
      expect(editor).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should show empty message when no items', () => {
      const { container } = render(() => <ListEditor items={[]} />);

      const emptyState = container.querySelector('[class*="list-editor__empty"]');
      expect(emptyState).toBeInTheDocument();
      expect(emptyState?.textContent).toContain('No items yet');
    });

    it('should show empty icon', () => {
      const { container } = render(() => <ListEditor items={[]} />);

      const icon = container.querySelector('i.ri-inbox-line');
      expect(icon).toBeInTheDocument();
    });

    it('should not show empty state when items exist', () => {
      const { container } = render(() => (
        <ListEditor items={['Item 1']} />
      ));

      const emptyState = container.querySelector('[class*="list-editor__empty"]');
      expect(emptyState).not.toBeInTheDocument();
    });
  });

  describe('add button', () => {
    it('should render add button by default', () => {
      const { container } = render(() => <ListEditor items={[]} />);

      const addButton = container.querySelector('[class*="list-editor__add-button"]');
      expect(addButton).toBeInTheDocument();
      expect(addButton?.textContent).toContain('Add Item');
    });

    it('should use custom add button label', () => {
      const { container } = render(() => (
        <ListEditor items={[]} addButtonLabel="Add New" />
      ));

      const addButton = container.querySelector('[class*="list-editor__add-button"]');
      expect(addButton?.textContent).toContain('Add New');
    });

    it('should add item when clicked', async () => {
      const handleChange = vi.fn();
      const createNewItem = () => 'New Item';

      const { container } = render(() => (
        <ListEditor
          items={[]}
          onChange={handleChange}
          createNewItem={createNewItem}
        />
      ));

      const addButton = container.querySelector('[class*="list-editor__add-button"]') as HTMLElement;
      addButton.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(['New Item']);
      });
    });

    it('should call onAdd callback', async () => {
      const handleAdd = vi.fn();
      const createNewItem = () => 'New Item';

      const { container } = render(() => (
        <ListEditor
          items={[]}
          onAdd={handleAdd}
          createNewItem={createNewItem}
        />
      ));

      const addButton = container.querySelector('[class*="list-editor__add-button"]') as HTMLElement;
      addButton.click();

      await waitFor(() => {
        expect(handleAdd).toHaveBeenCalledWith('New Item', 0);
      });
    });

    it('should not show add button when allowAdd is false', () => {
      const { container } = render(() => (
        <ListEditor items={[]} allowAdd={false} />
      ));

      const addButton = container.querySelector('[class*="list-editor__add-button"]');
      expect(addButton).not.toBeInTheDocument();
    });

    it('should not show add button when at maxItems', () => {
      const { container } = render(() => (
        <ListEditor items={['Item 1', 'Item 2']} maxItems={2} />
      ));

      const addButton = container.querySelector('[class*="list-editor__add-button"]');
      expect(addButton).not.toBeInTheDocument();
    });

    it('should not add item when disabled', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ListEditor items={[]} onChange={handleChange} disabled />
      ));

      const addButton = container.querySelector('[class*="list-editor__add-button"]');
      expect(addButton).not.toBeInTheDocument();
    });

    it('should add null when no createNewItem provided', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ListEditor items={[]} onChange={handleChange} />
      ));

      const addButton = container.querySelector('[class*="list-editor__add-button"]') as HTMLElement;
      addButton.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith([null]);
      });
    });
  });

  describe('remove button', () => {
    it('should render remove buttons for each item', () => {
      const items = ['Item 1', 'Item 2'];
      const { container } = render(() => <ListEditor items={items} />);

      const removeButtons = container.querySelectorAll('[class*="list-editor__remove-button"]');
      expect(removeButtons.length).toBe(2);
    });

    it('should remove item when clicked', async () => {
      const handleChange = vi.fn();
      const items = ['Item 1', 'Item 2', 'Item 3'];

      const { container } = render(() => (
        <ListEditor items={items} onChange={handleChange} />
      ));

      const removeButtons = container.querySelectorAll('[class*="list-editor__remove-button"]');
      (removeButtons[1] as HTMLElement).click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(['Item 1', 'Item 3']);
      });
    });

    it('should call onRemove callback', async () => {
      const handleRemove = vi.fn();
      const items = ['Item 1', 'Item 2'];

      const { container } = render(() => (
        <ListEditor items={items} onRemove={handleRemove} />
      ));

      const removeButtons = container.querySelectorAll('[class*="list-editor__remove-button"]');
      (removeButtons[0] as HTMLElement).click();

      await waitFor(() => {
        expect(handleRemove).toHaveBeenCalledWith('Item 1', 0);
      });
    });

    it('should not show remove buttons when allowRemove is false', () => {
      const items = ['Item 1', 'Item 2'];
      const { container } = render(() => (
        <ListEditor items={items} allowRemove={false} />
      ));

      const removeButtons = container.querySelectorAll('[class*="list-editor__remove-button"]');
      expect(removeButtons.length).toBe(0);
    });

    it('should not show remove buttons when at minItems', () => {
      const items = ['Item 1'];
      const { container } = render(() => (
        <ListEditor items={items} minItems={1} />
      ));

      const removeButtons = container.querySelectorAll('[class*="list-editor__remove-button"]');
      expect(removeButtons.length).toBe(0);
    });

    it('should disable remove buttons when disabled', () => {
      const items = ['Item 1', 'Item 2'];
      const { container } = render(() => (
        <ListEditor items={items} disabled />
      ));

      const removeButtons = container.querySelectorAll('[class*="list-editor__remove-button"]');
      removeButtons.forEach((button) => {
        expect(button).toHaveAttribute('disabled');
      });
    });
  });

  describe('drag handles', () => {
    it('should show drag handles by default', () => {
      const items = ['Item 1', 'Item 2'];
      const { container } = render(() => <ListEditor items={items} />);

      const dragHandles = container.querySelectorAll('[class*="list-editor__drag-handle"]');
      expect(dragHandles.length).toBe(2);
    });

    it('should hide drag handles when showDragHandles is false', () => {
      const items = ['Item 1', 'Item 2'];
      const { container } = render(() => (
        <ListEditor items={items} showDragHandles={false} />
      ));

      const dragHandles = container.querySelectorAll('[class*="list-editor__drag-handle"]');
      expect(dragHandles.length).toBe(0);
    });

    it('should hide drag handles when allowReorder is false', () => {
      const items = ['Item 1', 'Item 2'];
      const { container } = render(() => (
        <ListEditor items={items} allowReorder={false} />
      ));

      const dragHandles = container.querySelectorAll('[class*="list-editor__drag-handle"]');
      expect(dragHandles.length).toBe(0);
    });

    it('should have title attribute on drag handle', () => {
      const items = ['Item 1'];
      const { container } = render(() => <ListEditor items={items} />);

      const dragHandle = container.querySelector('[class*="list-editor__drag-handle"]');
      expect(dragHandle).toHaveAttribute('title', 'Drag to reorder');
    });
  });

  describe('drag and drop reordering', () => {
    it('should make items draggable when allowReorder is true', () => {
      const items = ['Item 1', 'Item 2'];
      const { container } = render(() => <ListEditor items={items} />);

      const listItems = container.querySelectorAll('[class*="list-editor__item"]:not([class*="list-editor__item-"])');
      listItems.forEach((item) => {
        expect(item).toHaveAttribute('draggable', 'true');
      });
    });

    it('should not make items draggable when allowReorder is false', () => {
      const items = ['Item 1', 'Item 2'];
      const { container } = render(() => (
        <ListEditor items={items} allowReorder={false} />
      ));

      const listItems = container.querySelectorAll('[class*="list-editor__item"]:not([class*="list-editor__item-"])');
      listItems.forEach((item) => {
        expect(item).toHaveAttribute('draggable', 'false');
      });
    });

    it('should not make items draggable when disabled', () => {
      const items = ['Item 1', 'Item 2'];
      const { container } = render(() => (
        <ListEditor items={items} disabled />
      ));

      const listItems = container.querySelectorAll('[class*="list-editor__item"]:not([class*="list-editor__item-"])');
      listItems.forEach((item) => {
        // When disabled, SolidJS removes the draggable attribute or sets it to false
        const draggable = item.getAttribute('draggable');
        expect(draggable === 'false' || draggable === null).toBe(true);
      });
    });

    it('should reorder items on drop', async () => {
      const handleChange = vi.fn();
      const items = ['Item 1', 'Item 2', 'Item 3'];

      const { container } = render(() => (
        <ListEditor items={items} onChange={handleChange} />
      ));

      const listItems = container.querySelectorAll('[class*="list-editor__item"]:not([class*="list-editor__item-"])');

      // Drag item 0 to position 2
      fireEvent.dragStart(listItems[0], new DragEvent('dragstart'));
      fireEvent.dragOver(listItems[2], new DragEvent('dragover'));
      fireEvent.drop(listItems[2], new DragEvent('drop'));

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(['Item 2', 'Item 3', 'Item 1']);
      });
    });

    it('should call onReorder callback', async () => {
      const handleReorder = vi.fn();
      const items = ['Item 1', 'Item 2', 'Item 3'];

      const { container } = render(() => (
        <ListEditor items={items} onReorder={handleReorder} />
      ));

      const listItems = container.querySelectorAll('[class*="list-editor__item"]:not([class*="list-editor__item-"])');

      fireEvent.dragStart(listItems[0], new DragEvent('dragstart'));
      fireEvent.dragOver(listItems[2], new DragEvent('dragover'));
      fireEvent.drop(listItems[2], new DragEvent('drop'));

      await waitFor(() => {
        expect(handleReorder).toHaveBeenCalledWith(['Item 2', 'Item 3', 'Item 1'], 0, 2);
      });
    });

    it('should not reorder when disabled', async () => {
      const handleChange = vi.fn();
      const items = ['Item 1', 'Item 2'];

      const { container } = render(() => (
        <ListEditor items={items} onChange={handleChange} disabled />
      ));

      // Get all divs with list-editor__item class, then filter to find the actual items
      const allDivs = Array.from(container.querySelectorAll('div[class*="list-editor__item"]'));
      const listItems = allDivs.filter(div =>
        div.className.includes('list-editor__item') &&
        !div.className.includes('list-editor__item-') &&
        !div.className.includes('list-editor__items')
      );

      if (listItems.length >= 2) {
        fireEvent.dragStart(listItems[0], new DragEvent('dragstart'));
        fireEvent.drop(listItems[1], new DragEvent('drop'));
      }

      // Wait a bit to ensure it doesn't fire
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('custom render function', () => {
    it('should use default render for string items', () => {
      const items = ['Item 1', 'Item 2'];
      const { container } = render(() => <ListEditor items={items} />);

      const itemContent = container.querySelector('[class*="list-editor__item-content"]');
      expect(itemContent).toBeInTheDocument();
      expect(itemContent?.textContent).toBe('Item 1');
    });

    it('should use default render for object items', () => {
      const items = [{ id: 1, name: 'Test' }];
      const { container } = render(() => <ListEditor items={items} />);

      const itemContent = container.querySelector('[class*="list-editor__item-content"]');
      expect(itemContent).toBeInTheDocument();
      expect(itemContent?.textContent).toContain('id');
    });

    it('should use custom renderItem function', () => {
      const items = ['Item 1', 'Item 2'];
      const renderItem = (item: string, index: number) => (
        <div class="custom-item">
          {index + 1}. {item}
        </div>
      );

      const { container } = render(() => (
        <ListEditor items={items} renderItem={renderItem} />
      ));

      const customItem = container.querySelector('.custom-item');
      expect(customItem).toBeInTheDocument();
      expect(customItem?.textContent).toBe('1. Item 1');
    });

    it('should pass correct index to renderItem', () => {
      const items = ['A', 'B', 'C'];
      const renderItem = (item: string, index: number) => (
        <div data-index={index}>{item}</div>
      );

      const { container } = render(() => (
        <ListEditor items={items} renderItem={renderItem} />
      ));

      const renderedItems = container.querySelectorAll('[data-index]');
      expect(renderedItems[0]).toHaveAttribute('data-index', '0');
      expect(renderedItems[1]).toHaveAttribute('data-index', '1');
      expect(renderedItems[2]).toHaveAttribute('data-index', '2');
    });
  });

  describe('constraints', () => {
    it('should respect minItems when removing', async () => {
      const handleChange = vi.fn();
      const items = ['Item 1', 'Item 2'];

      const { container } = render(() => (
        <ListEditor items={items} onChange={handleChange} minItems={2} />
      ));

      // Should not show remove buttons when at minimum
      const removeButtons = container.querySelectorAll('[class*="list-editor__remove-button"]');
      expect(removeButtons.length).toBe(0);
    });

    it('should respect maxItems when adding', () => {
      const items = ['Item 1', 'Item 2'];

      const { container } = render(() => (
        <ListEditor items={items} maxItems={2} />
      ));

      // Should not show add button when at maximum
      const addButton = container.querySelector('[class*="list-editor__add-button"]');
      expect(addButton).not.toBeInTheDocument();
    });

    it('should allow adding when below maxItems', () => {
      const items = ['Item 1'];

      const { container } = render(() => (
        <ListEditor items={items} maxItems={3} />
      ));

      const addButton = container.querySelector('[class*="list-editor__add-button"]');
      expect(addButton).toBeInTheDocument();
    });

    it('should allow removing when above minItems', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];

      const { container } = render(() => (
        <ListEditor items={items} minItems={1} />
      ));

      const removeButtons = container.querySelectorAll('[class*="list-editor__remove-button"]');
      expect(removeButtons.length).toBe(3);
    });

    it('should handle minItems of 0', () => {
      const items = ['Item 1'];

      const { container } = render(() => (
        <ListEditor items={items} minItems={0} />
      ));

      const removeButtons = container.querySelectorAll('[class*="list-editor__remove-button"]');
      expect(removeButtons.length).toBe(1);
    });
  });

  describe('disabled state', () => {
    it('should add disabled class to items', () => {
      const items = ['Item 1'];

      const { container } = render(() => (
        <ListEditor items={items} disabled />
      ));

      // Get all divs with list-editor__item class, then filter to find the actual item (not wrapper/content)
      const allDivs = Array.from(container.querySelectorAll('div[class*="list-editor__item"]'));
      const item = allDivs.find(div =>
        div.className.includes('list-editor__item') &&
        !div.className.includes('list-editor__item-') &&
        !div.className.includes('list-editor__items')
      );
      expect(item?.className).toMatch(/disabled/);
    });

    it('should not show add button when disabled', () => {
      const { container } = render(() => (
        <ListEditor items={[]} disabled />
      ));

      const addButton = container.querySelector('[class*="list-editor__add-button"]');
      expect(addButton).not.toBeInTheDocument();
    });

    it('should disable remove buttons', () => {
      const items = ['Item 1', 'Item 2'];

      const { container } = render(() => (
        <ListEditor items={items} disabled />
      ));

      const removeButtons = container.querySelectorAll('[class*="list-editor__remove-button"]');
      removeButtons.forEach((button) => {
        expect(button).toHaveAttribute('disabled');
      });
    });

    it('should make items non-draggable when disabled', () => {
      const items = ['Item 1', 'Item 2'];

      const { container } = render(() => (
        <ListEditor items={items} disabled />
      ));

      // Get all divs with list-editor__item class, then filter to find the actual items
      const allDivs = Array.from(container.querySelectorAll('div[class*="list-editor__item"]'));
      const listItems = allDivs.filter(div =>
        div.className.includes('list-editor__item') &&
        !div.className.includes('list-editor__item-') &&
        !div.className.includes('list-editor__items')
      );

      expect(listItems.length).toBe(2);
      listItems.forEach((item) => {
        // When disabled, SolidJS removes the draggable attribute or sets it to false
        const draggable = item.getAttribute('draggable');
        expect(draggable === 'false' || draggable === null).toBe(true);
      });
    });
  });

  describe('onChange callback', () => {
    it('should call onChange when adding item', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ListEditor items={[]} onChange={handleChange} createNewItem={() => 'New'} />
      ));

      const addButton = container.querySelector('[class*="list-editor__add-button"]') as HTMLElement;
      addButton.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(['New']);
        expect(handleChange).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onChange when removing item', async () => {
      const handleChange = vi.fn();
      const items = ['Item 1', 'Item 2'];

      const { container } = render(() => (
        <ListEditor items={items} onChange={handleChange} />
      ));

      const removeButton = container.querySelector('[class*="list-editor__remove-button"]') as HTMLElement;
      removeButton.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(['Item 2']);
      });
    });

    it('should work without onChange callback', () => {
      const { container } = render(() => (
        <ListEditor items={[]} createNewItem={() => 'New'} />
      ));

      const addButton = container.querySelector('[class*="list-editor__add-button"]') as HTMLElement;

      // Should not throw
      expect(() => addButton.click()).not.toThrow();
    });
  });

  describe('accessibility', () => {
    it('should have title on remove buttons', () => {
      const items = ['Item 1'];
      const { container } = render(() => <ListEditor items={items} />);

      const removeButton = container.querySelector('[class*="list-editor__remove-button"]');
      expect(removeButton).toHaveAttribute('title', 'Remove item');
    });

    it('should have title on drag handles', () => {
      const items = ['Item 1'];
      const { container } = render(() => <ListEditor items={items} />);

      const dragHandle = container.querySelector('[class*="list-editor__drag-handle"]');
      expect(dragHandle).toHaveAttribute('title', 'Drag to reorder');
    });

    it('should render buttons as type="button"', () => {
      const items = ['Item 1'];
      const { container } = render(() => <ListEditor items={items} />);

      const removeButton = container.querySelector('[class*="list-editor__remove-button"]');
      const addButton = container.querySelector('[class*="list-editor__add-button"]');

      expect(removeButton).toHaveAttribute('type', 'button');
      expect(addButton).toHaveAttribute('type', 'button');
    });
  });

  describe('complex scenarios', () => {
    it('should handle all props together', async () => {
      const handleChange = vi.fn();
      const handleAdd = vi.fn();
      const handleRemove = vi.fn();
      const handleReorder = vi.fn();

      const items = ['Item 1', 'Item 2'];
      const createNewItem = () => 'New Item';
      const renderItem = (item: string) => <div class="custom">{item}</div>;

      const { container } = render(() => (
        <ListEditor
          items={items}
          label="Test List"
          addButtonLabel="Add"
          showDragHandles={true}
          allowAdd={true}
          allowRemove={true}
          allowReorder={true}
          minItems={1}
          maxItems={5}
          disabled={false}
          class="custom-list"
          renderItem={renderItem}
          createNewItem={createNewItem}
          onChange={handleChange}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onReorder={handleReorder}
        />
      ));

      // Verify all features are present
      expect(container.querySelector('.custom-list')).toBeInTheDocument();
      expect(container.querySelector('[class*="list-editor__label"]')?.textContent).toBe('Test List');
      expect(container.querySelectorAll('.custom').length).toBe(2);

      const addButton = container.querySelector('[class*="list-editor__add-button"]') as HTMLElement;
      addButton.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(['Item 1', 'Item 2', 'New Item']);
        expect(handleAdd).toHaveBeenCalledWith('New Item', 2);
      });
    });

    it('should handle adding multiple items', async () => {
      const handleChange = vi.fn();
      let counter = 0;
      const createNewItem = () => `Item ${++counter}`;

      const { container } = render(() => (
        <ListEditor items={[]} onChange={handleChange} createNewItem={createNewItem} />
      ));

      const addButton = container.querySelector('[class*="list-editor__add-button"]') as HTMLElement;

      // Add multiple items
      addButton.click();
      addButton.click();
      addButton.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledTimes(3);
      });
    });

    it('should handle removing all items', async () => {
      const handleChange = vi.fn();
      const items = ['Item 1', 'Item 2'];

      const { container, unmount } = render(() => (
        <ListEditor items={items} onChange={handleChange} />
      ));

      // Remove first item
      let removeButton = container.querySelector('[class*="list-editor__remove-button"]') as HTMLElement;
      removeButton.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(['Item 2']);
      });

      unmount();

      // Re-render with one item
      const { container: container2, unmount: unmount2 } = render(() => (
        <ListEditor items={['Item 2']} onChange={handleChange} />
      ));

      // Remove last item
      removeButton = container2.querySelector('[class*="list-editor__remove-button"]') as HTMLElement;
      removeButton.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith([]);
      });

      unmount2();
    });
  });

  describe('edge cases', () => {
    it('should handle undefined items', () => {
      const { container } = render(() => (
        <ListEditor items={undefined} />
      ));

      const emptyState = container.querySelector('[class*="list-editor__empty"]');
      expect(emptyState).toBeInTheDocument();
    });

    it('should handle null items in array', () => {
      const items = [null, null];
      const { container } = render(() => <ListEditor items={items} />);

      const listItems = container.querySelectorAll('[class*="list-editor__item"]:not([class*="list-editor__item-"])');
      expect(listItems.length).toBe(2);
    });

    it('should handle object items with default render', () => {
      const items = [{ id: 1, value: 'Test' }];
      const { container } = render(() => <ListEditor items={items} />);

      const itemContent = container.querySelector('[class*="list-editor__item-content"]');
      expect(itemContent?.textContent).toContain('id');
      expect(itemContent?.textContent).toContain('value');
    });

    it('should handle drag to same position', async () => {
      const handleChange = vi.fn();
      const items = ['Item 1', 'Item 2'];

      const { container } = render(() => (
        <ListEditor items={items} onChange={handleChange} />
      ));

      const listItems = container.querySelectorAll('[class*="list-editor__item"]:not([class*="list-editor__item-"])');

      // Drag item to same position
      fireEvent.dragStart(listItems[0], new DragEvent('dragstart'));
      fireEvent.drop(listItems[0], new DragEvent('drop'));

      // Should not call onChange
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should handle maxItems of Infinity', () => {
      const items = Array(100).fill('Item');

      const { container } = render(() => (
        <ListEditor items={items} maxItems={Infinity} />
      ));

      const addButton = container.querySelector('[class*="list-editor__add-button"]');
      expect(addButton).toBeInTheDocument();
    });

    it('should handle empty string items', () => {
      const items = ['', '', ''];
      const { container } = render(() => <ListEditor items={items} />);

      const listItems = container.querySelectorAll('[class*="list-editor__item"]:not([class*="list-editor__item-"])');
      expect(listItems.length).toBe(3);
    });
  });
});

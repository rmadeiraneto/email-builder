/**
 * Component Showcase page
 * Displays all SolidJS components for testing and demonstration
 */

import { type Component, createSignal } from 'solid-js';
import {
  Button,
  Input,
  Label,
  Icon,
} from '@email-builder/ui-solid/atoms';
import {
  Modal,
  Dropdown,
  Tabs,
  Tooltip,
  Accordion,
  Alert,
  ToggleButton,
  Section,
  SectionItem,
  ExpandCollapse,
  type DropdownItem,
  type TabItem,
} from '@email-builder/ui-solid/molecules';
import styles from './ComponentShowcase.module.scss';

const ComponentShowcase: Component = () => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = createSignal(false);

  // Dropdown state
  const dropdownItems: DropdownItem[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3 (disabled)', value: '3', disabled: true },
    { label: 'Option 4', value: '4' },
  ];
  const [selectedDropdownItem, setSelectedDropdownItem] = createSignal<DropdownItem | null>(null);

  // Tabs state
  const tabItems: TabItem[] = [
    { label: 'Tab 1', content: <div class={styles.tabContent}>Content for Tab 1</div> },
    { label: 'Tab 2', content: <div class={styles.tabContent}>Content for Tab 2</div> },
    { label: 'Tab 3 (disabled)', content: <div class={styles.tabContent}>Content for Tab 3</div>, disabled: true },
    { label: 'Tab 4', content: <div class={styles.tabContent}>Content for Tab 4</div> },
  ];
  const [activeTabIndex, setActiveTabIndex] = createSignal(0);

  // Alert state
  const [showAlert, setShowAlert] = createSignal(true);

  // Input state
  const [inputValue, setInputValue] = createSignal('');

  // ToggleButton state
  const [isToggleActive, setIsToggleActive] = createSignal(false);

  // ExpandCollapse state
  const [isExpandCollapseOpen, setIsExpandCollapseOpen] = createSignal(false);

  return (
    <div class={styles.showcase}>
      <h1>SolidJS Component Showcase</h1>

      {/* Atoms Section */}
      <section class={styles.section}>
        <h2>Atoms</h2>

        <div class={styles.component}>
          <h3>Button</h3>
          <div class={styles.demo}>
            <Button variant="primary" size="medium">
              Primary Button
            </Button>
            <Button variant="secondary" size="medium">
              Secondary Button
            </Button>
            <Button variant="ghost" size="medium">
              Ghost Button
            </Button>
            <Button variant="primary" size="small">
              Small
            </Button>
            <Button variant="primary" size="large">
              Large
            </Button>
            <Button variant="primary" icon="star-fill" iconPosition="left">
              With Icon
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </div>

        <div class={styles.component}>
          <h3>Input</h3>
          <div class={styles.demo}>
            <div class={styles.inputGroup}>
              <Label htmlFor="input-default">Default Input</Label>
              <Input
                id="input-default"
                type="text"
                placeholder="Enter text..."
                value={inputValue()}
                onInput={(e) => setInputValue(e.currentTarget.value)}
              />
            </div>
            <div class={styles.inputGroup}>
              <Label htmlFor="input-error">Error State</Label>
              <Input
                id="input-error"
                type="text"
                placeholder="Error state..."
                validationState="error"
              />
            </div>
            <div class={styles.inputGroup}>
              <Label htmlFor="input-success">Success State</Label>
              <Input
                id="input-success"
                type="text"
                placeholder="Success state..."
                validationState="success"
              />
            </div>
          </div>
        </div>

        <div class={styles.component}>
          <h3>Icon</h3>
          <div class={styles.demo}>
            <Icon name="star-fill" size="small" />
            <Icon name="heart-fill" size="medium" color="#ef4444" />
            <Icon name="settings-3-line" size="large" color="#3b82f6" />
            <Icon
              name="delete-bin-line"
              size="medium"
              onClick={() => console.log('Icon clicked')}
              ariaLabel="Delete"
            />
          </div>
        </div>
      </section>

      {/* Molecules Section */}
      <section class={styles.section}>
        <h2>Molecules</h2>

        <div class={styles.component}>
          <h3>Modal</h3>
          <div class={styles.demo}>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Open Modal
            </Button>
            <Modal isOpen={isModalOpen()} onClose={() => setIsModalOpen(false)}>
              <div class={styles.modalContent}>
                <h2>Modal Title</h2>
                <p>This is a modal dialog with some content.</p>
                <div class={styles.modalActions}>
                  <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                    Confirm
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        </div>

        <div class={styles.component}>
          <h3>Dropdown</h3>
          <div class={styles.demo}>
            <Dropdown
              items={dropdownItems}
              selectedItem={selectedDropdownItem()}
              onChange={(item) => setSelectedDropdownItem(item)}
              placeholder="Select an option"
              size="md"
            />
            <p>Selected: {selectedDropdownItem()?.label || 'None'}</p>
          </div>
        </div>

        <div class={styles.component}>
          <h3>Tabs</h3>
          <div class={styles.demo}>
            <Tabs
              items={tabItems}
              activeIndex={activeTabIndex()}
              onTabChange={(index) => setActiveTabIndex(index)}
            />
          </div>
        </div>

        <div class={styles.component}>
          <h3>Tooltip</h3>
          <div class={styles.demo}>
            <Tooltip content="This is a tooltip" placement="top">
              <Button variant="secondary">Hover me (top)</Button>
            </Tooltip>
            <Tooltip content="Bottom tooltip" placement="bottom">
              <Button variant="secondary">Hover me (bottom)</Button>
            </Tooltip>
            <Tooltip content="Right tooltip" placement="right">
              <Button variant="secondary">Hover me (right)</Button>
            </Tooltip>
          </div>
        </div>

        <div class={styles.component}>
          <h3>Accordion</h3>
          <div class={styles.demo}>
            <Accordion title="Click to expand (default)" variant="default">
              <div class={styles.accordionContent}>
                This is the accordion content. It can contain any elements.
              </div>
            </Accordion>
            <Accordion title="Primary accordion" variant="primary" startOpen={true}>
              <div class={styles.accordionContent}>
                This accordion starts open.
              </div>
            </Accordion>
            <Accordion title="Secondary accordion" variant="secondary">
              <div class={styles.accordionContent}>
                Another accordion with secondary variant.
              </div>
            </Accordion>
          </div>
        </div>

        <div class={styles.component}>
          <h3>Alert</h3>
          <div class={styles.demo}>
            <Alert variant="info">
              This is an informational alert.
            </Alert>
            <Alert variant="success">
              Success! Your action was completed.
            </Alert>
            <Alert variant="warning">
              Warning: Please review your input.
            </Alert>
            <Alert variant="error">
              Error: Something went wrong.
            </Alert>
            {showAlert() && (
              <Alert variant="info" closable onClose={() => setShowAlert(false)}>
                This alert can be closed.
              </Alert>
            )}
          </div>
        </div>

        <div class={styles.component}>
          <h3>ToggleButton</h3>
          <div class={styles.demo}>
            <ToggleButton
              isActive={isToggleActive()}
              onChange={(active) => setIsToggleActive(active)}
              ariaLabel="Toggle setting"
            />
            <p>Toggle is: {isToggleActive() ? 'On' : 'Off'}</p>
            <ToggleButton
              isActive={true}
              disabled={true}
              ariaLabel="Disabled toggle"
            />
            <span>Disabled (always on)</span>
          </div>
        </div>

        <div class={styles.component}>
          <h3>Section</h3>
          <div class={styles.demo}>
            <Section label="Section with Label">
              <p>This is the section content.</p>
            </Section>
            <Section>
              <p>Section without label.</p>
            </Section>
          </div>
        </div>

        <div class={styles.component}>
          <h3>SectionItem</h3>
          <div class={styles.demo}>
            <SectionItem label="Item Label">
              <Input type="text" placeholder="Item content..." />
            </SectionItem>
            <SectionItem label="With Description" description="This is a helpful tooltip">
              <Button variant="secondary">Action</Button>
            </SectionItem>
          </div>
        </div>

        <div class={styles.component}>
          <h3>ExpandCollapse</h3>
          <div class={styles.demo}>
            <ExpandCollapse
              isExpanded={isExpandCollapseOpen()}
              onToggle={(expanded) => setIsExpandCollapseOpen(expanded)}
              trigger={
                <Button variant="secondary">
                  {isExpandCollapseOpen() ? 'Collapse' : 'Expand'}
                </Button>
              }
            >
              <div class={styles.expandedContent}>
                <p>This is the expanded content!</p>
                <p>It can contain any elements.</p>
              </div>
            </ExpandCollapse>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComponentShowcase;

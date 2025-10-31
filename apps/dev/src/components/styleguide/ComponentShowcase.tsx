/**
 * Component Showcase Section
 *
 * Displays all UI components with interactive examples
 */

import { type Component, createSignal } from 'solid-js';
import styles from './ComponentShowcase.module.scss';

export const ComponentShowcase: Component = () => {
  const [modalOpen, setModalOpen] = createSignal(false);

  return (
    <div class={styles.section}>
      <h2 class={styles.sectionTitle}>Components</h2>
      <p class={styles.sectionDescription}>
        Interactive showcase of all UI components with different variants and states.
      </p>

      {/* Atoms */}
      <div class={styles.category}>
        <h3 class={styles.categoryTitle}>Atoms</h3>
        <p class={styles.categoryDescription}>Basic building blocks</p>

        {/* Button */}
        <div class={styles.componentSection}>
          <h4 class={styles.componentTitle}>Button</h4>
          <div class={styles.componentDemo}>
            <button class={styles.demoButton}>Default Button</button>
            <button class={`${styles.demoButton} ${styles.primary}`}>Primary Button</button>
            <button class={`${styles.demoButton} ${styles.secondary}`}>Secondary Button</button>
            <button class={`${styles.demoButton} ${styles.ghost}`}>Ghost Button</button>
            <button class={`${styles.demoButton}`} disabled>Disabled Button</button>
          </div>
          <div class={styles.componentCode}>
            <pre>
              <code>{`<Button variant="primary">Click me</Button>`}</code>
            </pre>
          </div>
        </div>

        {/* Input */}
        <div class={styles.componentSection}>
          <h4 class={styles.componentTitle}>Input</h4>
          <div class={styles.componentDemo}>
            <input type="text" placeholder="Default input" class={styles.demoInput} />
            <input type="text" placeholder="Disabled input" class={styles.demoInput} disabled />
            <input
              type="text"
              value="Input with value"
              class={styles.demoInput}
            />
          </div>
          <div class={styles.componentCode}>
            <pre>
              <code>{`<Input placeholder="Enter text" />`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Molecules */}
      <div class={styles.category}>
        <h3 class={styles.categoryTitle}>Molecules</h3>
        <p class={styles.categoryDescription}>Composite components</p>

        {/* Modal */}
        <div class={styles.componentSection}>
          <h4 class={styles.componentTitle}>Modal</h4>
          <div class={styles.componentDemo}>
            <button
              class={`${styles.demoButton} ${styles.primary}`}
              onClick={() => setModalOpen(true)}
            >
              Open Modal
            </button>
          </div>
          <div class={styles.componentCode}>
            <pre>
              <code>{`<Modal isOpen={open()} onClose={() => setOpen(false)}>
  <ModalHeader>Modal Title</ModalHeader>
  <ModalBody>Modal content</ModalBody>
  <ModalFooter>
    <Button onClick={close}>Cancel</Button>
    <Button variant="primary" onClick={save}>Save</Button>
  </ModalFooter>
</Modal>`}</code>
            </pre>
          </div>
        </div>

        {/* Tabs */}
        <div class={styles.componentSection}>
          <h4 class={styles.componentTitle}>Tabs</h4>
          <div class={styles.componentDemo}>
            <div class={styles.demoTabs}>
              <div class={styles.tabList}>
                <button class={`${styles.tab} ${styles.active}`}>Tab 1</button>
                <button class={styles.tab}>Tab 2</button>
                <button class={styles.tab}>Tab 3</button>
              </div>
              <div class={styles.tabPanel}>
                <p>Content for Tab 1</p>
              </div>
            </div>
          </div>
          <div class={styles.componentCode}>
            <pre>
              <code>{`<Tabs>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </TabList>
  <TabPanel>Content 1</TabPanel>
  <TabPanel>Content 2</TabPanel>
</Tabs>`}</code>
            </pre>
          </div>
        </div>

        {/* Dropdown */}
        <div class={styles.componentSection}>
          <h4 class={styles.componentTitle}>Dropdown</h4>
          <div class={styles.componentDemo}>
            <button class={`${styles.demoButton} ${styles.secondary}`}>
              Select Option ▼
            </button>
          </div>
          <div class={styles.componentCode}>
            <pre>
              <code>{`<Dropdown>
  <DropdownTrigger>Select Option</DropdownTrigger>
  <DropdownMenu>
    <DropdownItem>Option 1</DropdownItem>
    <DropdownItem>Option 2</DropdownItem>
  </DropdownMenu>
</Dropdown>`}</code>
            </pre>
          </div>
        </div>

        {/* Accordion */}
        <div class={styles.componentSection}>
          <h4 class={styles.componentTitle}>Accordion</h4>
          <div class={styles.componentDemo}>
            <div class={styles.demoAccordion}>
              <div class={styles.accordionItem}>
                <button class={styles.accordionButton}>
                  Section 1
                  <span class={styles.accordionIcon}>▼</span>
                </button>
                <div class={styles.accordionPanel}>
                  <p>Content for section 1</p>
                </div>
              </div>
              <div class={styles.accordionItem}>
                <button class={styles.accordionButton}>
                  Section 2
                  <span class={styles.accordionIcon}>▶</span>
                </button>
              </div>
            </div>
          </div>
          <div class={styles.componentCode}>
            <pre>
              <code>{`<Accordion>
  <AccordionItem title="Section 1">
    Content 1
  </AccordionItem>
  <AccordionItem title="Section 2">
    Content 2
  </AccordionItem>
</Accordion>`}</code>
            </pre>
          </div>
        </div>

        {/* Alert */}
        <div class={styles.componentSection}>
          <h4 class={styles.componentTitle}>Alert</h4>
          <div class={styles.componentDemo}>
            <div style={{ display: 'flex', 'flex-direction': 'column', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 16px',
                'border-radius': '8px',
                border: '1px solid #90caf9',
                background: '#e3f2fd'
              }}>
                <div style={{ color: '#1976d2', 'font-size': '20px', 'flex-shrink': '0' }}>ℹ️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ 'font-size': '14px', 'font-weight': 600, color: '#0d47a1', 'margin-bottom': '4px' }}>Information</div>
                  <div style={{ 'font-size': '13px', color: '#1565c0' }}>This is an informational message</div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 16px',
                'border-radius': '8px',
                border: '1px solid #81c784',
                background: '#e8f5e9'
              }}>
                <div style={{ color: '#388e3c', 'font-size': '20px', 'flex-shrink': '0' }}>✅</div>
                <div style={{ flex: 1 }}>
                  <div style={{ 'font-size': '14px', 'font-weight': 600, color: '#1b5e20', 'margin-bottom': '4px' }}>Success</div>
                  <div style={{ 'font-size': '13px', color: '#2e7d32' }}>Your changes have been saved successfully</div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 16px',
                'border-radius': '8px',
                border: '1px solid #ffb74d',
                background: '#fff3e0'
              }}>
                <div style={{ color: '#f57c00', 'font-size': '20px', 'flex-shrink': '0' }}>⚠️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ 'font-size': '14px', 'font-weight': 600, color: '#e65100', 'margin-bottom': '4px' }}>Warning</div>
                  <div style={{ 'font-size': '13px', color: '#ef6c00' }}>Please review your input before proceeding</div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 16px',
                'border-radius': '8px',
                border: '1px solid #e57373',
                background: '#ffebee'
              }}>
                <div style={{ color: '#d32f2f', 'font-size': '20px', 'flex-shrink': '0' }}>❌</div>
                <div style={{ flex: 1 }}>
                  <div style={{ 'font-size': '14px', 'font-weight': 600, color: '#b71c1c', 'margin-bottom': '4px' }}>Error</div>
                  <div style={{ 'font-size': '13px', color: '#c62828' }}>An error occurred while processing your request</div>
                </div>
              </div>
            </div>
          </div>
          <div class={styles.componentCode}>
            <pre>
              <code>{`const alert = new Alert({
  type: 'success',
  title: 'Success',
  description: 'Your changes have been saved successfully',
  icon: iconElement,
  isHidden: false
});

document.body.appendChild(alert.getEl());

// Show/hide programmatically
alert.show();
alert.hide();

// Update content
alert.setTitle('New Title');
alert.setDescription('New Description');`}</code>
            </pre>
          </div>
        </div>

        {/* Popup */}
        <div class={styles.componentSection}>
          <h4 class={styles.componentTitle}>Popup</h4>
          <div class={styles.componentDemo}>
            <div style={{ display: 'flex', 'flex-direction': 'column', gap: '1rem' }}>
              <div style={{
                position: 'relative',
                background: '#f5f5f5',
                padding: '2rem',
                'border-radius': '8px',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{
                  position: 'relative',
                  width: '300px',
                  background: '#ffffff',
                  border: '1px solid #eaedf2',
                  'border-radius': '6px',
                  padding: '10px',
                  'box-shadow': '4px 4px 34px 0px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{
                    display: 'flex',
                    'justify-content': 'space-between',
                    'margin-bottom': '10px'
                  }}>
                    <div style={{
                      'font-weight': 600,
                      'font-size': '16px',
                      color: '#1a202c',
                      flex: 1
                    }}>Popup Title</div>
                    <div style={{ 'flex-shrink': 0 }}>
                      <button style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        'font-size': '20px',
                        'line-height': 1
                      }}>×</button>
                    </div>
                  </div>
                  <div style={{
                    'font-size': '14px',
                    'line-height': 1.6,
                    color: '#4a5568'
                  }}>This is the popup content. Popups are fixed-position overlays that can be centered or positioned anywhere on the screen.</div>
                </div>
              </div>
            </div>
          </div>
          <div class={styles.componentCode}>
            <pre>
              <code>{`const popup = new Popup({
  title: 'Popup Title',
  content: 'Popup content here',
  centerPopup: true,
  useCloseButton: true,
  startOpen: false
});

document.body.appendChild(popup.getEl());

// Control visibility
popup.open();
popup.close();
popup.toggle();

// Update content
popup.setTitle('New Title');

// Check state
const isOpen = popup.getIsOpen();

// Events
popup.on('open', (popup) => {
  console.log('Popup opened');
});

popup.on('close', (popup) => {
  console.log('Popup closed');
});`}</code>
            </pre>
          </div>
        </div>

        {/* Tooltip */}
        <div class={styles.componentSection}>
          <h4 class={styles.componentTitle}>Tooltip</h4>
          <div class={styles.componentDemo}>
            <div style={{ display: 'flex', gap: '2rem', 'align-items': 'center', 'flex-wrap': 'wrap' }}>
              <div style={{ display: 'flex', 'align-items': 'center', gap: '0.5rem' }}>
                <span>Hover for help</span>
                <span
                  style={{
                    display: 'inline-flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    width: '20px',
                    height: '20px',
                    'border-radius': '50%',
                    'background-color': '#3b82f6',
                    color: 'white',
                    'font-size': '14px',
                    'font-weight': 'bold',
                    cursor: 'help'
                  }}
                  title="This is a tooltip"
                >
                  ?
                </span>
              </div>
              <div style={{ display: 'flex', 'align-items': 'center', gap: '0.5rem' }}>
                <span>Top placement</span>
                <span
                  style={{
                    display: 'inline-flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    width: '20px',
                    height: '20px',
                    'border-radius': '50%',
                    'background-color': '#10b981',
                    color: 'white',
                    'font-size': '14px',
                    'font-weight': 'bold',
                    cursor: 'help'
                  }}
                  title="Tooltip above"
                >
                  i
                </span>
              </div>
              <div style={{ display: 'flex', 'align-items': 'center', gap: '0.5rem' }}>
                <span>Custom content</span>
                <span
                  style={{
                    display: 'inline-flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    width: '20px',
                    height: '20px',
                    'border-radius': '50%',
                    'background-color': '#f59e0b',
                    color: 'white',
                    'font-size': '14px',
                    'font-weight': 'bold',
                    cursor: 'help'
                  }}
                  title="Rich HTML content with bold and italic text"
                >
                  !
                </span>
              </div>
            </div>
          </div>
          <div class={styles.componentCode}>
            <pre>
              <code>{`const tooltip = new Tooltip({
  content: 'This is helpful information',
  floaterOptions: {
    placement: 'top',
    offset: 8,
    shiftPadding: 5
  }
});

// Custom trigger
const customTooltip = new Tooltip({
  trigger: customIconElement,
  content: '<strong>Bold</strong> and <em>italic</em> text',
  floaterOptions: {
    placement: 'bottom'
  }
});

// With callbacks
const tooltipWithCallbacks = new Tooltip({
  content: 'Tooltip content',
  onShow: () => console.log('Tooltip shown'),
  onHide: () => console.log('Tooltip hidden')
});`}</code>
            </pre>
          </div>
        </div>

        {/* InputLabel */}
        <div class={styles.componentSection}>
          <h4 class={styles.componentTitle}>InputLabel</h4>
          <div class={styles.componentDemo}>
            <div style={{ display: 'flex', 'flex-direction': 'column', gap: '1rem', 'max-width': '400px' }}>
              <div>
                <label style={{ 'font-weight': 600, 'font-size': '0.75rem', 'margin-bottom': '0.5rem', display: 'block' }}>Username</label>
                <input type="text" placeholder="Enter username" class={styles.demoInput} />
              </div>
              <div>
                <label style={{ 'font-weight': 600, 'font-size': '0.75rem', 'margin-bottom': '0.5rem', display: 'flex', 'align-items': 'center', gap: '0.25rem' }}>
                  Email <span style={{ color: '#f44336' }}>*</span>
                </label>
                <input type="email" placeholder="Enter email" class={styles.demoInput} />
              </div>
              <div style={{ display: 'flex', 'align-items': 'center', gap: '1rem' }}>
                <label style={{ 'font-weight': 600, 'font-size': '0.75rem', 'min-width': '100px' }}>Newsletter</label>
                <input type="checkbox" />
              </div>
            </div>
          </div>
          <div class={styles.componentCode}>
            <pre>
              <code>{`<InputLabel
  input={inputElement}
  label="Username"
  description="Enter your username"
  required={true}
/>

<InputLabel
  input={inputElement}
  label="Newsletter"
  sideBySide={true}
/>`}</code>
            </pre>
          </div>
        </div>

        {/* InputNumber */}
        <div class={styles.componentSection}>
          <h4 class={styles.componentTitle}>InputNumber</h4>
          <div class={styles.componentDemo}>
            <div style={{ display: 'flex', gap: '1rem', 'flex-wrap': 'wrap' }}>
              <div style={{ position: 'relative', width: '120px' }}>
                <input
                  type="text"
                  value="16px"
                  class={styles.demoInput}
                  style={{ 'padding-right': '2rem' }}
                />
                <div style={{
                  position: 'absolute',
                  right: '0.875rem',
                  top: '0.375rem',
                  display: 'flex',
                  'flex-direction': 'column',
                  gap: '0.125rem',
                  'font-size': '0.625rem',
                  color: '#9ca3af'
                }}>
                  <span style={{ cursor: 'pointer' }}>▲</span>
                  <span style={{ cursor: 'pointer' }}>▼</span>
                </div>
              </div>
              <div style={{ position: 'relative', width: '120px' }}>
                <input
                  type="text"
                  value="100%"
                  class={styles.demoInput}
                  style={{ 'padding-right': '2rem' }}
                />
                <div style={{
                  position: 'absolute',
                  right: '0.875rem',
                  top: '0.375rem',
                  display: 'flex',
                  'flex-direction': 'column',
                  gap: '0.125rem',
                  'font-size': '0.625rem',
                  color: '#9ca3af'
                }}>
                  <span style={{ cursor: 'pointer' }}>▲</span>
                  <span style={{ cursor: 'pointer' }}>▼</span>
                </div>
              </div>
            </div>
          </div>
          <div class={styles.componentCode}>
            <pre>
              <code>{`<InputNumber
  defaultValue={16}
  min={0}
  max={100}
  unit="px"
  increment={1}
  onChange={(value, unit) => console.log(value, unit)}
/>

<InputNumber
  defaultValue={100}
  unit="%"
  changeableUnit={true}
  availableUnits={['px', 'rem', '%']}
/>`}</code>
            </pre>
          </div>
        </div>

        {/* RadioButtonGroup */}
        <div class={styles.componentSection}>
          <h4 class={styles.componentTitle}>RadioButtonGroup</h4>
          <div class={styles.componentDemo}>
            <div style={{ display: 'flex', gap: '0.5rem', 'flex-wrap': 'wrap' }}>
              <button class={`${styles.demoButton} ${styles.radioButton} ${styles.selected}`}>
                Option 1
              </button>
              <button class={`${styles.demoButton} ${styles.radioButton}`}>
                Option 2
              </button>
              <button class={`${styles.demoButton} ${styles.radioButton}`}>
                Option 3
              </button>
            </div>
          </div>
          <div class={styles.componentCode}>
            <pre>
              <code>{`const group = new RadioButtonGroup({
  items: [
    new RadioButtonGroupItem({ value: 'option1', label: 'Option 1' }),
    new RadioButtonGroupItem({ value: 'option2', label: 'Option 2' }),
    new RadioButtonGroupItem({ value: 'option3', label: 'Option 3' })
  ],
  singleSelection: true,
  onChange: (items) => console.log('Selected:', items)
});

document.body.appendChild(group.getEl());`}</code>
            </pre>
          </div>
        </div>

        {/* LinkedInputs */}
        <div class={styles.componentSection}>
          <h4 class={styles.componentTitle}>LinkedInputs</h4>
          <div class={styles.componentDemo}>
            <div style={{ display: 'flex', 'align-items': 'center', gap: '0.5rem' }}>
              <input type="text" value="10px" class={styles.demoInput} style={{ width: '80px' }} />
              <input type="text" value="10px" class={styles.demoInput} style={{ width: '80px' }} />
              <input type="text" value="10px" class={styles.demoInput} style={{ width: '80px' }} />
              <input type="text" value="10px" class={styles.demoInput} style={{ width: '80px' }} />
              <button class={`${styles.demoButton} ${styles.linkButton} ${styles.active}`} title="Link values">
                🔗
              </button>
            </div>
          </div>
          <div class={styles.componentCode}>
            <pre>
              <code>{`const inputs = [
  new InputNumber({ defaultValue: 10, unit: 'px' }),
  new InputNumber({ defaultValue: 10, unit: 'px' }),
  new InputNumber({ defaultValue: 10, unit: 'px' }),
  new InputNumber({ defaultValue: 10, unit: 'px' })
];

const linkedInputs = new LinkedInputs({
  inputs: inputs,
  linked: true,
  labels: ['Top', 'Right', 'Bottom', 'Left']
});

document.body.appendChild(linkedInputs.getEl());`}</code>
            </pre>
          </div>
        </div>

        {/* EditableField */}
        <div class={styles.componentSection}>
          <h4 class={styles.componentTitle}>EditableField</h4>
          <div class={styles.componentDemo}>
            <div style={{ display: 'flex', 'flex-direction': 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', 'align-items': 'center', gap: '0.5rem' }}>
                <span style={{
                  padding: '0.5rem',
                  'border-radius': '0.25rem',
                  background: '#f3f4f6',
                  cursor: 'pointer'
                }}>
                  Click to edit this text
                </span>
              </div>
              <div style={{ display: 'flex', 'align-items': 'center', gap: '0.5rem' }}>
                <span style={{ padding: '0.5rem' }}>Non-editable text</span>
                <button class={`${styles.demoButton}`} style={{ padding: '0.25rem 0.5rem' }}>✏️</button>
              </div>
              <div style={{ display: 'flex', 'align-items': 'center', gap: '0.5rem' }}>
                <input type="text" value="Edit mode" class={styles.demoInput} />
                <button class={`${styles.demoButton} ${styles.primary}`} style={{ padding: '0.25rem 0.5rem' }}>💾</button>
                <button class={`${styles.demoButton}`} style={{ padding: '0.25rem 0.5rem' }}>🗑️</button>
              </div>
            </div>
          </div>
          <div class={styles.componentCode}>
            <pre>
              <code>{`const field = new EditableField({
  value: 'Initial value',
  showEditButton: true,
  onSave: (value) => console.log('Saved:', value),
  onDiscard: () => console.log('Discarded'),
  onEdit: () => console.log('Editing')
});

document.body.appendChild(field.getEl());

// Label click mode
const field2 = new EditableField({
  value: 'Click to edit',
  labelClickOpensEditMode: true
});`}</code>
            </pre>
          </div>
        </div>

        {/* ColorPicker */}
        <div class={styles.componentSection}>
          <h4 class={styles.componentTitle}>ColorPicker</h4>
          <div class={styles.componentDemo}>
            <div style={{ display: 'flex', 'flex-direction': 'column', gap: '1rem', 'max-width': '300px' }}>
              <div style={{ display: 'flex', 'align-items': 'center', gap: '1rem' }}>
                <label style={{ 'min-width': '100px', 'font-weight': 600, 'font-size': '0.875rem' }}>With Input:</label>
                <div style={{ position: 'relative', width: '200px' }}>
                  <input
                    type="text"
                    value="#3b82f6"
                    class={styles.demoInput}
                    style={{ 'padding-right': '40px' }}
                    readonly
                  />
                  <div style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '24px',
                    height: '24px',
                    'border-radius': '6px',
                    border: '1px solid #eaedf2',
                    background: '#3b82f6',
                    cursor: 'pointer'
                  }}></div>
                </div>
              </div>
              <div style={{ display: 'flex', 'align-items': 'center', gap: '1rem' }}>
                <label style={{ 'min-width': '100px', 'font-weight': 600, 'font-size': '0.875rem' }}>Swatch Only:</label>
                <div style={{
                  width: '32px',
                  height: '32px',
                  'border-radius': '6px',
                  border: '1px solid #eaedf2',
                  background: '#10b981',
                  cursor: 'pointer',
                  display: 'flex',
                  'align-items': 'center',
                  'justify-content': 'center'
                }}></div>
              </div>
              <div style={{ display: 'flex', 'align-items': 'center', gap: '1rem' }}>
                <label style={{ 'min-width': '100px', 'font-weight': 600, 'font-size': '0.875rem' }}>Transparent:</label>
                <div style={{ position: 'relative', width: '200px' }}>
                  <input
                    type="text"
                    value="none"
                    class={styles.demoInput}
                    style={{ 'padding-right': '40px' }}
                    readonly
                  />
                  <div style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '24px',
                    height: '24px',
                    'border-radius': '6px',
                    border: '1px solid #eaedf2',
                    background: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 12px 12px',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      background: 'red',
                      'clip-path': 'polygon(calc(100% - 1px) 0, 100% 1px, 1px 100%, 0 calc(100% - 1px), calc(100% - 1px) 0)'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class={styles.componentCode}>
            <pre>
              <code>{`const colorPicker = new ColorPicker({
  color: '#3b82f6',
  valueColorType: 'hex',
  onChange: (picker, event) => {
    console.log('Color changed:', picker.getColor());
  }
});

document.body.appendChild(colorPicker.getEl());

// Swatch only mode
const swatchOnly = new ColorPicker({
  color: '#10b981',
  noInput: true
});

// With transparency
const transparent = new ColorPicker({
  color: 'transparent',
  emptyColorLabel: 'none'
});`}</code>
            </pre>
          </div>
        </div>

        {/* GridSelector */}
        <div class={styles.componentSection}>
          <h4 class={styles.componentTitle}>GridSelector</h4>
          <div class={styles.componentDemo}>
            <div style={{ display: 'flex', 'flex-direction': 'column', gap: '1.5rem' }}>
              <div>
                <p style={{ 'font-size': '0.875rem', 'margin-bottom': '0.75rem', 'font-weight': 600 }}>Multi-selection (4 columns):</p>
                <div style={{
                  display: 'grid',
                  'grid-template-columns': 'repeat(4, 1fr)',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    padding: '1rem',
                    border: '2px solid #3b82f6',
                    'border-radius': '0.5rem',
                    background: '#eff6ff',
                    color: '#1e40af',
                    'font-weight': 500,
                    cursor: 'pointer'
                  }}>Option 1</div>
                  <div style={{
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    padding: '1rem',
                    border: '2px solid #e5e7eb',
                    'border-radius': '0.5rem',
                    background: '#ffffff',
                    cursor: 'pointer'
                  }}>Option 2</div>
                  <div style={{
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    padding: '1rem',
                    border: '2px solid #3b82f6',
                    'border-radius': '0.5rem',
                    background: '#eff6ff',
                    color: '#1e40af',
                    'font-weight': 500,
                    cursor: 'pointer'
                  }}>Option 3</div>
                  <div style={{
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    padding: '1rem',
                    border: '2px solid #e5e7eb',
                    'border-radius': '0.5rem',
                    background: '#ffffff',
                    cursor: 'pointer'
                  }}>Option 4</div>
                </div>
              </div>
              <div>
                <p style={{ 'font-size': '0.875rem', 'margin-bottom': '0.75rem', 'font-weight': 600 }}>Single-selection (3 columns):</p>
                <div style={{
                  display: 'grid',
                  'grid-template-columns': 'repeat(3, 1fr)',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    padding: '1rem',
                    border: '2px solid #e5e7eb',
                    'border-radius': '0.5rem',
                    background: '#ffffff',
                    cursor: 'pointer'
                  }}>Small</div>
                  <div style={{
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    padding: '1rem',
                    border: '2px solid #3b82f6',
                    'border-radius': '0.5rem',
                    background: '#eff6ff',
                    color: '#1e40af',
                    'font-weight': 500,
                    cursor: 'pointer'
                  }}>Medium</div>
                  <div style={{
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    padding: '1rem',
                    border: '2px solid #e5e7eb',
                    'border-radius': '0.5rem',
                    background: '#ffffff',
                    cursor: 'pointer'
                  }}>Large</div>
                </div>
              </div>
            </div>
          </div>
          <div class={styles.componentCode}>
            <pre>
              <code>{`// Multi-selection
const grid = new GridSelector({
  items: [
    { content: 'Option 1', value: 1 },
    { content: 'Option 2', value: 2 },
    { content: 'Option 3', value: 3 },
    { content: 'Option 4', value: 4 }
  ],
  columnsCount: 4,
  onChange: (selector, selectedItems) => {
    console.log('Selected:', selectedItems);
  }
});

document.body.appendChild(grid.getEl());

// Single-selection
const sizeSelector = new GridSelector({
  items: [
    { content: 'Small', value: 'sm' },
    { content: 'Medium', value: 'md', selected: true },
    { content: 'Large', value: 'lg' }
  ],
  columnsCount: 3,
  singleSelection: true,
  allowEmpty: false
});

// Responsive grid
const responsiveGrid = new GridSelector({
  items: [...],
  columnsCount: 4,
  responsiveConfig: {
    lg: 3,  // 3 columns on tablet
    md: 2,  // 2 columns on mobile
    sm: 1   // 1 column on small mobile
  }
});`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

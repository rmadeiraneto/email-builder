/**
 * Command exports
 */

export { CommandManager } from './CommandManager';
export { AddComponentCommand } from './AddComponentCommand';
export { RemoveComponentCommand } from './RemoveComponentCommand';
export { UpdateComponentContentCommand } from './UpdateComponentContentCommand';
export { UpdateComponentStyleCommand } from './UpdateComponentStyleCommand';
export { SaveTemplateCommand } from './SaveTemplateCommand';
export { LoadTemplateCommand } from './LoadTemplateCommand';
export { ExportTemplateCommand } from './ExportTemplateCommand';

// Template-aware commands
export { TemplateAddComponentCommand } from './TemplateAddComponentCommand';
export { TemplateUpdateComponentCommand } from './TemplateUpdateComponentCommand';
export { TemplateRemoveComponentCommand } from './TemplateRemoveComponentCommand';
export { TemplateReorderComponentCommand } from './TemplateReorderComponentCommand';
export { TemplateDuplicateComponentCommand } from './TemplateDuplicateComponentCommand';

// Preset commands
export { CreatePresetCommand } from './CreatePresetCommand';
export { UpdatePresetCommand } from './UpdatePresetCommand';
export { DeletePresetCommand } from './DeletePresetCommand';
export { ApplyPresetCommand } from './ApplyPresetCommand';

export type { AddComponentPayload, ComponentData } from './AddComponentCommand';
export type { RemoveComponentPayload } from './RemoveComponentCommand';
export type { UpdateComponentContentPayload } from './UpdateComponentContentCommand';
export type { UpdateComponentStylePayload } from './UpdateComponentStyleCommand';
export type { SaveTemplatePayload } from './SaveTemplateCommand';
export type { LoadTemplatePayload } from './LoadTemplateCommand';
export type { ExportTemplatePayload } from './ExportTemplateCommand';

// Template-aware command types
export type { TemplateAddComponentPayload } from './TemplateAddComponentCommand';
export type { TemplateUpdateComponentPayload } from './TemplateUpdateComponentCommand';
export type { TemplateRemoveComponentPayload } from './TemplateRemoveComponentCommand';
export type { TemplateReorderComponentPayload } from './TemplateReorderComponentCommand';
export type { TemplateDuplicateComponentPayload } from './TemplateDuplicateComponentCommand';

// Preset command types
export type { CreatePresetPayload } from './CreatePresetCommand';
export type { UpdatePresetPayload } from './UpdatePresetCommand';
export type { DeletePresetPayload } from './DeletePresetCommand';
export type { ApplyPresetPayload } from './ApplyPresetCommand';

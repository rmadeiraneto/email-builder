/**
 * Export Template Command
 *
 * Exports template to HTML or JSON format
 */

import type { Command } from '../types/command.types';
import { CommandType } from '../types/command.types';
import type {
  Template,
  TemplateExportOptions,
} from '../types/template.types';
import type { ExportResult } from '../template/TemplateExporter';
import { TemplateExporter } from '../template/TemplateExporter';

/**
 * Export template payload
 */
export interface ExportTemplatePayload {
  /**
   * Template to export
   */
  template: Template;

  /**
   * Export options
   */
  options: TemplateExportOptions;
}

/**
 * Export Template Command
 *
 * Exports template to various formats (HTML, JSON)
 * This is a non-undoable command as it's a read operation
 */
export class ExportTemplateCommand implements Command<ExportTemplatePayload> {
  public readonly type = CommandType.EXPORT_HTML;
  public readonly timestamp: number;
  public readonly id: string;
  public readonly payload: ExportTemplatePayload;

  private exporter: TemplateExporter;
  private exportResult?: ExportResult;

  constructor(payload: ExportTemplatePayload) {
    this.payload = payload;
    this.timestamp = Date.now();
    this.id = `export-template-${this.timestamp}`;
    this.exporter = new TemplateExporter();
  }

  /**
   * Execute export operation
   */
  public async execute(): Promise<void> {
    try {
      const { template, options } = this.payload;

      // Export template
      this.exportResult = this.exporter.export(template, options);
    } catch (error) {
      throw new Error(
        `Failed to export template: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get export result
   */
  public getExportResult(): ExportResult | undefined {
    return this.exportResult;
  }

  /**
   * Get exported HTML (if format was html or both)
   */
  public getHTML(): string | undefined {
    return this.exportResult?.html;
  }

  /**
   * Get exported JSON (if format was json or both)
   */
  public getJSON(): string | undefined {
    return this.exportResult?.json;
  }
}

/**
 * Spanish (Spain) Translations
 *
 * Example translation file demonstrating the translation system.
 * This is a partial translation for demonstration purposes.
 */

import type { TranslationDictionary } from '../types';

export const esES: TranslationDictionary = {
  ui: {
    toolbar: {
      new: 'Nuevo',
      save: 'Guardar',
      load: 'Cargar',
      undo: 'Deshacer',
      redo: 'Rehacer',
      export: 'Exportar',
      preview: 'Vista previa',
      check: 'Verificar',
      test: 'Probar',
      settings: 'Configuración',
      testMode: 'Modo de prueba',
      newTemplateTitle: 'Crear nueva plantilla',
      saveTemplateTitle: 'Guardar plantilla',
      loadTemplateTitle: 'Cargar plantilla',
      undoTitle: 'Deshacer última acción',
      redoTitle: 'Rehacer última acción',
      exportTitle: 'Exportar plantilla',
      previewTitle: 'Vista previa de plantilla',
      checkCompatibilityTitle: 'Verificar compatibilidad con clientes de correo',
      testEmailClientsTitle: 'Probar en clientes de correo',
      emailTestingSettingsTitle: 'Configuración de pruebas de correo',
    },

    palette: {
      searchPlaceholder: 'Buscar componentes...',
      allComponents: 'Todos',
      emptyState: 'No se encontraron componentes',
      categories: {
        all: 'Todos',
        base: 'Base',
        email: 'Correo',
        custom: 'Personalizado',
      },
    },

    panel: {
      content: 'Contenido',
      styles: 'Estilo',
      settings: 'Configuración',
      noSelection: 'Ningún componente seleccionado',
      selectComponent: 'Selecciona un componente para editar sus propiedades',
      generalSettings: 'Configuración general',
      componentProperties: 'Propiedades del componente',
      stylePresets: 'Preajustes de estilo',
      applyPreset: 'Aplicar preajuste',
      createPreset: 'Crear preajuste',
      managePresets: 'Gestionar preajustes',
      tabs: {
        components: 'Componentes',
        general: 'Estilos generales',
      },
    },

    modal: {
      close: 'Cerrar',
      cancel: 'Cancelar',
      save: 'Guardar',
      create: 'Crear',
      delete: 'Eliminar',
      confirm: 'Confirmar',
      apply: 'Aplicar',
    },

    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      warning: 'Advertencia',
      info: 'Información',
      yes: 'Sí',
      no: 'No',
      ok: 'Aceptar',
    },
  },

  property: {
    canvas: {
      width: 'Ancho del lienzo',
      widthDescription: 'Ancho del lienzo en píxeles (correo: típicamente 600px)',
      maxWidth: 'Ancho máximo',
      maxWidthDescription: 'Ancho máximo para diseños responsivos',
      background: 'Fondo del lienzo',
      border: 'Borde del lienzo',
      borderPlaceholder: '1px solid #ddd',
      borderDescription: 'Borde CSS abreviado (ej. "1px solid #ddd")',
    },

    defaultComponent: {
      background: 'Fondo predeterminado del componente',
      border: 'Borde predeterminado del componente',
      borderPlaceholder: '1px solid #eee',
      borderDescription: 'Borde CSS abreviado',
    },

    typography: {
      bodyFontFamily: 'Familia de fuente del cuerpo',
      bodyFontSize: 'Tamaño de fuente del cuerpo',
      bodyTextColor: 'Color del texto del cuerpo',
      bodyLineHeight: 'Altura de línea del cuerpo',
      paragraphFontSize: 'Tamaño de fuente del párrafo',
      paragraphColor: 'Color del párrafo',
      paragraphLineHeight: 'Altura de línea del párrafo',
      h1FontSize: 'Tamaño de fuente H1',
      h1Color: 'Color H1',
      h1Weight: 'Grosor H1',
      h2FontSize: 'Tamaño de fuente H2',
      h2Color: 'Color H2',
      h2Weight: 'Grosor H2',
      h3FontSize: 'Tamaño de fuente H3',
      h3Color: 'Color H3',
      h3Weight: 'Grosor H3',

      fontFamily: {
        arial: 'Arial',
        georgia: 'Georgia',
        helvetica: 'Helvética',
        timesNewRoman: 'Times New Roman',
        verdana: 'Verdana',
      },

      fontWeight: {
        normal: 'Normal',
        bold: 'Negrita',
        '300': '300',
        '400': '400',
        '500': '500',
        '600': '600',
        '700': '700',
      },
    },

    link: {
      color: 'Color del enlace',
      hoverColor: 'Color del enlace al pasar el cursor',
    },

    button: {
      background: 'Fondo del botón',
      textColor: 'Color del texto del botón',
      borderRadius: 'Radio del borde del botón',
      padding: 'Relleno del botón',
      text: 'Texto del botón',
      textPlaceholder: 'Ingrese el texto del botón',
      linkUrl: 'URL del enlace',
      linkUrlPlaceholder: 'https://ejemplo.com',
    },

    text: {
      content: 'Contenido del texto',
      contentPlaceholder: 'Ingrese el contenido del texto',
      fontFamily: 'Familia de fuente',
      fontSize: 'Tamaño de fuente',
      fontSizePlaceholder: '16px',
      fontWeight: 'Grosor de fuente',
      textColor: 'Color del texto',
      textAlign: 'Alineación del texto',
      textAlignOptions: {
        left: 'Izquierda',
        center: 'Centro',
        right: 'Derecha',
        justify: 'Justificado',
      },
      lineHeight: 'Altura de línea',
      lineHeightPlaceholder: '1.5',
    },

    image: {
      url: 'URL de la imagen',
      urlPlaceholder: 'https://ejemplo.com/imagen.jpg',
      altText: 'Texto alternativo',
      altTextPlaceholder: 'Describa la imagen',
      width: 'Ancho',
      height: 'Alto',
      alignment: 'Alineación',
      alignmentOptions: {
        left: 'Izquierda',
        center: 'Centro',
        right: 'Derecha',
      },
    },

    separator: {
      height: 'Alto',
      color: 'Color',
      style: 'Estilo',
      styleOptions: {
        solid: 'Sólido',
        dashed: 'Discontinuo',
        dotted: 'Punteado',
      },
    },

    spacer: {
      height: 'Alto',
      heightPlaceholder: '20px',
    },

    general: {
      backgroundColor: 'Color de fondo',
      textColor: 'Color del texto',
      borderColor: 'Color del borde',
      margin: 'Margen',
      padding: 'Relleno',
    },
  },

  section: {
    canvasDimensions: 'Dimensiones del lienzo',
    canvasAppearance: 'Apariencia del lienzo',
    defaultComponentStyles: 'Estilos predeterminados del componente',
    typography: 'Tipografía',
    bodyTypography: 'Tipografía del cuerpo',
    paragraphTypography: 'Tipografía del párrafo',
    headingTypography: 'Tipografía de encabezado',
    linkStyles: 'Estilos de enlace',
    buttonStyles: 'Estilos de botón',
    content: 'Contenido',
    styles: 'Estilos',
    advanced: 'Avanzado',
  },

  component: {
    button: {
      name: 'Botón',
      description: 'Un botón clicable con texto y enlace personalizables',
      presets: {
        primary: {
          name: 'Primario',
          description: 'Botón azul destacado para acciones primarias',
        },
        secondary: {
          name: 'Secundario',
          description: 'Botón gris sutil para acciones secundarias',
        },
        ghost: {
          name: 'Fantasma',
          description: 'Botón transparente con borde',
        },
      },
    },

    text: {
      name: 'Texto',
      description: 'Contenido de texto enriquecido con opciones de formato',
      presets: {
        paragraph: {
          name: 'Párrafo',
          description: 'Texto de párrafo estándar',
        },
        heading: {
          name: 'Encabezado',
          description: 'Texto de encabezado grande',
        },
        small: {
          name: 'Pequeño',
          description: 'Texto pequeño para notas al pie',
        },
      },
    },

    image: {
      name: 'Imagen',
      description: 'Mostrar imágenes con texto alternativo y alineación',
      presets: {
        standard: {
          name: 'Estándar',
          description: 'Imagen responsiva de ancho completo',
        },
        thumbnail: {
          name: 'Miniatura',
          description: 'Imagen miniatura pequeña',
        },
      },
    },

    separator: {
      name: 'Separador',
      description: 'Línea horizontal para separar contenido',
      presets: {
        thin: {
          name: 'Delgado',
          description: 'Separador sutil delgado',
        },
        thick: {
          name: 'Grueso',
          description: 'Separador grueso destacado',
        },
      },
    },

    spacer: {
      name: 'Espaciador',
      description: 'Espacio vertical entre componentes',
      presets: {
        small: {
          name: 'Pequeño',
          description: 'Espaciado pequeño (20px)',
        },
        medium: {
          name: 'Mediano',
          description: 'Espaciado mediano (40px)',
        },
        large: {
          name: 'Grande',
          description: 'Espaciado grande (60px)',
        },
      },
    },

    header: {
      name: 'Encabezado',
      description: 'Encabezado de correo con logo y marca',
      presets: {
        centered: {
          name: 'Centrado',
          description: 'Encabezado con logo centrado',
        },
        leftAligned: {
          name: 'Alineado a la izquierda',
          description: 'Logo alineado a la izquierda con menú',
        },
      },
    },

    footer: {
      name: 'Pie de página',
      description: 'Pie de página de correo con enlaces y derechos de autor',
      presets: {
        simple: {
          name: 'Simple',
          description: 'Pie de página simple con derechos de autor',
        },
        detailed: {
          name: 'Detallado',
          description: 'Pie de página con enlaces sociales y cancelar suscripción',
        },
      },
    },

    hero: {
      name: 'Héroe',
      description: 'Sección héroe grande con imagen y texto',
      presets: {
        imageBackground: {
          name: 'Fondo de imagen',
          description: 'Héroe con imagen de fondo',
        },
        colorBackground: {
          name: 'Fondo de color',
          description: 'Héroe con fondo de color sólido',
        },
      },
    },

    list: {
      name: 'Lista',
      description: 'Lista con viñetas o números',
      presets: {
        bulleted: {
          name: 'Con viñetas',
          description: 'Lista con puntos de viñeta',
        },
        numbered: {
          name: 'Numerada',
          description: 'Lista numerada',
        },
      },
    },

    cta: {
      name: 'Llamada a la acción',
      description: 'Sección destacada de llamada a la acción',
      presets: {
        centered: {
          name: 'Centrada',
          description: 'CTA centrada con botón',
        },
        split: {
          name: 'Dividida',
          description: 'Diseño dividido con imagen y CTA',
        },
      },
    },
  },

  message: {
    saveSuccess: 'Plantilla guardada con éxito',
    saveError: 'Error al guardar la plantilla',
    loadSuccess: 'Plantilla cargada con éxito',
    loadError: 'Error al cargar la plantilla',
    deleteSuccess: 'Plantilla eliminada con éxito',
    deleteError: 'Error al eliminar la plantilla',
    exportSuccess: 'Plantilla exportada con éxito',
    exportError: 'Error al exportar la plantilla',
    undoSuccess: 'Acción deshecha',
    redoSuccess: 'Acción rehecha',
    noUndoHistory: 'Nada que deshacer',
    noRedoHistory: 'Nada que rehacer',
    missingTranslation: 'Traducción faltante para la clave: {{key}}',
  },

  validation: {
    required: 'Este campo es obligatorio',
    invalidUrl: 'Por favor ingrese una URL válida',
    invalidEmail: 'Por favor ingrese un correo electrónico válido',
    invalidColor: 'Por favor ingrese un color válido',
    minValue: 'El valor debe ser al menos {{min}}',
    maxValue: 'El valor debe ser como máximo {{max}}',
  },
};

export default esES;

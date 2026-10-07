// Contenido de las 7 páginas de servicio y de las tarjetas de la home.
// Cada servicio se renderiza en /<slug>/ con src/templates/service.mjs.
//
// Estructura de `sections` (en orden de aparición, entre el hero y el FAQ):
//   bg: 'light' | 'white' | 'gray'
//   tag, title, headerIntro?  — encabezado de la sección
//   paragraphs?  — párrafos (HTML permitido)
//   bullets?     — feature bullets con palomita (HTML permitido), bulletsTitle? antecede la lista
//   cards?       — tarjetas sin número (p. ej. trimestres)
//   steps?       — tarjetas numeradas del paso a paso (sección ancha)

import { SERVICIOS_DATASET, formatPrecio } from './servicios-completos.mjs'
import { MOSTRAR_PRECIOS } from './site.mjs'

// Los precios de la página de orientación anticonceptiva salen del catálogo
// oficial de /servicios/, para que las dos páginas no puedan contradecirse.
// `nombre` es el principio del nombre en el catálogo (el de Kyleena es largo).
const SERVICIOS_CATALOGO = SERVICIOS_DATASET.categorias.flatMap((c) => c.servicios)

function precio(nombre) {
  const s = SERVICIOS_CATALOGO.find((x) => x.nombre.startsWith(nombre))
  if (!s) throw new Error('El catálogo no tiene el servicio: ' + nombre)
  return s
}

function mxn(nombre, campo = 'costo_regular') {
  const monto = formatPrecio(precio(nombre)[campo])
  if (!monto) throw new Error(`El servicio «${nombre}» no tiene ${campo}`)
  return monto
}

const CATALOGO = [
  {
    slug: 'consulta-ginecologica',
    nombre: 'Consulta ginecológica',
    title: 'Consulta Ginecológica en Polanco CDMX | Dra. Lidia Chávez',
    description:
      'Consulta ginecológica en Polanco y CDMX con la Dra. Lidia Chávez. Valoración integral de primera vez y seguimiento. Agenda tu cita médica fácil por WhatsApp.',
    ogAlt: 'Dra. Lidia Chávez - Consulta Ginecológica en Polanco CDMX',
    logoAlt: 'Logo Dra. Lidia Chávez - Ginecóloga en Polanco CDMX',
    waText: 'Hola, quiero agendar una consulta ginecológica con la Dra. Lidia. ¿Qué horarios tienen disponibles?',
    tagline: 'Atención Médica Especializada',
    h1: 'Consulta ginecológica en Polanco, CDMX',
    // Hero: una frase y tres beneficios. Lo largo vive en las secciones.
    heroP:
      'Una consulta sin prisas, con explicaciones claras y trato sin juicios, para tu primera vez o tu seguimiento.',
    heroPuntos: ['Primera vez o seguimiento', 'Exploración y receta incluidas', 'Confidencial y sin juicios'],
    procedure: {
      name: 'Consulta ginecológica',
      description:
        'Atención médica integral para valoración, orientación y seguimiento de la salud ginecológica femenina.',
      bodyLocation: 'Pelvis y aparato reproductor femenino',
      specialty: 'Gynecologic',
    },
    cardDesc:
      'Atención médica para valoración, orientación y seguimiento personalizado de la salud ginecológica.',
    cardAlt: 'Consulta ginecológica en Polanco CDMX',
    otroDesc: 'Atención médica para valoración, diagnóstico y seguimiento personalizado.',
    // El precio lo antepone service.mjs desde el catálogo de /servicios/.
    datosClave: [
      { label: 'Modalidad', valor: 'Primera vez o seguimiento' },
      { label: 'Incluye', valor: 'Signos vitales, historial, exploración y receta' },
      { label: 'Preparación', valor: 'Ropa cómoda y fecha de tu última regla' },
    ],
    landingCompacta: true,
    // Texto único de todos los botones de WhatsApp de la landing, como pidió la
    // clienta (el brief pide no tener CTAs distintos compitiendo entre sí).
    ctaWa: 'Agendar mi cita',
    sections: [
      {
        bg: 'light',
        tag: 'Valoración Médica Integral',
        title: '¿Qué se revisa en una consulta ginecológica?',
        paragraphs: [
          'Con la Dra. Lidia Chávez, ginecóloga en Polanco, cada consulta se brinda en un ambiente de absoluta confidencialidad, respeto y comunicación clara.',
          'Se revisan tu historial de salud y los síntomas que presentes, y se efectúa una exploración física respetuosa orientada a prevenir o tratar a tiempo cualquier molestia o síntoma pélvico.',
        ],
      },
      {
        bg: 'white',
        tag: 'Etapas de Atención',
        title: 'Consulta de primera vez vs. Cita de seguimiento',
        cards: [
          {
            title: 'Consulta de primera vez',
            text: 'Construimos tu historial clínico completo. Conversamos sobre antecedentes, estilo de vida, dudas iniciales sin prisas y determinamos la necesidad de estudios preventivos según tu edad.',
          },
          {
            title: 'Consulta de seguimiento',
            text: 'Monitoreamos tu evolución clínica tras iniciar un tratamiento prescrito, analizamos estudios de laboratorio solicitados y confirmamos la resolución exitosa de tus síntomas.',
          },
        ],
      },
      {
        bg: 'gray',
        tag: 'Motivos de Visita',
        title: 'Motivos más frecuentes para acudir a consulta ginecológica',
        bullets: [
          'Chequeo preventivo anual de rutina.',
          'Alteraciones menstruales o cólicos intensos.',
          'Molestias o cambios en el flujo genital.',
          'Asesoría de métodos anticonceptivos.',
          'Planeación preconcepcional de embarazo.',
        ],
      },
      {
        bg: 'white',
        tag: 'Proceso Claro',
        title: 'Cómo es la consulta paso a paso con la ginecóloga en Polanco',
        steps: [
          { title: 'Agendamiento por WhatsApp', text: 'Contactas al consultorio y confirmamos tu cita de manera inmediata.' },
          { title: 'Valoración médica inicial', text: 'Plática detallada sobre tus síntomas e historial de salud.' },
          { title: 'Exploración clínica', text: 'Revisión médica profesional realizada con técnica suave e instrumental estéril.' },
          { title: 'Diagnóstico e indicaciones', text: 'Explicaciones médicas claras y plan de tratamiento personalizado.' },
        ],
      },
    ],
    faqBg: 'white',
    faqTag: 'Resuelve tus Dudas',
    faqTitle: 'Preguntas frecuentes sobre la consulta ginecológica en CDMX',
    // Precio y forma de agendar van primero: son las dos dudas que más frenan
    // a quien llega desde un anuncio. Los montos salen del catálogo.
    faqs: [
      {
        q: '¿Cuánto cuesta la consulta ginecológica?',
        // Sin precios, la respuesta lleva a WhatsApp: preguntar el costo ya es
        // un contacto (ver MOSTRAR_PRECIOS en site.mjs).
        a: MOSTRAR_PRECIOS
          ? `La consulta de primera vez cuesta ${
              precio('Primera vez').costo_promocion
                ? `${mxn('Primera vez', 'costo_promocion')} MXN en promoción (precio regular ${mxn('Primera vez')} MXN)`
                : `${mxn('Primera vez')} MXN`
            } y la de seguimiento ${mxn('Subsecuente')} MXN. Los demás costos están en la página de Costos y Servicios.`
          : 'Escríbenos por WhatsApp y te compartimos el costo de la consulta y las promociones vigentes, junto con los horarios disponibles. Preguntar no te compromete a nada.',
      },
      {
        q: '¿Cómo agendo mi cita?',
        a: 'Escríbenos por WhatsApp al 55 1476 7298. Te compartimos los horarios disponibles y confirmamos tu cita, normalmente el mismo día.',
      },
      {
        q: '¿Cada cuánto debo agendar una consulta ginecológica en CDMX?',
        a: 'Se recomienda acudir a una consulta ginecológica en CDMX al menos una vez al año como medida preventiva, o de forma inmediata si presentas dolor pélvico o alteraciones menstruales.',
      },
      {
        q: '¿Cuál es la diferencia entre consulta de primera vez y seguimiento?',
        a: 'En la primera vez se elabora el historial clínico completo y valoración general. En seguimiento se evalúa la evolución de un tratamiento o resolución de síntomas.',
      },
      {
        q: '¿Qué debo llevar a mi consulta con la ginecóloga en Polanco?',
        a: 'Identificación oficial, fecha de tu última regla y, si cuentas con ellos, resultados de laboratorios o ultrasonidos pélvicos anteriores.',
      },
      {
        q: '¿Puedo acudir a consulta con mi periodo menstrual?',
        a: 'Por síntomas urgentes sí. Si se planea tomar Papanicolaou, es recomendable agendar en días posteriores al término del sangrado.',
      },
      {
        q: '¿La revisión ginecológica en consultorio produce dolor?',
        a: 'No produce dolor. La valoración se realiza con gentileza e instrumental estéril adecuado cuidando tu tranquilidad.',
      },
    ],
    galeria: [
      'Consultorio ginecológico y atención inicial',
      'Espacio de valoración privada en Polanco',
      'Atención médica empática y profesional',
      'Revisión de historial clínico y diagnóstico',
      'Orientación ginecológica personalizada',
      'Explicación médica sin prisas',
      'Instalaciones estériles y cómodas',
      'Consulta preventiva y de seguimiento',
      'Evaluación clínica de alta precisión',
      'Atención humana en Aurafem Polanco',
    ],
    confianzaBullet: 'Consulta ginecológica profesional',
    confianzaCta: 'Agendar consulta ginecológica por WhatsApp',
    otrosTag: 'Atención Integral',
    otrosIntro: 'Conoce los demás servicios y estudios preventivos que ofrece la Dra. Lidia Chávez en Polanco, CDMX.',
    ctaTitle: 'Agenda tu consulta ginecológica por WhatsApp',
  },

  {
    slug: 'papanicolaou',
    nombre: 'Papanicolaou',
    title: 'Papanicolaou en CDMX y Polanco | Dra. Lidia Chávez',
    description:
      'Papanicolaou en CDMX y Polanco con la Dra. Lidia Chávez. Detección oportuna, preparación clara y entrega rápida de resultados. Agenda tu cita por WhatsApp.',
    ogAlt: 'Dra. Lidia Chávez - Papanicolaou en CDMX Polanco',
    logoAlt: 'Logo Dra. Lidia Chávez - Papanicolaou en Polanco CDMX',
    waText: 'Hola, quiero agendar un Papanicolaou con la Dra. Lidia. ¿Qué horarios tienen disponibles?',
    tagline: 'Detección Preventiva Cervical',
    h1: 'Papanicolaou en Polanco, CDMX',
    heroP:
      'Detecta a tiempo cualquier alteración del cuello uterino con un estudio rápido, sin dolor y con instrumental estéril.',
    heroPuntos: ['Toma en unos 3 minutos', 'Resultados en 5 a 7 días hábiles', 'Instrumental de un solo uso'],
    procedure: {
      name: 'Papanicolaou',
      description:
        'Estudio citológico preventivo en cuello uterino para la detección oportuna de alteraciones celulares.',
      bodyLocation: 'Cuello uterino',
      specialty: 'Gynecologic',
    },
    cardDesc:
      'Estudio preventivo y fundamental para la detección oportuna de alteraciones en el cuello uterino.',
    cardAlt: 'Papanicolaou en CDMX y Polanco',
    otroDesc: 'Estudio preventivo para la detección oportuna de alteraciones en el cuello uterino.',
    datosClave: [
      { label: 'Toma de muestra', valor: 'Alrededor de 3 minutos' },
      { label: 'Resultados', valor: 'En pocos días hábiles' },
      { label: 'Frecuencia', valor: 'Cada 12 meses' },
      { label: 'Preparación', valor: 'Sin regla y sin óvulos 48 h antes' },
    ],
    landingCompacta: true,
    sections: [
      {
        bg: 'light',
        tag: 'Fundamento Médico',
        title: '¿Para qué sirve el examen de Papanicolaou en CDMX?',
        paragraphs: [
          'El Papanicolaou (citología cervical) es una prueba preventiva que toma una pequeña muestra de células del cuello uterino para ser estudiadas bajo el microscopio por patólogos certificados.',
          'Su función es identificar alteraciones celulares iniciales provocadas por el Virus del Papiloma Humano (VPH). Al detectar estas anomalías a tiempo, es posible brindar un tratamiento preventivo que evita complicaciones mayores.',
        ],
      },
      {
        bg: 'white',
        tag: 'Frecuencia Recomendada',
        title: '¿Cada cuánto tiempo se debe realizar el Papanicolaou?',
        bullets: [
          '<strong>Control anual de rutina:</strong> Se recomienda cada 12 meses desde el inicio de la vida sexual activa o a partir de los 21 años.',
          '<strong>Seguimiento médico:</strong> Si hubo alguna alteración, el seguimiento médico se define de forma individualizada.',
        ],
      },
      {
        bg: 'gray',
        tag: 'Ubicación e Indicaciones',
        title: '¿Dónde hacerse el Papanicolaou en Polanco y cómo prepararte?',
        paragraphs: [
          'Si te preguntas <strong>dónde hacerte el Papanicolaou</strong> en Polanco o Anzures, el consultorio de la Dra. Lidia Chávez en Aurafem cuenta con instrumental estéril de un solo uso y un ambiente seguro.',
        ],
        bulletsTitle: 'Preparación previa indispensable:',
        bullets: [
          '<strong>Sin sangrado menstrual:</strong> Agenda de 3 a 5 días después de haber concluido tu periodo.',
          '<strong>Sin productos vaginales:</strong> Suspende cremas, óvulos o duchas 48 horas antes.',
          '<strong>Abstención previa:</strong> Evita relaciones sexuales 24 a 48 horas antes de la prueba.',
        ],
      },
      {
        bg: 'white',
        tag: 'Reporte de Laboratorio',
        title: 'Tiempo de entrega de resultados y pasos posteriores',
        paragraphs: [
          'La muestra se envía a patología y se entrega en pocos días hábiles (de 5 a 7) con una explicación breve de la especialista.',
        ],
      },
      {
        bg: 'light',
        tag: 'Proceso Médico',
        title: 'El procedimiento del Papanicolaou paso a paso',
        steps: [
          { title: 'Cita por WhatsApp', text: 'Agendas fuera de tus días menstruales rápidamente.' },
          { title: 'Preparación en consultorio', text: 'En un espacio privado te explicamos el procedimiento.' },
          { title: 'Toma de muestra suave', text: 'Uso de espéculo estéril y recolección celular en 3 minutos.' },
          { title: 'Entrega de informe', text: 'Recibes tu resultado patológico con una breve explicación; si tienes dudas, puedes agendar consulta.' },
        ],
      },
    ],
    faqBg: 'white',
    faqTag: 'Dudas Frecuentes',
    faqTitle: 'Preguntas frecuentes sobre el Papanicolaou en CDMX',
    faqs: [
      {
        q: '¿Cada cuánto tiempo se debe realizar el Papanicolaou en CDMX?',
        a: 'Se recomienda realizar el Papanicolaou al menos una vez al año a partir del inicio de la vida sexual activa o desde los 21 años.',
      },
      {
        q: '¿Dónde hacerse el Papanicolaou en Polanco con seguridad?',
        a: 'En el consultorio de la Dra. Lidia Chávez en Aurafem (Polanco / Anzures, CDMX). El estudio se efectúa con instrumental estéril y técnica gentil.',
      },
      {
        q: '¿Para qué sirve exactamente el estudio de Papanicolaou?',
        a: 'Sirve para examinar la morfología de las células del cuello uterino, detectando lesiones inflamatorias o atipias celulares provocadas por el VPH.',
      },
      {
        q: '¿En cuánto tiempo entregan los resultados?',
        a: 'Los resultados procesados por patología especializada se entregan en pocos días hábiles con una explicación médica comprensible.',
      },
      {
        q: '¿Cuáles son las indicaciones de preparación previa?',
        a: 'Acudir sin menstruación activa, suspender el uso de duchas u óvulos vaginales 48 horas antes y abstenerse de mantener relaciones sexuales 24 a 48 horas previas.',
      },
    ],
    galeria: [
      'Toma de citología cervical preventiva',
      'Instrumental médico estéril y desechable',
      'Preparación para el estudio de Papanicolaou',
      'Muestras citológicas para patología',
      'Explicación de resultados de Papanicolaou',
      'Procedimiento citológico suave y rápido',
      'Prevención oportuna de alteraciones en cérvix',
      'Espacio privado y confiable en Polanco',
      'Análisis especializado en laboratorio patológico',
      'Cuidado preventivo anual para mujeres',
    ],
    confianzaBullet: 'Estudio citológico riguroso y profesional',
    confianzaCta: 'Agendar Papanicolaou por WhatsApp',
    ctaTitle: 'Agenda tu Papanicolaou por WhatsApp',
  },

  {
    slug: 'colposcopia',
    nombre: 'Colposcopía',
    title: 'Colposcopía en Polanco, CDMX | Dra. Lidia Chávez',
    description:
      'Colposcopía en Polanco y CDMX con la Dra. Lidia Chávez. Diagnóstico de alta precisión ante Papanicolaou alterado o VPH. Agenda tu consulta hoy por WhatsApp.',
    ogAlt: 'Dra. Lidia Chávez - Colposcopía en Polanco CDMX',
    logoAlt: 'Logo Dra. Lidia Chávez - Colposcopía en Polanco CDMX',
    waText: 'Hola, quiero agendar una colposcopía con la Dra. Lidia. ¿Qué horarios tienen disponibles?',
    tagline: 'Evaluación Visual Especializada',
    h1: 'Colposcopía en Polanco, CDMX',
    heroP:
      'Si tu Papanicolaou salió alterado o tienes VPH, la colposcopía muestra con precisión qué pasa y qué sigue.',
    heroPuntos: ['No genera dolor', 'Resultado explicado en consulta', 'Biopsia solo si hace falta'],
    procedure: {
      name: 'Colposcopía',
      description:
        'Exploración óptica directa del cuello uterino con colposcopio médico especializado ante Papanicolaou alterado o VPH.',
      bodyLocation: 'Cuello uterino',
      specialty: 'Gynecologic',
    },
    cardDesc:
      'Evaluación altamente especializada del cuello uterino cuando se requiere una revisión visual más profunda.',
    cardAlt: 'Colposcopía en Polanco CDMX',
    otroDesc: 'Evaluación visual especializada del tracto genital inferior con equipo de alta precisión.',
    datosClave: [
      { label: 'Indicada tras', valor: 'Papanicolaou alterado o VPH' },
      { label: 'Molestias', valor: 'No genera dolor' },
      { label: 'Biopsia', valor: 'Solo si se observa zona atípica' },
      { label: 'Preparación', valor: 'Sin sangrado y sin óvulos 48 h antes' },
    ],
    landingCompacta: true,
    sections: [
      {
        bg: 'light',
        tag: 'Precisión Diagnóstica',
        title: '¿Qué es la colposcopía y cómo se realiza?',
        paragraphs: [
          'La colposcopía es un estudio ginecológico que permite examinar visualmente y en tiempo real el cuello uterino, la vagina y la vulva mediante un colposcopio con lentes de magnificación que permite valorar con más precisión la zona a estudiar.',
          'Durante la realización de la <strong>colposcopía</strong>, la ginecóloga aplica soluciones contrastantes (ácido acético y Lugol) que resaltan áreas con tejido alterado o lesiones por VPH, permitiendo identificar su ubicación exacta.',
        ],
      },
      {
        bg: 'white',
        tag: 'Indicaciones Médicas',
        title: '¿Cuándo se indica realizar una colposcopía en Polanco?',
        bullets: [
          '<strong>Papanicolaou alterado:</strong> Reportes citológicos con presencia de células atípicas o displasias.',
          '<strong>Diagnóstico de VPH:</strong> Detección de lesiones de bajo o alto grado, o de verrugas genitales.',
          '<strong>Sangrado poscoital:</strong> Presencia de sangrado inusual posterior a relaciones sexuales.',
          '<strong>Seguimiento médico:</strong> Monitoreo posterior a tratamientos cervicales previos.',
        ],
      },
      {
        bg: 'light',
        tag: 'Indicaciones Previas',
        title: 'Preparación recomendada antes de tu colposcopía',
        bullets: [
          'Agendar sin sangrado menstrual activo.',
          'No colocar cremas u óvulos vaginales 48 horas antes.',
          'Suspender relaciones sexuales 24 a 48 horas previas.',
        ],
      },
      {
        bg: 'gray',
        tag: 'Respuestas Claras',
        title: '¿La colposcopía duele? ¿En qué consiste la biopsia?',
        paragraphs: [
          'La <strong>colposcopía en Polanco</strong> no genera dolor. Al colocarse el espéculo se siente la misma presión suave que en una citología convencional.',
          'Si la Dra. Lidia Chávez observa una zona atípica que requiera confirmación, realiza una toma de biopsia dirigida (muestra milimétrica para patología), donde se percibe un breve cólico similar al dolor menstrual.',
        ],
      },
      {
        bg: 'white',
        tag: 'Pasos del Estudio',
        title: 'El procedimiento de la colposcopía paso a paso',
        steps: [
          { title: 'Coordinación de cita', text: 'Agendas por WhatsApp asegurando acudir fuera de tu ciclo menstrual.' },
          { title: 'Revisión de estudios', text: 'En consultorio analizamos tus citologías o laboratorios previos.' },
          { title: 'Inspección óptica', text: 'Evaluación colposcópica directa con soluciones de contraste visual.' },
          { title: 'Reporte e indicación', text: 'Explicación inmediata de las imágenes observadas y plan médico.' },
        ],
      },
    ],
    faqBg: 'white',
    faqTag: 'Preguntas Frecuentes',
    faqTitle: 'Dudas comunes sobre la colposcopía en Polanco / CDMX',
    faqs: [
      {
        q: '¿Cuándo está recomendada una colposcopía en CDMX?',
        a: 'Está indicada ante un Papanicolaou alterado, diagnóstico de VPH, sangrado poscoital o lesiones visibles.',
      },
      {
        q: '¿El examen de colposcopía en Polanco causa dolor?',
        a: 'No es dolorosa. El colposcopio se coloca fuera del cuerpo. La solución contraste genera solo un breve hormigueo temporal.',
      },
      {
        q: '¿En qué casos se toma una biopsia?',
        a: 'Únicamente si se observa una zona atípica que requiera análisis en laboratorio patológico.',
      },
      {
        q: '¿En qué se diferencia de un Papanicolaou?',
        a: 'El Papanicolaou colecta células microscópicas y la colposcopía es la inspección óptica directa del tejido cervical.',
      },
      {
        q: '¿Cómo agendar mi colposcopía en Polanco?',
        a: 'Envíanos un mensaje por WhatsApp y coordinaremos tu cita en Aurafem en el horario de tu preferencia.',
      },
    ],
    galeria: [
      'Equipo óptico de colposcopía de alta precisión',
      'Inspección visual directa del cuello uterino',
      'Aplicación de soluciones contrastantes',
      'Diagnóstico en tiempo real ante Papanicolaou alterado',
      'Evaluación de lesiones acetoblancas o por VPH',
      'Toma de biopsia dirigida sin molestias',
      'Explicación médica de las imágenes obtenidas',
      'Tecnología médica avanzada en Polanco',
      'Monitoreo preventivo del epitelio cervical',
      'Atención colposcópica profesional y ética',
    ],
    confianzaBullet: 'Estudio colposcópico especializado',
    confianzaCta: 'Agendar colposcopía por WhatsApp',
    ctaTitle: 'Agenda tu colposcopía por WhatsApp',
  },

  {
    slug: 'control-prenatal',
    nombre: 'Control prenatal',
    title: 'Control Prenatal en CDMX y Polanco | Dra. Lidia Chávez',
    description:
      'Control prenatal en CDMX y Polanco con la Dra. Lidia Chávez. Monitoreo materno-fetal por trimestre, estudios y ecografía. Agenda tu cita médica por WhatsApp.',
    ogAlt: 'Dra. Lidia Chávez - Control Prenatal en CDMX Polanco',
    logoAlt: 'Logo Dra. Lidia Chávez - Control Prenatal en Polanco CDMX',
    waText: 'Hola, quiero agendar mi control prenatal con la Dra. Lidia. ¿Qué horarios tienen disponibles?',
    tagline: 'Control y Seguimiento de Embarazo',
    h1: 'Control prenatal en Polanco, CDMX',
    heroP:
      'Seguimiento de tu embarazo de principio a fin, con rastreo del bebé en cada consulta y explicaciones claras.',
    heroPuntos: ['Rastreo del bebé en cada cita', 'Del primer trimestre al parto', 'Estudios y suplementos indicados'],
    procedure: {
      name: 'Control prenatal',
      description:
        'Seguimiento médico continuo y estructurado durante el embarazo para la vigilancia del crecimiento fetal y la salud materna.',
      specialty: 'Obstetric',
    },
    cardDesc:
      'Seguimiento obstétrico durante y posterior al embarazo para cuidar rigurosamente de la salud materna y fetal.',
    cardAlt: 'Control prenatal en CDMX y Polanco',
    otroDesc: 'Seguimiento médico mes a mes para el bienestar de la mamá y el bebé durante el embarazo.',
    datosClave: [
      { label: 'Inicio ideal', valor: 'Semanas 6 a 8 de gestación' },
      { label: 'Frecuencia', valor: 'Mensual, luego quincenal y semanal' },
      { label: 'Incluye', valor: 'Rastreo obstétrico (sin reporte) y revisión materna' },
      { label: 'Seguimiento', valor: 'Del primer trimestre al parto' },
    ],
    landingCompacta: true,
    sections: [
      {
        bg: 'light',
        tag: 'Atención por Etapas',
        title: 'Calendario de consultas y seguimiento por trimestre',
        paragraphs: [
          'El <strong>control prenatal CDMX</strong> es la herramienta médica preventiva más valiosa para garantizar un embarazo saludable. Su objetivo es detectar factores de riesgo y vigilar el crecimiento fetal.',
        ],
        cards: [
          {
            title: 'Primer trimestre (Semanas 1 a 13)',
            text: 'Confirmación de edad gestacional, ubicación del saco embrionario, fecha probable de parto, laboratorios iniciales y ultrasonido de las semanas 11 a 14.',
          },
          {
            title: 'Segundo trimestre (Semanas 14 a 27)',
            text: 'Monitoreo del crecimiento del bebé, ultrasonido estructural (semana 18-22), tamiz de glucosa y medición de presión arterial.',
          },
          {
            title: 'Tercer trimestre (Semanas 28 al parto)',
            text: 'Consultas quincenales y semanales. Revisión de líquido amniótico, posición del bebé, salud placentaria y plan de nacimiento.',
          },
        ],
      },
      {
        bg: 'white',
        tag: 'Estudios de Laboratorio',
        title: 'Estudios habituales en el seguimiento prenatal',
        bullets: [
          '<strong>Pruebas de sangre:</strong> Biometría hemática, química sanguínea, grupo y Rh.',
          '<strong>Examen de orina:</strong> Descarte oportuno de infecciones de vías urinarias.',
          '<strong>Tamiz de glucosa:</strong> Detección temprana de diabetes gestacional.',
          '<strong>Monitoreo ecográfico:</strong> Evaluación de peso fetal, frecuencia cardíaca fetal, placenta y líquido amniótico.',
        ],
      },
      {
        bg: 'gray',
        tag: 'Paso a Paso',
        title: 'Tu consulta prenatal en Polanco paso a paso',
        steps: [
          { title: 'Agendamiento por WhatsApp', text: 'Coordinamos tu cita mensual o quincenal respetando tu agenda.' },
          { title: 'Signos vitales', text: 'Toma de presión arterial y control del incremento de peso.' },
          { title: 'Revisión clínica y fetal', text: 'Medición del fondo uterino, rastreo obstétrico para revisar al bebé y revisión de laboratorios.' },
          { title: 'Orientación y receta', text: 'Indicación de suplementos médicos y fecha de tu siguiente control.' },
        ],
      },
      {
        bg: 'white',
        tag: 'Cuidado Integral',
        title: 'Beneficios del acompañamiento prenatal especializado',
        paragraphs: [
          'Prevención y detección temprana de patologías que pudieran poner en riesgo a la mamá (hipertensión, preeclampsia) y al bebé (restricción de crecimiento). Monitoreamos la correcta nutrición materna y te guiamos en los preparativos para el nacimiento.',
        ],
      },
    ],
    faqBg: 'light',
    faqTag: 'Preguntas Frecuentes',
    faqTitle: 'Dudas comunes sobre el control prenatal en CDMX',
    faqs: [
      {
        q: '¿Cuándo se debe iniciar el control prenatal en CDMX?',
        a: 'Lo ideal es agendar tu primera consulta inmediatamente después de confirmar tu embarazo con prueba positiva, preferentemente entre las semanas 6 y 8 de gestación.',
      },
      {
        q: '¿Cuál es el calendario habitual de visitas con el ginecólogo de control prenatal en Polanco?',
        a: 'Durante el primer y segundo trimestre las visitas son mensuales. Dependiendo de los factores de riesgo, a partir de la semana 28 se pueden volver quincenales, y desde la semana 36 son semanales.',
      },
      {
        q: '¿Qué estudios son indispensables durante el embarazo?',
        a: 'Incluye biometría hemática, química sanguínea, grupo y RH, examen de orina, prueba de tamiz de glucosa y ultrasonidos genético y estructural.',
      },
      {
        q: '¿Qué suplementación médica se prescribe en las consultas prenatales?',
        a: 'Se prescribe ácido fólico, hierro y multivitamínicos según la condición clínica individual de cada mamá.',
      },
      {
        q: '¿Cómo puedo agendar mi seguimiento con la Dra. Lidia Chávez?',
        a: 'Puedes enviar un mensaje directo a través de WhatsApp para agendar tu consulta prenatal en Aurafem (Polanco / Anzures) en el horario que mejor te acomode.',
      },
    ],
    galeria: [
      'Monitoreo materno-fetal mes a mes',
      'Registro de presión arterial y signos vitales',
      'Ecografía médica y seguimiento del bebé',
      'Revisión de análisis de laboratorio prenatal',
      'Medición del crecimiento uterino',
      'Prescripción de suplementos e hidratación',
      'Atención personalizada por trimestre',
      'Orientación sobre tamiz y estudios genéticos',
      'Cuidado prenatal integral en Polanco',
      'Acompañamiento cercano para mamás',
    ],
    confianzaBullet: 'Seguimiento maternofetal profesional',
    confianzaCta: 'Agendar control prenatal por WhatsApp',
    ctaTitle: 'Agenda tu control prenatal por WhatsApp',
  },

  {
    slug: 'orientacion-anticonceptiva',
    nombre: 'Orientación anticonceptiva',
    title: 'Orientación Anticonceptiva Polanco CDMX | Dra. Lidia Chávez',
    description:
      'Orientación anticonceptiva en Polanco y CDMX con la Dra. Lidia Chávez. DIU, implante, pastillas y más, elegidos para ti. Agenda tu consulta por WhatsApp.',
    ogAlt: 'Dra. Lidia Chávez - Orientación anticonceptiva en Polanco CDMX',
    logoAlt: 'Logo Dra. Lidia Chávez - Orientación Anticonceptiva en Polanco CDMX',
    waText: 'Hola, quiero agendar una consulta de orientación anticonceptiva con la Dra. Lidia. ¿Qué horarios tienen disponibles?',
    tagline: 'Salud Sexual y Reproductiva',
    h1: 'Orientación anticonceptiva en Polanco, CDMX',
    heroP:
      'Elige el método anticonceptivo que de verdad se adapta a ti, con información clara y sin presión.',
    heroPuntos: ['DIU, implante, pastillas y más', 'Colocación en consultorio', 'Confidencial y sin juicios'],
    procedure: {
      name: 'Orientación anticonceptiva',
      description:
        'Consulta médica para elegir el método anticonceptivo más adecuado según tu salud, tu edad y tus planes de embarazo, con colocación de DIU e implante subdérmico en consultorio.',
      specialty: 'Gynecologic',
    },
    cardDesc:
      'Asesoría personalizada para elegir el método anticonceptivo que mejor se adapte a tu salud, necesidades y proyecto de vida.',
    cardAlt: 'Orientación anticonceptiva en Polanco CDMX',
    cardWaText: 'Hola Dra. Lidia, quiero informes sobre orientación anticonceptiva',
    otroDesc: 'Te ayudamos a elegir el método anticonceptivo ideal para tu salud y tu proyecto de vida.',
    datosClave: [
      { label: 'Métodos', valor: 'DIU, implante, pastillas y más' },
      { label: 'En consultorio', valor: 'Colocación de DIU e implante' },
      { label: 'Incluye', valor: 'Valoración y orientación personalizada' },
    ],
    sections: [
      {
        bg: 'light',
        tag: 'Métodos Disponibles',
        title: '¿Qué método anticonceptivo puedes elegir?',
        paragraphs: [
          'No existe un método que sea el mejor para todas. El adecuado es el que se ajusta a tu salud, a tu etapa de vida y a lo que esperas de él. En la consulta se te explican las opciones para que decidas con información clara.',
          'El preservativo es el único método que además protege contra infecciones de transmisión sexual, así que también se comenta en consulta y puede combinarse con cualquiera de los demás.',
        ],
        cards: [
          {
            title: 'DIU: con o sin hormonas',
            text: 'Dispositivo en forma de T que se coloca dentro del útero en el consultorio. Hay opciones sin hormonas (cobre y plata) y hormonales (Kyleena y Mirena, de unos 5 años de duración). Se retira cuando tú lo decidas.',
          },
          {
            title: 'Implante subdérmico',
            text: 'Varilla delgada y flexible que se coloca bajo la piel del brazo. Libera hormona de forma continua y protege alrededor de 3 años, sin tener que recordar nada. Se retira cuando quieras.',
          },
          {
            title: 'Pastillas, parche, anillo e inyección',
            text: 'Métodos hormonales que requieren constancia: pastillas (diarias), parche (semanal), anillo vaginal (mensual) e inyección. Se explica cómo funciona cada uno y se receta el que mejor se ajuste a tu salud y a tus hábitos.',
          },
        ],
      },
      {
        bg: 'white',
        tag: 'Motivos de Visita',
        title: 'Motivos frecuentes para pedir una orientación anticonceptiva',
        bullets: [
          '<strong>Quieres empezar a usar un método:</strong> por primera vez, al iniciar tu vida sexual o después de una pausa.',
          '<strong>Tu método actual no te convence:</strong> te causa molestias, sangrados irregulares o se te olvida con frecuencia.',
          '<strong>Buscas algo de larga duración:</strong> un DIU o un implante para despreocuparte durante años.',
          '<strong>Acabas de tener un bebé:</strong> quieres elegir un método compatible con el posparto y la lactancia.',
          '<strong>Quieres cambiar o retirar tu DIU o implante:</strong> o dejar el método porque planeas un embarazo.',
        ],
      },
      {
        bg: 'gray',
        tag: 'Tu Consulta',
        title: '¿Qué incluye la consulta de orientación anticonceptiva?',
        paragraphs: [
          'Es una consulta sin prisas, pensada para que elijas tú con toda la información. La Dra. Lidia Chávez revisa tu historial de salud (presión arterial, migrañas, antecedentes familiares, medicamentos y si fumas) porque algunos métodos no son adecuados en ciertas condiciones. También platican sobre tu ciclo menstrual, el método que usas hoy y tus planes de embarazo.',
          'Con esa información se te explican las opciones que sí son buenas para ti, cómo funcionan, qué tan efectivas son y qué molestias pueden causar. Si eliges pastillas u otro método hormonal, sales con tu indicación y tu receta. Si eliges DIU o implante, se coordina su colocación en el consultorio. Y si prefieres pensarlo con calma, también está bien.',
        ],
      },
      {
        bg: 'white',
        tag: 'Paso a Paso',
        title: 'Tu orientación anticonceptiva en Polanco paso a paso',
        steps: [
          { title: 'Agenda por WhatsApp', text: 'Escribes al consultorio y eliges el día y la hora que mejor te acomoden.' },
          { title: 'Platicamos de ti', text: 'Revisamos tu historial, tu ciclo, el método que usas (si tienes uno) y tus planes de embarazo.' },
          { title: 'Conoces tus opciones', text: 'Te explicamos cómo funciona cada método, su efectividad, sus ventajas y sus posibles molestias.' },
          { title: 'Eliges y te indicamos cómo seguir', text: 'Decides tu método; si es de prescripción sales con tu receta, y si es DIU o implante coordinamos su colocación.' },
        ],
      },
      // La lista de costos solo se muestra con MOSTRAR_PRECIOS (site.mjs).
      ...(MOSTRAR_PRECIOS
        ? [
          {
            bg: 'light',
            tag: 'Costos Claros',
            title: '¿Cuánto cuesta la consulta y la colocación del método?',
            paragraphs: [
              `La consulta de orientación anticonceptiva cuesta <strong>${mxn('Orientación anticonceptiva')} MXN</strong>${
                precio('Orientación anticonceptiva').costo_promocion
                  ? ` (promoción actual: <strong>${mxn('Orientación anticonceptiva', 'costo_promocion')} MXN</strong>)`
                  : ''
              }.`,
              'La colocación o el retiro de un DIU o de un implante se cobra aparte y <strong>no incluye la consulta</strong>. Consulta el detalle completo en el <a href="/servicios/#cat-metodos-anticonceptivos" class="font-semibold text-oro-rosa-profundo hover:underline">catálogo de Costos y Servicios</a>.',
            ],
            bulletsTitle: 'Costo de colocación y retiro (sin consulta):',
            bullets: [
              `<strong>DIU de cobre:</strong> ${mxn('DIU de cobre')}`,
              `<strong>DIU de plata:</strong> ${mxn('DIU de plata')}`,
              `<strong>DIU Kyleena:</strong> ${mxn('DIU Kyleena')} (se solicita con 7 días de anticipación y se aparta con un anticipo)`,
              `<strong>DIU Mirena:</strong> ${mxn('DIU Mirena')}`,
              `<strong>Implante subdérmico:</strong> ${mxn('Implante Subdérmico')}`,
              `<strong>Retiro de DIU:</strong> ${mxn('Retiro de DIU')} (${mxn('Retiro de DIU', 'costo_con_anestesia_local')} con anestesia local)`,
              `<strong>Retiro de implante:</strong> ${mxn('Retiro de implante')}`,
            ],
          },
          ]
        : []),
    ],
    faqBg: 'white',
    faqTag: 'Preguntas Frecuentes',
    faqTitle: 'Dudas comunes sobre los métodos anticonceptivos',
    faqs: [
      {
        q: '¿Cuál es el mejor método anticonceptivo?',
        a: 'No hay uno mejor para todas. El ideal depende de tu salud, tu edad, si has tenido hijos, si quieres embarazarte pronto o más adelante y de con cuál te sientes más cómoda. El DIU y el implante están entre los más efectivos porque no dependen de recordar una toma diaria, pero en consulta se revisan todas las opciones para elegir la tuya.',
      },
      {
        q: '¿Puedo usar DIU o implante si aún no he tenido hijos?',
        a: 'Sí. En la mayoría de los casos son opciones seguras también para mujeres que no han tenido hijos, y tu fertilidad regresa al retirarlos. Antes de recomendarlos se valora tu caso en particular.',
      },
      {
        q: '¿Duele la colocación del DIU o del implante?',
        a: 'Es una molestia breve. Con el DIU puedes sentir un cólico parecido al menstrual durante la colocación, que suele durar unos minutos; el implante se coloca en el brazo con anestesia local. Antes del procedimiento se te explica qué esperar para que llegues con tranquilidad.',
      },
      {
        q: '¿Los anticonceptivos afectan mi fertilidad futura?',
        a: 'No. Al suspender la mayoría de los métodos tu fertilidad regresa y puedes embarazarte; con el DIU y el implante basta con retirarlos. Si planeas un embarazo, cuéntaselo a la doctora para elegir un método que se ajuste a tus tiempos.',
      },
      {
        q: 'Tuve un descuido, ¿qué puedo hacer?',
        a: 'La anticoncepción de emergencia sirve para casos puntuales (condón roto, pastillas olvidadas o una relación sin protección) y es más efectiva mientras más pronto se use, idealmente en las primeras 72 horas. No sustituye a un método regular. Escríbenos lo antes posible por WhatsApp para orientarte.',
      },
      {
        q: '¿Cuánto cuesta la consulta y qué incluye?',
        a: MOSTRAR_PRECIOS
          ? `La consulta de orientación anticonceptiva cuesta ${mxn('Orientación anticonceptiva')} MXN e incluye la valoración de tu historial y la orientación personalizada. La colocación del DIU o del implante se cobra aparte; puedes ver todos los costos en la página de Costos y Servicios.`
          : 'Escríbenos por WhatsApp y te compartimos el costo de la consulta y de la colocación del método que te interese. La consulta incluye la valoración de tu historial y la orientación personalizada.',
      },
    ],
    galeria: [
      'Consulta de orientación anticonceptiva',
      'Colocación de implante subdérmico',
      'Pastillas anticonceptivas',
      'Dispositivo intrauterino hormonal',
      'Distintos métodos anticonceptivos',
      'Preservativo masculino',
    ],
    confianzaBullet: 'Orientación anticonceptiva profesional',
    confianzaCta: 'Agendar orientación anticonceptiva por WhatsApp',
    ctaTitle: 'Agenda tu orientación anticonceptiva por WhatsApp',
  },

  {
    slug: 'vph',
    nombre: 'Orientación sobre VPH',
    title: 'Especialista en VPH Polanco CDMX | Dra. Lidia Chávez',
    description:
      'Especialista en VPH en Polanco y CDMX, Dra. Lidia Chávez. Diagnóstico confidencial, colposcopía, vacunación y seguimiento. Agenda tu consulta por WhatsApp.',
    ogAlt: 'Dra. Lidia Chávez - Especialista en VPH Polanco CDMX',
    logoAlt: 'Logo Dra. Lidia Chávez - Especialista en VPH en Polanco CDMX',
    waText: 'Hola, quiero agendar una valoración sobre VPH con la Dra. Lidia. ¿Qué horarios tienen disponibles?',
    tagline: 'Atención Especializada y Confidencial',
    h1: 'VPH en CDMX: Orientación y Colposcopía',
    heroP:
      'Diagnóstico, seguimiento y vacuna contra el VPH, con información clara y sin estigmas.',
    heroPuntos: ['Papanicolaou, colposcopía y PCR', 'Vacuna disponible', 'Atención confidencial'],
    procedure: {
      name: 'Orientación sobre VPH',
      description:
        'Diagnóstico confidencial, evaluación colposcópica, vacunación y seguimiento integral del Virus del Papiloma Humano.',
      specialty: 'Gynecologic',
    },
    cardDesc:
      'Información clara, valoración, estudios diagnósticos y seguimiento integral en caso de tener virus del papiloma humano.',
    cardAlt: 'Orientación y especialista en VPH Polanco CDMX',
    otroDesc: 'Diagnóstico, vacunación y valoración experta del Virus del Papiloma Humano.',
    // La doctora pidió que esta página priorice valoración confidencial,
    // explicación clara y seguimiento, en ese orden, y que no se lea alarmista.
    datosClave: [
      { label: 'Atención', valor: 'Confidencial y sin estigmas' },
      { label: 'Diagnóstico', valor: 'Papanicolaou, colposcopía y PCR' },
      { label: 'Seguimiento', valor: 'Según los hallazgos de tu valoración' },
      { label: 'Prevención', valor: 'Vacunación disponible' },
    ],
    sections: [
      {
        bg: 'light',
        tag: 'Conocimiento Médico',
        title: '¿Qué es el VPH y cómo se detecta en consultorio?',
        paragraphs: [
          'El Virus del Papiloma Humano (VPH) es un grupo de virus que afectan el epitelio genital. La gran mayoría de las personas sexualmente activas entrarán en contacto con algún tipo de VPH y el sistema inmune lo eliminará naturalmente.',
          'Para una <strong>especialista en VPH en Polanco</strong>, la detección oportuna incluye:',
        ],
        bullets: [
          '<strong>Papanicolaou:</strong> Evalúa si existen cambios celulares o lesiones por virus del papiloma humano en el cérvix.',
          '<strong>Colposcopía:</strong> Permite estudiar el tracto genital inferior y ver la zona exacta de la lesión.',
          '<strong>PCR para VPH:</strong> Determina la presencia de serotipos de alto o bajo riesgo.',
          '<strong>Biopsia:</strong> Estudio confirmatorio para saber el grado de la lesión.',
        ],
      },
      {
        bg: 'white',
        tag: 'Evaluación Directa',
        title: 'Relación entre el VPH y la colposcopía',
        paragraphs: [
          'La colposcopía permite a la ginecóloga observar directamente si el virus ha provocado alguna lesión en el tracto genital inferior y definir de forma individualizada el seguimiento y el tratamiento.',
        ],
      },
      {
        bg: 'gray',
        tag: 'Prevención Avanzada',
        title: 'Vacunación contra el VPH y manejo integral',
        paragraphs: [
          'La vacuna contra el VPH disminuye el riesgo de cáncer cervicouterino. Se recomienda su aplicación tanto en mujeres como en hombres.',
        ],
      },
      {
        bg: 'white',
        tag: 'Paso a Paso',
        title: 'Tu valoración de VPH en Polanco paso a paso',
        steps: [
          { title: 'Cita confidencial por WhatsApp', text: 'Agendas con discreción y atención oportuna en Polanco.' },
          { title: 'Análisis de antecedentes', text: 'Revisamos tus estudios previos o síntomas actuales.' },
          { title: 'Examen colposcópico', text: 'Exploración cuidadosa para valorar todo el tracto genital inferior.' },
          { title: 'Plan de manejo', text: 'Definimos el seguimiento y el tratamiento, y recomendamos la vacunación preventiva en caso de no tenerla.' },
        ],
      },
      {
        bg: 'light',
        tag: 'Tranquilidad Médica',
        title: 'Por qué acudir con una especialista en VPH',
        paragraphs: [
          'Una especialista en VPH puede acompañarte durante el proceso, resolver tus dudas y ayudarte a llevar un seguimiento adecuado. La mayoría de las pacientes pueden continuar con su vida de manera completamente normal.',
        ],
      },
    ],
    faqBg: 'white',
    faqTag: 'Preguntas Frecuentes',
    faqTitle: 'Dudas comunes sobre VPH en Polanco y CDMX',
    faqs: [
      {
        q: '¿Qué es el VPH y cómo se contagia?',
        a: 'El Virus del Papiloma Humano (VPH) es una infección viral muy común: actualmente es la infección de transmisión sexual más frecuente y se transmite por contacto directo piel con piel durante las relaciones sexuales.',
      },
      {
        q: '¿Cómo detecta una especialista en VPH en Polanco la presencia del virus?',
        a: 'Mediante Papanicolaou, colposcopía y pruebas moleculares de ADN / PCR para VPH.',
      },
      {
        q: '¿Cuál es la relación entre el VPH y la colposcopía?',
        a: 'La colposcopía permite ver la ubicación y la severidad de las lesiones causadas por el VPH en el tracto genital inferior.',
      },
      {
        q: '¿La vacuna contra el VPH funciona si ya fui diagnosticada?',
        a: 'Sí. La vacuna protege contra múltiples serotipos no adquiridos previamente y disminuye el riesgo de cáncer cervicouterino.',
      },
      {
        q: '¿Cómo solicitar una cita confidencial sobre VPH en Polanco?',
        a: 'Envía un mensaje de WhatsApp al 55 1476 7298 para agendar con absoluta discreción en Aurafem.',
      },
    ],
    galeria: [
      'Orientación médica sobre el VPH',
      'Diagnóstico confidencial y prueba PCR',
      'Evaluación colposcópica de lesiones por VPH',
      'Información clara sobre serotipos de alto riesgo',
      'Esquemas de vacunación contra el VPH',
      'Seguimiento de lesiones cervicales atípicas',
      'Atención sin estigmas en Polanco',
      'Tratamientos preventivos ambulatorios',
      'Cuidado y prevención en salud de pareja',
      'Tranquilidad médica con la Dra. Lidia Chávez',
    ],
    confianzaBullet: 'Orientación y colposcopía profesional',
    confianzaCta: 'Agendar valoración de VPH por WhatsApp',
    ctaTitle: 'Agenda tu consulta sobre VPH por WhatsApp',
  },

  {
    slug: 'revision-ginecologicapreventiva',
    nombre: 'Revisión ginecológica preventiva',
    title: 'Chequeo Ginecológico Anual CDMX | Dra. Lidia Chávez',
    description:
      'Chequeo ginecológico anual en CDMX y Polanco con la Dra. Lidia Chávez. Valoración preventiva integral pélvica y mamaria. Agenda tu cita hoy por WhatsApp.',
    ogAlt: 'Dra. Lidia Chávez - Chequeo Ginecológico Anual en CDMX Polanco',
    logoAlt: 'Logo Dra. Lidia Chávez - Chequeo Ginecológico Anual en Polanco CDMX',
    waText: 'Hola, quiero agendar mi revisión ginecológica preventiva con la Dra. Lidia. ¿Qué horarios tienen disponibles?',
    tagline: 'Prevención y Tranquilidad',
    h1: 'Chequeo ginecológico anual en CDMX',
    heroP:
      'Revisa tu salud ginecológica y mamaria una vez al año, antes de que aparezcan síntomas.',
    heroPuntos: ['Papanicolaou y colposcopía', 'Exploración mamaria', 'Varias modalidades de check up'],
    procedure: {
      name: 'Revisión ginecológica preventiva',
      description:
        'Chequeo ginecológico anual integral para la valoración mamaria, pélvica y citológica preventiva de la mujer.',
      specialty: 'Gynecologic',
    },
    cardDesc:
      'Consulta integral enfocada en el chequeo general, resolución de dudas, molestias repentinas o seguimiento anual periódico.',
    cardAlt: 'Revisión ginecológica preventiva anual CDMX',
    otroDesc: 'Chequeo completo de rutina para mantener tu salud óptima año con año.',
    datosClave: [
      { label: 'Frecuencia', valor: 'Una vez al año' },
      { label: 'Desde', valor: 'Los 21 años o al iniciar vida sexual' },
      { label: 'Incluye', valor: 'Consulta, exploración mamaria, rastreo pélvico, Papanicolaou y colposcopía' },
      { label: 'Preparación', valor: 'Fuera de tus días de menstruación' },
    ],
    landingCompacta: true,
    mostrarCheckUps: true,
    sections: [
      {
        bg: 'light',
        tag: 'Cuidado Preventivo',
        title: '¿Qué incluye un chequeo ginecológico anual en CDMX?',
        paragraphs: [
          'El <strong>chequeo ginecológico anual en CDMX</strong> es una evaluación integral que permite conocer, cuidar y dar seguimiento a la salud ginecológica y mamaria, ayudando a identificar oportunamente alteraciones que puedan impactar tu bienestar.',
          'Con la Dra. Lidia Chávez en Polanco, la revisión preventiva abarca de forma clara:',
        ],
        bullets: [
          '<strong>Entrevista e historial de salud:</strong> Revisión de la regularidad menstrual, cambios hormonales, vida sexual y antecedentes familiares.',
          '<strong>Exploración mamaria clínica:</strong> Palpación cuidadosa para identificar nódulos o cambios en el tejido mamario.',
          '<strong>Exploración pélvica y genital:</strong> Evaluación para detectar oportunamente alteraciones que puedan impactar tu salud ginecológica.',
          '<strong>Toma de Papanicolaou y colposcopía:</strong> Estudios para detectar a tiempo lesiones asociadas al virus del papiloma humano.',
          '<strong>Rastreo pélvico o endovaginal:</strong> Visualización por ultrasonido de útero y ovarios para detectar en etapas tempranas cáncer de ovario y de endometrio.',
        ],
      },
      {
        bg: 'white',
        tag: 'Filosofía Médica',
        title: 'Por qué no debes esperar a tener síntomas para acudir al ginecólogo',
        paragraphs: [
          'Una de las mayores trampas en la salud femenina es asumir que si no hay dolor o sangrado inusual, todo está perfectamente bien. La realidad médica demuestra que la gran mayoría de las afecciones iniciales del cuello uterino (como las lesiones causadas por el VPH), los miomas pequeños o los cambios quísticos ovarios se desarrollan de manera silenciosa y sin dolor.',
          'Acudir a tu revisión preventiva anual permite identificar cualquier pequeña alteración antes de que genere molestias o complicaciones. Esto garantiza tratamientos en etapas tempranas, menos invasivos y con mayores tasas de éxito.',
        ],
      },
      {
        bg: 'gray',
        tag: 'Recomendaciones',
        title: 'Cómo prepararte para tu chequeo preventivo',
        bullets: [
          'Agendar preferentemente entre los días 3 a 5 posteriores al término de tu periodo menstrual.',
          'Evitar aplicar geles, cremas u óvulos vaginales 48 horas antes de la consulta.',
          'Suspender relaciones sexuales 24 a 48 horas previas al examen si se incluirá Papanicolaou.',
        ],
      },
      {
        bg: 'white',
        tag: 'Paso a Paso',
        title: 'Tu revisión ginecológica preventiva paso a paso',
        headerIntro: 'Proceso estructurado en 4 pasos para brindarte total comodidad.',
        steps: [
          { title: 'Cita directa por WhatsApp', text: 'Reservas tu espacio en el consultorio de Polanco en la fecha que más te acomode.' },
          { title: 'Valoración médica inicial', text: 'Conversamos sobre tu estado de salud, hábitos, medicamentos y dudas actuales.' },
          { title: 'Valoración clínica', text: 'Exploración física cuidadosa y toma de muestras con técnica médica suave.' },
          { title: 'Recomendaciones', text: 'Entrega de indicaciones médicas, resolución de preguntas y plan preventivo personal.' },
        ],
      },
      {
        bg: 'light',
        tag: 'Servicios Incluidos',
        title: 'Por qué elegir nuestro consultorio en Polanco',
        paragraphs: [
          'La Dra. Lidia Chávez se distingue por brindar una consulta sin prisas, donde cada paciente es escuchada con empatía y respeto. Contamos con instalaciones médicas esterilizadas y una excelente ubicación en Aurafem, Polanco / Anzures.',
        ],
      },
    ],
    faqBg: 'white',
    faqTag: 'Preguntas Frecuentes',
    faqTitle: 'Dudas comunes sobre el chequeo ginecológico anual en CDMX',
    faqs: [
      {
        q: '¿Por qué es tan importante realizar un chequeo ginecológico anual en CDMX?',
        a: 'Porque la mayoría de las alteraciones celulares en el cuello uterino, miomas pequeños, quistes de ovario o infecciones silenciosas no producen síntomas visibles en sus etapas iniciales. El chequeo anual permite detectarlas y solucionarlas a tiempo.',
      },
      {
        q: '¿Qué incluye la revisión ginecológica preventiva completa en Polanco?',
        a: 'Incluye entrevista médica detallada, revisión del historial de salud, exploración clínica pélvica y mamaria, toma de citología Papanicolaou (o colposcopía si corresponde) y recomendaciones de salud reproductiva.',
      },
      {
        q: '¿Debo esperar a tener dolor o molestias para agendar mi revisión?',
        a: 'No. La medicina preventiva se basa en acudir precisamente cuando te sientes bien para confirmar que todo permanezca en perfecto estado de salud.',
      },
      {
        q: '¿A partir de qué edad se debe iniciar el chequeo anual?',
        a: 'A partir del inicio de la vida sexual activa o desde los 21 años. En adolescentes también es recomendable si existen dudas sobre el ciclo o dolores menstruales severos.',
      },
      {
        q: '¿Cómo me preparo para mi chequeo anual en el consultorio?',
        a: 'Acude preferentemente fuera de tus días de menstruación, evita duchas u óvulos vaginales 48 horas antes y abstente de relaciones sexuales 24 a 48 horas previas al examen.',
      },
      {
        q: '¿Cómo puedo agendar mi chequeo ginecológico anual con la Dra. Lidia Chávez?',
        a: 'Puedes enviar un mensaje directo a través de WhatsApp. Coordinaremos tu cita en el consultorio de Aurafem en Polanco / Anzures rápidamente.',
      },
    ],
    galeria: [
      'Chequeo ginecológico anual completo',
      'Exploración pélvica y mamaria preventiva',
      'Revisión rutinaria antes de presentar síntomas',
      'Detección oportuna de quistes y miomas',
      'Asesoría en salud menstrual y hormonal',
      'Consulta de prevención en Aurafem Polanco',
      'Cuidado integral anual de la mujer',
      'Instalaciones limpias y esterilizadas',
      'Entrega de indicaciones de bienestar anual',
      'Valoración médica experta con la Dra. Lidia',
    ],
    confianzaBullet: 'Chequeo preventivo profesional',
    confianzaCta: 'Agendar revisión preventiva por WhatsApp',
    ctaTitle: 'Agenda tu revisión ginecológica preventiva por WhatsApp',
  },
]

/**
 * Orden de aparición en el menú, la portada, /conoce/ y «otros servicios». Lo
 * definió la doctora en el documento de correcciones: primero la consulta y la
 * revisión preventiva, después los estudios, y al final el seguimiento del
 * embarazo. Vive aparte del catálogo para poder reordenar la lista sin mover
 * bloques de cientos de líneas.
 */
const ORDEN = [
  'consulta-ginecologica',
  'revision-ginecologicapreventiva',
  'papanicolaou',
  'colposcopia',
  'vph',
  'control-prenatal',
  'orientacion-anticonceptiva',
]

export const SERVICES = ORDEN.map((slug) => {
  const s = CATALOGO.find((x) => x.slug === slug)
  if (!s) throw new Error('ORDEN referencia un servicio inexistente: ' + slug)
  return s
})

export function getService(slug) {
  return SERVICES.find((s) => s.slug === slug)
}

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

export const SERVICES = [
  {
    slug: 'consulta-ginecologica',
    nombre: 'Consulta ginecológica',
    title: 'Consulta Ginecológica en Polanco CDMX | Dra. Lidia Chávez',
    description:
      'Consulta ginecológica en Polanco y CDMX con la Dra. Lidia Chávez. Valoración integral de primera vez y seguimiento. Agenda tu cita médica fácil por WhatsApp.',
    ogAlt: 'Dra. Lidia Chávez - Consulta Ginecológica en Polanco CDMX',
    logoAlt: 'Logo Dra. Lidia Chávez - Ginecóloga en Polanco CDMX',
    waText: 'Hola Dra. Lidia, quiero agendar una consulta ginecológica',
    tagline: 'Atención Médica Especializada',
    h1: 'Consulta ginecológica en Polanco, CDMX',
    heroP:
      'Si buscas una ginecóloga en Polanco que combine rigor médico con trato humano, la consulta ginecológica en CDMX con la Dra. Lidia Chávez brinda la máxima tranquilidad para cuidar de tu salud reproductiva.',
    heroSubP:
      'Ofrecemos valoración médica personalizada para citas de primera vez o seguimiento continuo en Aurafem (Polanco / Anzures). Reserva tu cita por WhatsApp.',
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
    datosClave: [
      { label: 'Modalidad', valor: 'Primera vez o seguimiento' },
      { label: 'Incluye', valor: 'Historial, exploración y receta' },
      { label: 'Frecuencia sugerida', valor: 'Al menos una vez al año' },
      { label: 'Preparación', valor: 'Ropa cómoda y fecha de tu última regla' },
    ],
    sections: [
      {
        bg: 'light',
        tag: 'Valoración Médica Integral',
        title: '¿Qué se revisa en una consulta ginecológica en CDMX?',
        paragraphs: [
          'La consulta ginecológica es el espacio médico ideal para evaluar la salud reproductiva femenina. Con la Dra. Lidia Chávez, ginecóloga en Polanco, cada sesión se brinda en un ambiente de absoluta confidencialidad, respeto y comunicación clara.',
          'Se revisan tu historial de salud, ciclo menstrual, anticoncepción y se efectúa una exploración física respetuosa orientada a prevenir o tratar a tiempo cualquier molestia o síntoma pélvico.',
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
            text: 'Monitoreamos tu evolución clínica tras iniciar un tratamiento prescrito, analizamos estudios de laboratorio ordenados y confirmamos la resolución exitosa de tus síntomas.',
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
          { title: 'Entrevista confidencial', text: 'Plática detallada sobre tus síntomas e historial de salud.' },
          { title: 'Exploración clínica', text: 'Revisión médica profesional realizada con técnica suave e instrumental estéril.' },
          { title: 'Diagnóstico e indicaciones', text: 'Explicaciones médicas claras y plan de tratamiento personalizado.' },
        ],
      },
      {
        bg: 'light',
        tag: 'Detalles del Servicio',
        title: 'Qué incluye y cómo prepararte para tu cita ginecológica',
        paragraphs: [
          'La consulta incluye elaboración de expediente, exploración clínica pélvica/mamaria y prescripción médica personalizada.',
          'Se recomienda acudir con ropa cómoda y tener en mente la fecha de tu última regla.',
        ],
      },
    ],
    faqBg: 'white',
    faqTag: 'Resuelve tus Dudas',
    faqTitle: 'Preguntas frecuentes sobre la consulta ginecológica en CDMX',
    faqs: [
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
    confianzaCta: 'Quiero agendar una consulta',
    otrosTag: 'Atención Integral',
    otrosIntro: 'Conoce las demás especialidades y estudios preventivos que ofrece la Dra. Lidia Chávez en Polanco, CDMX.',
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
    waText: 'Hola Dra. Lidia, quiero agendar un Papanicolaou',
    tagline: 'Detección Preventiva Cervical',
    h1: 'Papanicolaou en CDMX',
    heroP:
      'Si te preguntas dónde hacerse el Papanicolaou con total tranquilidad, la Dra. Lidia Chávez realiza el estudio de <strong>Papanicolaou en CDMX</strong> con máxima higiene y calidez médica en Polanco.',
    heroSubP:
      'Cuidamos la salud de tu cuello uterino mediante una prueba rápida e indolora. Agenda tu citología en minutos por WhatsApp.',
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
          '<strong>Seguimiento médico:</strong> Si hubo cambios inflamatorios atípicos previos, se sugiere repetir a los 6 meses.',
        ],
      },
      {
        bg: 'gray',
        tag: 'Ubicación e Indicaciones',
        title: '¿Dónde hacerse el Papanicolaou en Polanco y cómo prepararte?',
        paragraphs: [
          'Si te preguntas <strong>dónde hacerse el Papanicolaou</strong> en Polanco o Anzures, el consultorio de la Dra. Lidia Chávez en Aurafem cuenta con instrumental estéril de un solo uso y un ambiente seguro.',
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
          'La muestra se envía a patología y se entrega en pocos días hábiles con una explicación clara de la especialista.',
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
          { title: 'Entrega de informe', text: 'Recibes tu resultado patológico procesado con explicación clínica.' },
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
    confianzaCta: 'Quiero agendar mi Papanicolaou',
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
    waText: 'Hola Dra. Lidia, quiero agendar una colposcopía',
    tagline: 'Evaluación Visual Especializada',
    h1: 'Colposcopía en Polanco, CDMX',
    heroP:
      'Si cuentas con un reporte de Papanicolaou alterado o requerimiento de valoración por VPH, realizar una colposcopía en Polanco con la Dra. Lidia Chávez te brinda la precisión clínica necesaria.',
    heroSubP:
      'Ofrecemos diagnóstico de alta definición con colposcopio médico en Aurafem (Polanco / Anzures, CDMX). Agenda tu cita fácil por WhatsApp.',
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
    otroDesc: 'Evaluación visual especializada del cuello uterino con equipo de alta precisión.',
    datosClave: [
      { label: 'Indicada tras', valor: 'Papanicolaou alterado o VPH' },
      { label: 'Molestias', valor: 'No genera dolor' },
      { label: 'Biopsia', valor: 'Solo si se observa zona atípica' },
      { label: 'Preparación', valor: 'Sin sangrado y sin óvulos 48 h antes' },
    ],
    sections: [
      {
        bg: 'light',
        tag: 'Precisión Diagnóstica',
        title: '¿Qué es la colposcopía en CDMX y cómo se realiza?',
        paragraphs: [
          'La colposcopía es un estudio ginecológico que permite examinar visualmente y en tiempo real el cuello uterino, la vagina y la vulva mediante un colposcopio con lentes de magnificación que permanece fuera del cuerpo.',
          'Durante la realización de la <strong>colposcopía CDMX</strong>, la ginecóloga aplica soluciones contrastantes (ácido acético y Lugol) que resaltan áreas con tejido alterado o lesiones por VPH, permitiendo identificar su ubicación exacta.',
        ],
      },
      {
        bg: 'white',
        tag: 'Indicaciones Médicas',
        title: '¿Cuándo se indica realizar una colposcopía en Polanco?',
        bullets: [
          '<strong>Papanicolaou alterado:</strong> Reportes citológicos con presencia de células atípicas o displasias.',
          '<strong>Diagnóstico de VPH:</strong> Detección de serotipos de alto riesgo o verrugas genitales.',
          '<strong>Sangrado poscoital:</strong> Presencia de sangrado inusual posterior a relaciones sexuales.',
          '<strong>Seguimiento médico:</strong> Monitoreo posterior a tratamientos cervicales previos.',
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
    confianzaCta: 'Quiero agendar mi colposcopía',
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
    waText: 'Hola Dra. Lidia, quiero agendar control prenatal',
    tagline: 'Seguimiento Maternofetal Continuo',
    h1: 'Control prenatal en CDMX',
    heroP:
      'Si buscas un <strong>ginecólogo para control prenatal en Polanco</strong> con atención profesional y cálida, el servicio de <strong>control prenatal CDMX</strong> de la Dra. Lidia Chávez te acompaña cuidando el desarrollo saludable de tu bebé.',
    heroSubP:
      'Ofrecemos monitoreo médico personalizado en Aurafem (Polanco / Anzures, CDMX). Agenda tu cita por WhatsApp.',
    procedure: {
      name: 'Control prenatal',
      description:
        'Seguimiento médico continuo y estructurado durante el embarazo para la vigilancia del crecimiento fetal y la salud materna.',
      specialty: 'Obstetric',
    },
    cardDesc:
      'Seguimiento médico constante durante el embarazo para cuidar rigurosamente de la salud materna y fetal.',
    cardAlt: 'Control prenatal en CDMX y Polanco',
    otroDesc: 'Seguimiento médico mes a mes para el bienestar de la mamá y el bebé durante el embarazo.',
    datosClave: [
      { label: 'Inicio ideal', valor: 'Semanas 6 a 8 de gestación' },
      { label: 'Frecuencia', valor: 'Mensual, luego quincenal y semanal' },
      { label: 'Incluye', valor: 'Ecografía, laboratorios y suplementación' },
      { label: 'Seguimiento', valor: 'Del primer trimestre al parto' },
    ],
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
            text: 'Confirmación de edad gestacional, ubicación del saco embrionario, fecha probable de parto, laboratorios iniciales y primera ecografía.',
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
          '<strong>Tamiz de glucosa:</strong> Prevención u orquestación del manejo de diabetes gestacional.',
          '<strong>Monitoreo ecográfico:</strong> Evaluación de frecuencia cardíaca fetal y placenta.',
        ],
      },
      {
        bg: 'gray',
        tag: 'Paso a Paso',
        title: 'Tu consulta prenatal en Polanco paso a paso',
        steps: [
          { title: 'Agendamiento por WhatsApp', text: 'Coordinamos tu cita mensual o quincenal respetando tu agenda.' },
          { title: 'Signos vitales', text: 'Toma de presión arterial y control del incremento de peso.' },
          { title: 'Revisión clínica y fetal', text: 'Medición del fondo uterino, escucha de latidos y laboratorios.' },
          { title: 'Orientación y receta', text: 'Indicación de suplementos médicos y fecha de tu siguiente control.' },
        ],
      },
      {
        bg: 'white',
        tag: 'Cuidado Integral',
        title: 'Beneficios del acompañamiento prenatal especializado',
        paragraphs: [
          'Prevenimos cuadros hipertensivos (preeclampsia), monitoreamos la correcta nutrición materna y te guiamos en los preparativos para el nacimiento.',
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
        a: 'Durante el primer y segundo trimestre las visitas son mensuales. A partir de la semana 28 se vuelven quincenales, y desde la semana 36 son semanales.',
      },
      {
        q: '¿Qué estudios son indispensables durante el embarazo?',
        a: 'Incluye biometría hemática, química sanguínea, grupo y RH, examen de orina, prueba de tamiz de glucosa y ultrasonidos genético y estructural.',
      },
      {
        q: '¿Qué suplementación médica se prescribe en las consultas prenatales?',
        a: 'Se prescribe ácido fólico, hierro, calcio, multivitamínicos y omega 3 según la condición clínica individual de cada mamá.',
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
    confianzaCta: 'Quiero agendar mi control prenatal',
    ctaTitle: 'Agenda tu control prenatal por WhatsApp',
  },

  {
    slug: 'atencion-embarazo',
    nombre: 'Atención en el embarazo',
    title: 'Ginecólogo para Embarazo Polanco | Dra. Lidia Chávez',
    description:
      'Atención del embarazo en Polanco, CDMX con la Dra. Lidia Chávez. Acompañamiento médico en cada trimestre y señales de alarma. Agenda tu cita por WhatsApp.',
    ogAlt: 'Dra. Lidia Chávez - Ginecólogo para embarazo en Polanco',
    logoAlt: 'Logo Dra. Lidia Chávez - Ginecólogo para Embarazo en Polanco',
    waText: 'Hola Dra. Lidia, quiero información sobre atención en el embarazo',
    tagline: 'Acompañamiento Gestacional Experto',
    h1: 'Ginecólogo para embarazo en Polanco, CDMX',
    heroP:
      'Si buscas a un <strong>ginecólogo para embarazo en Polanco</strong> que te escuche y vigile paso a paso la salud de tu bebé, la Dra. Lidia Chávez te ofrece un espacio de atención médica confiable y seguro.',
    heroSubP:
      'Ofrecemos consulta de atención integral de embarazo en Aurafem (Polanco y Anzures, CDMX). Reserva tu cita fácil por WhatsApp.',
    procedure: {
      name: 'Atención en el embarazo',
      description:
        'Acompañamiento médico profesional durante la gestación, resolución de dudas y detección temprana de señales de alarma.',
      specialty: 'Obstetric',
    },
    cardDesc:
      'Orientación humana y acompañamiento profesional para guiarte en cada trimestre de tu gestación.',
    cardAlt: 'Atención en el embarazo en Polanco CDMX',
    cardWaText: 'Hola Dra. Lidia, quiero informes sobre atención en el embarazo',
    otroDesc: 'Acompañamiento humano e integral en cada etapa de la gestación.',
    datosClave: [
      { label: 'Acompañamiento', valor: 'En los tres trimestres' },
      { label: 'Incluye', valor: 'Revisión ecográfica y plan de bienestar' },
      { label: 'Tercer trimestre', valor: 'Quincenal y semanal desde la 36' },
      { label: 'Señales de alarma', valor: 'Orientación y valoración oportuna' },
    ],
    sections: [
      {
        bg: 'light',
        tag: 'Cuidado Gestacional',
        title: 'Acompañamiento médico continuo en cada trimestre',
        paragraphs: [
          'Contar con la asesoría de una especialista experimentada como tu <strong>ginecólogo para embarazo en Polanco</strong> te permite afrontar los cambios gestacionales con plena tranquilidad.',
          'La atención médica se estructura de manera progresiva para monitorear el desarrollo del bebé:',
        ],
        cards: [
          {
            title: 'Primer trimestre',
            text: 'Confirmación del embarazo por ecografía, manejo de náuseas o fatiga, suplementación folática y prevención de riesgos iniciales.',
          },
          {
            title: 'Segundo trimestre',
            text: 'Evaluación del crecimiento anatómico fetal, función placentaria, presión arterial y orientación nutricional materna.',
          },
          {
            title: 'Tercer trimestre',
            text: 'Monitoreo estrecho de la presentación fetal, líquido amniótico, salud placentaria y preparación del plan de nacimiento.',
          },
        ],
      },
      {
        bg: 'white',
        tag: 'Prevención y Seguridad',
        title: 'Señales de alarma que requieren valoración médica urgente',
        bullets: [
          '<strong>Sangrado vaginal:</strong> Cualquier pérdida de sangre vaginal en cualquier mes gestacional.',
          '<strong>Dolor abdominal o pélvico:</strong> Cólicos intensos o dolor punzante en vientre bajo.',
          '<strong>Pérdida de líquido:</strong> Salida inusual de fluido claro por la vagina antes de tiempo.',
          '<strong>Síntomas hipertensivos:</strong> Dolor de cabeza severo, zumbido de oídos o visión de destellos.',
          '<strong>Disminución de movimientos:</strong> Percepción de que el bebé se mueve menos de lo habitual.',
        ],
      },
      {
        bg: 'gray',
        tag: 'Paso a Paso',
        title: 'Tu consulta de atención de embarazo en Polanco',
        steps: [
          { title: 'Cita directa por WhatsApp', text: 'Agendas tu horario en el consultorio de Polanco sin intermediarios.' },
          { title: 'Revisión de síntomas', text: 'Platicamos sobre tus dudas físicas y evaluamos tus análisis recientes.' },
          { title: 'Evaluación maternofetal', text: 'Valoración de presión, peso, crecimiento del vientre y revisión ecográfica.' },
          { title: 'Plan de bienestar', text: 'Indicaciones médicas claras, receta y fecha de tu siguiente revisión.' },
        ],
      },
      {
        bg: 'white',
        tag: 'Servicios Incluidos',
        title: 'Beneficios de la atención médica de embarazo',
        paragraphs: [
          'La Dra. Lidia Chávez prioriza el parto seguro, el acompañamiento respetuoso y la resolución pronta de inquietudes gestacionales.',
        ],
      },
    ],
    faqBg: 'light',
    faqTag: 'Preguntas Frecuentes',
    faqTitle: 'Dudas comunes sobre la atención del embarazo',
    faqs: [
      {
        q: '¿Cuáles son las señales de alarma durante el embarazo que exigen valoración médica urgente?',
        a: 'Son señales de alarma: sangrado vaginal, dolor abdominal o pélvico severo, dolor de cabeza con zumbidos o luces, fiebre, pérdida de líquido y disminución en los movimientos fetales.',
      },
      {
        q: '¿Por qué elegir a la Dra. Lidia Chávez como tu ginecólogo para embarazo en Polanco?',
        a: 'Porque ofrece un acompañamiento continuo con rigor científico, ecografía médica y trato empático y respetuoso en cada trimestre de tu gestación.',
      },
      {
        q: '¿Cómo se manejan los síntomas frecuentes del embarazo como náuseas y acidez?',
        a: 'En cada consulta se evalúa la intensidad sintomática, prescribiendo ajustes nutricionales, descanso y medicamentos seguros autorizados en la gestación.',
      },
      {
        q: '¿Con qué frecuencia debo acudir a consulta en el último trimestre?',
        a: 'A partir de la semana 28 las visitas son quincenales, y desde la semana 36 son semanales para vigilar la madurez del bebé y placenta.',
      },
      {
        q: '¿Cómo agendar la primera consulta de atención de embarazo en Polanco?',
        a: 'La coordinación es inmediata por WhatsApp. Agendamos tu espacio en el consultorio de Aurafem en Polanco / Anzures rápidamente.',
      },
    ],
    galeria: [
      'Acompañamiento médico en la gestación',
      'Resolución de dudas sobre síntomas comunes',
      'Monitoreo de frecuencia cardíaca fetal',
      'Orientación sobre señales de alarma gestacional',
      'Preparación para el plan de parto',
      'Evaluación del bienestar materno en el 3er trimestre',
      'Atención médica cálida en Aurafem Polanco',
      'Consulta gestacional de alta confianza',
      'Monitoreo ecográfico del bebé',
      'Seguimiento médico seguro y sin prisas',
    ],
    confianzaBullet: 'Acompañamiento materno profesional',
    confianzaCta: 'Quiero consultar sobre mi embarazo',
    ctaTitle: 'Agenda tu atención de embarazo por WhatsApp',
  },

  {
    slug: 'vph',
    nombre: 'Orientación sobre VPH',
    title: 'Especialista en VPH Polanco CDMX | Dra. Lidia Chávez',
    description:
      'Especialista en VPH en Polanco y CDMX, Dra. Lidia Chávez. Diagnóstico confidencial, colposcopía, vacunación y seguimiento. Agenda tu consulta por WhatsApp.',
    ogAlt: 'Dra. Lidia Chávez - Especialista en VPH Polanco CDMX',
    logoAlt: 'Logo Dra. Lidia Chávez - Especialista en VPH en Polanco CDMX',
    waText: 'Hola Dra. Lidia, quiero orientación sobre VPH',
    tagline: 'Atención Especializada y Confidencial',
    h1: 'VPH en CDMX: Orientación y Colposcopía',
    heroP:
      'Si requieres asesoría médica, diagnóstico oportuno o seguimiento por <strong>VPH en CDMX</strong>, acudir con una <strong>especialista en VPH en Polanco</strong> como la Dra. Lidia Chávez te garantiza información científica clara y sin estigmas.',
    heroSubP:
      'Ofrecemos consulta de valoración, colposcopía y vacunación en Aurafem (Polanco / Anzures). Agenda tu cita confidencial por WhatsApp.',
    procedure: {
      name: 'Orientación sobre VPH',
      description:
        'Diagnóstico confidencial, evaluación colposcópica, vacunación y seguimiento integral del Virus del Papiloma Humano.',
      specialty: 'Gynecologic',
    },
    cardDesc:
      'Información clara, diagnóstico, valoración y seguimiento integral ante el Virus del Papiloma Humano.',
    cardAlt: 'Orientación y especialista en VPH Polanco CDMX',
    otroDesc: 'Diagnóstico, vacunación y valoración experta del Virus del Papiloma Humano.',
    datosClave: [
      { label: 'Diagnóstico', valor: 'Papanicolaou, colposcopía y PCR' },
      { label: 'Prevención', valor: 'Vacunación disponible' },
      { label: 'Atención', valor: 'Confidencial y sin estigmas' },
      { label: 'Seguimiento', valor: 'Según los hallazgos de tu valoración' },
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
          '<strong>Papanicolaou:</strong> Evalúa si existen cambios en la forma celular del cérvix.',
          '<strong>Colposcopía:</strong> Permite ver la zona exacta de cualquier lesión.',
          '<strong>PCR para VPH:</strong> Determina la presencia de serotipos de alto o bajo riesgo.',
        ],
      },
      {
        bg: 'white',
        tag: 'Evaluación Directa',
        title: 'Relación entre el VPH y la colposcopía',
        paragraphs: [
          'La colposcopía permite a la ginecóloga observar directamente si el virus ha provocado alguna lesión en el cuello uterino y definir si requiere seguimiento o tratamiento ambulatorio preventivo.',
        ],
      },
      {
        bg: 'gray',
        tag: 'Prevención Avanzada',
        title: 'Vacunación contra el VPH y manejo integral',
        paragraphs: [
          'La vacuna contra el VPH previene lesiones y serotipos oncogénicos. Se recomienda su aplicación tanto en mujeres como en hombres.',
        ],
      },
      {
        bg: 'white',
        tag: 'Paso a Paso',
        title: 'Tu valoración de VPH en Polanco paso a paso',
        steps: [
          { title: 'Cita confidencial por WhatsApp', text: 'Agendas con discreción y atención oportuna en Polanco.' },
          { title: 'Análisis de antecedentes', text: 'Revisamos tus estudios previos o síntomas actuales.' },
          { title: 'Examen colposcópico', text: 'Exploración cuidadosa para valorar el tejido cervical.' },
          { title: 'Plan de manejo', text: 'Definimos si requiere seguimiento o vacunación preventiva.' },
        ],
      },
      {
        bg: 'light',
        tag: 'Tranquilidad Médica',
        title: 'Por qué acudir con una especialista en VPH',
        paragraphs: [
          'Acudir con una especialista capacitada te permite entender que con el seguimiento correcto la inmensa mayoría de las pacientes mantienen una vida totalmente normal.',
        ],
      },
    ],
    faqBg: 'white',
    faqTag: 'Preguntas Frecuentes',
    faqTitle: 'Dudas comunes sobre VPH en Polanco y CDMX',
    faqs: [
      {
        q: '¿Qué es el VPH y cómo se contagia?',
        a: 'El Virus del Papiloma Humano (VPH) es una infección viral muy común transmitida por contacto directo piel con piel durante relaciones sexuales.',
      },
      {
        q: '¿Cómo detecta una especialista en VPH en Polanco la presencia del virus?',
        a: 'Mediante Papanicolaou, colposcopía y pruebas moleculares de ADN / PCR para VPH.',
      },
      {
        q: '¿Cuál es la relación entre el VPH y la colposcopía?',
        a: 'La colposcopía permite ver la ubicación y severidad de las lesiones causadas por el VPH en el cuello uterino.',
      },
      {
        q: '¿La vacuna contra el VPH funciona si ya fui diagnosticada?',
        a: 'Sí. La vacuna protege contra múltiples serotipos no adquiridos previamente y refuerza el sistema inmune.',
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
    confianzaCta: 'Quiero orientación por WhatsApp',
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
    waText: 'Hola Dra. Lidia, quiero agendar una revisión ginecológica preventiva',
    tagline: 'Prevención y Tranquilidad',
    h1: 'Chequeo ginecológico anual en CDMX',
    heroP:
      'La prevención es la mejor inversión en tu salud. Realizar un <strong>chequeo ginecológico anual en CDMX</strong> con la Dra. Lidia Chávez te garantiza una valoración integral, profesional y sin dolor en la zona de Polanco.',
    heroSubP:
      'Cuidamos de ti en un ambiente médico seguro, privado y empático en las instalaciones de Aurafem. Reserva tu cita preventiva fácil por WhatsApp.',
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
      { label: 'Incluye', valor: 'Exploración mamaria, pélvica y citología' },
      { label: 'Preparación', valor: 'Fuera de tus días de menstruación' },
    ],
    sections: [
      {
        bg: 'light',
        tag: 'Cuidado Preventivo',
        title: '¿Qué incluye un chequeo ginecológico anual en CDMX?',
        paragraphs: [
          'El <strong>chequeo ginecológico anual en CDMX</strong> es una evaluación clínica metódica diseñada para examinar de manera integral el estado de salud del aparato reproductor femenino y las mamas, asegurando que todo funcione adecuadamente.',
          'Con la Dra. Lidia Chávez en Polanco, la revisión preventiva abarca de forma clara:',
        ],
        bullets: [
          '<strong>Entrevista e historial de salud:</strong> Revisión de la regularidad menstrual, cambios hormonales, vida sexual y antecedentes familiares.',
          '<strong>Exploración mamaria clínica:</strong> Palpación cuidadosa para identificar nódulos o cambios en el tejido mamario.',
          '<strong>Exploración pélvica y citología (Papanicolaou):</strong> Toma celular suave para prevención de lesiones cervicales.',
          '<strong>Orientación anticonceptiva o de fertilidad:</strong> Asesoría médica sobre métodos de barrera, hormonales o planeación de embarazo.',
        ],
      },
      {
        bg: 'white',
        tag: 'Filosofía Médica',
        title: 'Por qué no debes esperar a tener síntomas para acudir al ginecólogo',
        paragraphs: [
          'Una de las mayores trampas en la salud femenina es asumir que si no hay dolor o sangrado inusual, todo está perfectamente bien. La realidad médica demuestra que la gran mayoría de las afecciones iniciales del cuello uterino (como las lesiones causadas por el VPH), los miomas pequeños o los cambios quísticos ovarios se desarrollan de manera silenciosa y sin dolor.',
          'Acudir a tu revisión preventiva anual permite identificar cualquier pequeña variación celular antes de que genere molestias o complicaciones. Esto garantiza tratamientos significativamente más sencillos, menos invasivos y con tasas de éxito total.',
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
          { title: 'Entrevista médica previa', text: 'Conversamos sobre tu estado de salud, hábitos, medicamentos y dudas actuales.' },
          { title: 'Valoración clínica', text: 'Exploración física cuidadosa y toma de muestra preventiva con técnica médica suave.' },
          { title: 'Recomendaciones anuales', text: 'Entrega de indicaciones médicas, resolución de preguntas y plan preventivo personal.' },
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
    confianzaCta: 'Quiero agendar mi revisión preventiva',
    ctaTitle: 'Agenda tu revisión ginecológica preventiva por WhatsApp',
  },
]

export function getService(slug) {
  return SERVICES.find((s) => s.slug === slug)
}

// Fuente de verdad centralizada para la lista completa de servicios y costos oficial.

export const SERVICIOS_DATASET = {
  titulo: "COSTOS Y SERVICIOS",
  moneda: "MXN",
  fuente: "SERVICIOS PAGINA.pdf",
  categorias: [
    {
      nombre: "CONSULTA",
      servicios: [
        {
          nombre: "Primera vez",
          incluye: null,
          costo_regular: 1300.0,
          costo_promocion: 999.0
        },
        {
          nombre: "Subsecuente",
          incluye: null,
          costo_regular: 1200.0,
          costo_promocion: null
        },
        {
          nombre: "Video consulta",
          incluye: "NO SE DA RECETA",
          costo_regular: 699.0,
          costo_promocion: null
        },
        {
          nombre: "Orientación anticonceptiva",
          incluye: "Solo consulta de orientación anticonceptiva",
          costo_regular: 700.0,
          costo_promocion: 600.0
        },
        {
          nombre: "Consulta de Control Prenatal",
          incluye: "Incluye rastreo, no se da reporte",
          costo_regular: 1350.0,
          costo_promocion: null
        },
        {
          nombre: "Consulta + Papanicolaou",
          incluye: "Consulta + toma de pap",
          costo_regular: 1400.0,
          costo_promocion: null
        },
        {
          nombre: "Consulta + colposcopia",
          incluye: "Consulta + toma de colpos",
          costo_regular: 1350.0,
          costo_promocion: null
        }
      ]
    },
    {
      nombre: "CHECK UP",
      servicios: [
        {
          nombre: "Check up Básico",
          incluye: "Consulta + Papanicolaou + colposcopia + vulvoscopia + exploración mamaria + prueba rápida de infección de vías urinarias",
          costo_regular: 2200.0,
          costo_promocion: 1750.0
        },
        {
          nombre: "Check up Plus",
          incluye: "Básico + rastreo endovaginal (no se da reporte)",
          costo_regular: 2450.0,
          costo_promocion: 2000.0
        },
        {
          nombre: "Check up Teens -15 a 17 años-",
          incluye: "Consulta + educación menstrual y de higiene íntima. Asesoría anticonceptiva.",
          costo_regular: 999.0,
          costo_promocion: null
        },
        {
          nombre: "Check up VPH",
          incluye: "Consulta + Colposcopia + Papanicolaou + Prueba PCR para detección de 28 genotipos de VPH (19 de Alto riesgo y 9 de Bajo Riesgo).",
          costo_regular: 4250.0,
          costo_promocion: 3999.0
        },
        {
          nombre: "Check up Menopausia",
          incluye: "Check up plus + medición rápida de glucosa capilar, colesterol",
          costo_regular: 2450.0,
          costo_promocion: 2000.0
        }
      ]
    },
    {
      nombre: "METODOS ANTICONCEPTIVOS",
      servicios: [
        {
          nombre: "DIU de cobre",
          incluye: "NO INCLUYE CONSULTA",
          costo_regular: 1500.0
        },
        {
          nombre: "DIU de plata",
          incluye: "NO INCLUYE CONSULTA",
          costo_regular: 2700.0
        },
        {
          nombre: "DIU Kyleena (se solicita con 7 días de anticipación, se solicita apartar con $3000",
          incluye: "NO INCLUYE CONSULTA",
          costo_regular: 5000.0
        },
        {
          nombre: "DIU Mirena",
          incluye: "NO INCLUYE CONSULTA",
          costo_regular: 6000.0
        },
        {
          nombre: "Retiro de DIU",
          incluye: "NO INCLUYE CONSULTA",
          costo_regular: 1100.0,
          costo_con_anestesia_local: 1800.0
        },
        {
          nombre: "Implante Subdérmico",
          incluye: "NO INCLUYE CONSULTA",
          costo_regular: 3600.0
        },
        {
          nombre: "Retiro de implante",
          incluye: "NO INCLUYE CONSULTA",
          costo_regular: 1500.0
        }
      ]
    },
    {
      nombre: "VACUNA GARDASIL",
      servicios: [
        {
          nombre: "Gardasil 9",
          incluye: "1 dosis",
          costo_regular: 4350.0
        },
        {
          nombre: "Gardasil 9 (3 dosis)",
          incluye: "Paga el esquema completo, solo viene a la aplicación de sus dosis Pago en una sola exhibición",
          costo_regular: 12000.0
        }
      ]
    },
    {
      nombre: "PROCEDIMIENTOS",
      servicios: [
        {
          nombre: "Biopsia de cérvix",
          incluye: "La consulta se cobra por aparte",
          costo_regular: 3500.0
        },
        {
          nombre: "Biopsia de endometrio",
          incluye: "La consulta se cobra por aparte",
          costo_regular: 3800.0
        },
        {
          nombre: "Biopsia de vulva",
          incluye: "La consulta se cobra por aparte",
          costo_regular: 3600.0
        },
        {
          nombre: "Drenaje de absceso",
          incluye: "La consulta se cobra por aparte",
          costo_regular: 2500.0
        },
        {
          nombre: "Retiro de verrugas 1-5 electrofulguración",
          incluye: "La consulta se cobra por aparte",
          costo_regular: 1800.0
        },
        {
          nombre: "Retiro de verrugas 6-10 electrofulguración",
          incluye: "La consulta se cobra por aparte",
          costo_regular: 2500.0
        },
        {
          nombre: "Retiro de verrugas 10 o + electrofulguración",
          incluye: "La consulta se cobra por aparte",
          costo_regular: null,
          costo_adicional: 500.0,
          nota_costo: "Costo adicional al anterior: +$500.00"
        },
        {
          nombre: "Retiro de verrugas 1-5 electro (subsecuente)",
          incluye: "La consulta se cobra por aparte",
          costo_regular: 1100.0
        },
        {
          nombre: "Retiro de verrugas 6-10 electro (subsecuente)",
          incluye: "La consulta se cobra por aparte",
          costo_regular: 1500.0
        },
        {
          nombre: "Retiro de verrugas 10 o + electro (subsecuente)",
          incluye: "La consulta se cobra por aparte",
          costo_regular: null,
          costo_adicional: 500.0,
          nota_costo: "Costo adicional al anterior: +$500.00"
        },
        {
          nombre: "Retiro de lesiones 1-10 Láser",
          incluye: "La consulta se cobra por aparte",
          costo_regular: 7500.0
        },
        {
          nombre: "Esferolisis/Electrocirugía",
          incluye: "La consulta se cobra por aparte",
          costo_regular: 5500.0,
          costo_con_laser: 8000.0
        },
        {
          nombre: "Cono cervical",
          incluye: "La consulta se cobra por aparte",
          costo_regular: 9000.0,
          desglose_costo: "$7,000.00 + Biopsia de $2,000.00"
        },
        {
          nombre: "Vulvectomía en consultorio",
          incluye: "La consulta se cobra por aparte",
          costo_regular: 8000.0
        }
      ]
    },
    {
      nombre: "ILE CON MEDICAMENTOS A PARTIR DE $4500",
      servicios: [
        {
          nombre: "ILE con medicamento (hasta 9.6 semanas) básico",
          incluye: "Consulta de valoración con rastreo (no se entrega reporte)\nMedicamentos.\nOrientación anticonceptiva.",
          costo_regular: 4500.0
        },
        {
          nombre: "ILE de la semana 9.6-12.6 Con anestesia general o sedación",
          incluye: "El costo varía, ya que al ser un procedimiento que se realiza en ambiente hospitalario, se tiene que tomar en cuenta los honorarios médicos + el hospital, se recomienda primero acudir a una valoración con costo de $1,500 para que se puedan dar orientación y costo aproximado.",
          costo_regular: null,
          costo_valoracion_previa: 1500.0
        }
      ]
    },
    {
      nombre: "LABORATORIOS KITS ITS/ CULTIVOS",
      servicios: [
        {
          nombre: "PCR VPH",
          incluye: "Alto Riesgo (19): VPH 16, VPH 18, VPH 26, VPH 31, VPH 33, VPH35, VPH 39, VPH 45, VPH 51, VPH 52, VPH 53, VPH 56, VPH 58, VPH 59, VPH 66, VPH 68, VPH69, VPH 73, VPH 82.\nBajo Riesgo (9): VPH 6, VPH 11, VPH 40, VPH 42, VPH 43, VPH 44, VPH 54, VPH 61, VPH 70.",
          costo_regular: 3500.0
        },
        {
          nombre: "Kit Prenatal - STI8",
          incluye: "Toxoplasma, VIH I y II, Sifilis, Herpes 1 y 2, Hepatitis B, Hepatitis C, Rubeola Citomegalovirus",
          costo_regular: 3500.0
        },
        {
          nombre: "Kit ITS Platinum- STI14",
          incluye: "Chlamydia trachomatis (CT), Mycoplasma genitalium (MG) Mycoplasma hominis (MH), Neisseria gonorrhoeae (NG) Trichomonas vaginalis (TV), Ureaplasma parvum (UP) Ureaplasma urealyticum (UU), Herpes I y Herpes II, Lymphogranuloma venerum, Cytomegalovirus, Varicella-zoster virus, Haemophilus ducreyi, Treponema pallidum (Sifilis)",
          costo_regular: 4000.0
        },
        {
          nombre: "KIt ITS Gold",
          incluye: "Kit VPH + Kit ITS Platinum",
          costo_regular: 5000.0
        },
        {
          nombre: "Kit Black",
          incluye: "Kit VPH + Chlamydia trachomatis (CT), Haemophilus Ducreyi (HD), Mycoplasma genitalium (MG) Mycoplasma hominis (MH), Neisseria gonorrhoeae (NG) Trichomonas vaginalis (TV), Ureaplasma parvum (UP) Ureaplasma urealyticum (UU), VIH I y II, Treponema pallidum (Sifilis), Herpes I y II, Hepatitis B y Hepatitis C.",
          costo_regular: 5300.0
        },
        {
          nombre: "Cultivo vaginosis",
          incluye: "Gardnerella vaginalis (GV), Lactobacillus spp. (LB), Atopobium vaginae (AV), Trichomonas vaginalis (TV), Candida glabrata (CG), Candida albicans (CA), Candida krusei (CK) y C. parapsilosis/C. tropicalis/C. dubliniensis (CSPP)",
          costo_regular: 2200.0
        },
        {
          nombre: "Cultivo con MIC",
          incluye: null,
          costo_regular: 800.0
        },
        {
          nombre: "Cultivo Ureaplasma Urealyticum",
          incluye: null,
          costo_regular: 800.0
        },
        {
          nombre: "Cultivo Mycoplasma",
          incluye: null,
          costo_regular: 1300.0
        },
        {
          nombre: "Cultivo candida (Albicans, tropicalis, krusei, glabrata)",
          incluye: null,
          costo_regular: 800.0
        },
        {
          nombre: "Antifungigrama",
          incluye: null,
          costo_regular: 3000.0
        },
        {
          nombre: "Microbioma vaginal básico",
          incluye: "pH (solo disponible en muestra vaginal), IgA secretora, Lactoferrina, Beta-glucosidasa, Beta-glucuronidasa, Grupo de Lactobacillus spp. Tipificación de: Lactobacillus crispatus, Lactobacillus jensenii, Lactobacillus iners, y Lactobacillus gasseri. Bacterias ácido-lácticas: Bifidobacterium spp., Enterococcus spp., Mobiluncus spp., Atopobium vaginae, Gardnerella vaginalis, Streptococcus spp. Bacterias no ácido lácticas: Bacteroides spp. (dieta), Prevotella spp. (dieta), Staphylococcus spp. (erupciones vaginales), Enterobacterias (infecciones de orina), Sneathia amnii, Actinomyces, Corynebacterium spp., Fusobacterium spp. Grupo de Candida spp. Tipificación de: Candida albicans y Candida glabrata.",
          costo_regular: 8000.0
        },
        {
          nombre: "Microbioma vaginal extendido",
          incluye: "Básico + Patógenos, Chlamydia trachomatis, Neisseria gonorrhoeae, Trichomonas vaginalis, Mycoplasma hominis, Mycoplasma genitalium, Ureaplasma parvum, Ureaplasma urealyticum, Virus Herpes Simple 1, Virus Herpes Simple 2, Citomegalovirus, Virus Varicella Zoster, Haemophilus drucreyi, Chlamydia trachomatis, Treponema pallidum.",
          costo_regular: 9000.0
        }
      ]
    },
    {
      nombre: "ULTRASONIDOS POR MATERNO FETAL CERTIFICADO",
      nota_categoria: "ULTRASONIDOS SOLO MIERCOLES Y DOMINGOS, PREVIA VERIFICACION DE DISPONIBILIDAD POR MEDICO MATERNO FETAL. SE ENTREGA REPORTE E IMÁGENES DIGITALES",
      servicios: [
        {
          nombre: "Ultrasonido genético/cromosómico (11-14)",
          incluye: "Se realiza entre la semana 11-13.6. Ayuda a detección de aneuploidías, riesgo de parto prematuro, preeclampsia, restricción de crecimiento intrauterino",
          costo_regular: 2000.0,
          costo_gemelar: 3200.0,
          costo_trillizos: 3700.0
        },
        {
          nombre: "Ultrasonido estructural / anatómico",
          incluye: "Se realiza entre la semana 18-22. Ayuda a detección de malformaciones fetales",
          costo_regular: 2000.0,
          costo_gemelar: 3200.0,
          costo_trillizos: 3700.0
        },
        {
          nombre: "Ultrasonido de crecimiento",
          incluye: "Se realiza a partir de la semana 28 de gestación para poder valorar adecuado crecimiento de bebe",
          costo_regular: 2000.0,
          costo_gemelar: 3200.0,
          costo_trillizos: 3700.0
        },
        {
          nombre: "Ultrasonido Doppler / hemodinamia",
          incluye: "Ultrasonido que ayuda a medir el flujo sanguíneo en la placenta, el cordón umbilical y los vasos fetales y uterinos",
          costo_regular: 2000.0,
          costo_gemelar: 3200.0,
          costo_trillizos: 3700.0
        },
        {
          nombre: "NIPT Básico y Asesoría Genética en línea con casos positivos (a partir de la semana 10 de gestación)",
          incluye: "Detección de trisomías en cromosomas 21, 18, 13\nDetección de anomalías en cromosomas X, Y\nDeterminación de género del bebé.\n99.9% certeza.",
          costo_regular: 8500.0
        }
      ]
    }
  ]
}

export function formatPrecio(monto) {
  if (monto === null || monto === undefined) return null
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(monto)
}

export function getEstadisticasServicios() {
  const totalCategorias = SERVICIOS_DATASET.categorias.length
  let totalServicios = 0
  for (const cat of SERVICIOS_DATASET.categorias) {
    totalServicios += cat.servicios.length
  }
  return { totalCategorias, totalServicios }
}

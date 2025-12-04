/**
 * Datos de regiones y comunas de Chile
 * Para autocomplete intuitivo en formularios de envío
 */

export interface Region {
  id: string;
  name: string;
  romanNumber: string;
  comunas: string[];
}

export const regiones: Region[] = [
  {
    id: 'XV',
    name: 'Arica y Parinacota',
    romanNumber: 'XV',
    comunas: ['Arica', 'Camarones', 'General Lagos', 'Putre']
  },
  {
    id: 'I',
    name: 'Tarapacá',
    romanNumber: 'I',
    comunas: ['Alto Hospicio', 'Camiña', 'Colchane', 'Huara', 'Iquique', 'Pica', 'Pozo Almonte']
  },
  {
    id: 'II',
    name: 'Antofagasta',
    romanNumber: 'II',
    comunas: ['Antofagasta', 'Calama', 'María Elena', 'Mejillones', 'Ollagüe', 'San Pedro de Atacama', 'Sierra Gorda', 'Taltal', 'Tocopilla']
  },
  {
    id: 'III',
    name: 'Atacama',
    romanNumber: 'III',
    comunas: ['Alto del Carmen', 'Caldera', 'Chañaral', 'Copiapó', 'Diego de Almagro', 'Freirina', 'Huasco', 'Tierra Amarilla', 'Vallenar']
  },
  {
    id: 'IV',
    name: 'Coquimbo',
    romanNumber: 'IV',
    comunas: ['Andacollo', 'Canela', 'Combarbalá', 'Coquimbo', 'Illapel', 'La Higuera', 'La Serena', 'Los Vilos', 'Monte Patria', 'Ovalle', 'Paihuano', 'Punitaqui', 'Río Hurtado', 'Salamanca', 'Vicuña']
  },
  {
    id: 'V',
    name: 'Valparaíso',
    romanNumber: 'V',
    comunas: ['Algarrobo', 'Cabildo', 'Calle Larga', 'Cartagena', 'Casablanca', 'Catemu', 'Concón', 'El Quisco', 'El Tabo', 'Hijuelas', 'Isla de Pascua', 'Juan Fernández', 'La Calera', 'La Cruz', 'La Ligua', 'Limache', 'Llaillay', 'Los Andes', 'Nogales', 'Olmué', 'Panquehue', 'Papudo', 'Petorca', 'Puchuncaví', 'Putaendo', 'Quillota', 'Quilpué', 'Quintero', 'Rinconada', 'San Antonio', 'San Esteban', 'San Felipe', 'Santa María', 'Santo Domingo', 'Valparaíso', 'Villa Alemana', 'Viña del Mar', 'Zapallar']
  },
  {
    id: 'RM',
    name: 'Metropolitana de Santiago',
    romanNumber: 'RM',
    comunas: [
      'Alhué', 'Buin', 'Calera de Tango', 'Cerrillos', 'Cerro Navia', 'Colina', 'Conchalí', 
      'Curacaví', 'El Bosque', 'El Monte', 'Estación Central', 'Huechuraba', 'Independencia', 
      'Isla de Maipo', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 
      'Lampa', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 
      'María Pinto', 'Melipilla', 'Ñuñoa', 'Padre Hurtado', 'Paine', 'Pedro Aguirre Cerda', 
      'Peñaflor', 'Peñalolén', 'Pirque', 'Providencia', 'Pudahuel', 'Puente Alto', 'Quilicura', 
      'Quinta Normal', 'Recoleta', 'Renca', 'San Bernardo', 'San Joaquín', 'San José de Maipo', 
      'San Miguel', 'San Pedro', 'San Ramón', 'Santiago', 'Talagante', 'Tiltil', 'Vitacura'
    ]
  },
  {
    id: 'VI',
    name: "Libertador General Bernardo O'Higgins",
    romanNumber: 'VI',
    comunas: ['Chimbarongo', 'Chépica', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'La Estrella', 'Las Cabras', 'Litueche', 'Lolol', 'Machalí', 'Malloa', 'Marchihue', 'Mostazal', 'Nancagua', 'Navidad', 'Olivar', 'Palmilla', 'Paredones', 'Peralillo', 'Peumo', 'Pichidegua', 'Pichilemu', 'Placilla', 'Pumanque', 'Quinta de Tilcoco', 'Rancagua', 'Rengo', 'Requínoa', 'San Fernando', 'San Vicente', 'Santa Cruz']
  },
  {
    id: 'VII',
    name: 'Maule',
    romanNumber: 'VII',
    comunas: ['Cauquenes', 'Chanco', 'Colbún', 'Constitución', 'Curepto', 'Curicó', 'Empedrado', 'Hualañé', 'Licantén', 'Linares', 'Longaví', 'Maule', 'Molina', 'Parral', 'Pelarco', 'Pelluhue', 'Pencahue', 'Rauco', 'Retiro', 'Río Claro', 'Romeral', 'Sagrada Familia', 'San Clemente', 'San Javier', 'San Rafael', 'Talca', 'Teno', 'Vichuquén', 'Villa Alegre', 'Yerbas Buenas']
  },
  {
    id: 'XVI',
    name: 'Ñuble',
    romanNumber: 'XVI',
    comunas: ['Bulnes', 'Chillán', 'Chillán Viejo', 'Cobquecura', 'Coelemu', 'Coihueco', 'El Carmen', 'Ninhue', 'Ñiquén', 'Pemuco', 'Pinto', 'Portezuelo', 'Quillón', 'Quirihue', 'Ránquil', 'San Carlos', 'San Fabián', 'San Ignacio', 'San Nicolás', 'Treguaco', 'Yungay']
  },
  {
    id: 'VIII',
    name: 'Biobío',
    romanNumber: 'VIII',
    comunas: ['Alto Biobío', 'Antuco', 'Arauco', 'Cabrero', 'Cañete', 'Chiguayante', 'Concepción', 'Contulmo', 'Coronel', 'Curanilahue', 'Florida', 'Hualpén', 'Hualqui', 'Laja', 'Lebu', 'Los Álamos', 'Los Ángeles', 'Lota', 'Mulchén', 'Nacimiento', 'Negrete', 'Penco', 'Quilaco', 'Quilleco', 'San Pedro de la Paz', 'San Rosendo', 'Santa Bárbara', 'Santa Juana', 'Talcahuano', 'Tirúa', 'Tomé', 'Tucapel', 'Yumbel']
  },
  {
    id: 'IX',
    name: 'La Araucanía',
    romanNumber: 'IX',
    comunas: ['Angol', 'Carahue', 'Cholchol', 'Collipulli', 'Cunco', 'Curacautín', 'Curarrehue', 'Ercilla', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Melipeuco', 'Nueva Imperial', 'Padre Las Casas', 'Perquenco', 'Pitrufquén', 'Pucón', 'Purén', 'Renaico', 'Saavedra', 'Temuco', 'Teodoro Schmidt', 'Toltén', 'Traiguén', 'Victoria', 'Vilcún', 'Villarrica']
  },
  {
    id: 'XIV',
    name: 'Los Ríos',
    romanNumber: 'XIV',
    comunas: ['Corral', 'Futrono', 'La Unión', 'Lago Ranco', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli', 'Río Bueno', 'Valdivia']
  },
  {
    id: 'X',
    name: 'Los Lagos',
    romanNumber: 'X',
    comunas: ['Ancud', 'Calbuco', 'Castro', 'Chaitén', 'Chonchi', 'Cochamó', 'Curaco de Vélez', 'Dalcahue', 'Fresia', 'Frutillar', 'Futaleufú', 'Hualaihué', 'Llanquihue', 'Los Muermos', 'Maullín', 'Osorno', 'Palena', 'Puerto Montt', 'Puerto Octay', 'Puerto Varas', 'Puqueldón', 'Purranque', 'Puyehue', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao', 'Río Negro', 'San Juan de la Costa', 'San Pablo']
  },
  {
    id: 'XI',
    name: 'Aysén del General Carlos Ibáñez del Campo',
    romanNumber: 'XI',
    comunas: ['Aysén', 'Chile Chico', 'Cisnes', 'Cochrane', 'Coyhaique', 'Guaitecas', 'Lago Verde', "O'Higgins", 'Río Ibáñez', 'Tortel']
  },
  {
    id: 'XII',
    name: 'Magallanes y de la Antártica Chilena',
    romanNumber: 'XII',
    comunas: ['Antártica', 'Cabo de Hornos', 'Laguna Blanca', 'Natales', 'Porvenir', 'Primavera', 'Punta Arenas', 'Río Verde', 'San Gregorio', 'Timaukel', 'Torres del Paine']
  }
];

/**
 * Obtener todas las comunas de Chile como array plano
 */
export function getAllComunas(): { comuna: string; region: string; regionId: string }[] {
  const result: { comuna: string; region: string; regionId: string }[] = [];
  
  for (const region of regiones) {
    for (const comuna of region.comunas) {
      result.push({
        comuna,
        region: region.name,
        regionId: region.id
      });
    }
  }
  
  return result.sort((a, b) => a.comuna.localeCompare(b.comuna, 'es'));
}

/**
 * Buscar comunas que coincidan con el query
 */
export function searchComunas(query: string, limit = 10): { comuna: string; region: string; regionId: string }[] {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const allComunas = getAllComunas();
  
  // Primero las que empiezan con el query, luego las que contienen
  const startsWithQuery = allComunas.filter(item => 
    item.comuna.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').startsWith(normalizedQuery)
  );
  
  const containsQuery = allComunas.filter(item => 
    !item.comuna.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').startsWith(normalizedQuery) &&
    item.comuna.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normalizedQuery)
  );
  
  return [...startsWithQuery, ...containsQuery].slice(0, limit);
}

/**
 * Obtener comunas de una región específica
 */
export function getComunasByRegion(regionId: string): string[] {
  const region = regiones.find(r => r.id === regionId);
  return region ? region.comunas.sort((a, b) => a.localeCompare(b, 'es')) : [];
}

/**
 * Obtener la región de una comuna
 */
export function getRegionByComuna(comunaName: string): Region | undefined {
  const normalizedComuna = comunaName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  for (const region of regiones) {
    const found = region.comunas.find(c => 
      c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === normalizedComuna
    );
    if (found) return region;
  }
  
  return undefined;
}

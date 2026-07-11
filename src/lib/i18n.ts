import type { CampaignPage } from "@/content/site";

export type Language = "en" | "es";

export const languageLabels: Record<Language, string> = {
  en: "English",
  es: "Español",
};

const spanishTranslations: Record<string, string> = {
  "Morales for Assembly": "Morales para la Asamblea",
  "New Jersey General Assembly": "Asamblea General de Nueva Jersey",
  "Legislative District 34": "Distrito Legislativo 34",
  "Paid for by Morales for Assembly. Prepared for campaign website review.":
    "Pagado por Morales para la Asamblea. Preparado para la revisión del sitio web de la campaña.",
  Home: "Inicio",
  About: "Acerca de",
  Issues: "Prioridades",
  Events: "Eventos",
  Endorsements: "Respaldos",
  News: "Noticias",
  Contact: "Contacto",
  Volunteer: "Voluntariado",
  Donate: "Donar",
  "Leadership rooted in community. Results built for the future.":
    "Liderazgo arraigado en la comunidad. Resultados para el futuro.",
  "Carmen Morales is bringing steady public-service leadership, local accountability, and practical problem solving to the campaign for New Jersey's Legislative District 34.":
    "Carmen Morales aporta a la campaña del Distrito Legislativo 34 de Nueva Jersey un liderazgo firme de servicio público, responsabilidad local y soluciones prácticas.",
  "Join the Campaign": "Únete a la Campaña",
  "Carmen Morales standing with state leaders in an official State House setting.":
    "Carmen Morales de pie junto a líderes estatales en un entorno oficial de la Casa del Estado.",
  "Students and community leaders recognized inside the Assembly chamber.":
    "Estudiantes y líderes comunitarios reconocidos dentro de la cámara de la Asamblea.",
  "Campaign supporters greeting neighbors at an outdoor community table.":
    "Simpatizantes de la campaña saludando a vecinos en una mesa comunitaria al aire libre.",
  "Public Service": "Servicio Público",
  "A campaign centered on listening first.": "Una campaña centrada primero en escuchar.",
  "From school communities to small businesses, Carmen's work starts with hearing directly from the people who live with the consequences of every policy decision.":
    "Desde comunidades escolares hasta pequeños negocios, el trabajo de Carmen empieza escuchando directamente a las personas que viven las consecuencias de cada decisión política.",
  Momentum: "Impulso",
  "A modern campaign presence for a serious local race.":
    "Una presencia moderna de campaña para una contienda local seria.",
  "This site keeps the design polished and editorial while leaving room for the final domain, donation platform, voter tools, and campaign operations.":
    "Este sitio mantiene un diseño pulido y editorial, dejando espacio para el dominio final, la plataforma de donaciones, las herramientas para votantes y las operaciones de campaña.",
  "Meet Carmen Morales.": "Conoce a Carmen Morales.",
  "Carmen is running to make government more responsive, more transparent, and more connected to families across the district.":
    "Carmen se postula para hacer que el gobierno sea más receptivo, transparente y conectado con las familias de todo el distrito.",
  "Read the Priorities": "Lee las Prioridades",
  "Carmen Morales meeting with state leaders in a formal office.":
    "Carmen Morales reuniéndose con líderes estatales en una oficina formal.",
  "Carmen Morales standing with community leaders at a local gathering.":
    "Carmen Morales de pie junto a líderes comunitarios en una reunión local.",
  "Carmen Morales kneeling beside a child during a community event.":
    "Carmen Morales arrodillada junto a un niño durante un evento comunitario.",
  "Her Story": "Su Historia",
  "A public servant shaped by real conversations.":
    "Una servidora pública formada por conversaciones reales.",
  "Carmen's campaign reflects the neighborhoods, parents, students, workers, and civic leaders who want government to focus on everyday quality of life.":
    "La campaña de Carmen refleja a los vecindarios, padres, estudiantes, trabajadores y líderes cívicos que quieren que el gobierno se enfoque en la calidad de vida diaria.",
  "Why She Is Running": "Por Qué se Postula",
  "Trust is earned face to face.": "La confianza se gana cara a cara.",
  "The campaign is built around showing up consistently, communicating clearly, and turning local priorities into a practical legislative agenda.":
    "La campaña se construye alrededor de estar presente de manera constante, comunicarse con claridad y convertir las prioridades locales en una agenda legislativa práctica.",
  "A practical agenda for stronger communities.":
    "Una agenda práctica para comunidades más fuertes.",
  "The Morales platform focuses on public education, affordability, safe neighborhoods, accessible healthcare, and local economic opportunity.":
    "La plataforma de Morales se enfoca en la educación pública, la asequibilidad, vecindarios seguros, atención médica accesible y oportunidades económicas locales.",
  "Get Involved": "Participa",
  "A graduate facing a full stadium with a decorated cap about continuing forward.":
    "Una graduada frente a un estadio lleno con una gorra decorada sobre seguir adelante.",
  "Residents and organizers gathered for a roundtable listening session.":
    "Residentes y organizadores reunidos para una mesa redonda de escucha.",
  "Carmen Morales visiting with Bloomfield community members outdoors.":
    "Carmen Morales visitando a miembros de la comunidad de Bloomfield al aire libre.",
  Education: "Educación",
  "Invest in students, educators, and safe learning environments.":
    "Invertir en estudiantes, educadores y entornos de aprendizaje seguros.",
  "Every child deserves strong schools, modern supports, and pathways that prepare them for college, careers, and civic life.":
    "Cada niño merece escuelas sólidas, apoyos modernos y caminos que lo preparen para la universidad, el trabajo y la vida cívica.",
  Affordability: "Asequibilidad",
  "Make New Jersey more livable for working families.":
    "Hacer que Nueva Jersey sea más habitable para las familias trabajadoras.",
  "Carmen supports responsible budgeting, housing stability, and relief that helps families stay rooted in the communities they love.":
    "Carmen apoya presupuestos responsables, estabilidad de vivienda y alivio que ayude a las familias a permanecer arraigadas en las comunidades que aman.",
  "Public Safety": "Seguridad Pública",
  "Strengthen trust, prevention, and neighborhood partnerships.":
    "Fortalecer la confianza, la prevención y las alianzas vecinales.",
  "Safer communities come from coordinated services, accountable leadership, and consistent investment in the people closest to the work.":
    "Las comunidades más seguras nacen de servicios coordinados, liderazgo responsable e inversión constante en las personas más cercanas al trabajo.",
  "Meet the campaign on the trail.": "Conoce a la campaña en el camino.",
  "Town halls, community conversations, volunteer briefings, and neighborhood stops keep the campaign close to the people it serves.":
    "Asambleas comunitarias, conversaciones vecinales, reuniones de voluntarios y visitas a los barrios mantienen a la campaña cerca de las personas a quienes sirve.",
  "Volunteer for an Event": "Sé Voluntario en un Evento",
  "Community members gathered inside a coffee shop for a campaign event.":
    "Miembros de la comunidad reunidos dentro de una cafetería para un evento de campaña.",
  "A campaign event podium set up inside an event venue.":
    "Un podio de evento de campaña preparado dentro de un local.",
  "Campaign supporters attending a briefing inside a campaign office.":
    "Simpatizantes de la campaña asistiendo a una reunión informativa dentro de una oficina de campaña.",
  Upcoming: "Próximamente",
  "Community listening sessions.": "Sesiones comunitarias de escucha.",
  "The campaign calendar is ready for upcoming voter-registration events, canvass launches, meet-and-greets, and district town halls.":
    "El calendario de la campaña está listo para próximos eventos de registro de votantes, lanzamientos de canvassing, encuentros comunitarios y asambleas del distrito.",
  Host: "Organiza",
  "Bring Carmen to your neighborhood.": "Trae a Carmen a tu vecindario.",
  "Supporters can host small conversations, invite neighbors, and help the campaign hear from people who are not always in the room.":
    "Los simpatizantes pueden organizar conversaciones pequeñas, invitar a vecinos y ayudar a la campaña a escuchar a personas que no siempre están en la sala.",
  "A growing coalition for accountable leadership.":
    "Una coalición creciente por un liderazgo responsable.",
  "Community leaders, organizers, and neighbors are joining the campaign because they trust Carmen to do the work and stay accessible.":
    "Líderes comunitarios, organizadores y vecinos se están sumando a la campaña porque confían en que Carmen hará el trabajo y se mantendrá accesible.",
  "Endorse Carmen": "Respalda a Carmen",
  "Local supporters standing together with campaign signs.":
    "Simpatizantes locales de pie juntos con carteles de campaña.",
  "Community supporters gathered together at a local venue.":
    "Simpatizantes comunitarios reunidos en un local.",
  "Carmen Morales standing with state leaders in an official setting.":
    "Carmen Morales de pie junto a líderes estatales en un entorno oficial.",
  Leaders: "Líderes",
  "Support from people who know the district.":
    "Apoyo de personas que conocen el distrito.",
  "This section is structured to grow into a full endorsement hub with public officials, labor, civic groups, and community voices.":
    "Esta sección está estructurada para crecer hasta convertirse en un centro completo de respaldos con funcionarios públicos, trabajadores, grupos cívicos y voces comunitarias.",
  Organizations: "Organizaciones",
  "Built for future endorsement updates.": "Preparado para futuras actualizaciones de respaldos.",
  "When official endorsement language is ready, the content can move from static cards into structured campaign entries without redesigning the page.":
    "Cuando el lenguaje oficial de respaldo esté listo, el contenido podrá pasar de tarjetas estáticas a entradas estructuradas de campaña sin rediseñar la página.",
  "Campaign updates and community notes.": "Actualizaciones de campaña y notas comunitarias.",
  "Follow the latest announcements, field updates, endorsements, and photos from the Morales for Assembly campaign.":
    "Sigue los últimos anuncios, actualizaciones de campo, respaldos y fotos de la campaña Morales para la Asamblea.",
  "Contact the Campaign": "Contacta a la Campaña",
  "Student champions and public officials photographed in the Assembly chamber.":
    "Estudiantes destacados y funcionarios públicos fotografiados en la cámara de la Asamblea.",
  "Campaign outreach table set up during a neighborhood event.":
    "Mesa de alcance de campaña instalada durante un evento vecinal.",
  "A listening session with residents around a table.":
    "Una sesión de escucha con residentes alrededor de una mesa.",
  "Field Notes": "Notas de Campo",
  "Listening across the district.": "Escuchando en todo el distrito.",
  "Campaign updates can highlight voter conversations, issue priorities, event recaps, and behind-the-scenes field momentum.":
    "Las actualizaciones de campaña pueden destacar conversaciones con votantes, prioridades, resúmenes de eventos e impulso de campo detrás de escena.",
  Press: "Prensa",
  "A ready space for statements and media releases.":
    "Un espacio listo para declaraciones y comunicados de prensa.",
  "The page is prepared for future campaign news posts and media contact information once the final content calendar is approved.":
    "La página está preparada para futuras noticias de campaña e información de contacto para medios cuando se apruebe el calendario final de contenido.",
  "Get in touch with the campaign.": "Ponte en contacto con la campaña.",
  "Reach the Morales team with questions, event invitations, press inquiries, volunteer interest, and local concerns.":
    "Comunícate con el equipo de Morales para preguntas, invitaciones a eventos, consultas de prensa, interés en voluntariado y preocupaciones locales.",
  "Volunteer Today": "Sé Voluntario Hoy",
  "Carmen Morales speaking with neighbors during a community conversation.":
    "Carmen Morales hablando con vecinos durante una conversación comunitaria.",
  "Carmen Morales connecting with a family at a community event.":
    "Carmen Morales conectando con una familia en un evento comunitario.",
  "Campaign Office": "Oficina de Campaña",
  "A direct line for community questions.": "Una línea directa para preguntas de la comunidad.",
  "The contact form is ready for a future database table or email workflow. It presents the final layout without collecting submissions.":
    "El formulario de contacto está listo para una futura tabla de base de datos o flujo de correo electrónico. Presenta el diseño final sin recopilar envíos.",
  "Media and event requests.": "Solicitudes de medios y eventos.",
  "Campaign staff can use this area for press contacts, event coordination, and stakeholder outreach once official details are confirmed.":
    "El personal de campaña puede usar esta área para contactos de prensa, coordinación de eventos y comunicación con aliados cuando se confirmen los detalles oficiales.",
  "Step forward. Volunteer today.": "Da un paso al frente. Sé voluntario hoy.",
  "Every conversation matters. Join the field team, help with events, share campaign updates, or host a neighborhood conversation.":
    "Cada conversación importa. Únete al equipo de campo, ayuda con eventos, comparte actualizaciones de campaña u organiza una conversación vecinal.",
  "Contact the Team": "Contacta al Equipo",
  "A Morales campaign volunteer recruitment graphic with team photos.":
    "Un gráfico de reclutamiento de voluntarios de la campaña Morales con fotos del equipo.",
  "Volunteers and organizers gathered for a campaign briefing.":
    "Voluntarios y organizadores reunidos para una sesión informativa de campaña.",
  "Volunteers speaking with neighbors at a community outreach table.":
    "Voluntarios hablando con vecinos en una mesa de alcance comunitario.",
  Field: "Campo",
  "Canvass, call, text, and welcome voters.": "Toca puertas, llama, envía mensajes y recibe a los votantes.",
  "The volunteer page is ready to connect with a future signup flow after the campaign chooses its data process.":
    "La página de voluntariado está lista para conectarse con un futuro flujo de inscripción cuando la campaña elija su proceso de datos.",
  Community: "Comunidad",
  "Host a conversation or bring friends to an event.":
    "Organiza una conversación o lleva amigos a un evento.",
  "Supporters can help the campaign grow by making introductions, sharing local concerns, and bringing new voices into the work.":
    "Los simpatizantes pueden ayudar a que la campaña crezca haciendo presentaciones, compartiendo preocupaciones locales y trayendo nuevas voces al trabajo.",
  "Invest in a stronger district.": "Invierte en un distrito más fuerte.",
  "Contributions help the campaign reach voters, organize volunteers, print materials, and keep the message visible across the district.":
    "Las contribuciones ayudan a la campaña a llegar a votantes, organizar voluntarios, imprimir materiales y mantener el mensaje visible en todo el distrito.",
  "Volunteer Instead": "Prefiero Ser Voluntario",
  "Carmen Morales with public officials inside a formal chamber.":
    "Carmen Morales con funcionarios públicos dentro de una cámara formal.",
  "Supporters gathered with campaign signs at a local endorsement event.":
    "Simpatizantes reunidos con carteles de campaña en un evento local de respaldo.",
  Contribute: "Contribuye",
  "Fuel voter contact and campaign visibility.": "Impulsa el contacto con votantes y la visibilidad de la campaña.",
  "This page includes the donation layout. The final contribution link can be connected when the campaign selects its compliance-approved payment platform.":
    "Esta página incluye el diseño de donaciones. El enlace final de contribución se puede conectar cuando la campaña seleccione su plataforma de pagos aprobada por cumplimiento.",
  Compliance: "Cumplimiento",
  "Prepared for final legal language.": "Preparado para el lenguaje legal final.",
  "The footer and contribution content are intentionally easy to update once the campaign treasurer confirms the required disclaimer text.":
    "El pie de página y el contenido de contribuciones son intencionalmente fáciles de actualizar cuando el tesorero de la campaña confirme el texto legal requerido.",
  "A Voice for Our Future": "Una Voz para Nuestro Futuro",
  "Committed to transparent leadership, economic vitality, and bringing genuine progress to our communities. Join the movement for a stronger district.":
    "Comprometida con el liderazgo transparente, la vitalidad económica y el progreso real para nuestras comunidades. Únete al movimiento por un distrito más fuerte.",
  "Contribute Now": "Contribuye Ahora",
  "Countdown to Election": "Cuenta Regresiva para la Elección",
  Days: "Días",
  Hours: "Horas",
  Mins: "Min",
  Secs: "Seg",
  "November 3rd": "3 de Noviembre",
  "On the Trail": "En el Camino",
  "Join Us on the Trail": "Únete en el Camino",
  "Our Priorities": "Nuestras Prioridades",
  "A Life Dedicated to Public Service.": "Una Vida Dedicada al Servicio Público.",
  "A Vision for Modern Statesmanship.": "Una Visión para un Liderazgo Público Moderno.",
  '"Progress through practical, proven solutions."': '"Progreso mediante soluciones prácticas y comprobadas."',
  "The Mission": "La Misión",
  "Restoring Trust, Delivering Results": "Restaurar la Confianza, Lograr Resultados",
  "We are at a crossroads. It is time for leadership that prioritizes community over politics. Carmen brings public-service experience with a fresh, modern approach to solving the district's toughest challenges.":
    "Estamos en una encrucijada. Es momento de un liderazgo que priorice la comunidad por encima de la política. Carmen aporta experiencia de servicio público con un enfoque fresco y moderno para resolver los desafíos más difíciles del distrito.",
  "A Leader Who Listens": "Una Líder que Escucha",
  "From local meetings to the State House, Carmen keeps an open door and a clear connection to the people she serves.":
    "Desde reuniones locales hasta la Casa del Estado, Carmen mantiene una puerta abierta y una conexión clara con las personas a quienes sirve.",
  "Read Full Bio": "Lee la Biografía Completa",
  "Integrity First": "Integridad Primero",
  "Economic Vitality": "Vitalidad Económica",
  "Key Priorities": "Prioridades Clave",
  "Issues That Matter": "Prioridades que Importan",
  "View All Issues": "Ver Todas las Prioridades",
  "Investing in Our Future Generations": "Invertir en Nuestras Futuras Generaciones",
  "We must ensure every child has access to world-class public education, modern classrooms, and stable support systems.":
    "Debemos asegurar que cada niño tenga acceso a educación pública de primer nivel, aulas modernas y sistemas de apoyo estables.",
  "Read Plan": "Lee el Plan",
  "Accessible & Affordable Care": "Atención Accesible y Asequible",
  "Building for Tomorrow": "Construir para Mañana",
  "Why I'm Running": "Por Qué Me Postulo",
  "The challenges we face require steady, principled leadership. It is time to build a future that works for everyone.":
    "Los desafíos que enfrentamos requieren un liderazgo firme y con principios. Es hora de construir un futuro que funcione para todos.",
  "Protecting Public Education": "Proteger la Educación Pública",
  "Accessible Healthcare": "Atención Médica Accesible",
  "Healthcare is a basic human right. No family should face financial ruin because of care.":
    "La atención médica es un derecho humano básico. Ninguna familia debería enfrentar ruina financiera por recibir cuidado.",
  "A Sustainable Economy": "Una Economía Sostenible",
  "Creating pathways for good-paying union jobs and resilient infrastructure.":
    "Crear caminos hacia empleos sindicales bien remunerados e infraestructura resiliente.",
  "Roots in the Community.": "Raíces en la Comunidad.",
  "Early Life & Education": "Infancia y Educación",
  '"I learned the value of hard work from the families who keep our communities moving every single day."':
    '"Aprendí el valor del trabajo duro de las familias que mantienen nuestras comunidades en movimiento todos los días."',
  Priority: "Prioridad",
  "Investing heavily in early childhood education and modernizing public school infrastructure.":
    "Invertir fuertemente en educación infantil temprana y modernizar la infraestructura de las escuelas públicas.",
  "Learn More": "Más Información",
  "Investing in students, educators, and modern public school infrastructure across every community.":
    "Invertir en estudiantes, educadores e infraestructura escolar pública moderna en cada comunidad.",
  "Strengthening prevention, response times, and trust between neighborhoods and local responders.":
    "Fortalecer la prevención, los tiempos de respuesta y la confianza entre vecindarios y equipos locales de respuesta.",
  "Taxes & Economy": "Impuestos y Economía",
  "Relieving pressure on working families while keeping local business corridors competitive.":
    "Aliviar la presión sobre las familias trabajadoras mientras se mantienen competitivos los corredores comerciales locales.",
  "Healthcare Access": "Acceso a la Salud",
  "Expanding affordable care, lowering prescription costs, and protecting essential services.":
    "Ampliar la atención asequible, reducir los costos de medicamentos recetados y proteger servicios esenciales.",
  Transportation: "Transporte",
  "Repairing aging roads, improving transit reliability, and connecting residents to opportunity.":
    "Reparar carreteras envejecidas, mejorar la confiabilidad del transporte y conectar a los residentes con oportunidades.",
  "Small Business": "Pequeños Negocios",
  "Cutting unnecessary red tape and expanding grants, storefront support, and innovation hubs.":
    "Reducir trámites innecesarios y ampliar subvenciones, apoyo a comercios e innovación local.",
  Housing: "Vivienda",
  "Addressing affordability with practical zoning reforms, tenant stability, and sustainable development.":
    "Abordar la asequibilidad con reformas prácticas de zonificación, estabilidad para inquilinos y desarrollo sostenible.",
  "Upcoming Events": "Próximos Eventos",
  "Featured campaign stops and public gatherings.": "Paradas destacadas de campaña y reuniones públicas.",
  "Town Hall": "Asamblea Comunitaria",
  "Oct 24": "24 de Oct",
  "Economic Future of the Central District": "Futuro Económico del Distrito Central",
  "Central Library Atrium": "Atrio de la Biblioteca Central",
  RSVP: "Confirmar",
  "Meet & Greet": "Encuentro",
  "Oct 26": "26 de Oct",
  "Coffee with the Candidate": "Café con la Candidata",
  "Brew & Bake": "Brew & Bake",
  "RSVP Now": "Confirma Ahora",
  Fundraiser: "Recaudación",
  "Nov 02": "2 de Nov",
  "Founders Circle Dinner": "Cena del Círculo Fundador",
  "The Newark Room": "The Newark Room",
  "Get Tickets": "Consigue Boletos",
  "Fall Harvest Festival Parade": "Desfile del Festival de Cosecha de Otoño",
  "Carmen and the team will be marching in the annual parade. Join our volunteer wave.":
    "Carmen y el equipo marcharán en el desfile anual. Únete a nuestro grupo de voluntarios.",
  "Join Volunteers": "Únete a Voluntarios",
  "Full Calendar": "Calendario Completo",
  "We are across the district every day. View upcoming canvasses, community stops, and meetings.":
    "Estamos por todo el distrito todos los días. Mira los próximos canvasses, visitas comunitarias y reuniones.",
  November: "Noviembre",
  Sun: "Dom",
  Mon: "Lun",
  Tue: "Mar",
  Wed: "Mié",
  Thu: "Jue",
  Fri: "Vie",
  Sat: "Sáb",
  "Read Update": "Lee la Actualización",
  "Send a note to the campaign.": "Envía una nota a la campaña.",
  "This public preview keeps the form static. The markup is ready for a future database insert or email workflow when the final backend is approved.":
    "Esta vista pública mantiene el formulario estático. La estructura está lista para una futura inserción en base de datos o flujo de correo electrónico cuando se apruebe el backend final.",
  "Send Message": "Enviar Mensaje",
  "Volunteer Signup": "Inscripción de Voluntarios",
  "Tell the team how you want to help.": "Dile al equipo cómo quieres ayudar.",
  "Choose a field role, event role, or hosting opportunity and the campaign can connect this form to the final backend later.":
    "Elige un rol de campo, un rol de evento o una oportunidad de anfitrión, y la campaña podrá conectar este formulario al backend final más adelante.",
  "Sign Up": "Inscribirme",
  "Secure Contribution": "Contribución Segura",
  "Choose an amount.": "Elige una cantidad.",
  "Final donation processing should connect to the campaign's compliance-approved donation provider after domains and payment setup are confirmed.":
    "El procesamiento final de donaciones debe conectarse al proveedor aprobado por cumplimiento de la campaña cuando se confirmen los dominios y la configuración de pagos.",
  Name: "Nombre",
  Email: "Correo Electrónico",
  Interest: "Interés",
  Canvassing: "Tocar Puertas",
  "Phone bank": "Banco Telefónico",
  "Host a conversation": "Organizar una Conversación",
  Message: "Mensaje",
  "Join us on the trail.": "Únete en el camino.",
  "Join the Movement": "Únete al Movimiento",
  "Sign up for event updates and volunteer opportunities in your neighborhood.":
    "Inscríbete para recibir actualizaciones de eventos y oportunidades de voluntariado en tu vecindario.",
  "Sign up to receive campaign updates, volunteer opportunities, and news from the trail.":
    "Inscríbete para recibir actualizaciones de campaña, oportunidades de voluntariado y noticias del camino.",
  "Email Address": "Correo Electrónico",
  Subscribe: "Suscribirme",
  "Transparent, accountable, district-first leadership in every decision.":
    "Liderazgo transparente, responsable y centrado en el distrito en cada decisión.",
  "Practical plans for working families and seniors across the district.":
    "Planes prácticos para familias trabajadoras y adultos mayores en todo el distrito.",
  "Page not found": "Página no encontrada",
  "That campaign page is not available.": "Esa página de campaña no está disponible.",
  "Return Home": "Volver al Inicio",
  "Language": "Idioma",
  "Translate site": "Traducir sitio",
  "Switch to Spanish": "Cambiar a español",
  "Switch to English": "Cambiar a inglés",
  "Main navigation": "Navegación principal",
  "Footer navigation": "Navegación del pie de página",
  "Mobile navigation": "Navegación móvil",
  "Donate Now": "Donar Ahora",
};

export function translateText(text: string, language: Language): string {
  if (language === "en") return text;

  return spanishTranslations[text] ?? text;
}

export function getMissingSpanishTranslations(values: string[]): string[] {
  return Array.from(new Set(values)).filter((value) => !spanishTranslations[value]);
}

export function translateCampaignPage(page: CampaignPage, language: Language): CampaignPage {
  if (language === "en") return page;

  return {
    ...page,
    navLabel: translateText(page.navLabel, language),
    title: translateText(page.title, language),
    eyebrow: page.eyebrow ? translateText(page.eyebrow, language) : undefined,
    summary: translateText(page.summary, language),
    ctaLabel: page.ctaLabel ? translateText(page.ctaLabel, language) : undefined,
    images: page.images.map((image) => ({
      ...image,
      alt: translateText(image.alt, language),
    })),
    sections: page.sections.map((section) => ({
      ...section,
      kicker: section.kicker ? translateText(section.kicker, language) : undefined,
      title: translateText(section.title, language),
      body: translateText(section.body, language),
    })),
  };
}

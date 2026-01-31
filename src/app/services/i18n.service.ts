import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Language = 'fr' | 'es';

interface Translations {
  [key: string]: {
    fr: string;
    es: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private platformId = inject(PLATFORM_ID);
  private currentLanguage = signal<Language>('fr');
  
  language = computed(() => this.currentLanguage());


  private translations: Translations = {
    // Navegación
    'nav.dashboard': { fr: 'Tableau de bord', es: 'Panel de control' },
    'nav.payments': { fr: 'Paiements', es: 'Pagos' },
    'nav.suppliers': { fr: 'Fournisseurs', es: 'Proveedores' },
    'nav.clients': { fr: 'Clients', es: 'Clientes' },
    'nav.cards': { fr: 'Cartes de crédit', es: 'Tarjetas de crédito' },
    'nav.accounts': { fr: 'Comptes bancaires', es: 'Cuentas bancarias' },
    'nav.documents': { fr: 'Documents', es: 'Documentos' },
    'nav.emails': { fr: 'Courriels', es: 'Correos' },
    'nav.users': { fr: 'Utilisateurs', es: 'Usuarios' },
    'nav.audit': { fr: 'Audit', es: 'Auditoría' },
    'nav.settings': { fr: 'Paramètres', es: 'Configuración' },
    'nav.logout': { fr: 'Déconnexion', es: 'Cerrar sesión' },

    // Dashboard
    'dashboard.title': { fr: 'Tableau de bord', es: 'Panel de control' },
    'dashboard.welcome': { fr: 'Bienvenue au panneau d\'administration', es: 'Bienvenido al panel de administración' },
    'dashboard.stats_summary': { fr: 'Résumé des transactions et états', es: 'Resumen de transacciones y estados' },
    'dashboard.total_payments': { fr: 'Total des paiements', es: 'Pagos Totales' },
    'dashboard.pending_payments': { fr: 'Paiements en attente', es: 'Pagos pendientes' },
    'dashboard.pending_verify': { fr: 'En attente de vérification', es: 'Pendientes de verificar' },
    'dashboard.paid': { fr: 'Payés', es: 'Pagados' },
    'dashboard.verified': { fr: 'Vérifiés', es: 'Verificados' },
    'dashboard.pending_emails': { fr: 'Courriels en attente', es: 'Correos pendientes' },
    'dashboard.sent_emails': { fr: 'Courriels envoyés', es: 'Correos enviados' },
    'dashboard.monthly_total': { fr: 'Total du mois', es: 'Total del mes' },
    'dashboard.top_suppliers': { fr: 'Top Fournisseurs', es: 'Top Proveedores' },
    'dashboard.recent_activity': { fr: 'Activité récente', es: 'Actividad reciente' },
    'dashboard.payment_methods': { fr: 'Moyens de paiement', es: 'Medios de pago' },
    'dashboard.view_all': { fr: 'Tout voir', es: 'Ver todos' },

    // Pagos
    'payments.title': { fr: 'Gestion des paiements', es: 'Gestión de pagos' },
    'payments.new': { fr: 'Nouveau paiement', es: 'Nuevo pago' },
    'payments.code': { fr: 'Code de réservation', es: 'Código de reserva' },
    'payments.amount': { fr: 'Montant', es: 'Monto' },
    'payments.currency': { fr: 'Devise', es: 'Moneda' },
    'payments.supplier': { fr: 'Fournisseur', es: 'Proveedor' },
    'payments.client': { fr: 'Client', es: 'Cliente' },
    'payments.method': { fr: 'Moyen de paiement', es: 'Medio de pago' },
    'payments.status': { fr: 'Statut', es: 'Estado' },
    'payments.date': { fr: 'Date', es: 'Fecha' },
    'payments.actions': { fr: 'Actions', es: 'Acciones' },
    'payments.count': { fr: 'paiements', es: 'pagos' },
    'payments.non_verified': { fr: 'Non vérifié', es: 'No verificado' },
    'payments.edit_title': { fr: 'Modifier le paiement', es: 'Editar pago' },
    'payments.new_title': { fr: 'Nouveau paiement', es: 'Nuevo pago' },
    'payments.info_section': { fr: 'Informations du paiement', es: 'Información del pago' },
    'payments.select_method': { fr: 'Sélectionner un moyen de paiement', es: 'Seleccionar un medio de pago' },
    'payments.select_supplier': { fr: 'Sélectionner un fournisseur', es: 'Seleccionar un proveedor' },
    'payments.select_client': { fr: 'Sélectionner un client', es: 'Seleccionar un cliente' },
    'payments.select_card_hint': { fr: 'Sélectionner une carte', es: 'Selecciona una tarjeta' },
    'payments.select_account_hint': { fr: 'Sélectionner un compte', es: 'Selecciona una cuenta' },
    'payments.associated_clients': { fr: 'Clients associés (hôtels)', es: 'Clientes asociados (hoteles)' },
    'payments.add_client_placeholder': { fr: 'Ajouter un client...', es: 'Ajouter un client...' },
    'payments.expected_debit_date': { fr: 'Date prévue de débit', es: 'Fecha esperada de débito' },
    'payments.pago': { fr: 'Paiement', es: 'Pago' },
    'payments.verificacion': { fr: 'Vérification', es: 'Verificación' },

    // Estados
    'status.pending': { fr: 'En attente', es: 'Pendiente' },
    'status.paid': { fr: 'Payé', es: 'Pagado' },
    'status.verified': { fr: 'Vérifié', es: 'Verificado' },
    'status.draft': { fr: 'Brouillon', es: 'Borrador' },
    'status.sent': { fr: 'Envoyé', es: 'Enviado' },
    'status.active': { fr: 'Actif', es: 'Activo' },
    'status.inactive': { fr: 'Inactif', es: 'Inactivo' },

    // Proveedores
    'suppliers.title': { fr: 'Gestion des fournisseurs', es: 'Gestión de proveedores' },
    'suppliers.new': { fr: 'Nouveau fournisseur', es: 'Nuevo proveedor' },
    'suppliers.name': { fr: 'Nom', es: 'Nombre' },
    'suppliers.service': { fr: 'Service', es: 'Servicio' },
    'suppliers.language': { fr: 'Langue', es: 'Idioma' },
    'suppliers.emails': { fr: 'Courriels', es: 'Correos' },
    'suppliers.phone': { fr: 'Téléphone', es: 'Teléfono' },
    'suppliers.count': { fr: 'fournisseurs actifs', es: 'proveedores activos' },

    // Clientes
    'clients.title': { fr: 'Gestion des clients', es: 'Gestión de clientes' },
    'clients.new': { fr: 'Nouveau client', es: 'Nuevo cliente' },
    'clients.name': { fr: 'Nom', es: 'Nombre' },
    'clients.location': { fr: 'Emplacement', es: 'Ubicación' },
    'clients.email': { fr: 'Courriel', es: 'Correo' },
    'clients.count': { fr: 'clients enregistrés', es: 'clientes registrados' },
    'clients.name_placeholder': { fr: 'Nom de l\'hôtel/client', es: 'Nombre del hotel/cliente' },
    'clients.location_placeholder': { fr: 'Ville, Province', es: 'Ciudad, Provincia' },

    // Tarjetas
    'cards.title': { fr: 'Cartes de crédit', es: 'Tarjetas de crédito' },
    'cards.new': { fr: 'Nouvelle carte', es: 'Nueva tarjeta' },
    'cards.holder': { fr: 'Titulaire', es: 'Titular' },
    'cards.last4': { fr: '4 derniers chiffres', es: 'Últimos 4 dígitos' },
    'cards.limit': { fr: 'Limite mensuelle', es: 'Límite mensual' },
    'cards.available': { fr: 'Disponible', es: 'Disponible' },
    'cards.type': { fr: 'Type', es: 'Tipo' },
    'cards.count': { fr: 'cartes', es: 'tarjetas' },
    'cards.holder_placeholder': { fr: 'Nom du titulaire', es: 'Nombre del titular' },

    // Cuentas bancarias
    'accounts.title': { fr: 'Comptes bancaires', es: 'Cuentas bancarias' },
    'accounts.new': { fr: 'Nouveau compte', es: 'Nueva cuenta' },
    'accounts.bank': { fr: 'Banque', es: 'Banco' },
    'accounts.name': { fr: 'Nom du compte', es: 'Nombre de cuenta' },
    'accounts.count': { fr: 'comptes', es: 'cuentas' },
    'accounts.select_bank': { fr: 'Sélectionner une banque', es: 'Seleccionar un banco' },
    'accounts.name_placeholder': { fr: 'Ex: Compte Opérations', es: 'Ej: Cuenta Operaciones' },

    // Documentos
    'documents.title': { fr: 'Gestion des documents', es: 'Gestión de documentos' },
    'documents.upload': { fr: 'Télécharger', es: 'Subir' },
    'documents.type': { fr: 'Type', es: 'Tipo' },
    'documents.invoice': { fr: 'Facture', es: 'Factura' },
    'documents.bank_doc': { fr: 'Document bancaire', es: 'Documento bancario' },
    'documents.filename': { fr: 'Nom du fichier', es: 'Nombre del archivo' },
    'documents.uploaded_by': { fr: 'Téléchargé par', es: 'Subido por' },
    'documents.count': { fr: 'documents', es: 'documentos' },
    'documents.upload_title': { fr: 'Télécharger un document', es: 'Subir documento' },
    'documents.view_title': { fr: 'Détail du document', es: 'Detalle del documento' },
    'documents.invoice_desc': { fr: 'Facture du fournisseur', es: 'Factura del proveedor' },
    'documents.bank_doc_desc': { fr: 'Relevé bancaire pour vérification', es: 'Extracto bancario para verificación' },
    'documents.bank_info_text': { fr: 'Les documents bancaires sont utilisés pour vérifier les paiements. Une fois téléchargé, vous pourrez sélectionner les paiements à marquer comme vérifiés.', es: 'Los documentos bancarios se usan para verificar pagos. Una vez subido, podrás seleccionar los pagos a marcar como verificados.' },
    'documents.dropzone_text': { fr: 'Glissez-déposez un fichier ici ou', es: 'Arrastra un archivo aquí o' },
    'documents.file': { fr: 'Fichier', es: 'Archivo' },
    'documents.uploaded_date': { fr: 'Date de téléchargement', es: 'Fecha de subida' },
    'documents.preview_placeholder': { fr: 'Aperçu du document non disponible', es: 'Vista previa no disponible' },

    // Correos
    'emails.title': { fr: 'Gestion des courriels', es: 'Gestión de correos' },
    'emails.compose': { fr: 'Composer', es: 'Redactar' },
    'emails.subject': { fr: 'Objet', es: 'Asunto' },
    'emails.recipient': { fr: 'Destinataire', es: 'Destinatario' },
    'emails.payment_count': { fr: 'Nombre de paiements', es: 'Cantidad de pagos' },
    'emails.total_amount': { fr: 'Montant total', es: 'Monto total' },
    'emails.pending_count': { fr: 'en attente', es: 'pendientes' },
    'emails.sent_count': { fr: 'envoyés', es: 'enviados' },
    'emails.detail_title': { fr: 'Détail du courriel', es: 'Detalle del correo' },
    'emails.payments_included': { fr: 'Paiements inclus', es: 'Pagos incluidos' },
    'emails.payment_to_include': { fr: 'Paiements à inclure', es: 'Pagos a incluir' },
    'emails.body': { fr: 'Corps du message', es: 'Cuerpo del mensaje' },
    'emails.new_title': { fr: 'Nouveau courriel', es: 'Nuevo correo' },
    'emails.edit_title': { fr: 'Modifier le courriel', es: 'Editar correo' },
    'emails.sent': { fr: 'Envoyé', es: 'Enviado' },
    'emails.pending': { fr: 'En attente', es: 'Pendiente' },

    // Usuarios  
    'users.title': { fr: 'Gestion des utilisateurs', es: 'Gestión de usuarios' },
    'users.new': { fr: 'Nouvel utilisateur', es: 'Nuevo usuario' },
    'users.username': { fr: 'Nom d\'utilisateur', es: 'Nombre de usuario' },
    'users.fullname': { fr: 'Nom complet', es: 'Nombre completo' },
    'users.role': { fr: 'Rôle', es: 'Rol' },
    'users.email': { fr: 'Courriel', es: 'Correo' },
    'users.count': { fr: 'utilisateurs', es: 'usuarios' },
    'users.no_edit_hint': { fr: 'Ne peut pas être modifié après création', es: 'No se puede modificar después de crear' },
    'users.fullname_placeholder': { fr: 'Prénom Nom', es: 'Nombre Apellido' },
    'users.password': { fr: 'Mot de passe', es: 'Contraseña' },
    'users.password_hint': { fr: 'Minimum 8 caractères', es: 'Mínimo 8 caracteres' },

    // Auditoría
    'audit.title': { fr: 'Journal d\'audit', es: 'Registro de auditoría' },
    'audit.event': { fr: 'Événement', es: 'Evento' },
    'audit.user': { fr: 'Utilisateur', es: 'Usuario' },
    'audit.entity': { fr: 'Entité', es: 'Entidad' },
    'audit.description': { fr: 'Description', es: 'Descripción' },
    'audit.date': { fr: 'Date', es: 'Fecha' },
    'audit.ip': { fr: 'IP', es: 'IP' },
    'audit.detail_title': { fr: 'Détail de l\'événement', es: 'Detalle del evento' },
    'audit.all_types': { fr: 'Tous les types', es: 'Todos los tipos' },
    'audit.type_login': { fr: 'Connexion', es: 'Inicio sesión' },
    'audit.type_create': { fr: 'Création', es: 'Creación' },
    'audit.type_update': { fr: 'Mise à jour', es: 'Actualización' },
    'audit.type_delete': { fr: 'Suppression', es: 'Eliminación' },
    'audit.type_verify': { fr: 'Vérification', es: 'Verificación' },
    'audit.type_email': { fr: 'Envoi courriel', es: 'Envío correo' },

    // Acciones comunes
    'actions.save': { fr: 'Enregistrer', es: 'Guardar' },
    'actions.cancel': { fr: 'Annuler', es: 'Cancelar' },
    'actions.delete': { fr: 'Supprimer', es: 'Eliminar' },
    'actions.edit': { fr: 'Modifier', es: 'Editar' },
    'actions.view': { fr: 'Voir', es: 'Ver' },
    'actions.search': { fr: 'Rechercher', es: 'Buscar' },
    'actions.filter': { fr: 'Filtrer', es: 'Filtrar' },
    'actions.export': { fr: 'Exporter', es: 'Exportar' },
    'actions.refresh': { fr: 'Actualiser', es: 'Actualizar' },
    'actions.confirm': { fr: 'Confirmer', es: 'Confirmar' },
    'actions.send': { fr: 'Envoyer', es: 'Enviar' },
    'actions.upload': { fr: 'Télécharger', es: 'Subir' },
    'actions.browse': { fr: 'Parcourir', es: 'Seleccionar' },
    'actions.select': { fr: 'Sélectionner', es: 'Seleccionar' },
    'actions.save_draft': { fr: 'Enregistrer comme brouillon', es: 'Guardar como borrador' },
    'actions.view_detail': { fr: 'Détail', es: 'Detalle' },
    'actions.assoc_payment': { fr: 'Associer au paiement', es: 'Asociar a pago' },
    'actions.edit_user': { fr: 'Modifier l\'utilisateur', es: 'Editar usuario' },
    'actions.new_user': { fr: 'Nouvel utilisateur', es: 'Nuevo usuario' },
    'actions.edit_client': { fr: 'Modifier le client', es: 'Editar cliente' },
    'actions.new_client': { fr: 'Nouveau client', es: 'Nuevo cliente' },
    'actions.edit_account': { fr: 'Modifier le compte', es: 'Editar cuenta' },
    'actions.new_account': { fr: 'Nouveau compte', es: 'Nuevo cuenta' },
    'actions.edit_card': { fr: 'Modifier la carte', es: 'Editar tarjeta' },
    'actions.new_card': { fr: 'Nouvelle carte', es: 'Nueva tarjeta' },
    'actions.add_email': { fr: 'Ajouter un courriel', es: 'Ajouter un courriel' },
    'actions.principal': { fr: 'Principal', es: 'Principal' },
    'actions.new_supplier': { fr: 'Nouveau fournisseur', es: 'Nuevo proveedor' },
    'actions.edit_supplier': { fr: 'Modifier le fournisseur', es: 'Editar proveedor' },
    'actions.select_service': { fr: 'Sélectionner un service', es: 'Seleccionar un servicio' },
    'actions.supplier_name_placeholder': { fr: 'Nom du fournisseur', es: 'Nombre del proveedor' },
    'actions.open_full': { fr: 'Ouvrir complet', es: 'Abrir completo' },

    // Services
    'service.assurance': { fr: 'Assurance', es: 'Seguros' },
    'service.comptable': { fr: 'Comptable', es: 'Contable' },
    'service.cadeaux': { fr: 'Cadeaux et invitations', es: 'Regalos e invitaciones' },
    'service.bureau': { fr: 'Bureau / équipement / internet, téléphonie', es: 'Oficina / equipos / internet, telefonía' },
    'service.voyage': { fr: 'Voyage de reco', es: 'Viaje de reconocimiento' },
    'service.coworking': { fr: 'Frais coworking/cafés', es: 'Gastos coworking/cafés' },
    'service.hotels': { fr: 'Hotels', es: 'Hoteles' },
    'service.operations': { fr: 'Opérations clients (Services/activités/guides/entrées/transports)', es: 'Operaciones clientes (Servicios/actividades/guías/entradas/transportes)' },
    'service.promotion': { fr: 'Promotion de l\'agence', es: 'Promoción de la agencia' },
    'service.salaires': { fr: 'Salaires', es: 'Salarios' },

    // Filters
    'filter.all_services': { fr: 'Tous les services', es: 'Todos los servicios' },
    'filter.all_status': { fr: 'Tous les statuts', es: 'Todos los estados' },
    'filter.all_methods': { fr: 'Tous les moyens', es: 'Todos los medios' },
    'filter.cards': { fr: 'Cartes', es: 'Tarjetas' },
    'filter.accounts': { fr: 'Comptes', es: 'Cuentas' },

    // Roles
    'role.admin': { fr: 'Administrateur', es: 'Administrador' },
    'role.supervisor': { fr: 'Superviseur', es: 'Supervisor' },
    'role.equipo': { fr: 'Équipe', es: 'Equipo' },

    // Header
    'header.search': { fr: 'Rechercher...', es: 'Buscar...' },
    'header.notifications': { fr: 'Notifications', es: 'Notificaciones' },
    'header.theme': { fr: 'Thème', es: 'Tema' },
    'header.profile': { fr: 'Profil', es: 'Perfil' },

    // Feedback
    'msg.no_data': { fr: 'Aucune donnée disponible', es: 'No hay datos disponibles' },
    'msg.loading': { fr: 'Chargement...', es: 'Cargando...' },
    'msg.confirm_delete_payment': { fr: 'Êtes-vous sûr de vouloir supprimer ce paiement ?', es: '¿Está seguro de que desea eliminar este pago?' },
  };

  constructor() {
    this.loadLanguage();
  }

  private loadLanguage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('terra-language') as Language;
      if (saved && (saved === 'fr' || saved === 'es')) {
        this.currentLanguage.set(saved);
      }
    }
  }

  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('terra-language', lang);
    }
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage() === 'fr' ? 'es' : 'fr';
    this.setLanguage(newLang);
  }

  t(key: string): string {
    const translation = this.translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[this.currentLanguage()];
  }
}

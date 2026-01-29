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
    'dashboard.pending_payments': { fr: 'Paiements en attente', es: 'Pagos pendientes' },
    'dashboard.paid': { fr: 'Payés', es: 'Pagados' },
    'dashboard.verified': { fr: 'Vérifiés', es: 'Verificados' },
    'dashboard.pending_emails': { fr: 'Courriels en attente', es: 'Correos pendientes' },
    'dashboard.sent_emails': { fr: 'Courriels envoyés', es: 'Correos enviados' },
    'dashboard.monthly_total': { fr: 'Total du mois', es: 'Total del mes' },
    'dashboard.top_suppliers': { fr: 'Top Fournisseurs', es: 'Top Proveedores' },
    'dashboard.recent_activity': { fr: 'Activité récente', es: 'Actividad reciente' },
    'dashboard.payment_methods': { fr: 'Moyens de paiement', es: 'Medios de pago' },

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

    // Clientes
    'clients.title': { fr: 'Gestion des clients', es: 'Gestión de clientes' },
    'clients.new': { fr: 'Nouveau client', es: 'Nuevo cliente' },
    'clients.name': { fr: 'Nom', es: 'Nombre' },
    'clients.location': { fr: 'Emplacement', es: 'Ubicación' },
    'clients.email': { fr: 'Courriel', es: 'Correo' },

    // Tarjetas
    'cards.title': { fr: 'Cartes de crédit', es: 'Tarjetas de crédito' },
    'cards.new': { fr: 'Nouvelle carte', es: 'Nueva tarjeta' },
    'cards.holder': { fr: 'Titulaire', es: 'Titular' },
    'cards.last4': { fr: '4 derniers chiffres', es: 'Últimos 4 dígitos' },
    'cards.limit': { fr: 'Limite mensuelle', es: 'Límite mensual' },
    'cards.available': { fr: 'Disponible', es: 'Disponible' },
    'cards.type': { fr: 'Type', es: 'Tipo' },

    // Cuentas bancarias
    'accounts.title': { fr: 'Comptes bancaires', es: 'Cuentas bancarias' },
    'accounts.new': { fr: 'Nouveau compte', es: 'Nueva cuenta' },
    'accounts.bank': { fr: 'Banque', es: 'Banco' },
    'accounts.name': { fr: 'Nom du compte', es: 'Nombre de cuenta' },

    // Documentos
    'documents.title': { fr: 'Gestion des documents', es: 'Gestión de documentos' },
    'documents.upload': { fr: 'Télécharger', es: 'Subir' },
    'documents.type': { fr: 'Type', es: 'Tipo' },
    'documents.invoice': { fr: 'Facture', es: 'Factura' },
    'documents.bank_doc': { fr: 'Document bancaire', es: 'Documento bancario' },
    'documents.filename': { fr: 'Nom du fichier', es: 'Nombre del archivo' },
    'documents.uploaded_by': { fr: 'Téléchargé par', es: 'Subido por' },

    // Correos
    'emails.title': { fr: 'Gestion des courriels', es: 'Gestión de correos' },
    'emails.compose': { fr: 'Composer', es: 'Redactar' },
    'emails.subject': { fr: 'Objet', es: 'Asunto' },
    'emails.recipient': { fr: 'Destinataire', es: 'Destinatario' },
    'emails.payment_count': { fr: 'Nombre de paiements', es: 'Cantidad de pagos' },
    'emails.total_amount': { fr: 'Montant total', es: 'Monto total' },

    // Usuarios  
    'users.title': { fr: 'Gestion des utilisateurs', es: 'Gestión de usuarios' },
    'users.new': { fr: 'Nouvel utilisateur', es: 'Nuevo usuario' },
    'users.username': { fr: 'Nom d\'utilisateur', es: 'Nombre de usuario' },
    'users.fullname': { fr: 'Nom complet', es: 'Nombre completo' },
    'users.role': { fr: 'Rôle', es: 'Rol' },
    'users.email': { fr: 'Courriel', es: 'Correo' },

    // Auditoría
    'audit.title': { fr: 'Journal d\'audit', es: 'Registro de auditoría' },
    'audit.event': { fr: 'Événement', es: 'Evento' },
    'audit.user': { fr: 'Utilisateur', es: 'Usuario' },
    'audit.entity': { fr: 'Entité', es: 'Entidad' },
    'audit.description': { fr: 'Description', es: 'Descripción' },
    'audit.date': { fr: 'Date', es: 'Fecha' },
    'audit.ip': { fr: 'IP', es: 'IP' },

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

    // Servicios (en francés como en la documentación)
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

    // Mensajes
    'msg.confirm_delete': { fr: 'Êtes-vous sûr de vouloir supprimer ?', es: '¿Está seguro de que desea eliminar?' },
    'msg.saved': { fr: 'Enregistré avec succès', es: 'Guardado exitosamente' },
    'msg.deleted': { fr: 'Supprimé avec succès', es: 'Eliminado exitosamente' },
    'msg.error': { fr: 'Une erreur est survenue', es: 'Ha ocurrido un error' },
    'msg.no_data': { fr: 'Aucune donnée disponible', es: 'No hay datos disponibles' },
    'msg.loading': { fr: 'Chargement...', es: 'Cargando...' },

    // Header
    'header.search': { fr: 'Rechercher...', es: 'Buscar...' },
    'header.notifications': { fr: 'Notifications', es: 'Notificaciones' },
    'header.theme': { fr: 'Thème', es: 'Tema' },
    'header.profile': { fr: 'Profil', es: 'Perfil' },
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

export enum LocalStorageKeys {
    tokenKey = 'authToken',
    userLanguageKey = 'userLanguage',
    selectedLanguage = 'selectedLanguage',
    selectedTheme = "selectedTheme",
    selectedTicket = 'selectedTicket',
    loggedUser = 'loggedUser',
    reloaded = 'reloaded'
}


export enum Roles {
    superAdminRole = 'SuperAdmin',
    adminRole = 'Admin',
    userRole = 'User'
}

export enum StorageRoutes {
    attachmentStorage = 'C:/2ºDAW/Proyecto_Integrado/Storage'
}

export const environment = {
    production: false,
    apiUrl: 'https://localhost:7058/gateway'
};
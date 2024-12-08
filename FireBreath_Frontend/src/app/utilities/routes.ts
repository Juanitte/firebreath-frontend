export enum Routes {
    login = 'login',
    recover = 'recover',
    recover2 = 'recover/:hash/:username/:domain/:tld',
    register = 'register',
    home = 'home',
    supportTechnician = 'manager/support-technician',
    reviewManager = 'manager/review',
    incidence = 'incidence',
    cls = 'cls',
    link = 'link/:hashedId/:ticketId',
    notFound = '404'
}
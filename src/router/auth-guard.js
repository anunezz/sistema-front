export const isAuthenticatedGuard = async( to, from, next ) => {

    if (sessionStorage.getItem('sistema_token')) {
        next()
    } else {
        next('/ingresar')
    }
}





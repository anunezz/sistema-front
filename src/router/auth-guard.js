export const isAuthenticatedGuard = async( to, from, next ) => {

    if (sessionStorage.getItem('impedimentos_token')) {
        next()
    } else {
        next('/ingresar')
    }
}





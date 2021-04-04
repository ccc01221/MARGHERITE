import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../../intro/Main'
import store from '../store/index'
import Dashboard from "../../dashboard/Dashboard";
import Books from '../../books/Books'
import SingleBook from '../../books/SingleBook'
import { i18n } from '../../plugins/i18n.js';
import AuthorProfile from "../../author/AuthorProfile";


Vue.use(VueRouter);
function lazyLoad(folder,view){
    return() => import(`../../${folder}/${view}.vue`)
}

const routes = [{
        path: '/',
        name: 'Main',
        component: lazyLoad('intro','Main')
    },
    {
        path: '/books',
        name: 'Books',
        component: lazyLoad('books','Books')
    },
    {
        path: '/teacher/:teacherID',
        name: 'teacher',
        component: lazyLoad('author','AuthorProfile')
    },
    {
        path: '/books/:id',
        name: 'SingleBook',
        props: true,
        component: lazyLoad('books','SingleBook')
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: lazyLoad('dashboard','Dashboard'),
        meta: {
            requiresAuth: true
        }
    }
];
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});
router.beforeEach((to, from, next) => {
    if (store.state.language.language && store.state.language.language !== i18n.locale) {
        i18n.locale = store.state.language.language;
        next();
    } else if (!store.state.language.language) {
        let language = navigator.languages[0].substring(0, 2);
        if (language !== "en" && language !== "de") {
            language = 'en';
        }
        store.dispatch('language/setLanguage', language)
            .then(() => {
                i18n.locale = store.state.language.language;
                next();
            });
    } else {
        next();
    }
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isLoggedIn) {
            next();
            return
        }
        next('/')
    } else {
        next()
    }

});

export default router
import { ipcRenderer } from "electron";
import Vue from "vue";
import Vuex, { mapMutations, mapState } from "vuex";

Vue.use(Vuex);

/* tslint:disable:object-literal-sort-keys */
const store = new Vuex.Store({
    state: {
        // 開発テンポを良くするため、一時的にダミーを設定
        // TODO: アクセストークンを使用する段階になったら空文字に戻すこと
        accessToken: "dummyToken",
        authErrorMessage: "",
        views: {
            unread: {
                count: 456,
                isActive: true,
            },
            favorite: {
                isActive: false,
            },
            archive: {
                isActive: false,
            },
            hosts: [
                {
                    name: "twitter.com",
                    count: 10,
                    isActive: false,
                },
                {
                    name: "pixiv.net",
                    count: 20,
                    isActive: false,
                },
                {
                    name: "Other",
                    count: 30,
                    isActive: false,
                },
            ],
            tags: [
                {
                    name: "Programming",
                    count: 40,
                    isActive: false,
                },
                {
                    name: "Game",
                    count: 40,
                    isActive: false,
                },
            ]
        },
        articles: [
            {
                title: "article1",
                host: "twitter.com",
                thumb: "images/dummy_image.png",
            },
            {
                title: "article2",
                host: "pixiv.net",
                thumb: "images/dummy_image.png",
            },
            {
                title: "article3",
                host: "hatena.ne.jp",
                thumb: "images/dummy_image.png",
            },
            {
                title: "長いタイトルあああああああああああああああああああああああああああああああああ",
                host: "twitter.com",
                thumb: "images/dummy_image.png",
            },
        ],
        searchArticle: "",
    },
    mutations: {
        initAuth(state) {
            state.accessToken = "";
            state.authErrorMessage = "";
        },
        setAccessToken(state, accessToken: string) {
            state.accessToken = accessToken;
        },
        setAuthErrorMessage(state, authErrorMessage: string) {
            state.authErrorMessage = authErrorMessage;
        },
        selectUnreadView(state) {
            deselectViews(state);
            state.views.unread.isActive = true;
            state.articles = [
                {
                    title: "article1",
                    host: "twitter.com",
                    thumb: "images/dummy_image.png",
                },
                {
                    title: "article2",
                    host: "pixiv.net",
                    thumb: "images/dummy_image.png",
                },
                {
                    title: "article3",
                    host: "hatena.ne.jp",
                    thumb: "images/dummy_image.png",
                },
                {
                    title: "長いタイトルあああああああああああああああああああああああああああああああああ",
                    host: "twitter.com",
                    thumb: "images/dummy_image.png",
                },
            ];
        },
        selectFavoriteView(state) {
            deselectViews(state);
            state.views.favorite.isActive = true;
            state.articles = [
                {
                    title: "article1",
                    host: "twitter.com",
                    thumb: "images/dummy_image.png",
                },
            ];
        },
        selectArchiveView(state) {
            deselectViews(state);
            state.views.archive.isActive = true;
            state.articles = [
                {
                    title: "article4",
                    host: "twitter.com",
                    thumb: "images/dummy_image.png",
                },
                {
                    title: "article5",
                    host: "pixiv.net",
                    thumb: "images/dummy_image.png",
                },
            ];

        },
        selectHostsView(state, index: number) {
            deselectViews(state);
            state.views.hosts[index].isActive = true;

            switch (index) {
                case 0:
                    state.articles = [
                        {
                            title: "article1",
                            host: "twitter.com",
                            thumb: "images/dummy_image.png",
                        },
                    ];
                    break;
                case 1:
                    state.articles = [
                        {
                            title: "article2",
                            host: "pixiv.net",
                            thumb: "images/dummy_image.png",
                        },
                    ];
                    break;
                case 2:
                    state.articles = [
                        {
                            title: "article3",
                            host: "hatena.ne.jp",
                            thumb: "images/dummy_image.png",
                        },
                        {
                            title: "長いタイトルあああああああああああああああああああああああああああああああああ",
                            host: "twitter.com",
                            thumb: "images/dummy_image.png",
                        },
                    ];
                    break;
            }
        },
        selectTagsView(state, index: number) {
            deselectViews(state);
            state.views.tags[index].isActive = true;

            switch (index) {
                case 0:
                    state.articles = [
                        {
                            title: "article3",
                            host: "hatena.ne.jp",
                            thumb: "images/dummy_image.png",
                        },
                    ];
                    break;
                case 1:
                    state.articles = [];
                    break;
            }
        },
        updateSearchArticle(state, text) {
            state.searchArticle = text;
        },
    },
});

function deselectViews(state) {
    state.views.unread.isActive = false;
    state.views.favorite.isActive = false;
    state.views.archive.isActive = false;
    for (const host of state.views.hosts) {
        host.isActive = false;
    }
    for (const tag of state.views.tags) {
        tag.isActive = false;
    }
}

const app = new Vue({
    el: "#app",
    store,
    methods: {
        pocketAuth() {
            store.commit("initAuth");
            ipcRenderer.send("pocket-auth");
        },
        ...mapMutations([
            "selectUnreadView",
            "selectFavoriteView",
            "selectArchiveView",
        ]),
        selectHostsView(index: number) {
            store.commit("selectHostsView", index);
        },
        selectTagsView(index: number) {
            store.commit("selectTagsView", index);
        },
        updateSearchArticle(event) {
            store.commit("updateSearchArticle", event.target.value);
        }
    },
    computed: {
        ...mapState({
            pocketAccessToken: "accessToken",
            pocketErrorMessage: "authErrorMessage",
            views: "views",
            searchArticle: "searchArticle",
        }),
        articles() {
            return store.state.articles.filter(
                (article) => {
                    if (article.title.indexOf(store.state.searchArticle) !== -1) {
                        return true;
                    }
                    if (article.host.indexOf(store.state.searchArticle) !== -1) {
                        return true;
                    }
                    return false;
                }
            );
        },
    }
});
/* tslint:enable:object-literal-sort-keys */

ipcRenderer.on("pocket-auth-reply", (event, error, accessToken) => {
    if (error !== null) {
        store.commit("setAuthErrorMessage", error);
    }
    else {
        store.commit("setAccessToken", accessToken);
    }
});

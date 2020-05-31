import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    highestOrderNo: 0,
    awaitedOrder: {},
    hideInvisibleFilm: true,
    order: {
      orderNo: 1,
      date: "",
      items: [],
      eta: 0,
      total: "",
    },
    user: {
      id: 0,
      name: "",
      email: "",
      listOfOrders: [],
    },
    menu: [],
    loggedIn: false,
    uppdateEta: true
  },
  getters: {
    getAmountOfItems: state => {
      return state.order.items.map(item => item.amount).reduce((a, b) => a + b, 0)
    },
    timeToDeliver: state => {
      let time =  state.awaitedOrder.deliveryTime - Date.now()
      if(time < 0) {
        return "0:00"
      }
      let minutes = Math.floor(time/60000)
      
      let seconds = Math.floor((time - minutes*60000)/1000)
      if(seconds<10) {
        return `${minutes}:0${seconds}`
      } else {
      return `${minutes}:${seconds}`
      }
    }
  },

  mutations: {
    addItemToBasket(state, itemToAdd) {
      let itemExists = false
      for (let itemInItems of state.order.items) {
        if (itemInItems.item.id == itemToAdd.id) {
          itemInItems.amount++
          itemExists = true
        }
      }
      if (!itemExists) {
        let newItemToAdd = {}
        newItemToAdd.item = itemToAdd
        newItemToAdd.amount = 1
        state.order.items.push(newItemToAdd)
      }
    },
    removeItemfromBasket(state, itemToRemove) {
      let itemIndex = state.order.items.findIndex(item => item.item.id === itemToRemove.id)
      for (let itemInOrderList of state.order.items) {
        if (itemInOrderList.item.id == itemToRemove.id) {
          if (itemInOrderList.amount > 1) {
            itemInOrderList.amount--
          } else {
            state.order.items.splice(itemIndex, 1)
          }
        }
      }
    },
    addOrderToUser(state) {
      state.order.orderNo = ++state.highestOrderNo
      if (state.loggedIn) {
        state.user.listOfOrders.push(state.order)
      }
    },
    resetOrder(state) {
      state.awaitedOrder = state.order
      state.awaitedOrder.deliveryTime = Date.now() + state.awaitedOrder.eta * 60 * 1000
      state.order = {
        orderNo: state.getHighestOrderNo,
        date: "",
        items: [],
        eta: state.awaitedOrder.eta,
        total: "",
      }
    },
    setMenuItems(state, menu) {
      state.menu = menu
    },
    setHighestOrderNo(state, highestOrderNo) {
      state.highestOrderNo = highestOrderNo
    },
    setNameAndEmail(state, loginData) {
      state.user.name = loginData.name;
      state.user.email = loginData.email;

    },
    loginUser(state, user) {
      state.user = user
      state.loggedIn = true
    },
    showInvisibleFilm(state) {
      state.hideInvisibleFilm = false;
    },
    hideInvisibleFilm(state) {
      state.hideInvisibleFilm = true;
    },
    updateInvisibleFilm(state, value) {
      state.hideInvisibleFilm = value
    },
    setOrderDate(state, date) {
      state.order.date = date
    },
    setOrderTotal(state, total) {
      state.order.total = total
    },
    setOrderEta(state, eta) {
      state.order.eta = eta
    },
    uppdateEta(state) {
      state.uppdateEta = !state.uppdateEta
      console.log('changing eta');
      
    }
  },

  actions: {

    async addOrderToUser(context) {
      context.commit('addOrderToUser')
      if (context.state.loggedIn) {
        await API.addOrderToUser(context.state.order, context.state.user.id)
      } else {
        await API.addOrderNoUser(context.state.order)
      }
      context.commit('resetOrder')
    },

    async getMenuItems(context) {
      const menu = await API.getMenuItems()
      context.commit('setMenuItems', menu)

    },

    async getHighestOrderNo(context) {
      const highestOrderNo = await API.getHighestOrderNo()
      context.commit('setHighestOrderNo', highestOrderNo)
    },

    async loginUser(context, user) {
      const userFromAPI = await API.loginUser(user)
      context.commit('loginUser', userFromAPI)
    },
    async changeEta(context) {
      console.log('updating eta');
      setInterval(() => {context.commit('uppdateEta')}, 500 )
      console.log('updated eta');
    }

  },

  modules: {
  }
})
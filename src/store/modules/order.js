const order = {
  state: {
    // 选择的订票类型
    order_type: '',
    // 立即购买不选座时购买的票数
    order_num: '',
    // 选择的座位id列表
    choose_seats: [],
    // 选择的座位个数
    choose_seats_count: '',
    // store中存的order订票信息较之前的是否已经被修改过
    order_modified: false
  },

  mutations: {
    SET_ORDER_TYPE: (state, order_type) => {
      state.order_type = order_type
    },
    SET_ORDER_NUM: (state, order_num) => {
      state.order_num = order_num
    },
    SET_CHOOSE_SEATS: (state, choose_seats) => {
      state.choose_seats = choose_seats
    },
    SET_CHOOSE_SEATS_COUNT: (state, choose_seats_count) => {
      state.choose_seats_count = choose_seats_count
    },
    SET_ORDER_MODIFIED: (state, bool) => {
      state.order_modified = bool
    }
  },

  actions: {
    // 提交立即选座的座位信息
    StoreMemberChooseSeats({ commit }, { choose_seats, choose_seats_count }) {
      commit('SET_ORDER_TYPE', 'CHOOSE_SEATS')
      commit('SET_CHOOSE_SEATS', choose_seats)
      commit('SET_CHOOSE_SEATS_COUNT', choose_seats_count)
      commit('SET_ORDER_MODIFIED', true)
    },
    // 提交立即购买不选座的购买数量
    StoreNotChooseSeats({ commit }, order_num) {
      commit('SET_ORDER_TYPE', 'NOT_CHOOSE_SEATS')
      commit('SET_ORDER_NUM', order_num)
      commit('SET_ORDER_MODIFIED', true)
    }
  }
}

export default order
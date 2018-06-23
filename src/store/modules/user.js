import { login, memberSignUp, spotSignUp, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { Message } from 'element-ui'

const user = {
  state: {
    token: getToken(),
    name: '',
    // avatar: '',
    roles: [],
    spot_examined: false
  },
  getters:{
    // 参数列表state指的是state数据
    getToken: state => {
      return state.token;
    }
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    // SET_AVATAR: (state, avatar) => {
    //   state.avatar = avatar
    // },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_SPOT_EXAMINED: (state, spot_examined) => {
      state.spot_examined = spot_examined
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      // const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(userInfo.email, userInfo.password, userInfo.userType).then(response => {
          if (response.state === 'OK') {
            const token = JSON.parse(response.object)
            setToken(token)
            commit('SET_TOKEN', token)
            // 因为是根据token再使用GetInfo()获取的用户编号，但是因为一开始刚登录还未根据token去获取，所以先设置一下。。
            commit('SET_NAME', userInfo.username)
            console.log('login finish')
          }
          else {
            var errorMsg = '未知错误，请联系管理员！'
            if (response.state === 'USER_NOT_EXIST') {
              switch (userInfo.userType) {
                case 'member':
                  errorMsg = '此会员名还未被注册，请先注册哦～'
                  break
                case 'spot':
                  errorMsg = '此场馆名还未被注册，快来加入我们吧～'
                  break
                case 'manager':
                  errorMsg = '此管理员不存在！'
                  break
              }
            } else if (response.state === 'MEMBER_INVALIDATE') {
              errorMsg = '此用户已被注销，不能登录！'
            } else if (response.state === 'MEMBER_INACTIVE') {
              errorMsg = '此用户还未被激活哦～'
            }
            Message({
              message: errorMsg,
              type: 'error',
              duration: 3 * 1000,
              center: true,
              showClose: true
            })
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 会员注册
    MemberSignUp({ commit }, userInfo) {
      // const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        memberSignUp(userInfo.username, userInfo.password, userInfo.email).then(response => {
          if (response.state === 'OK') {
            const token = JSON.parse(response.object)
            //TODO fjj 注册完不是应该先验证之后才setToken吗
            setToken(token)
            commit('SET_TOKEN', token)
            // 因为是根据token再使用GetInfo()获取的用户编号，但是因为一开始刚登录还未根据token去获取，所以先设置一下。。
            commit('SET_NAME', username)
            console.log('sign_up finish')
          } else if (response.state === 'USER_HAS_BEEN_SIGN_UP') {
            Message({
              message: '此会员名已被注册',
              type: 'error',
              duration: 3 * 1000,
              center: true,
              showClose: true
            })
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 场馆注册
    SpotSignUp({ commit }, { spot_basic, spot_seats_map, cur_seat_type_count, seat_names }) {
      return new Promise((resolve, reject) => {
        spotSignUp(spot_basic, spot_seats_map, cur_seat_type_count, seat_names).then(response => {
          if (response.state === 'OK') {
            const token = JSON.parse(response.object)
            setToken(token)
            commit('SET_TOKEN', token)
            console.log('sign_up finish')
            Message({
              message: '用户您好，您已成功注册，欢迎使用！',
              type: 'success',
              duration: 3 * 1000,
              center: true,
              showClose: true
            })
            resolve()
          } else if (response.state === 'ALIPAY_ENTITY_NOT_EXIST') {
            Message({
              message: '此支付宝账号不存在，请检查后重新注册！',
              type: 'error',
              duration: 3 * 1000,
              center: true,
              showClose: true
            })
            reject()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      //    TODO fjj
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          if (response.state === 'OK') {
            const data = JSON.parse(response.object)
            console.log(data)
            commit('SET_ROLES', data.role)
            commit('SET_NAME', data.user.id)
            // 场馆多一个是否已被审核通过的属性
            // if (data.role[0] === 'SPOT') commit('SET_SPOT_EXAMINED', data.examined)
            // commit('SET_AVATAR', data.avatar)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(response => {
          if (response.state === 'OK') {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            commit('SET_NAME', '')
            commit('SET_SPOT_EXAMINED', false)
            removeToken()
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user

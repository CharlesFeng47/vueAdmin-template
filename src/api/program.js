import request from '@/utils/request'

const qs = require('qs')

/**
 * 获取首页推荐
 */
export function recommend(city) {
  return request({
    url: '/program/recommend?city=' + city,
    method: 'get'
  })
}

/**
 * 获取该类型的所有节目
 */
export function getProgramsByType(city, type) {
  return request({
    url: '/program/getProgramsByType?city=' + city + '&programType=' + type,
    method: 'get'
  })
}


/**
 * 获取该节目详情
 */
export function getProgramDetail(programId) {
  console.log(programId)
  return request({
    url: '/program/getProgramDetail?briefProgramID=' + programId,
    method: 'get'
  })
}


import request from '@/utils/request'

export function checkOrder(type, medicareId) {
  return request({
    url: '/MMS/checkOrder',
    method: 'post',
    data: {
      type,
      medicareId
    }
  })
}

export function finishCheck(orderId) {
  return request({
    url: '/MMS/finishCheck',
    method: 'post',
    data: {
      orderId
    }
  })
}


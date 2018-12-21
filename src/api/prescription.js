import request from '@/utils/request'

export function prescriptionOrder(type, medicareId) {
  return request({
    url: '/MMS/prescriptionOrder',
    method: 'post',
    data: {
      type,
      medicareId
    }
  })
}

export function prescriptionOrderDetail(orderId) {
  return request({
    url: '/MMS/prescriptionOrderDetail',
    method: 'post',
    data: {
      orderId
    }
  })
}

export function finishDispensary(orderId) {
  return request({
    url: '/MMS/finishDispensary',
    method: 'post',
    data: {
      orderId
    }
  })
}

export function finishPrescription(orderId) {
  return request({
    url: '/MMS/finishPrescription',
    method: 'post',
    data: {
      orderId
    }
  })
}

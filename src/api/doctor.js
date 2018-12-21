import request from '@/utils/request'

export function search(type, target) {
  return request({
    url: '/MMS/search_user',
    method: 'post',
    data: {
      type,
      target
    }
  })
}

export function checkList() {
  return request({
    url: '/MMS/search_test',
    method: 'get'
  })
}

export function fdaList() {
  return request({
    url: '/MMS/search_fda',
    method: 'post'
  })
}

export function check(medicareId, checkList) {
  return request({
    url: '/MMS/applyCheck',
    method: 'post',
    data: {
      medicareId,
      checkList
    }
  })
}

export function prescription(medicareId, prescriptionList) {
  return request({
    url: '/MMS/applyPrescription',
    method: 'post',
    data: {
      medicareId,
      prescriptionList
    }
  })
}


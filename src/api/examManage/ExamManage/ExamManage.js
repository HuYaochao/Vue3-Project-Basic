import axios from 'axios'
import instance from '../../../stores/http'

export function getExamInfo(params) {
  return instance.post('/teacher/getExamInfo', params)
}

export function getQuestion(params) {
  return instance.get('/teacher/getQuestion', {
    params: params
  })
}
import { beforeEach, describe, it, expect } from 'vitest'
import {
  clearAuthFromLS,
  getAccessTokenFromLS,
  getProfileFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS
} from '../auth'

const access_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYWQ0MGY0NmQ3YzYyMDM0MDg0ZjQzMyIsImVtYWlsIjoiZHRkMUBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDIzLTA4LTIyVDE2OjMwOjQyLjUzNFoiLCJpYXQiOjE2OTI3MjE4NDIsImV4cCI6MTY5MzMyNjY0Mn0.zQRoMYWWH2afBFuLuJhzEThxUK_jdKy6X0RklB_71vY'
const refresh_token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYWQ0MGY0NmQ3YzYyMDM0MDg0ZjQzMyIsImVtYWlsIjoiZHRkMUBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDIzLTA4LTIyVDE2OjMwOjQyLjUzNFoiLCJpYXQiOjE2OTI3MjE4NDIsImV4cCI6MTcwMTM2MTg0Mn0.psA_BinxWDrZ7JjO2iBWP2cexAQ70lZlBNoUlHOKVRc'
const profile =
  '{"_id":"63ad40f46d7c62034084f433","roles":["User"],"email":"dtd1@gmail.com","createdAt":"2022-12-29T07:25:40.193Z","updatedAt":"2023-08-22T07:20:01.166Z","__v":0,"address":"334","date_of_birth":"2003-09-08T17:00:00.000Z","name":"112","phone":"223","avatar":"ac8f8960-cffe-4b53-ab3b-00fabade6f05.jpg"}'

// localStorage => env js_dom

beforeEach(() => {
  localStorage.clear()
})
// describe('setAccessTokenToLS', () => {
//   it('access_token dc set vao localStorage', () => {
//     setAccessTokenToLS(access_token)

//     // de su dung localStorage.getItem /setItem => environment === 'jsdom'
//     expect(localStorage.getItem('access_token')).toEqual(access_token)
//   })
// })

// describe('getAccessTokenFromLS', () => {
//   it('get dc access_token', () => {
//     localStorage.setItem('access_token', access_token)

//     expect(getAccessTokenFromLS()).toEqual(access_token)
//   })
// })

// test dc 2 fnc setAccessTokenToLS + getAccessTokenFromLS
describe('access_token', () => {
  it('access_token dc set + get vao localStorage', () => {
    setAccessTokenToLS(access_token)

    // de su dung localStorage.getItem /setItem => environment === 'jsdom'
    expect(getAccessTokenFromLS()).toEqual(access_token)
  })
})

describe('refresh_token', () => {
  it('refresh_token dc set + get vao localStorage', () => {
    setRefreshTokenToLS(refresh_token)

    expect(getRefreshTokenFromLS()).toEqual(refresh_token)
  })
})

describe('profile', () => {
  it('profile dc set + get vao localStorage', () => {
    setProfileToLS(JSON.parse(profile))

    expect(getProfileFromLS()).toEqual(JSON.parse(profile))
  })
})

describe('clearAuthFromLS', () => {
  it('xoa access_token, refresh_token, profile khoi localStorage', () => {
    setAccessTokenToLS(access_token)
    setRefreshTokenToLS(refresh_token)
    setProfileToLS(JSON.parse(profile))

    // ...
    clearAuthFromLS()

    expect(localStorage.getItem('access_token')).toBe(null)
    expect(localStorage.getItem('refresh_token')).toBe(null)
    expect(localStorage.getItem('profile')).toBe(null)
  })
})

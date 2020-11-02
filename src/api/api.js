import { get, post } from '@/api/globalRequest.js'

export default {
    login: (params) => post('/login', params),
    addRecord: (params) => post('/addRecord', params),
    getRecord: (params) => get('/getRecord', params),
    deleteRecord: (params) => post('/deleteRecord', params),
    checkUploadStatus: (params) => get('/checkUploadStatus', params),
    showStudent: (params) => get('/showStudent', params),
    addRecordId: (params) => get('/addRecordId', params),
    addTacher: (params) => post('/addTacher', params),
    showTeacher: (params) => get('/showTeacher', params),
    editTeacher: (params) => post('/editTeacher', params)
}
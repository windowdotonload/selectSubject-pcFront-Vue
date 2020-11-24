/*
 * @Descripttion: 
 * @version: 
 * @Author: windowdotonload
 */
/*
 * @Descripttion: 
 * @version: 
 * @Author: windowdotonload
 */
/*
 * @Descripttion: 
 * @version: 
 * @Author: windowdotonload
 */
import { get, post } from '@/api/globalRequest.js'

export default {
    login: (params) => post('/login', params),
    addRecord: (params) => post('/addRecord', params),
    getRecord: (params) => get('/getRecord', params),
    deleteRecord: (params) => post('/deleteRecord', params),
    overRecord: (params) => post("/overRecord", params),
    checkUploadStatus: (params) => get('/checkUploadStatus', params),
    showStudent: (params) => get('/showStudent', params),
    addRecordId: (params) => get('/addRecordId', params),
    addTacher: (params) => post('/addTacher', params),
    showTeacher: (params) => get('/showTeacher', params),
    editTeacher: (params) => post('/editTeacher', params),
    addTeaToRecord: (params) => post('/addTeaToRecord', params),
    showSelectTeacher: (params) => get('/showSelectTeacher', params),
    deleteSelectTeacher: (params) => post('/deleteSelectTeacher', params),
    submitEditStudent: (params) => post('/submitEditStudent', params),
    deleteStudent: (params) => post('/deleteStudent', params),
    deleteTeacher: (params) => post('/deleteTeacher', params),
    editRecord: (params) => post('/editRecord', params),
    addTitleInfo: (params) => post('/addTitleInfo', params),
    showTitle: (params) => get('/showTitle', params),
    editTitle: (params) => post('/editTitle', params),
    deleteTitle: (params) => post('/deleteTitle', params),
    searchSimilarTitleName: (params) => get('/searchSimilarTitleName', params),
    showAllStudentCanSelectTeacher: (params) => get('/showAllStudentCanSelectTeacher', params),
    showSelectTeacherTitle: (params) => get('/showSelectTeacherTitle', params),
    saveTeacherId: (params) => post('/saveTeacherId', params),
    createdShowSelectTeacherId: (params) => get('/createdShowSelectTeacherId', params),
    stuGetSelectTeacherName: (params) => get("/stuGetSelectTeacherName", params),
    confirmSelectTeacher: (params) => post('/confirmSelectTeacher', params),
    getStuInfo: (params) => get('/getStuInfo', params),
    confirmStudentSelTitle: (params) => post('/confirmStudentSelTitle', params),
    getStudentSelTitleInfo: (params) => get('/getStudentSelTitleInfo', params),
    changeTitleStatus: (params) => post('/changeTitleStatus', params),
    studentCustomTitle: (params) => post("/studentCustomTitle", params),
    teaGetSelectStuInfo: (params) => get('/teaGetSelectStuInfo', params),
    passStudentSelTitle: (params) => post("/passStudentSelTitle", params),
    refuseStudentSelTitle: (params) => post('/refuseStudentSelTitle', params),
    stuChangeTitle: (params) => post("/stuChangeTitle", params),
    teacherSubmitScore: (params) => post('/teacherSubmitScore', params),
    recordChangeTitle: (params) => post('/recordChangeTitle', params),
    teacherGetApplyHistory: (params) => get("/teacherGetApplyHistory", params),
    recordIfStuSendMessage: (params) => post("/recordIfStuSendMessage", params),
    teacherAlreadyReadMessage: (params) => post("/teacherAlreadyReadMessage", params),
    studentAlreadyReadMessage: (params) => post("/studentAlreadyReadMessage", params),
    showHistoryMessage: (params) => get('/showHistoryMessage', params),
    remindStudentMessage: (params) => post("/remindStudentMessage", params)
}   
var express = require('express');
var router = express.Router();
var db = require("../model/db")
var course=require('../model/course');
var user=require(('../model/user'));
var series = require('../model/series')
var joinreceptionshop=require('../model/joinreceptionshop')
var joinreceptionmanager=require('../model/joinreceptionmanager');
var student = require("../model/student")
var teacher = require("../model/teacher")
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/student_detail',function(req,res,next){

  res.render('student_detail');

    /*student.findOne({'where':{userId:34}}).then(function (ret) {
        ret.getUser().then(function (ret1) {
            console.log(JSON.stringify({info:ret1,infos:ret}))
            res.render('student_detail',{info:ret1,infos:ret});
        })
    })*/
    var studentId = 16;
    var sql = "SELECT a.userName, " +
        "a.userAge, " +
        "s.school, " +
        "s.personalSign " +
        "FROM  student s " +
        "JOIN account a ON a.userId = s.userId  " +
        "WHERE s.studentId = " + studentId;
    db.sequelize.query(sql).then(function (ret) {
        console.log(JSON.stringify(ret));
        console.log(JSON.stringify({date:ret[0][0]}));
        res.render('student_detail',{data:ret[0][0]});
    })
});

router.get('/student',function(req,res,next){
    var studentId = 34;
    student.findOne({'where':{studentId:34}}).then(function (student) {
        user.findOne({'where':{userId:student.userId}}).then(function (user) {
            var sql =  "SELECT c.courseSeriesId,c.courseSeriesName, a.userName as teacher, c.startDate, c.endDate, c.time, c.room "+
                "FROM courseSeries c " +
                "JOIN account a ON c.courseSeriesTeacher = a.userId " +
                "JOIN joinSeries j ON j.courseSeriesId = c.courseSeriesId "+
                //"JOIN teacher t ON t.teacherId = c.courseSeriesTeacher " +
                "WHERE j.studentId ="+ student.studentId;
            db.sequelize.query(sql).then(function (AllCourse) {
                console.log(sql);
                console.log("userId:" + student.userId);
                console.log("allCourse" + JSON.stringify(AllCourse[0]))
                res.render('student_course',{AllCourse:AllCourse[0],NowCourse:[],FinishCourse:[],NotCourse:[]});
                // var sql = "SELECT c.courseSeriesId,c.courseSeriesName, a.userName as teacher, c.startDate, c.endDate, c.time, c.room "+
                //     "FROM courseSeries c " +
                //     "JOIN account a ON c.courseSeriesTeacher = a.userId " +
                //     "JOIN joinSeries j ON j.courseSeriesId = c.courseSeriesId "+
                //     "WHERE j.process = 1  and c.endDate < now() and j.studentId ="+student.studentId;
                // db.sequelize.query(sql).then(function (FinishCourse) {
                //     var sql = "SELECT c.courseSeriesId,c.courseSeriesName, a.userName as teacher, c.startDate, c.endDate, c.time, c.room "+
                //         "FROM courseSeries c " +
                //         "JOIN account a ON c.courseSeriesTeacher = a.userId " +
                //         "JOIN joinSeries j ON j.courseSeriesId = c.courseSeriesId "+
                //         "WHERE j.process = 1  and c.endDate >= now() and j.studentId ="+student.studentId;
                //     db.sequelize.query(sql).then(function (NowCourse) {
                //         res.render('student_course',{AllCourse:AllCourse[0],NowCourse:NowCourse[0],FinishCourse:FinishCourse[0]});
                //     })
                // })
            })
        })
    })
});

//所有课程
router.get('/allCourse',function (req, res, next) {
    var studentId = 34;
    student.findOne({'where':{studentId:34}}).then(function (student) {
        user.findOne({'where':{userId:student.userId}}).then(function (user) {
            var sql =  "SELECT c.courseSeriesId,c.courseSeriesName, a.userName as teacher, c.startDate, c.endDate, c.time, c.room "+
                "FROM courseSeries c " +
                "JOIN account a ON c.courseSeriesTeacher = a.userId " +
                "JOIN joinSeries j ON j.courseSeriesId = c.courseSeriesId "+
                //"JOIN teacher t ON t.teacherId = c.courseSeriesTeacher " +
                "WHERE j.studentId ="+ student.studentId;
            db.sequelize.query(sql).then(function (AllCourse) {
                console.log(sql);
                console.log("userId:" + student.userId);
                console.log("allCourse" + JSON.stringify(AllCourse[0]))
                res.render('student_course',{AllCourse:AllCourse[0],NowCourse:[],FinishCourse:[],NotCourse:[]});
            })
        })
    })
})

//已完成课程
router.get('/finishCourse',function (req, res, next) {
    var studentId = 34;
    student.findOne({'where':{studentId:34}}).then(function (student) {
        user.findOne({'where':{userId:student.userId}}).then(function (user) {
            var sql = "SELECT c.courseSeriesId,c.courseSeriesName, a.userName as teacher, c.startDate, c.endDate, c.time, c.room "+
                "FROM courseSeries c " +
                "JOIN account a ON c.courseSeriesTeacher = a.userId " +
                "JOIN joinSeries j ON j.courseSeriesId = c.courseSeriesId "+
                "WHERE j.process = 1  and c.endDate < now() and j.studentId ="+student.studentId;
            db.sequelize.query(sql).then(function (FinishCourse) {
                console.log(sql);
                console.log('userId:' + student.userId);
                console.log("finishCourse:" + JSON.stringify(FinishCourse[0]))
                res.render('student_course',{AllCourse:[],NowCourse:[],FinishCourse:FinishCourse[0],NotCourse:[]});
            })
        })
    })
})

router.get('/nowCourse',function (req, res, next) {
    var studentId = 34;
    student.findOne({'where':{studentId:34}}).then(function (student) {
        user.findOne({'where':{userId:student.userId}}).then(function (user) {
            var sql = "SELECT c.courseSeriesId,c.courseSeriesName, a.userName as teacher, c.startDate, c.endDate, c.time, c.room "+
                "FROM courseSeries c " +
                "JOIN account a ON c.courseSeriesTeacher = a.userId " +
                "JOIN joinSeries j ON j.courseSeriesId = c.courseSeriesId "+
                "WHERE j.process = 1  and c.endDate >= now() and j.studentId ="+student.studentId;
            db.sequelize.query(sql).then(function (NowCourse) {
                console.log(sql);
                console.log('userId:' + student.userId);
                console.log("nowCourse:" + JSON.stringify(NowCourse[0]))
                res.render('student_course',{AllCourse:[],NowCourse:NowCourse[0],FinishCourse:[],NotCourse:[]});
            })
        })
    })
})

router.get('/notstartCourse',function (req, res, next) {
    var studentId = 34;
    student.findOne({'where':{studentId:34}}).then(function (student) {
        user.findOne({'where':{userId:student.userId}}).then(function (user) {
            var sql = "SELECT j.joinSeriesId,s.seriesName,studentId,hopeTeacher,hopeClassType,hopeTime,other " +
                "FROM joinSeries j " +
                "JOIN seriesTemplate s ON s.templateId = j.templateId " +
                "WHERE process = 0 and j.studentId="+student.studentId;

            db.sequelize.query(sql).then(function (NotCourse) {
                console.log(sql);
                console.log('userId:' + student.userId);
                console.log("NotCourse:" + JSON.stringify(NotCourse[0]))
                res.render('student_course',{AllCourse:[],NowCourse:[],FinishCourse:[],NotCourse:NotCourse[0]});
            })
        })
    })
})
router.get('/course_re',function(req,res,next){
    res.render('course_re');
});


module.exports = router;
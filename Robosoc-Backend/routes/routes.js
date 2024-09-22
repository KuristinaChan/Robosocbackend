const router = require('express').Router()

const { getAllMembers, addNewMember, deleteMember, editMember, getAllProjects, addNewProject, 
        editProject, deleteProject, getAllAchievements, addNewAchievement, 
        editAchievement, deleteAchievement } = require('../controllers/controllers')

const { login, checkAuthenticity } = require('../middlewares/auth')
const uploadImage = require('../middlewares/uploadImage')
const firebase = require("../firebase/config.js")

router.route('/login').post(login)

router.route('/members').get(getAllMembers).post(checkAuthenticity,uploadImage.fields([{name : 'image', maxCount : 1}]),addNewMember)
.put(checkAuthenticity,uploadImage.fields([{name : 'image', maxCount : 1}]),editMember).delete(checkAuthenticity,deleteMember)

router.route("/projects").get(getAllProjects).post(checkAuthenticity,uploadImage.fields([{name : 'image', maxCount : 1}]),addNewProject)
.put(checkAuthenticity,uploadImage.fields([{name : 'image', maxCount : 1}]),editProject).delete(checkAuthenticity,deleteProject)

router.route("/achievements").get(getAllAchievements).post(checkAuthenticity,uploadImage.fields([{name : 'image', maxCount : 1}]),addNewAchievement)
.put(checkAuthenticity,uploadImage.fields([{name : 'image', maxCount : 1}]),editAchievement).delete(checkAuthenticity,deleteAchievement)
//commit
module.exports = router
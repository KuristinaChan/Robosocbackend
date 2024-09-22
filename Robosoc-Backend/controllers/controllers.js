const {individuals, projects, achievements} = require('../models/model')
const { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } =  require("firebase/storage")

const getAllMembers = async(req,res)=>{
    try {
        let {query} = req
        if(!query){
            let members = await individuals.find({})
            return res.status(200).json({data : members})
        }
        let members = await individuals.find(query)
        if(members){
            return res.status(200).json({data : members})
        }
        return res.status(404).json({msg : "No such members"})
    } catch (error) {
        return res.status(500).json({error : error.message})
    }
}

const addNewMember = async(req,res)=>{
    try {
        let {name,position,techStack,passOutYear,instaLink,githubLink,linkedinLink,isActive,company} = req.body
        if(!name || !position || !passOutYear || isActive===undefined){
            return res.status(400).json({message : 'Full details not provided'})
        }
        if(req.files === undefined && req.files['image']===undefined){
            return res.status(400).json({message : 'Image not provided'})
        }
        // console.log(req.body)
        const time = new Date().getTime();
        const storage = getStorage()
        const storageRef = ref(storage,`members/${req.files['image'][0].originalname + "  " + time}`)
        const metadata = {
            contentType: req.files['image'][0].mimetype,
        };
        const snapshot = await uploadBytesResumable(storageRef, req.files['image'][0].buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        let newMember = await individuals.create({
            name,
            position : position.toLowerCase(),
            techStack,
            isActive,
            image : downloadURL,
            passOutYear,
            instaLink,
            githubLink,
            linkedinLink,
            company : company ? company : ""
        })
        return res.status(201).json({msg: 'Member added'})
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const editMember = async(req,res)=>{
    try {
        let {id,name,position,techStack,instaLink,linkedinLink,githubLink,passOutYear,isActive,company} = req.body
        // console.log(req.body)
        let memberToBeEdited = await individuals.findById(id)
        if(!memberToBeEdited){
            return res.status(404).json({msg:"No such member"})
        }
        if(req.files!==undefined && req.files['image']){
            const time = new Date().getTime();
            const storage = getStorage()
            const fileRef = ref(storage, memberToBeEdited.image);
            await deleteObject(fileRef)
            const storageRef = ref(storage,`members/${req.files['image'][0].originalname + "  " + time}`)
            const metadata = {
                contentType: req.files['image'][0].mimetype,
            };
            const snapshot = await uploadBytesResumable(storageRef, req.files['image'][0].buffer, metadata);
            const downloadURL = await getDownloadURL(snapshot.ref);
            memberToBeEdited.image = downloadURL
        }
        if(name){
            memberToBeEdited.name = name
        }
        if(techStack){
            memberToBeEdited.techStack = techStack
        }
        if(position){
            memberToBeEdited.position = position.toLowerCase()
        }
        if(passOutYear){
            memberToBeEdited.passOutYear = passOutYear
        }
        if(githubLink){
            memberToBeEdited.githubLink = githubLink
        }
        if(linkedinLink){
            memberToBeEdited.linkedinLink = linkedinLink
        }
        if(instaLink){
            memberToBeEdited.instaLink = instaLink
        }
        if(company!==undefined){
            memberToBeEdited.company = company
        }
        if(isActive!==undefined){
            memberToBeEdited.isActive = isActive
            if(isActive==="true" || isActive===true){
                memberToBeEdited.company = ""
            }
        }
        await memberToBeEdited.save()
        return res.status(200).json({msg:"Member updated successfully"})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({error : error.message})
    }
}

const deleteMember = async(req,res)=>{
    try {
        let {id} = req.query
        // console.log(id)
        let memberToBeDeleted = await individuals.findByIdAndDelete(id)
        if(!memberToBeDeleted){
            return res.status(404).json({msg:"No such member"})
        }
        const storage = getStorage()
        const fileRef = ref(storage, memberToBeDeleted.image);
        await deleteObject(fileRef)
        return res.status(200).json({msg: "Member deleted successfully"})
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

const getAllProjects = async(req,res)=>{
    try {
        let projectsOfSociety = await projects.find({})
        return res.status(200).json({data : projectsOfSociety})
    } catch (error) {
        return res.status(500).json({msg : error.message})
    }
}

const addNewProject = async(req,res)=>{
    try {
        let {name,description} = req.body
        if(!name || !description){
            return res.status(400).json({message : 'Full details not provided'})
        }
        if(req.files === undefined && req.files['image']===undefined){
            return res.status(400).json({message : 'Image not provided'})
        }
        const allowed_formats = ['image/png','image/jpeg', 'image/jpg']
        const time = new Date().getTime();
        const storage = getStorage()
        const storageRef = ref(storage,`projects/${req.files['image'][0].originalname + "  " + time}`)
        const metadata = {
            contentType: req.files['image'][0].mimetype,
        };
        const snapshot = await uploadBytesResumable(storageRef, req.files['image'][0].buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        let project = await projects.create({
            name : name,
            description : description,
            image : downloadURL
        })
        return res.status(201).json({msg : "Project added successfully"})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({msg : error.message})
    }
}

const editProject = async(req,res)=>{
    try{
        let {id,name,description} = req.body
        let projectToBeEdited = await projects.findById(id)
        if(!projectToBeEdited){
            return res.status(404).json({msg:"No such project"})
        }
        if(req.files!==undefined && req.files['image']){
            const time = new Date().getTime();
            const storage = getStorage()
            const fileRef = ref(storage, projectToBeEdited.image);
            await deleteObject(fileRef)
            const storageRef = ref(storage,`projects/${req.files['image'][0].originalname + "  " + time}`)
            const metadata = {
                contentType: req.files['image'][0].mimetype,
            };
            const snapshot = await uploadBytesResumable(storageRef, req.files['image'][0].buffer, metadata);
            const downloadURL = await getDownloadURL(snapshot.ref);
            projectToBeEdited.image = downloadURL
        }
        if(name){
            projectToBeEdited.name = name
        }
        if(description){
            projectToBeEdited.description = description
        }
        await projectToBeEdited.save()
        return res.status(200).json({msg : "Project updated successfully"})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({error : error.message})
    }
}

const deleteProject = async(req,res)=>{
    try {
        let {id} = req.query
        let projectToBeDeleted = await projects.findByIdAndDelete(id)
        if(!projectToBeDeleted){
            return res.status(404).json({msg:"No such project"})
        }
        const storage = getStorage()
        const fileRef = ref(storage, projectToBeDeleted.image);
        await deleteObject(fileRef)
        return res.status(200).json({msg: "Project deleted successfully"})
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

//achievements
const getAllAchievements = async(req,res)=>{
    try {
        let achievementsOfSociety = await achievements.find({}).sort({year : 1})
        // let years = new Set(achievementsOfSociety.map((achievement)=>{
        //         return achievement.year
        //     })
        // )
        // let yearsArray = {}
        // years.forEach((year)=>{
        //     return {
        //         ...yearsArray,
        //         [year] : []
        //     }
        // })
        // for(let i=0;i<achievementsOfSociety.length;i++){
        //     yearsArray[achievementsOfSociety[i].year].push(achievementsOfSociety[i])
        // }
        return res.status(200).json({data : achievementsOfSociety})
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

const addNewAchievement = async(req,res)=>{
    try {
        let {name,description,year} = req.body
        //console.log(req.files['image'])
        if(!name || !description || !year){
            return res.status(400).json({message : 'Full details not provided'})
        }
        if(req.files===undefined){
            return res.status(400).json({message : 'Image not provided'})
        }
        if(req.files['image']===undefined){
            return res.status(400).json({message : 'Image not provided'})
        }
        const allowed_formats = ['image/png','image/jpeg', 'image/jpg']
        const time = new Date().getTime();
        const storage = getStorage()
        const storageRef = ref(storage,`achievements/${req.files['image'][0].originalname + "  " + time}`)
        const metadata = {
            contentType: req.files['image'][0].mimetype,
        };
        const snapshot = await uploadBytesResumable(storageRef, req.files['image'][0].buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        let achievement = await achievements.create({
            heading : name,
            description : description,
            image : downloadURL,
            year : year
        })
        return res.status(201).json({msg : "Achievement added successfully"})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({msg : error.message})
    }
}

const editAchievement = async(req,res)=>{
    try{
        let {id,name,description,year} = req.body
        let achievementToBeEdited = await achievements.findById(id)
        if(!achievementToBeEdited){
            return res.status(404).json({msg:"No such Achievement"})
        }
        if(req.files!==undefined && req.files['image']!==undefined){
            const time = new Date().getTime();
            const storage = getStorage()
            const fileRef = ref(storage, achievementToBeEdited.image);
            await deleteObject(fileRef)
            const storageRef = ref(storage,`achievements/${req.files['image'][0].originalname + "  " + time}`)
            const metadata = {
                contentType: req.files['image'][0].mimetype,
            };
            const snapshot = await uploadBytesResumable(storageRef, req.files['image'][0].buffer, metadata);
            const downloadURL = await getDownloadURL(snapshot.ref);
            achievementToBeEdited.image = downloadURL
        }
        if(name){
            achievementToBeEdited.heading = name
        }
        if(description){
            achievementToBeEdited.description = description
        }
        if(year){
            achievementToBeEdited.year = Number(year)
        }
        await achievementToBeEdited.save()
        return res.status(200).json({msg : "Achievement updated successfully"})
    }catch(error){
        return res.status(500).json({error : error.message})
    }
}

const deleteAchievement = async(req,res)=>{
    try {
        let {id} = req.query
        let achievementToBeDeleted = await achievements.findByIdAndDelete(id)
        if(!achievementToBeDeleted){
            return res.status(404).json({msg:"No such achievement"})
        }
        const storage = getStorage()
        const fileRef = ref(storage, achievementToBeDeleted.image);
        await deleteObject(fileRef)
        return res.status(200).json({msg: "Achievement deleted successfully"})
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

module.exports = {
    getAllMembers, addNewMember,editMember,deleteMember,
    getAllProjects,editProject,deleteProject,addNewProject,
    getAllAchievements,addNewAchievement,editAchievement,deleteAchievement
}